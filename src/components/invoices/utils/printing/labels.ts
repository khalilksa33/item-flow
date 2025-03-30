
/**
 * Label translations for printed documents
 */

interface DocumentLabels {
  invoice: Record<string, string>;
  receipt: Record<string, string>;
}

/**
 * Get localized labels for documents based on language
 */
export const getDocumentLabels = (isRTL: boolean): DocumentLabels => {
  return {
    invoice: isRTL ? {
      invoice: "فاتورة",
      reference: "المرجع",
      date: "التاريخ",
      dueDate: "تاريخ الاستحقاق",
      paymentTerms: "شروط الدفع",
      billTo: "فاتورة إلى",
      items: "عناصر الفاتورة",
      item: "العنصر",
      quantity: "الكمية",
      unitPrice: "سعر الوحدة",
      subtotal: "المجموع الفرعي",
      vat: "ضريبة القيمة المضافة",
      total: "المجموع",
      notes: "ملاحظات",
      thankYou: "شكرًا لعملك معنا!",
      generatedOn: "تم إنشاؤها في",
      paid: "مدفوع",
      vatNumber: "رقم ضريبة القيمة المضافة",
      crNumber: "رقم السجل التجاري",
      address: "العنوان",
      phone: "الهاتف",
      email: "البريد الإلكتروني"
    } : {
      invoice: "Invoice",
      reference: "Reference",
      date: "Date",
      dueDate: "Due Date",
      paymentTerms: "Payment Terms",
      billTo: "Bill To",
      items: "Invoice Items",
      item: "Item",
      quantity: "Quantity",
      unitPrice: "Unit Price",
      subtotal: "Subtotal",
      vat: "VAT",
      total: "Total",
      notes: "Notes",
      thankYou: "Thank you for your business!",
      generatedOn: "Generated on",
      paid: "PAID",
      vatNumber: "VAT Number",
      crNumber: "CR Number",
      address: "Address",
      phone: "Phone",
      email: "Email"
    },
    receipt: isRTL ? {
      receipt: "إيصال نقدي",
      receiptNo: "رقم الإيصال",
      date: "التاريخ",
      receivedFrom: "استلمنا من",
      paymentMethod: "طريقة الدفع",
      invoiceReference: "مرجع الفاتورة",
      amountReceived: "المبلغ المستلم",
      amountInWords: "المبلغ بالكلمات",
      receivedBy: "استلم بواسطة",
      customerSignature: "توقيع العميل",
      cash: "نقدي",
      paid: "مدفوع"
    } : {
      receipt: "Cash Receipt",
      receiptNo: "Receipt No",
      date: "Date",
      receivedFrom: "Received from",
      paymentMethod: "Payment Method",
      invoiceReference: "Invoice Reference",
      amountReceived: "Amount Received",
      amountInWords: "Amount in Words",
      receivedBy: "Received By",
      customerSignature: "Customer Signature",
      cash: "Cash",
      paid: "PAID"
    }
  };
};
