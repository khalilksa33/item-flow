
import { Vendor } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

interface VendorListProps {
  vendors: Vendor[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (id: string) => void;
}

export function VendorList({ vendors, onEdit, onDelete }: VendorListProps) {
  const { t, i18n } = useTranslation(["vendors", "common"]);
  const isRTL = i18n.language === 'ar';

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={isRTL ? "text-right" : ""}>{t("vendors:name")}</TableHead>
            <TableHead className={isRTL ? "text-right" : ""}>{t("vendors:type")}</TableHead>
            <TableHead className={isRTL ? "text-right" : ""}>{t("vendors:contact")}</TableHead>
            <TableHead className={isRTL ? "text-right" : ""}>{t("vendors:status")}</TableHead>
            <TableHead className={isRTL ? "text-right" : ""}>{t("vendors:actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell className={isRTL ? "text-right" : ""}>{vendor.name}</TableCell>
              <TableCell className={isRTL ? "text-right" : ""}>
                {t(`vendors:${vendor.type}`)}
              </TableCell>
              <TableCell className={isRTL ? "text-right" : ""}>
                <div className="space-y-1">
                  <div>{vendor.email}</div>
                  <div className="text-sm text-gray-500">{vendor.phone}</div>
                </div>
              </TableCell>
              <TableCell className={isRTL ? "text-right" : ""}>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    vendor.activeContract
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {vendor.activeContract ? t("vendors:active") : t("vendors:inactive")}
                </span>
              </TableCell>
              <TableCell className={isRTL ? "text-right" : ""}>
                <div className={`flex space-x-2 ${isRTL ? "space-x-reverse" : ""}`}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(vendor)}
                    title={t("common:edit")}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onDelete(vendor.id)}
                    title={t("common:delete")}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {vendors.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                {t("vendors:noVendors", "No vendors found")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
