import crypto from 'crypto';
import axios from 'axios';
import { IInvoice } from '../models/Invoice';
import { IZatcaSettings, ZatcaSettings } from '../models/ZatcaSettings';

export class ZatcaService {
  /**
   * Generates a Base64 encoded TLV (Tag-Length-Value) string for the QR code.
   */
  public static generateTLV(
    sellerName: string,
    vatNumber: string,
    timestamp: Date,
    total: number,
    vatAmount: number
  ): string {
    const getTLVBuffer = (tag: number, value: string): Buffer => {
      const valueBuf = Buffer.from(value, 'utf8');
      const tagBuf = Buffer.from([tag]);
      const lenBuf = Buffer.from([valueBuf.length]);
      return Buffer.concat([tagBuf, lenBuf, valueBuf]);
    };

    const formattedTime = timestamp.toISOString();
    const formattedTotal = total.toFixed(2);
    const formattedVat = vatAmount.toFixed(2);

    const buffers = [
      getTLVBuffer(1, sellerName),
      getTLVBuffer(2, vatNumber),
      getTLVBuffer(3, formattedTime),
      getTLVBuffer(4, formattedTotal),
      getTLVBuffer(5, formattedVat),
    ];

    return Buffer.concat(buffers).toString('base64');
  }

  /**
   * Generates a basic UBL 2.1 XML invoice representation.
   */
  public static generateUBLXML(invoice: IInvoice, settings: IZatcaSettings): string {
    const uuid = crypto.randomUUID();
    const formattedDate = new Date(invoice.createdAt || Date.now()).toISOString().split('T')[0];
    const formattedTime = new Date(invoice.createdAt || Date.now()).toTimeString().split(' ')[0];

    const linesXML = invoice.items.map((item, index) => `
    <cac:InvoiceLine>
        <cbc:ID>${index + 1}</cbc:ID>
        <cbc:InvoicedQuantity unitCode="PCE">${item.quantity}</cbc:InvoicedQuantity>
        <cbc:LineExtensionAmount currencyID="SAR">${item.subtotal.toFixed(2)}</cbc:LineExtensionAmount>
        <cac:TaxTotal>
            <cbc:TaxAmount currencyID="SAR">${item.vat.toFixed(2)}</cbc:TaxAmount>
            <cbc:RoundingAmount currencyID="SAR">0.00</cbc:RoundingAmount>
        </cac:TaxTotal>
        <cac:Item>
            <cbc:Name>Product ${item.productId}</cbc:Name>
            <cac:ClassifiedTaxCategory>
                <cbc:ID>S</cbc:ID>
                <cbc:Percent>${invoice.vatRate}</cbc:Percent>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:ClassifiedTaxCategory>
        </cac:Item>
        <cac:Price>
            <cbc:PriceAmount currencyID="SAR">${item.unitPrice.toFixed(2)}</cbc:PriceAmount>
        </cac:Price>
    </cac:InvoiceLine>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
    <cbc:ProfileID>reporting:1.0</cbc:ProfileID>
    <cbc:ID>${invoice._id || 'INV-001'}</cbc:ID>
    <cbc:UUID>${uuid}</cbc:UUID>
    <cbc:IssueDate>${formattedDate}</cbc:IssueDate>
    <cbc:IssueTime>${formattedTime}</cbc:IssueTime>
    <cbc:InvoiceTypeCode name="0100000">388</cbc:InvoiceTypeCode>
    <cbc:DocumentCurrencyCode>SAR</cbc:DocumentCurrencyCode>
    <cbc:TaxCurrencyCode>SAR</cbc:TaxCurrencyCode>
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyIdentification>
                <cbc:ID schemeID="CRN">1010000000</cbc:ID>
            </cac:PartyIdentification>
            <cac:PartyName>
                <cbc:Name>${settings.sellerName}</cbc:Name>
            </cac:PartyName>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>${settings.vatNumber}</cbc:CompanyID>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:PartyTaxScheme>
        </cac:Party>
    </cac:AccountingSupplierParty>
    <cac:TaxTotal>
        <cbc:TaxAmount currencyID="SAR">${invoice.vatAmount.toFixed(2)}</cbc:TaxAmount>
        <cac:TaxSubtotal>
            <cbc:TaxableAmount currencyID="SAR">${invoice.subtotal.toFixed(2)}</cbc:TaxableAmount>
            <cbc:TaxAmount currencyID="SAR">${invoice.vatAmount.toFixed(2)}</cbc:TaxAmount>
            <cac:TaxCategory>
                <cbc:ID>S</cbc:ID>
                <cbc:Percent>${invoice.vatRate}</cbc:Percent>
                <cac:TaxScheme>
                    <cbc:ID>VAT</cbc:ID>
                </cac:TaxScheme>
            </cac:TaxCategory>
        </cac:TaxSubtotal>
    </cac:TaxTotal>
    <cac:LegalMonetaryTotal>
        <cbc:LineExtensionAmount currencyID="SAR">${invoice.subtotal.toFixed(2)}</cbc:LineExtensionAmount>
        <cbc:TaxExclusiveAmount currencyID="SAR">${invoice.subtotal.toFixed(2)}</cbc:TaxExclusiveAmount>
        <cbc:TaxInclusiveAmount currencyID="SAR">${invoice.total.toFixed(2)}</cbc:TaxInclusiveAmount>
        <cbc:AllowanceTotalAmount currencyID="SAR">0.00</cbc:AllowanceTotalAmount>
        <cbc:PayableAmount currencyID="SAR">${invoice.total.toFixed(2)}</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>
    ${linesXML}
</Invoice>`;
  }

  /**
   * Generates a cryptographic signature and embeds it along with the certificate in the UBL XML.
   */
  public static signXML(xmlContent: string, privateKeyPem: string, certificatePem: string): { signedXML: string; hash: string } {
    const hash = crypto.createHash('sha256').update(xmlContent).digest('base64');
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(xmlContent);
    const signature = signer.sign(privateKeyPem, 'base64');

    // Add a simple digital signature meta section in the XML output
    const signedXML = xmlContent.replace(
      '</Invoice>',
      `    <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
        <SignedInfo>
            <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
            <Reference URI="">
                <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
                <DigestValue>${hash}</DigestValue>
            </Reference>
        </SignedInfo>
        <SignatureValue>${signature}</SignatureValue>
        <KeyInfo>
            <X509Data>
                <X509Certificate>${certificatePem.replace(/-----\w+[\s\w]+-----/g, '').trim()}</X509Certificate>
            </X509Data>
        </KeyInfo>
    </Signature>\n</Invoice>`
    );

    return { signedXML, hash };
  }

  /**
   * Generates keys and a dummy Certificate Signing Request (CSR) for onboarding.
   */
  public static generateCSR(vatNumber: string, sellerName: string): { privateKey: string; publicKey: string; csr: string } {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    const csr = `-----BEGIN CERTIFICATE REQUEST-----
MIICvDCCAaQCAQAwdzELMAkGA1UEBhMCU0ExDjAMBgNVBAgMCU1ha2thaDEOMAwG
A1UEBwwFSmVkZGFoMRQwEgYDVQQKDAtJdGVtIEZsb3cxGDAWBgNVBAsMD0lUIERl
cGFydG1lbnQxGTAXBgNVBAMMDHNzaC1lcnAuMjZpLnVrMIIBIjANBgkqhkiG9w0B
AQEFAAOCAQ8AMIIBCgKCAQEA08...
-----END CERTIFICATE REQUEST-----`;

    return { privateKey, publicKey, csr };
  }

  /**
   * Integrates with ZATCA Compliance API endpoint (Developer Portal Sandbox).
   */
  public static async onboardWithZatca(
    vatNumber: string,
    sellerName: string,
    otp: string,
    environment: 'sandbox' | 'simulation' | 'production'
  ): Promise<{ privateKey: string; publicKey: string; certificate: string; certificateId: string }> {
    const { privateKey, publicKey, csr } = this.generateCSR(vatNumber, sellerName);

    if (environment === 'sandbox' || environment === 'simulation') {
      // Simulate successful onboarding responses for testing/sandboxing environments
      const fakeCertificate = `-----BEGIN CERTIFICATE-----
MIIDdzCCAl+gAwIBAgIETk5...
-----END CERTIFICATE-----`;
      return {
        privateKey,
        publicKey,
        certificate: fakeCertificate,
        certificateId: `compliance-id-${crypto.randomBytes(4).toString('hex')}`,
      };
    }

    // Real API implementation details
    const baseUrl = 'https://gw-fatoora.zatca.sa/api/v2';
    try {
      const response = await axios.post(
        `${baseUrl}/compliance`,
        { csr },
        { headers: { 'OTP': otp, 'Accept-Version': 'V2', 'Content-Type': 'application/json' } }
      );
      return {
        privateKey,
        publicKey,
        certificate: response.data.binarySecurityToken,
        certificateId: response.data.requestID,
      };
    } catch (error: any) {
      throw new Error(`ZATCA Compliance API Error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Submits signed e-invoice to ZATCA endpoint.
   */
  public static async submitInvoice(
    signedXML: string,
    invoiceHash: string,
    settings: IZatcaSettings
  ): Promise<{ status: 'cleared' | 'reported' | 'failed'; errors?: string }> {
    if (settings.environment === 'sandbox' || settings.environment === 'simulation') {
      // Simulate approval/clearance in sandbox mode
      return { status: 'cleared' };
    }

    const baseUrl = 'https://gw-fatoora.zatca.sa/api/v2';
    try {
      const response = await axios.post(
        `${baseUrl}/invoices`,
        {
          invoiceHash,
          uuid: crypto.randomUUID(),
          invoice: Buffer.from(signedXML).toString('base64'),
        },
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(settings.complianceCertificateId + ':' + settings.complianceCertificate).toString('base64')}`,
            'Accept-Version': 'V2',
            'Content-Type': 'application/json',
          },
        }
      );
      return { status: response.data.clearanceStatus === 'CLEARED' ? 'cleared' : 'reported' };
    } catch (error: any) {
      return {
        status: 'failed',
        errors: error.response?.data?.validationResults?.errors?.map((e: any) => e.message).join(', ') || error.message,
      };
    }
  }
}
