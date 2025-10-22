
-- Add SEO fields to Product
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "metaTitle" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "metaDescription" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "metaKeywords" TEXT[];
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "seoSlug" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "ogImage" TEXT;
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "noIndex" BOOLEAN DEFAULT false;

-- Create Tag model
CREATE TABLE IF NOT EXISTS "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "color" TEXT DEFAULT '#1c7430',
    "icon" TEXT,
    "displayOrder" INTEGER DEFAULT 0,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- Create ProductTag junction table
CREATE TABLE IF NOT EXISTS "product_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "product_tags_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE,
    CONSTRAINT "product_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE,
    CONSTRAINT "product_tags_productId_tagId_unique" UNIQUE ("productId", "tagId")
);

-- Add SEO fields to PageContent
ALTER TABLE "page_contents" ADD COLUMN IF NOT EXISTS "metaTitle" TEXT;
ALTER TABLE "page_contents" ADD COLUMN IF NOT EXISTS "metaDescription" TEXT;
ALTER TABLE "page_contents" ADD COLUMN IF NOT EXISTS "metaKeywords" TEXT[];
ALTER TABLE "page_contents" ADD COLUMN IF NOT EXISTS "noIndex" BOOLEAN DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "products_seoSlug_idx" ON "products"("seoSlug");
CREATE INDEX IF NOT EXISTS "tags_slug_idx" ON "tags"("slug");
CREATE INDEX IF NOT EXISTS "product_tags_productId_idx" ON "product_tags"("productId");
CREATE INDEX IF NOT EXISTS "product_tags_tagId_idx" ON "product_tags"("tagId");

-- Insert default tags
INSERT INTO "tags" ("id", "name", "slug", "description", "color") VALUES
('tag_halal', 'Halal', 'halal', 'Halal certified meals', '#10b981'),
('tag_vegetarian', 'Vegetarian', 'vegetarian', 'Vegetarian-friendly meals', '#22c55e'),
('tag_vegan', 'Vegan', 'vegan', 'Vegan meals', '#84cc16'),
('tag_glutenfree', 'Gluten Free', 'gluten-free', 'Gluten-free options', '#f59e0b'),
('tag_kids', 'Kids Friendly', 'kids-friendly', 'Perfect for children', '#ec4899'),
('tag_student', 'Student Budget', 'student-budget', 'Budget-friendly for students', '#8b5cf6'),
('tag_pasta', 'Pasta', 'pasta', 'Pasta dishes', '#f97316'),
('tag_seafood', 'Seafood', 'seafood', 'Fresh seafood meals', '#06b6d4'),
('tag_spicy', 'Spicy', 'spicy', 'Spicy dishes', '#ef4444'),
('tag_lowcarb', 'Low Carb', 'low-carb', 'Low carbohydrate meals', '#14b8a6'),
('tag_highprotein', 'High Protein', 'high-protein', 'High protein content', '#6366f1'),
('tag_comfort', 'Comfort Food', 'comfort-food', 'Classic comfort meals', '#f43f5e'),
('tag_irish', 'Traditional Irish', 'traditional-irish', 'Traditional Irish cuisine', '#059669'),
('tag_international', 'International', 'international', 'International cuisine', '#7c3aed')
ON CONFLICT (id) DO NOTHING;
