import { fetchProducts, Product } from '@/utils/products';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import Feature from './feature';

export default function Features() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((data) => {
        if (active) setProducts(data);
      })
      .catch(() => {
        if (active) setError('Failed to load products.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <View className="mt-16">
      <Text className="mb-6 text-2xl font-bold text-[#1B1B1D]">Featured</Text>
      <View>
        {loading ? (
          <ActivityIndicator color="#0058BE" />
        ) : error ? (
          <Text className="text-[#BA1A1A]">{error}</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}>
            {products.map((product) => (
              <Feature key={product.id} product={product} />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
