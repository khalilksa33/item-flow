
import { Quotation } from "@/types/inventory";
import { useTranslation } from "react-i18next";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Edit, Download, Trash, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { QuotationPDF } from "../documents/QuotationPDF";

interface QuotationActionsProps {
  quotation: Quotation;
  customerName: string;
  onEdit: (quotation: Quotation) => void;
  onDelete: (id: string) => void;
}

export function QuotationActions({ quotation, customerName, onEdit, onDelete }: QuotationActionsProps) {
  const { t, i18n } = useTranslation(["quotations", "common"]);
  const isRTL = i18n.language === 'ar';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">{t("common:actions")}</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuItem onClick={() => onEdit(quotation)} className={isRTL ? "text-right" : ""}>
          <Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("common:edit")}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <PDFDownloadLink
          document={<QuotationPDF quotation={quotation} customerName={customerName} />}
          fileName={`quotation-${quotation.id.slice(0, 8)}.pdf`}
          style={{ textDecoration: 'none' }}
        >
          {({ loading }) => (
            <DropdownMenuItem disabled={loading} className={isRTL ? "text-right" : ""}>
              <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t("common:print")}
            </DropdownMenuItem>
          )}
        </PDFDownloadLink>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onDelete(quotation.id)}
          className={`text-red-600 hover:text-red-800 hover:bg-red-50 ${isRTL ? "text-right" : ""}`}
        >
          <Trash className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("common:delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
