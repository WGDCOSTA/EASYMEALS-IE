
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
    
    // Test connection by fetching system status
    const response = await woo.get('system_status');
    
    return NextResponse.json({
      success: true,
      message: 'Successfully connected to WooCommerce',
      storeInfo: {
        version: response.data.environment?.version,
        url: response.data.environment?.home_url,
      },
    });

  } catch (error: any) {
    console.error('Error testing WooCommerce connection:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to connect to WooCommerce',
        details: error.response?.data || null,
      },
      { status: 500 }
    );
  }
}
