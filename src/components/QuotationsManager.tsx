
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

export function QuotationsManager() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [customers] = useState<Customer[]>(storage.getCustomers());
  const [products] = useState<InventoryItem[]>(storage.getItems());

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = () => {
    setQuotations(storage.getQuotations());
  };

  const handleSubmit = (data: Partial<Quotation>) => {
    const quotationData: Quotation = {
      id: editingQuotation?.id || crypto.randomUUID(),
      ...data,
      status: 'draft',
      createdAt: editingQuotation?.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    } as Quotation;

    if (editingQuotation) {
      storage.updateQuotation(quotationData);
      toast.success("Quotation updated successfully");
    } else {
      storage.addQuotation(quotationData);
      toast.success("Quotation created successfully");
    }

    loadQuotations();
    setIsDialogOpen(false);
    setEditingQuotation(null);
  };

  const handleEdit = (quotation: Quotation) => {
    setEditingQuotation(quotation);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    storage.deleteQuotation(id);
    loadQuotations();
    toast.success("Quotation deleted successfully");
  };

  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || 'Unknown Customer';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quotations</h2>
        <Button onClick={() => {
          setEditingQuotation(null);
          setIsDialogOpen(true);
        }}>
          New Quotation
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Valid Until</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.map((quotation) => (
            <TableRow key={quotation.id}>
              <TableCell>{new Date(quotation.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{getCustomerName(quotation.customerId)}</TableCell>
              <TableCell>${quotation.total.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  quotation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  quotation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  quotation.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {quotation.status}
                </span>
              </TableCell>
              <TableCell>{new Date(quotation.validUntil).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(quotation)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(quotation.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingQuotation ? "Edit Quotation" : "New Quotation"}
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
