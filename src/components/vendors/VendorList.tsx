
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Vendor } from "@/types/inventory";
import { useTranslation } from "react-i18next";

interface VendorListProps {
  vendors: Vendor[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (id: string) => void;
}

export function VendorList({ vendors, onEdit, onDelete }: VendorListProps) {
  const { t } = useTranslation();
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("vendors.name")}</TableHead>
          <TableHead>{t("vendors.type")}</TableHead>
          <TableHead>{t("vendors.products")}</TableHead>
          <TableHead>{t("vendors.contact")}</TableHead>
          <TableHead>{t("vendors.status")}</TableHead>
          <TableHead>{t("vendors.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vendors.map((vendor) => (
          <TableRow key={vendor.id}>
            <TableCell>{vendor.name}</TableCell>
            <TableCell className="capitalize">{t(`vendors.${vendor.type}`)}</TableCell>
            <TableCell>{vendor.products.join(', ')}</TableCell>
            <TableCell>{vendor.email}</TableCell>
            <TableCell>
              <span 
                className={`px-2 py-1 rounded-full text-xs ${
                  vendor.activeContract 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {vendor.activeContract ? t("vendors.active") : t("vendors.inactive")}
              </span>
            </TableCell>
            <TableCell