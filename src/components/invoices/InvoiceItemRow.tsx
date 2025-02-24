
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InvoiceItemProps } from "./types";

export function InvoiceItemRow({ item, products, onItemChange, onRemove }: InvoiceItemProps) {
  return (
    <div className="grid grid-cols-4 gap-2 mb-2">
      <select
        className="rounded-md border border-input bg-background px-3 py-2"
        value={item.productId}
        onChange={(e) => onItemChange('productId', e.target.value)}
        required
      >
        <option value="">Select Product</option>
        {products.map(product => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      <Input
        type="number"
        min="0"
        step="0.01"
        value={item.unitPrice}
        onChange={(e) => onItemChange('unitPrice', e.target.value)}
        placeholder="Unit Price"
        required
      />
      <Input
        type="number"
        min="1"
        value={item.quantity}
        onChange={(e) => onItemChange('quantity', e.target.value)}
        placeholder="Quantity"
        required
      />
      <div className="flex items-center gap-2">
        <div className="text-sm space-y-1">
          <div className="text-gray-600">
            Subtotal: ${item.subtotal.toFixed(2)}
          </div>
          <div className="text-gray-600">
            VAT (15%): ${item.vat.toFixed(2)}
          </div>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
