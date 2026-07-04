import { supabase } from '@/utils/supabase';

export interface Product {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
}

type ProductRow = {
  id: string;
  title: string;
  category_id: string;
  price: number | string;
  image_url: string | null;
  description: string | null;
  categories: { name: string } | { name: string }[] | null;
};

function mapProduct(row: ProductRow): Product {
  const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  return {
    id: row.id,
    title: row.title,
    category: category?.name ?? '',
    categoryId: row.category_id,
    price: Number(row.price),
    imageUrl: row.image_url,
    description: row.description,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, title, category_id, price, image_url, description, categories(name)')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => mapProduct(row as unknown as ProductRow));
}

export async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, title, category_id, price, image_url, description, categories(name)')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => mapProduct(row as unknown as ProductRow));
}
