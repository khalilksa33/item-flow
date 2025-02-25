
interface InvoiceTotalsProps {
  subtotal: number;
  vatAmount: number;
  total: number;
}

export function InvoiceTotals({ subtotal, vatAmount, total }: InvoiceTotalsProps) {
  return (
    <div className="text-right space-y-1">
      <div className="text-gray-600">
        Subtotal: ${subtotal.toFixed(2)}
      </div>
      <div className="text-gray-600">
        VAT (15%): ${vatAmount.toFixed(2)}
      </div>
      <div className="text-lg font-semibold">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
}
