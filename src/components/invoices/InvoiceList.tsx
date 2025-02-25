
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

interface InvoiceListProps {
  invoices: Invoice[];
  customers: Customer[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
}

export function InvoiceList({ invoices, customers, onEdit, onDelete }: InvoiceListProps) {
  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || 'Unknown Customer';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>{getCustomerName(invoice.customerId)}</TableCell>
            <TableCell>${invoice.total.toFixed(2)}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                invoice.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {invoice.status}
              </span>
            </TableCell>
            <TableCell>{new Date(invoice.paymentDue).toLocaleDateString()}</TableCell>
            <TableCell>
              <InvoiceActions 
                invoice={invoice} 
                customers={customers} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
