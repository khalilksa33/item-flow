import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  children?: React.ReactNode;
}

export function BarcodeScanner({ onScan, children }: BarcodeScannerProps) {
  const { t, i18n } = useTranslation(['invoices', 'common']);
  const isRTL = i18n.language === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    if (isOpen && isScanning) {
      startScanning();
    }
    
    return () => {
      stopScanning();
    };
  }, [isOpen, isScanning]);

  const startScanning = async () => {
    try {
      codeReader.current = new BrowserMultiFormatReader();
      
      // Get available video devices
      const videoInputDevices = await codeReader.current.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        toast.error(t('common:noCamera', 'No camera found'));
        return;
      }

      // Use the first available camera (usually back camera on mobile)
      const selectedDeviceId = videoInputDevices[0].deviceId;
      
      if (videoRef.current) {
        await codeReader.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              const barcode = result.getText();
              onScan(barcode);
              setIsOpen(false);
              setIsScanning(false);
              toast.success(
                isRTL 
                  ? `تم مسح الرمز: ${barcode}` 
                  : `Scanned code: ${barcode}`
              );
            }
            // Ignore errors as they're common during scanning
          }
        );
      }
    } catch (error) {
      console.error('Error starting barcode scanner:', error);
      toast.error(t('common:scannerError', 'Failed to start camera'));
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
      codeReader.current = null;
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setIsScanning(true);
    } else {
      setIsScanning(false);
      stopScanning();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Camera className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'مسح الباركود' : 'Scan Barcode'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
            {isRTL ? 'مسح الباركود' : 'Scan Barcode'}
          </DialogTitle>
        </DialogHeader>
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 bg-black rounded-lg"
            playsInline
            muted
          />
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">
                {isRTL ? 'جاري تحميل الكاميرا...' : 'Loading camera...'}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-center mt-4">
          <Button
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            className="w-full"
          >
            <X className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('common:cancel', 'Cancel')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}