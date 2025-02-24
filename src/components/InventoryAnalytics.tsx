
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { InventoryItem, AnalyticsData } from "@/types/inventory";
import { Package2, TrendingUp, AlertTriangle, History } from "lucide-react";

interface InventoryAnalyticsProps {
  items: InventoryItem[];
}

export function InventoryAnalytics({ items }: InventoryAnalyticsProps) {
  const calculateAnalytics = (): AnalyticsData => {
    const stockByCategory = items.reduce((acc: { category: string; count: number; }[], item) => {
      const existingCategory = acc.find(c => c.category === item.category);
      if (existingCategory) {
        existingCategory.count += item.quantity;
      } else {
        acc.push({ category: item.category, count: item.quantity });
      }
      return acc;
    }, []);

    const totalValue = items.reduce((sum, item) => sum + (item.cost || 0) * item.quantity, 0);
    const lowStockItems = items.filter(item => item.quantity <= item.minQuantity).length;
    const movementsToday = items.reduce((count, item) => {
      const today = new Date().toISOString().split('T')[0];
      return count + item.stockMovements.filter(m => m.date.startsWith(today)).length;
    }, 0);

    return {
      totalItems: items.length,
      totalValue,
      lowStockItems,
      movementsToday,
      stockByCategory
    };
  };

  const analytics = calculateAnalytics();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.lowStockItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Movements</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.movementsToday}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader>
          <CardTitle>Stock by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.stockByCategory}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
