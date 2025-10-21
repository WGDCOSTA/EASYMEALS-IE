
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWooCommerceClient, WooProduct, WooCategory } from '@/lib/woocommerce';
import { prisma } from '@/lib/db';
import { ProductCategory, StorageType } from '@prisma/client';

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
    
    // Fetch all products with pagination
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
      
      // Check if there are more pages
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1');
      hasMore = page < totalPages;
      page++;
    }

    // Map WooCommerce category to our ProductCategory enum
    const mapCategory = (wooCategories: Array<{ name: string; slug: string }>): ProductCategory => {
      if (!wooCategories || wooCategories.length === 0) {
        return ProductCategory.INTERNATIONAL;
      }

      const categoryName = wooCategories[0].name.toLowerCase();
      
      if (categoryName.includes('irish') || categoryName.includes('traditional')) {
        return ProductCategory.TRADITIONAL_IRISH;
      } else if (categoryName.includes('healthy') || categoryName.includes('fitness')) {
        return ProductCategory.HEALTHY;
      } else if (categoryName.includes('vegetarian') || categoryName.includes('vegan')) {
        return ProductCategory.VEGETARIAN;
      } else if (categoryName.includes('seafood') || categoryName.includes('fish')) {
        return ProductCategory.SEAFOOD;
      } else if (categoryName.includes('comfort')) {
        return ProductCategory.COMFORT_FOOD;
      }
      
      return ProductCategory.INTERNATIONAL;
    };

    // Extract nutritional information from meta_data or description
    const extractNutrition = (product: WooProduct) => {
      let calories = null;
      let protein = null;
      let carbs = null;
      let fat = null;
      let fiber = null;
      let sugars = null;
      let saturatedFat = null;
      let salt = null;

      // Try to extract from meta_data
      if (product.meta_data) {
        for (const meta of product.meta_data) {
          const key = meta.key.toLowerCase();
          const value = parseFloat(meta.value);
          
          if (!isNaN(value)) {
            if (key.includes('calorie')) calories = Math.round(value);
            if (key.includes('protein')) protein = value;
            if (key.includes('carb')) carbs = value;
            if (key.includes('fat') && !key.includes('saturated')) fat = value;
            if (key.includes('saturated')) saturatedFat = value;
            if (key.includes('fiber') || key.includes('fibre')) fiber = value;
            if (key.includes('sugar')) sugars = value;
            if (key.includes('salt') || key.includes('sodium')) {
              salt = key.includes('sodium') ? value / 1000 : value; // Convert mg to g
            }
          }
        }
      }

      return {
        calories,
        protein,
        carbs,
        fat,
        fiber,
        sugars,
        saturatedFat,
        salt,
      };
    };

    // Extract tags from product
    const extractTags = (product: WooProduct): string[] => {
      const tags: string[] = [];
      
      if (product.tags) {
        tags.push(...product.tags.map(t => t.name.toLowerCase()));
      }
      
      // Add category-based tags
      if (product.categories) {
        product.categories.forEach(cat => {
          const catName = cat.name.toLowerCase();
          if (catName.includes('halal')) tags.push('halal');
          if (catName.includes('pasta')) tags.push('pasta');
          if (catName.includes('kids')) tags.push('kids');
          if (catName.includes('student')) tags.push('student');
          if (catName.includes('vegan')) tags.push('vegan');
          if (catName.includes('vegetarian')) tags.push('vegetarian');
        });
      }
      
      return [...new Set(tags)]; // Remove duplicates
    };

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const wooProduct of allProducts) {
      try {
        // Skip draft or private products
        if (wooProduct.status !== 'publish') {
          skipped++;
          continue;
        }

        const nutrition = extractNutrition(wooProduct);
        const tags = extractTags(wooProduct);
        
        const productData = {
          woocommerceId: wooProduct.id,
          sku: wooProduct.sku || null,
          name: wooProduct.name,
          description: wooProduct.description || wooProduct.short_description || '',
          shortDescription: wooProduct.short_description || null,
          price: parseFloat(wooProduct.price) || 0,
          originalPrice: wooProduct.regular_price ? parseFloat(wooProduct.regular_price) : null,
          imageUrl: wooProduct.images && wooProduct.images[0] ? wooProduct.images[0].src : '/placeholder-image.jpg',
          category: mapCategory(wooProduct.categories),
          isActive: wooProduct.status === 'publish',
          stockQuantity: wooProduct.stock_quantity || 0,
          storageType: StorageType.FRESH_CHILLED, // Default, can be customized
          allergens: [],
          weight: wooProduct.weight ? parseFloat(wooProduct.weight) : null,
          dimensions: wooProduct.dimensions 
            ? `${wooProduct.dimensions.length}x${wooProduct.dimensions.width}x${wooProduct.dimensions.height}`
            : null,
          ...nutrition,
          tags,
          isFeatured: wooProduct.featured,
          discount: wooProduct.on_sale && wooProduct.regular_price && wooProduct.sale_price
            ? Math.round(((parseFloat(wooProduct.regular_price) - parseFloat(wooProduct.sale_price)) / parseFloat(wooProduct.regular_price)) * 100)
            : null,
        };

        // Check if product already exists by WooCommerce ID or name
        const existingProduct = await prisma.product.findFirst({
          where: {
            OR: [
              { woocommerceId: wooProduct.id },
              { name: wooProduct.name }
            ]
          },
        });

        let product;
        if (existingProduct) {
          // Update existing product
          product = await prisma.product.update({
            where: { id: existingProduct.id },
            data: productData,
          });
          updated++;
        } else {
          // Create new product
          product = await prisma.product.create({
            data: productData,
          });
          imported++;
        }

        // Handle multiple categories
        if (wooProduct.categories && wooProduct.categories.length > 0) {
          // Remove existing category relations
          await prisma.productCategoryRelation.deleteMany({
            where: { productId: product.id }
          });

          // Add new category relations
          for (let i = 0; i < wooProduct.categories.length; i++) {
            const wooCategory = wooProduct.categories[i];
            
            // Find category by WooCommerce ID
            const category = await prisma.category.findUnique({
              where: { woocommerceId: wooCategory.id }
            });

            if (category) {
              await prisma.productCategoryRelation.create({
                data: {
                  productId: product.id,
                  categoryId: category.id,
                  isPrimary: i === 0 // First category is primary
                }
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error importing product ${wooProduct.name}:`, error);
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      total: allProducts.length,
      imported,
      updated,
      skipped,
      message: `Successfully processed ${allProducts.length} products. ${imported} imported, ${updated} updated, ${skipped} skipped.`,
    });

  } catch (error: any) {
    console.error('Error importing products from WooCommerce:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import products' },
      { status: 500 }
    );
  }
}
