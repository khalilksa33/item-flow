
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { storage } from "@/lib/storage";
import { Quotation } from "@/types/inventory";
import { useTranslation } from "react-i18next";

export function useQuotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const { t } = useTranslation(["quotations", "common"]);

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

  const handleCreateNew = () => {
    setEditingQuotation(null);
    setIsDialogOpen(true);
  };

  return {
    quotations,
    isDialogOpen,
    setIsDialogOpen,
    editingQuotation,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCreateNew
  };
}
