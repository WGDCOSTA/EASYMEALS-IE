

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                sku: true,
                storageType: true
              }
            }
          }
        },
        deliveryZone: {
          select: {
            name: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Generate HTML delivery slip
    const deliverySlipHtml = generateDeliverySlipHtml(order)

    return new NextResponse(deliverySlipHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="delivery-slip-${order.orderNumber}.html"`
      }
    })
  } catch (error) {
    console.error('Delivery slip generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate delivery slip' },
      { status: 500 }
    )
  }
}

function generateDeliverySlipHtml(order: any): string {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Delivery Slip ${order.orderNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #fff;
    }
    .header {
      text-align: center;
      border-bottom: 4px solid #1c7430;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .slip-title {
      font-size: 36px;
      font-weight: bold;
      color: #1c7430;
      margin-bottom: 10px;
    }
    .order-number {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
    .important-box {
      background: #fff3cd;
      border: 2px solid #ffc107;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .important-box h2 {
      margin: 0 0 15px 0;
      color: #856404;
      font-size: 18px;
      text-transform: uppercase;
    }
    .important-box p {
      margin: 8px 0;
      font-size: 15px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    .info-section {
      border: 2px solid #1c7430;
      border-radius: 8px;
      padding: 15px;
    }
    .info-section h3 {
      margin: 0 0 15px 0;
      font-size: 16px;
      text-transform: uppercase;
      color: #1c7430;
      border-bottom: 1px solid #1c7430;
      padding-bottom: 10px;
    }
    .info-section p {
      margin: 8px 0;
      font-size: 14px;
    }
    .items-list {
      border: 2px solid #333;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .items-list h3 {
      margin: 0 0 20px 0;
      font-size: 18px;
      text-transform: uppercase;
      text-align: center;
    }
    .item {
      display: grid;
      grid-template-columns: 60px 1fr 100px 80px;
      gap: 15px;
      padding: 15px;
      border-bottom: 1px solid #ddd;
      align-items: center;
    }
    .item:last-child {
      border-bottom: none;
    }
    .item-qty {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      background: #1c7430;
      color: white;
      padding: 10px;
      border-radius: 8px;
    }
    .item-name {
      font-weight: 600;
      font-size: 15px;
    }
    .item-sku {
      color: #666;
      font-size: 13px;
    }
    .storage-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .storage-fresh { background: #d4edda; color: #155724; }
    .storage-frozen { background: #d1ecf1; color: #0c5460; }
    .checkbox {
      width: 30px;
      height: 30px;
      border: 3px solid #333;
      border-radius: 4px;
      margin: auto;
    }
    .summary {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 16px;
    }
    .summary-row.total {
      border-top: 2px solid #333;
      margin-top: 10px;
      padding-top: 15px;
      font-size: 20px;
      font-weight: bold;
    }
    .signature-section {
      margin-top: 40px;
      padding: 20px;
      border: 2px dashed #666;
      border-radius: 8px;
    }
    .signature-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 20px;
    }
    .signature-line {
      border-bottom: 2px solid #333;
      padding-bottom: 5px;
      margin-bottom: 10px;
    }
    .signature-label {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    @media print {
      body { padding: 0; }
      .checkbox { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="slip-title">DELIVERY SLIP</div>
    <div class="order-number">Order #${order.orderNumber}</div>
    <p style="margin: 5px 0; color: #666;">Date: ${formatDate(order.createdAt)}</p>
  </div>

  <div class="important-box">
    <h2>⚠️ Delivery Instructions</h2>
    <p><strong>Delivery Zone:</strong> ${order.deliveryZone.name}</p>
    ${order.scheduledFor ? `<p><strong>Scheduled Delivery:</strong> ${formatDate(order.scheduledFor)}</p>` : ''}
    ${order.estimatedDeliveryDate ? `<p><strong>Estimated Delivery:</strong> ${formatDate(order.estimatedDeliveryDate)}</p>` : ''}
    ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
    ${order.notes ? `<p><strong>Special Notes:</strong> ${order.notes}</p>` : ''}
  </div>

  <div class="info-grid">
    <div class="info-section">
      <h3>📦 Deliver To</h3>
      <p><strong>${order.user.name || 'Customer'}</strong></p>
      <p>${order.deliveryAddress}</p>
      ${order.user.phone ? `<p><strong>Phone:</strong> ${order.user.phone}</p>` : ''}
      <p><strong>Email:</strong> ${order.user.email}</p>
    </div>
    <div class="info-section">
      <h3>🏢 From</h3>
      <p><strong>EasyMeals.ie</strong></p>
      <p>Premium Ready Meals</p>
      <p>Ireland</p>
      <p>info@easymeals.ie</p>
    </div>
  </div>

  <div class="items-list">
    <h3>📋 Items to Deliver (${order.orderItems.length} item${order.orderItems.length !== 1 ? 's' : ''})</h3>
    ${order.orderItems.map((item: any) => `
      <div class="item">
        <div class="item-qty">${item.quantity}×</div>
        <div>
          <div class="item-name">${item.product.name}</div>
          <div class="item-sku">SKU: ${item.product.sku || 'N/A'}</div>
        </div>
        <div>
          <span class="storage-badge storage-${item.product.storageType === 'FRESH_CHILLED' ? 'fresh' : 'frozen'}">
            ${item.product.storageType === 'FRESH_CHILLED' ? '🍃 FRESH' : '❄️ FROZEN'}
          </span>
        </div>
        <div class="checkbox"></div>
      </div>
    `).join('')}
  </div>

  <div class="summary">
    <div class="summary-row">
      <span>Total Items:</span>
      <span>${order.orderItems.reduce((sum: number, item: any) => sum + item.quantity, 0)} items</span>
    </div>
    <div class="summary-row">
      <span>Subtotal:</span>
      <span>€${order.subtotal.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Delivery Fee:</span>
      <span>€${order.deliveryFee.toFixed(2)}</span>
    </div>
    <div class="summary-row total">
      <span>TOTAL:</span>
      <span>€${order.total.toFixed(2)}</span>
    </div>
  </div>

  <div class="signature-section">
    <p style="margin: 0 0 20px 0; font-weight: bold; font-size: 16px;">Delivery Confirmation</p>
    <div class="signature-box">
      <div>
        <div class="signature-line"></div>
        <div class="signature-label">Driver Signature</div>
      </div>
      <div>
        <div class="signature-line"></div>
        <div class="signature-label">Customer Signature</div>
      </div>
    </div>
    <div style="margin-top: 20px;">
      <div class="signature-line" style="width: 200px;"></div>
      <div class="signature-label">Date & Time</div>
    </div>
  </div>

  <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
    <p>For questions or concerns, contact EasyMeals.ie at info@easymeals.ie</p>
  </div>
</body>
</html>
  `.trim()
}
