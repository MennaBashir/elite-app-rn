import { supabase } from '@/utils/supabase';

export interface Category {
  id: string;
  name: string;
  productCount: number;
}

type CategoryRow = {
  id: string;
  name: string;
  products: { count: number }[];
};

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, products(count)')
    .order('name', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => {
    const typed = row as CategoryRow;
    return {
      id: typed.id,
      name: typed.name,
      productCount: typed.products?.[0]?.count ?? 0,
    };
  });
}
