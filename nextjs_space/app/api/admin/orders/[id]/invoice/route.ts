

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
            phone: true,
            address: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                sku: true
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

    // Generate HTML invoice
    const invoiceHtml = generateInvoiceHtml(order)

    return new NextResponse(invoiceHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="invoice-${order.orderNumber}.html"`
      }
    })
  } catch (error) {
    console.error('Invoice generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}

function generateInvoiceHtml(order: any): string {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-IE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${order.orderNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #fff;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      border-bottom: 3px solid #1c7430;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .company-info {
      flex: 1;
    }
    .company-name {
      font-size: 28px;
      font-weight: bold;
      color: #1c7430;
      margin-bottom: 5px;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-title {
      font-size: 32px;
      font-weight: bold;
      color: #1c7430;
      margin-bottom: 10px;
    }
    .info-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }
    .info-box {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
    }
    .info-box h3 {
      margin: 0 0 10px 0;
      font-size: 14px;
      text-transform: uppercase;
      color: #666;
      letter-spacing: 0.5px;
    }
    .info-box p {
      margin: 5px 0;
      font-size: 14px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .items-table thead {
      background: #1c7430;
      color: white;
    }
    .items-table th,
    .items-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .items-table th {
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .items-table td {
      font-size: 14px;
    }
    .items-table tbody tr:hover {
      background: #f8f9fa;
    }
    .text-right {
      text-align: right;
    }
    .totals {
      margin-left: auto;
      width: 300px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .total-row.grand-total {
      border-top: 2px solid #1c7430;
      border-bottom: 2px solid #1c7430;
      margin-top: 10px;
      padding: 15px 0;
      font-size: 18px;
      font-weight: bold;
      color: #1c7430;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .status-pending { background: #fff3cd; color: #856404; }
    .status-confirmed { background: #d1ecf1; color: #0c5460; }
    .status-preparing { background: #e7d6f5; color: #6f42c1; }
    .status-out_for_delivery { background: #feebc8; color: #c05621; }
    .status-delivered { background: #d4edda; color: #155724; }
    .status-cancelled { background: #f8d7da; color: #721c24; }
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <div class="company-name">EasyMeals.ie</div>
      <p style="margin: 5px 0; color: #666;">Premium Ready Meals Delivery</p>
      <p style="margin: 5px 0; font-size: 14px;">Ireland</p>
      <p style="margin: 5px 0; font-size: 14px;">info@easymeals.ie</p>
    </div>
    <div class="invoice-info">
      <div class="invoice-title">INVOICE</div>
      <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${order.orderNumber}</p>
      <p style="margin: 5px 0;"><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
      <p style="margin: 5px 0;">
        <span class="status-badge status-${order.status.toLowerCase()}">${order.status.replace(/_/g, ' ')}</span>
      </p>
    </div>
  </div>

  <div class="info-section">
    <div class="info-box">
      <h3>Bill To</h3>
      <p><strong>${order.user.name || 'Guest Customer'}</strong></p>
      <p>${order.user.email}</p>
      ${order.user.phone ? `<p>${order.user.phone}</p>` : ''}
      ${order.user.address ? `<p>${order.user.address}</p>` : ''}
    </div>
    <div class="info-box">
      <h3>Delivery Details</h3>
      <p><strong>Address:</strong></p>
      <p>${order.deliveryAddress}</p>
      <p><strong>Zone:</strong> ${order.deliveryZone.name}</p>
      ${order.scheduledFor ? `<p><strong>Scheduled:</strong> ${formatDate(order.scheduledFor)}</p>` : ''}
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Item</th>
        <th>SKU</th>
        <th class="text-right">Quantity</th>
        <th class="text-right">Unit Price</th>
        <th class="text-right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${order.orderItems.map((item: any) => `
        <tr>
          <td>${item.product.name}</td>
          <td>${item.product.sku || 'N/A'}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">€${item.price.toFixed(2)}</td>
          <td class="text-right">€${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row">
      <span>Subtotal:</span>
      <span>€${order.subtotal.toFixed(2)}</span>
    </div>
    <div class="total-row">
      <span>Delivery Fee:</span>
      <span>€${order.deliveryFee.toFixed(2)}</span>
    </div>
    <div class="total-row grand-total">
      <span>TOTAL:</span>
      <span>€${order.total.toFixed(2)}</span>
    </div>
  </div>

  ${order.notes ? `
    <div style="margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
      <h3 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #666;">Customer Notes</h3>
      <p style="margin: 0; font-size: 14px;">${order.notes}</p>
    </div>
  ` : ''}

  <div class="footer">
    <p><strong>Thank you for your business!</strong></p>
    <p>EasyMeals.ie | Premium Ready Meals Delivery Service</p>
    <p>For inquiries, contact us at info@easymeals.ie</p>
  </div>
</body>
</html>
  `.trim()
}
