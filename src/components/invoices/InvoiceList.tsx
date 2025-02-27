
import { Invoice, Customer } from "@/types/inventory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceActions } from "./InvoiceActions";
import { useTranslation } from "react-i18next";

interface InvoiceListProps {
  invoices: Invoice[];
  customers: Customer[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
}

export function InvoiceList({ invoices, customers, onEdit, onDelete }: InvoiceListProps) {
  const { t, i18n } = useTranslation(["invoices", "customers", "common"]);
  const isRTL = i18n.language === 'ar';
  
  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || t("invoices:unknownCustomer");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem('currency') || 'SAR';
    return isRTL 
      ? `${amount.toFixed(2)} ${currency}` 
      : `${currency} ${amount.toFixed(2)}`;
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={isRTL ? "text-right" : ""}>{t("invoices:date")}</TableHead>
            <TableHead className={isRTL ? "text-right" : ""}>{t("customers:title")}</TableHead>
            <TableHead className={isRTL ? "text-right" : ""}>{t("invoices:total")}</TableHead>
            <TableHead className={isRTL ? "text-right" : ""}>{t("invoices:status")}</TableHead>
            <TableHead className={isRTL ? "text-right" : ""}>{t("invoices:dueDate")}</TableHead>
            <TableHead className={`${isRTL ? "text-right" : ""} w-[100px]`}>{t("common:actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                {t("common:noRecords")}
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className={isRTL ? "text-right" : ""}>
                  {formatDate(invoice.createdAt)}
                </TableCell>
                <TableCell className={isRTL ? "text-right" : ""}>
                  {getCustomerName(invoice.customerId)}
                </TableCell>
                <TableCell className={isRTL ? "text-right" : ""}>
                  {formatCurrency(invoice.total)}
                </TableCell>
                <TableCell className={isRTL ? "text-right" : ""}>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    invoice.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t(`invoices:status.${invoice.status}`)}
                  </span>
                </TableCell>
                <TableCell className={isRTL ? "text-right" : ""}>
                  {formatDate(invoice.paymentDue)}
                </TableCell>
                <TableCell className={isRTL ? "text-right" : ""}>
                  <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
                    <InvoiceActions 
                      invoice={invoice} 
                      customers={customers} 
                      onEdit={onEdit} 
                      onDelete={onDelete} 
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
