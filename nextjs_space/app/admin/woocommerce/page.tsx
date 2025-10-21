
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ShoppingCart, 
  Package, 
  Users,
  RefreshCw,
  Database,
  AlertCircle,
  Download
} from 'lucide-react';

interface ImportResult {
  success: boolean;
  total?: number;
  imported?: number;
  updated?: number;
  skipped?: number;
  message?: string;
  error?: string;
}

interface WooStats {
  products: number;
  orders: number;
  customers: number;
}

export default function WooCommerceImportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [connectionError, setConnectionError] = useState<string>('');
  const [wooStats, setWooStats] = useState<WooStats | null>(null);
  
  const [importingProducts, setImportingProducts] = useState(false);
  const [importingOrders, setImportingOrders] = useState(false);
  const [productsResult, setProductsResult] = useState<ImportResult | null>(null);
  const [ordersResult, setOrdersResult] = useState<ImportResult | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      const userRole = (session?.user as any)?.role;
      if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
        router.push('/');
      }
    }
  }, [status, session, router]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await fetch('/api/woocommerce/test-connection');
      const data = await response.json();
      
      if (data.success) {
        setIsConnected(true);
        setConnectionError('');
        fetchWooStats();
      } else {
        setIsConnected(false);
        setConnectionError(data.error || 'Failed to connect');
      }
    } catch (error: any) {
      setIsConnected(false);
      setConnectionError(error.message || 'Network error');
    }
  };

  const fetchWooStats = async () => {
    try {
      const response = await fetch('/api/woocommerce/stats');
      const data = await response.json();
      
      if (data.success) {
        setWooStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching WooCommerce stats:', error);
    }
  };

  const handleImportProducts = async () => {
    setImportingProducts(true);
    setProductsResult(null);
    
    try {
      const response = await fetch('/api/woocommerce/import-products', {
        method: 'POST',
      });
      
      const data = await response.json();
      setProductsResult(data);
    } catch (error: any) {
      setProductsResult({
        success: false,
        error: error.message || 'Failed to import products',
      });
    } finally {
      setImportingProducts(false);
    }
  };

  const handleImportOrders = async () => {
    setImportingOrders(true);
    setOrdersResult(null);
    
    try {
      const response = await fetch('/api/woocommerce/import-orders', {
        method: 'POST',
      });
      
      const data = await response.json();
      setOrdersResult(data);
    } catch (error: any) {
      setOrdersResult({
        success: false,
        error: error.message || 'Failed to import orders',
      });
    } finally {
      setImportingOrders(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">WooCommerce Import</h1>
        <p className="text-muted-foreground">
          Import products and orders from your WooCommerce store
        </p>
      </div>

      {/* Connection Status */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Connection Status
              </CardTitle>
              <CardDescription>
                WooCommerce API connection status
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={testConnection}
              disabled={isConnected === null}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Test Connection
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isConnected === null ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Testing connection...
            </div>
          ) : isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Connected successfully</span>
              </div>
              
              {wooStats && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Products</p>
                        <p className="text-2xl font-bold">{wooStats.products}</p>
                      </div>
                      <Package className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Orders</p>
                        <p className="text-2xl font-bold">{wooStats.orders}</p>
                      </div>
                      <ShoppingCart className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Customers</p>
                        <p className="text-2xl font-bold">{wooStats.customers}</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Connection failed:</strong> {connectionError}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Import Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Import Products
            </CardTitle>
            <CardDescription>
              Import all products from WooCommerce to your database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This will import all published products including:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Product name, description, and images</li>
                <li>Pricing and stock information</li>
                <li>Categories and tags</li>
                <li>Nutritional information (if available)</li>
              </ul>
            </div>

            <Button
              onClick={handleImportProducts}
              disabled={!isConnected || importingProducts}
              className="w-full"
            >
              {importingProducts ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Import Products
                </>
              )}
            </Button>

            {productsResult && (
              <Alert variant={productsResult.success ? 'default' : 'destructive'}>
                {productsResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {productsResult.success ? (
                    <div className="space-y-2">
                      <p className="font-medium">{productsResult.message}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">
                          Total: {productsResult.total}
                        </Badge>
                        <Badge variant="default" className="bg-green-600">
                          Imported: {productsResult.imported}
                        </Badge>
                        <Badge variant="default" className="bg-blue-600">
                          Updated: {productsResult.updated}
                        </Badge>
                        <Badge variant="outline">
                          Skipped: {productsResult.skipped}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p>{productsResult.error}</p>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Import Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Import Orders
            </CardTitle>
            <CardDescription>
              Import all orders from WooCommerce to your database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This will import all orders including:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Order details and status</li>
                <li>Customer information</li>
                <li>Order items and quantities</li>
                <li>Billing and shipping addresses</li>
              </ul>
            </div>

            <Button
              onClick={handleImportOrders}
              disabled={!isConnected || importingOrders}
              className="w-full"
            >
              {importingOrders ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Import Orders
                </>
              )}
            </Button>

            {ordersResult && (
              <Alert variant={ordersResult.success ? 'default' : 'destructive'}>
                {ordersResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {ordersResult.success ? (
                    <div className="space-y-2">
                      <p className="font-medium">{ordersResult.message}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">
                          Total: {ordersResult.total}
                        </Badge>
                        <Badge variant="default" className="bg-green-600">
                          Imported: {ordersResult.imported}
                        </Badge>
                        <Badge variant="outline">
                          Skipped: {ordersResult.skipped}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p>{ordersResult.error}</p>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      <Alert className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important Notes:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li>Existing products will be updated based on product name</li>
            <li>Duplicate orders (same order number) will be skipped</li>
            <li>Customer accounts will be created automatically if they don't exist</li>
            <li>Large imports may take several minutes to complete</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
