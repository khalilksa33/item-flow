import { Router, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { ZatcaSettings } from '../models/ZatcaSettings';
import { Invoice } from '../models/Invoice';
import { ZatcaService } from '../services/ZatcaService';

const router = Router();
router.use(authenticate);

// Get current ZATCA onboarding settings
router.get('/settings', async (req, res: Response) => {
  try {
    let settings = await ZatcaSettings.findOne();
    if (!settings) {
      // Return initial defaults if settings do not exist
      settings = await ZatcaSettings.create({
        vatNumber: '300000000000003', // Default Saudi test VAT number
        sellerName: 'Item Flow Trading Co.',
        onboarded: false,
        environment: 'sandbox',
      });
    }
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Onboard device with ZATCA using OTP
router.post('/onboard', async (req, res: Response) => {
  const { vatNumber, sellerName, otp, environment } = req.body;

  if (!vatNumber || !sellerName || !otp) {
    return res.status(400).json({ error: 'VAT number, seller name, and OTP are required' });
  }

  try {
    const result = await ZatcaService.onboardWithZatca(vatNumber, sellerName, otp, environment || 'sandbox');

    let settings = await ZatcaSettings.findOne();
    if (settings) {
      settings.vatNumber = vatNumber;
      settings.sellerName = sellerName;
      settings.otp = otp;
      settings.environment = environment || 'sandbox';
      settings.privateKey = result.privateKey;
      settings.publicKey = result.publicKey;
      settings.complianceCertificate = result.certificate;
      settings.complianceCertificateId = result.certificateId;
      settings.onboarded = true;
      await settings.save();
    } else {
      settings = await ZatcaSettings.create({
        vatNumber,
        sellerName,
        otp,
        environment: environment || 'sandbox',
        privateKey: result.privateKey,
        publicKey: result.publicKey,
        complianceCertificate: result.certificate,
        complianceCertificateId: result.certificateId,
        onboarded: true,
      });
    }

    res.json({ message: 'Onboarding completed successfully', settings });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate e-invoice XML, sign it, embed QR, and report/clear with ZATCA
router.post('/invoice/:id/submit', async (req, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const settings = await ZatcaSettings.findOne();
    if (!settings || !settings.onboarded) {
      return res.status(400).json({ error: 'ZATCA Settings are not onboarded yet' });
    }

    // 1. Generate TLV Data for QR Code
    const qrCodeData = ZatcaService.generateTLV(
      settings.sellerName,
      settings.vatNumber,
      new Date(invoice.createdAt || Date.now()),
      invoice.total,
      invoice.vatAmount
    );

    // 2. Generate unsigned UBL 2.1 XML
    const xmlContent = ZatcaService.generateUBLXML(invoice, settings);

    // 3. Sign the XML
    const { signedXML, hash } = ZatcaService.signXML(
      xmlContent,
      settings.privateKey || '',
      settings.complianceCertificate || ''
    );

    // 4. Submit to ZATCA API
    const submissionResult = await ZatcaService.submitInvoice(signedXML, hash, settings);

    // 5. Update Database Record
    invoice.xmlHash = hash;
    invoice.qrCodeData = qrCodeData;
    invoice.zatcaStatus = submissionResult.status;
    if (submissionResult.status === 'failed') {
      invoice.zatcaErrorMessage = submissionResult.errors;
    } else {
      invoice.zatcaErrorMessage = undefined;
      // Increment Invoice Counter & Update last invoice chain hash
      settings.invoiceCounter += 1;
      settings.lastInvoiceHash = hash;
      await settings.save();
    }

    await invoice.save();

    res.json({
      message: submissionResult.status === 'failed' ? 'Submission failed' : 'Invoice processed successfully',
      zatcaStatus: invoice.zatcaStatus,
      errorMessage: invoice.zatcaErrorMessage,
      qrCodeData: invoice.qrCodeData,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
