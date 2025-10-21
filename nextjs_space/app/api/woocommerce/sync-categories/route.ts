
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWooCommerceClient } from '@/lib/woocommerce';
import { prisma } from '@/lib/db';

interface WooCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: {
    src: string;
  };
  parent: number;
  display?: string;
  count?: number;
}

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
    
    // Fetch all categories from WooCommerce
    let page = 1;
    let allCategories: WooCategory[] = [];
    let hasMore = true;
    
    while (hasMore) {
      const response = await woo.get('products/categories', {
        per_page: 100,
        page,
      });
      
      const categories = response.data as WooCategory[];
      allCategories = [...allCategories, ...categories];
      
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1');
      hasMore = page < totalPages;
      page++;
    }

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    // First pass: create or update categories without parent relationships
    for (const wooCategory of allCategories) {
      try {
        const categoryData = {
          name: wooCategory.name,
          slug: wooCategory.slug,
          description: wooCategory.description || null,
          imageUrl: wooCategory.image?.src || null,
          woocommerceId: wooCategory.id,
          isActive: true,
          displayOrder: 0,
        };

        const existingCategory = await prisma.category.findUnique({
          where: { woocommerceId: wooCategory.id }
        });

        if (existingCategory) {
          await prisma.category.update({
            where: { id: existingCategory.id },
            data: categoryData
          });
          updated++;
        } else {
          await prisma.category.create({
            data: categoryData
          });
          imported++;
        }
      } catch (error) {
        console.error(`Error syncing category ${wooCategory.name}:`, error);
        skipped++;
      }
    }

    // Second pass: update parent relationships
    for (const wooCategory of allCategories) {
      if (wooCategory.parent && wooCategory.parent > 0) {
        try {
          const parentCategory = await prisma.category.findUnique({
            where: { woocommerceId: wooCategory.parent }
          });

          if (parentCategory) {
            await prisma.category.update({
              where: { woocommerceId: wooCategory.id },
              data: { parentId: parentCategory.id }
            });
          }
        } catch (error) {
          console.error(`Error updating parent for category ${wooCategory.name}:`, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      total: allCategories.length,
      imported,
      updated,
      skipped,
      message: `Successfully processed ${allCategories.length} categories. ${imported} imported, ${updated} updated, ${skipped} skipped.`,
    });

  } catch (error: any) {
    console.error('Error syncing categories from WooCommerce:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync categories' },
      { status: 500 }
    );
  }
}
