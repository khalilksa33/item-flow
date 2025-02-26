
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { storage } from "@/lib/storage";
import { Quotation, Customer, InventoryItem } from "@/types/inventory";
import { toast } from "sonner";
import { QuotationForm } from "./quotations/QuotationForm";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Printer, Plus, MoreVertical, Trash, Edit, Download } from "lucide-react";
import { QuotationPDF } from "./documents/QuotationPDF";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function QuotationsManager() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [customers] = useState<Customer[]>(storage.getCustomers());
  const [products] = useState<InventoryItem[]>(storage.getItems());
  const { t, i18n } = useTranslation(["quotations", "common"]);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = () => {
    setQuotations(storage.getQuotations());
  };

  const handleSubmit = (data: Partial<Quotation>) => {
    try {
      const quotationData: Quotation = {
        id: editingQuotation?.id || crypto.randomUUID(),
        ...data,
        status: 'draft',
        createdAt: editingQuotation?.createdAt || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      } as Quotation;

      if (editingQuotation) {
        storage.updateQuotation(quotationData);
        toast.success(t("quotations:updateSuccess"));
      } else {
        storage.addQuotation(quotationData);
        toast.success(t("quotations:createSuccess"));
      }

      loadQuotations();
      setIsDialogOpen(false);
      setEditingQuotation(null);
    } catch (error) {
      console.error("Error submitting quotation:", error);
      toast.error(t("common:error"));
    }
  };

  const handleEdit = (quotation: Quotation) => {
    setEditingQuotation(quotation);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    storage.deleteQuotation(id);
    loadQuotations();
    toast.success(t("quotations:deleteSuccess"));
  };

  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || 'Unknown Customer';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(i18n.language, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem('currency') || 'SAR';
    return isRTL 
      ? `${amount.toFixed(2)} ${currency}` 
      : `${currency} ${amount.toFixed(2)}`;
  };

  const renderActions = (quotation: Quotation) => {
    const customerName = getCustomerName(quotation.customerId);
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">{t("common:actions")}</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isRTL ? "start" : "end"}>
          <DropdownMenuItem onClick={() => handleEdit(quotation)} className={isRTL ? "text-right" : ""}>
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
            onClick={() => handleDelete(quotation.id)}
            className={`text-red-600 hover:text-red-800 hover:bg-red-50 ${isRTL ? "text-right" : ""}`}
          >
            <Trash className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t("common:delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("quotations:title")}</h2>
        <Button onClick={() => {
          setEditingQuotation(null);
          setIsDialogOpen(true);
        }}>
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("quotations:newQuotation")}
        </Button>
      </div>

      <div>
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
                    {formatDate(quotation.createdAt)}
                  </TableCell>
                  <TableCell className={isRTL ? "text-right" : ""}>
                    {getCustomerName(quotation.customerId)}
                  </TableCell>
                  <TableCell className={isRTL ? "text-right" : ""}>
                    {formatCurrency(quotation.total)}
                  </TableCell>
                  <TableCell className={isRTL ? "text-right" : ""}>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      quotation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      quotation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      quotation.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {t(`quotations:status.${quotation.status}`)}
                    </span>
                  </TableCell>
                  <TableCell className={isRTL ? "text-right" : ""}>
                    {formatDate(quotation.validUntil)}
                  </TableCell>
                  <TableCell>
                    <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
                      {renderActions(quotation)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  {t("quotations:noQuotations", "No quotations found. Create your first quotation using the button above.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className={isRTL ? "text-right" : ""}>
              {editingQuotation ? t("quotations:editQuotation") : t("quotations:newQuotation")}
            </DialogTitle>
          </DialogHeader>
          <QuotationForm
            editingQuotation={editingQuotation}
            customers={customers}
            products={products}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
