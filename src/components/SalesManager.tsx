import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { Sale, Customer, InventoryItem } from "@/types/inventory";
import { toast } from "sonner";
import { SalesAnalytics } from "./SalesAnalytics";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

export function SalesManager() {
  const [customers] = useState<Customer[]>(storage.getCustomers());
  const [products] = useState<InventoryItem[]>(storage.getItems());
  const [sales, setSales] = useState<Sale[]>([]);
  const { t, i18n } = useTranslation(["sales", "common"]);
  const isRTL = i18n.language === 'ar';
  
  useEffect(() => {
    const loadedSales = storage.getSales();
    setSales(loadedSales);
  }, []);

  const refreshSales = () => {
    const loadedSales = storage.getSales();
    setSales(loadedSales);
  };

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem('currency') || 'SAR';
    return isRTL 
      ? `${amount.toFixed(2)} ${currency}` 
      : `${currency} ${amount.toFixed(2)}`;
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : t("sales:unknownCustomer", "Unknown Customer");
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("sales:title")}</h2>
        <Button onClick={() => {
          /* Sale creation logic */
        }}>
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("sales:newSale")}
        </Button>
      </div>
      
      {/* Sales Analytics Component */}
      <SalesAnalytics sales={sales} />
      
      {/* Sales Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className={`p-2 text-${isRTL ? 'right' : 'left'}`}>{t("sales:customerName")}</th>
              <th className={`p-2 text-${isRTL ? 'right' : 'left'}`}>{t("sales:saleDate")}</th>
              <th className={`p-2 text-${isRTL ? 'right' : 'left'}`}>{t("sales:total")}</th>
              <th className={`p-2 text-${isRTL ? 'right' : 'left'}`}>{t("sales:status")}</th>
              <th className={`p-2 text-${isRTL ? 'right' : 'left'}`}>{t("sales:paymentStatus")}</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id} className="border-b">
                <td className="p-2">{getCustomerName(sale.customerId)}</td>
                <td className="p-2">{formatDate(sale.date)}</td>
                <td className="p-2">{formatCurrency(sale.total)}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                    sale.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t(`sales:${sale.status}`)}
                  </span>
                </td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    sale.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    sale.paymentStatus === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {t(`sales:${sale.paymentStatus}`)}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline" onClick={() => {
                      /* Sale edit logic */
                    }}>
                      {t("common:edit")}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => {
                      /* Sale delete logic */
                    }}>
                      {t("common:delete")}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {sales.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  {t("sales:noSales", "No sales records found")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
