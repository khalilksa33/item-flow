
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Quotation, Customer } from "@/types/inventory";
import { QuotationStatusBadge } from "./QuotationStatusBadge";
import { QuotationActions } from "./QuotationActions";
import { formatUtils } from "@/utils/formatUtils";

interface QuotationTableProps {
  quotations: Quotation[];
  customers: Customer[];
  onEdit: (quotation: Quotation) => void;
  onDelete: (id: string) => void;
}

export function QuotationTable({ quotations, customers, onEdit, onDelete }: QuotationTableProps) {
  const { t, i18n } = useTranslation(["quotations", "common"]);
  const isRTL = i18n.language === 'ar';

  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || t("quotations:unknownCustomer");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={isRTL ? "text-right" : ""}>{t("quotations:date")}</TableHead>
          <TableHead className={isRTL ? "text-right" : ""}>{t("quotations:customer")}</TableHead>
          <TableHead className={isRTL ? "text-right" : ""}>{t("quotations:total")}</TableHead>
          <TableHead className={isRTL ? "text-right" : ""}>{t("quotations:status")}</TableHead>
          <TableHead className={isRTL ? "text-right" : ""}>{t("quotations:validUntil")}</TableHead>
          <TableHead className={isRTL ? "text-right" : ""}>{t("common:actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotations.length > 0 ? (
          quotations.map((quotation) => (
            <TableRow key={quotation.id}>
              <TableCell className={isRTL ? "text-right" : ""}>
                {formatUtils.formatDate(quotation.createdAt, i18n.language)}
              </TableCell>
              <TableCell className={isRTL ? "text-right" : ""}>
                {getCustomerName(quotation.customerId)}
              </TableCell>
              <TableCell className={isRTL ? "text-right" : ""}>
                {formatUtils.formatCurrency(quotation.total, isRTL)}
              </TableCell>
              <TableCell className={isRTL ? "text-right" : ""}>
                <QuotationStatusBadge status={quotation.status} />
              </TableCell>
              <TableCell className={isRTL ? "text-right" : ""}>
                {formatUtils.formatDate(quotation.validUntil, i18n.language)}
              </TableCell>
              <TableCell>
                <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
                  <QuotationActions
                    quotation={quotation}
                    customerName={getCustomerName(quotation.customerId)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              {t("quotations:noQuotations")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
