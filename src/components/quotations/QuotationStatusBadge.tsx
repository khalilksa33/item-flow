
import { useTranslation } from "react-i18next";

interface QuotationStatusBadgeProps {
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
}

export function QuotationStatusBadge({ status }: QuotationStatusBadgeProps) {
  const { t } = useTranslation(["quotations"]);
  
  const getStatusClass = () => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass()}`}>
      {t(`quotations:status.${status}`)}
    </span>
  );
}
