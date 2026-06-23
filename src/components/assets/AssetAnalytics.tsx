import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Asset, ASSET_STATUS_LABELS } from '@/types/asset';
import { Shield, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface AssetAnalyticsProps {
  assets: Asset[];
}

export function AssetAnalytics({ assets }: AssetAnalyticsProps) {
  // ── Metrics Calculation ─────────────────────────────────────
  const totalCount = assets.length;
  const totalPurchaseValue = assets.reduce((sum, a) => sum + a.purchasePrice, 0);
  const totalCurrentValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
  const totalDepreciation = Math.max(0, totalPurchaseValue - totalCurrentValue);

  // ── Category Data ───────────────────────────────────────────
  const categoriesDataMap = assets.reduce((acc: Record<string, { category: string; value: number; count: number }>, asset) => {
    if (!acc[asset.category]) {
      acc[asset.category] = { category: asset.category, value: 0, count: 0 };
    }
    acc[asset.category].value += asset.currentValue;
    acc[asset.category].count += 1;
    return acc;
  }, {});
  const categoryData = Object.values(categoriesDataMap);

  // ── Status Data ─────────────────────────────────────────────
  const statusDataMap = assets.reduce((acc: Record<string, { name: string; value: number }>, asset) => {
    const label = ASSET_STATUS_LABELS[asset.status]?.label || asset.status;
    if (!acc[asset.status]) {
      acc[asset.status] = { name: label, value: 0 };
    }
    acc[asset.status].value += 1;
    return acc;
  }, {});
  const statusData = Object.values(statusDataMap);

  // Colors for Pie Chart
  const COLORS = ['#10B981', '#F59E0B', '#6B7280', '#EF4444'];

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">Fixed assets cataloged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Acquisition Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPurchaseValue)}</div>
            <p className="text-xs text-muted-foreground">Original purchase value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Book Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalCurrentValue)}</div>
            <p className="text-xs text-muted-foreground">Current depreciated value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Depreciation</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalDepreciation)}</div>
            <p className="text-xs text-muted-foreground">Value lost over time</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Value Bar Chart */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Asset Value by Category (SAR)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {categoryData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  No data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `SR ${v}`} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Current Value']} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Assets Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              {statusData.length === 0 ? (
                <div className="text-muted-foreground text-sm">No data available</div>
              ) : (
                <div className="w-full h-full flex flex-col sm:flex-row items-center justify-around">
                  <div className="w-[200px] h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-2 mt-4 sm:mt-0">
                    {statusData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="font-medium">{entry.name}</span>
                        <span className="text-muted-foreground">({entry.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
