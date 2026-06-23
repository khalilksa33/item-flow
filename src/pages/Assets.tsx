import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Plus, LayoutDashboard, ListFilter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { AssetList } from '@/components/assets/AssetList';
import { AssetAnalytics } from '@/components/assets/AssetAnalytics';
import { AssetForm } from '@/components/assets/AssetForm';
import { assetsApi } from '@/lib/api';
import { Asset } from '@/types/asset';
import { toast } from 'sonner';

export default function AssetsPage() {
  const { t, i18n } = useTranslation(['common']);
  const isRTL = i18n.language === 'ar';
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const data = await assetsApi.getAll() as Asset[];
      setAssets(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load assets from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Navigation */}
      <div className="flex justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <Home className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('common:back')}
          </Button>
        </Link>
        <LanguageSwitcher />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asset Management</h1>
          <p className="text-muted-foreground mt-1">Track and manage company fixed assets, net book values, and depreciation.</p>
        </div>
        <Button onClick={() => { setEditingAsset(null); setIsFormOpen(true); }} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          Add Asset
        </Button>
      </div>

      {/* Content Tabs */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="list" className="gap-2">
              <ListFilter className="h-4 w-4" />
              Assets Catalog
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Financial Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="border-none p-0 outline-none">
            <AssetList assets={assets} onEdit={handleEdit} onRefresh={fetchAssets} />
          </TabsContent>

          <TabsContent value="analytics" className="border-none p-0 outline-none">
            <AssetAnalytics assets={assets} />
          </TabsContent>
        </Tabs>
      )}

      {/* Add / Edit Form Dialog */}
      <AssetForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingAsset(null); }}
        onSave={fetchAssets}
        asset={editingAsset}
      />
    </div>
  );
}
