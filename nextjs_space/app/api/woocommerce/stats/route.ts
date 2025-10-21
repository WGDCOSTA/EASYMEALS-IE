
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getWooCommerceClient } from '@/lib/woocommerce';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const woo = getWooCommerceClient();
    
    // Fetch counts from WooCommerce
    const [productsRes, ordersRes, customersRes] = await Promise.all([
      woo.get('products', { per_page: 1 }),
      woo.get('orders', { per_page: 1 }),
      woo.get('customers', { per_page: 1 }),
    ]);
    
    return NextResponse.json({
      success: true,
      stats: {
        products: parseInt(productsRes.headers['x-wp-total'] || '0'),
        orders: parseInt(ordersRes.headers['x-wp-total'] || '0'),
        customers: parseInt(customersRes.headers['x-wp-total'] || '0'),
      },
    });

  } catch (error: any) {
    console.error('Error fetching WooCommerce stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
