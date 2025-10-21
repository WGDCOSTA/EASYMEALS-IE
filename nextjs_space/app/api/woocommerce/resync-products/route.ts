
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWooCommerceClient, WooProduct } from '@/lib/woocommerce';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    
    if (!session || (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const woo = getWooCommerceClient();
    
    // Fetch all products with complete data
    let page = 1;
    let allProducts: WooProduct[] = [];
    let hasMore = true;
    
    while (hasMore) {
      const response = await woo.get('products', {
        per_page: 100,
        page,
      });
      
      const products = response.data as WooProduct[];
      allProducts = [...allProducts, ...products];
      
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1');
      hasMore = page < totalPages;
      page++;
    }

    let updated = 0;
    let errors = 0;

    for (const wooProduct of allProducts) {
      try {
        // Find existing product by WooCommerce ID or name
        let existingProduct = await prisma.product.findFirst({
          where: {
            OR: [
              { woocommerceId: wooProduct.id },
              { name: wooProduct.name }
            ]
          }
        });

        if (!existingProduct) {
          continue; // Skip if product doesn't exist locally
        }

        // Extract all available data from WooCommerce
        const updateData: any = {
          woocommerceId: wooProduct.id,
          sku: wooProduct.sku || null,
          name: wooProduct.name,
          description: wooProduct.description || wooProduct.short_description || existingProduct.description,
          shortDescription: wooProduct.short_description || null,
          price: parseFloat(wooProduct.price) || existingProduct.price,
          originalPrice: wooProduct.regular_price ? parseFloat(wooProduct.regular_price) : null,
          imageUrl: wooProduct.images && wooProduct.images[0] ? wooProduct.images[0].src : existingProduct.imageUrl,
          stockQuantity: wooProduct.stock_quantity || existingProduct.stockQuantity,
          isActive: wooProduct.status === 'publish',
          isFeatured: wooProduct.featured,
          weight: wooProduct.weight ? parseFloat(wooProduct.weight) : null,
          dimensions: wooProduct.dimensions 
            ? `${wooProduct.dimensions.length}x${wooProduct.dimensions.width}x${wooProduct.dimensions.height}`
            : null,
        };

        // Calculate discount if on sale
        if (wooProduct.on_sale && wooProduct.regular_price && wooProduct.sale_price) {
          const regularPrice = parseFloat(wooProduct.regular_price);
          const salePrice = parseFloat(wooProduct.sale_price);
          updateData.discount = Math.round(((regularPrice - salePrice) / regularPrice) * 100);
        }

        // Extract tags
        const tags: string[] = [];
        if (wooProduct.tags) {
          tags.push(...wooProduct.tags.map(t => t.name.toLowerCase()));
        }
        if (tags.length > 0) {
          updateData.tags = tags;
        }

        // Update the product
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: updateData
        });

        // Sync categories - remove old and add new
        if (wooProduct.categories && wooProduct.categories.length > 0) {
          // Remove existing category relations
          await prisma.productCategoryRelation.deleteMany({
            where: { productId: existingProduct.id }
          });

          // Add new category relations
          for (let i = 0; i < wooProduct.categories.length; i++) {
            const wooCategory = wooProduct.categories[i];
            const category = await prisma.category.findUnique({
              where: { woocommerceId: wooCategory.id }
            });

            if (category) {
              await prisma.productCategoryRelation.create({
                data: {
                  productId: existingProduct.id,
                  categoryId: category.id,
                  isPrimary: i === 0 // First category is primary
                }
              });
            }
          }
        }

        updated++;
      } catch (error) {
        console.error(`Error resyncing product ${wooProduct.name}:`, error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      total: allProducts.length,
      updated,
      errors,
      message: `Successfully resynced ${updated} products. ${errors} errors occurred.`,
    });

  } catch (error: any) {
    console.error('Error resyncing products from WooCommerce:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to resync products' },
      { status: 500 }
    );
  }
}
