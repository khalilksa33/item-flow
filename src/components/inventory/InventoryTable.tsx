
import { InventoryItem } from "@/types/inventory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export function InventoryTable({ items, onEdit, onDelete }: InventoryTableProps) {
  const { t, i18n } = useTranslation(["inventory", "common"]);
  const isRTL = i18n.language === 'ar';

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className={isRTL ? "text-right" : ""}>{t("inventory:name")}</TableHead>
          <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? 'كود الصنف' : 'Item Code'}</TableHead>
          <TableHead className={isRTL ? "text-right" : ""}>{t("inventory:category")}</TableHead>
          <TableHead className={isRTL ? "text-right" : ""}>{t("common:description")}</TableHead>
          <TableHead className={isRTL ? "text-right" : ""}>{t("inventory:quantity")}</TableHead>
          <TableHead className={isRTL ? "text-right" : ""}>{t("inventory:minQuantity")}</TableHead>
          <TableHead className={isRTL ? "text-right" : ""}>{t("inventory:price")}</TableHead>
          <TableHead className={isRTL ? "text-right" : ""}>{t("inventory:lastUpdated")}</TableHead>
          <TableHead className={isRTL ? "text-right" : ""}>{t("inventory:actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length > 0 ? (
          items.map((item) => (
            <TableRow 
              key={item.id}
              className={item.quantity <= item.minQuantity ? "bg-red-50" : ""}
            >
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.barcode || item.id.slice(0, 8)}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell className="flex items-center gap-2">
                {item.quantity}
                {item.quantity <= item.minQuantity && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </TableCell>
              <TableCell>{item.minQuantity}</TableCell>
              <TableCell>${item.cost?.toFixed(2) || '0.00'}</TableCell>
              <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit(item)}
                  >
                    {t("common:edit")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    {t("common:delete")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-4">
              {t("inventory:noItems", "No items found")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
