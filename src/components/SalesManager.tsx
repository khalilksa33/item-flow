
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { storage } from "@/lib/storage";
import { Sale, SaleItem, Customer, InventoryItem } from "@/types/inventory";
import { toast } from "sonner";

export function SalesManager() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [customers] = useState<Customer[]>(storage.getCustomers());
  const [products] = useState<InventoryItem[]>(storage.getItems());
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = () => {
    setSales(storage.getSales());
  };

  const calculateTotal = (items: SaleItem[]) => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleAddItem = () => {
    const newItem: SaleItem = {
      id: crypto.randomUUID(),
      productId: "",
      quantity: 1,
      unitPrice: 0,
      subtotal: 0
    };
    setSaleItems([...saleItems, newItem]);
  };

  const handleItemChange = (index: number, field: keyof SaleItem, value: any) => {
    const updatedItems = [...saleItems];
    const item = { ...updatedItems[index] };

    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        item.productId = value;
        item.unitPrice = product.cost || 0;
        item.subtotal = item.quantity * item.unitPrice;
      }
    } else if (field === 'quantity') {
      item.quantity = Number(value);
      item.subtotal = item.quantity * item.unitPrice;
    }

    updatedItems[index] = item;
    setSaleItems(updatedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const saleData: Sale = {
      id: editingSale?.id || crypto.randomUUID(),
      customerId: selectedCustomer,
      items: saleItems,
      total: calculateTotal(saleItems),
      status: 'pending',
      paymentStatus: 'unpaid',
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    if (editingSale) {
      storage.updateSale(saleData);
      toast.success("Sale updated successfully");
    } else {
      storage.addSale(saleData);
      toast.success("Sale created successfully");
    }

    loadSales();
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedCustomer("");
    setSaleItems([]);
    setEditingSale(null);
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setSelectedCustomer(sale.customerId);
    setSaleItems(sale.items);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    storage.deleteSale(id);
    loadSales();
    toast.success("Sale deleted successfully");
  };

  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || 'Unknown Customer';
  };

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales</h2>
        <Button onClick={() => {
          resetForm();
          setIsDialogOpen(true);
        }}>
          New Sale
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
              <TableCell>{getCustomerName(sale.customerId)}</TableCell>
              <TableCell>{sale.items.length} items</TableCell>
              <TableCell>${sale.total.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  sale.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  sale.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {sale.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(sale)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(sale.id)}
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
              {editingSale ? "Edit Sale" : "New Sale"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer">Customer</Label>
                <select
                  id="customer"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Items</Label>
                  <Button type="button" onClick={handleAddItem} size="sm">
                    Add Item
                  </Button>
                </div>
                {saleItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-3 gap-2 mb-2">
                    <select
                      className="rounded-md border border-input bg-background px-3 py-2"
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ${product.cost}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      placeholder="Quantity"
                      required
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Subtotal: ${item.subtotal.toFixed(2)}
                      </span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const updatedItems = saleItems.filter((_, i) => i !== index);
                          setSaleItems(updatedItems);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right text-lg font-semibold">
                Total: ${calculateTotal(saleItems).toFixed(2)}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingSale ? "Update" : "Create"} Sale
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
