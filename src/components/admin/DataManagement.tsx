
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { storage } from "@/lib/storage";
import { Database } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function DataManagement() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { t, i18n } = useTranslation(["admin", "common"]);
  const isRTL = i18n.language === 'ar';

  const exportData = () => {
    try {
      const data = storage.exportData();
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "inventory-data.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast.success(t("admin:dataExported"));
    } catch (error) {
      console.error("Export error:", error);
      toast.error(t("common:errorOccurred"));
    }
  };

  const importData = () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const content = event.target?.result as string;
              const data = JSON.parse(content);
              storage.importData(data);
              toast.success(t("admin:dataImported"));
            } catch (error) {
              console.error("Parse error:", error);
              toast.error(t("common:invalidFileFormat"));
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    } catch (error) {
      console.error("Import error:", error);
      toast.error(t("common:errorOccurred"));
    }
  };

  const clearData = () => {
    try {
      storage.clearData();
      setIsAlertOpen(false);
      toast.success(t("admin:dataCleared"));
    } catch (error) {
      console.error("Clear error:", error);
      toast.error(t("common:errorOccurred"));
    }
  };

  return (
    <Card dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          {t("admin:dataTab")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={exportData}>
            {t("admin:exportData")}
          </Button>
          <Button onClick={importData}>
            {t("admin:importData")}
          </Button>
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                {t("admin:clearData")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("common:areYouSure")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("admin:confirmClear")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("common:cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={clearData} className="bg-destructive text-destructive-foreground">
                  {t("common:confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
