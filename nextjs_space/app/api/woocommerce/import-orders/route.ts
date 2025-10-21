
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getWooCommerceClient, WooOrder } from '@/lib/woocommerce';
import { prisma } from '@/lib/db';
import { OrderStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const userRole = (session?.user as any)?.role;
    
    if (!session || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const woo = getWooCommerceClient();
    
    // Fetch all orders with pagination
    let page = 1;
    let allOrders: WooOrder[] = [];
    let hasMore = true;
    
    while (hasMore) {
      const response = await woo.get('orders', {
        per_page: 100,
        page,
      });
      
      const orders = response.data as WooOrder[];
      allOrders = [...allOrders, ...orders];
      
      // Check if there are more pages
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1');
      hasMore = page < totalPages;
      page++;
    }

    // Map WooCommerce order status to our OrderStatus enum
    const mapOrderStatus = (wooStatus: string): OrderStatus => {
      switch (wooStatus) {
        case 'pending':
        case 'on-hold':
          return OrderStatus.PENDING;
        case 'processing':
          return OrderStatus.CONFIRMED;
        case 'completed':
          return OrderStatus.DELIVERED;
        case 'cancelled':
        case 'refunded':
        case 'failed':
          return OrderStatus.CANCELLED;
        default:
          return OrderStatus.PENDING;
      }
    };

    let imported = 0;
    let skipped = 0;

    // Get or create default delivery zone
    let defaultZone = await prisma.deliveryZone.findFirst({
      where: { name: 'Imported Orders' },
    });

    if (!defaultZone) {
      defaultZone = await prisma.deliveryZone.create({
        data: {
          name: 'Imported Orders',
          areas: ['All Areas'],
          deliveryFee: 0,
          isActive: true,
        },
      });
    }

    for (const wooOrder of allOrders) {
      try {
        // Check if order already exists
        const existingOrder = await prisma.order.findFirst({
          where: {
            orderNumber: wooOrder.number,
          },
        });

        if (existingOrder) {
          skipped++;
          continue;
        }

        // Find or create user based on email
        let user = await prisma.user.findUnique({
          where: { email: wooOrder.billing.email },
        });

        if (!user) {
          // Create user from order billing info
          user = await prisma.user.create({
            data: {
              email: wooOrder.billing.email,
              name: `${wooOrder.billing.first_name} ${wooOrder.billing.last_name}`,
              firstName: wooOrder.billing.first_name,
              lastName: wooOrder.billing.last_name,
              phone: wooOrder.billing.phone,
              address: `${wooOrder.billing.address_1}, ${wooOrder.billing.city}, ${wooOrder.billing.postcode}`,
              role: 'USER',
            },
          });
        }

        // Calculate totals
        const subtotal = parseFloat(wooOrder.total) - parseFloat(wooOrder.shipping_total);
        const deliveryFee = parseFloat(wooOrder.shipping_total);
        const total = parseFloat(wooOrder.total);

        // Create order
        const order = await prisma.order.create({
          data: {
            userId: user.id,
            orderNumber: wooOrder.number,
            status: mapOrderStatus(wooOrder.status),
            subtotal,
            deliveryFee,
            total,
            deliveryAddress: `${wooOrder.shipping.address_1}, ${wooOrder.shipping.city}, ${wooOrder.shipping.postcode}`,
            deliveryZoneId: defaultZone.id,
            notes: wooOrder.customer_note || null,
            createdAt: new Date(wooOrder.date_created),
            updatedAt: new Date(wooOrder.date_modified),
          },
        });

        // Create order items
        for (const lineItem of wooOrder.line_items) {
          // Find matching product by name
          const product = await prisma.product.findFirst({
            where: {
              name: {
                contains: lineItem.name,
                mode: 'insensitive',
              },
            },
          });

          if (product) {
            await prisma.orderItem.create({
              data: {
                orderId: order.id,
                productId: product.id,
                quantity: lineItem.quantity,
                price: lineItem.price,
              },
            });
          }
        }

        imported++;
      } catch (error) {
        console.error(`Error importing order ${wooOrder.number}:`, error);
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      total: allOrders.length,
      imported,
      skipped,
      message: `Successfully processed ${allOrders.length} orders. ${imported} imported, ${skipped} skipped.`,
    });

  } catch (error: any) {
    console.error('Error importing orders from WooCommerce:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import orders' },
      { status: 500 }
    );
  }
}
