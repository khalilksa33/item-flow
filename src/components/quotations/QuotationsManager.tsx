
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { Customer, InventoryItem } from "@/types/inventory";
import { QuotationForm } from "./QuotationForm";
import { useQuotations } from "./useQuotations";
import { QuotationTable } from "./QuotationTable";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { useState } from "react";

export function QuotationsManager() {
  const [customers] = useState<Customer[]>(storage.getCustomers());
  const [products] = useState<InventoryItem[]>(storage.getItems());
  const { t, i18n } = useTranslation(["quotations", "common"]);
  const isRTL = i18n.language === 'ar';
  
  const {
    quotations,
    isDialogOpen,
    setIsDialogOpen,
    editingQuotation,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCreateNew
  } = useQuotations();

  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("quotations:title")}</h2>
        <Button onClick={handleCreateNew}>
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("quotations:newQuotation")}
        </Button>
      </div>

      <div>
        <QuotationTable 
          quotations={quotations}
          customers={customers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
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
