import Container from '@/components/container';
import { Fonts } from '@/constants/theme';
import { fetchProductsByCategory, Product } from '@/utils/products';
import { assets } from 'assets/assets';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Heart, PackageOpen } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

function ProductCard({ product }: { product: Product }) {
  const { title, category, price, imageUrl } = product;
  const source = imageUrl && assets[imageUrl] ? assets[imageUrl] : imageUrl;

  return (
    <View
      className="overflow-hidden rounded-3xl bg-white"
      style={{
        shadowColor: 'rgba(15,23,42,0.08)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 4,
      }}>
      <View>
        <Image source={source} style={{ width: '100%', height: 260 }} contentFit="cover" />
        <Pressable className="absolute right-4 top-4 h-10 w-10 items-center justify-center rounded-full bg-white/85">
          <Heart size={18} color="#1B1B1D" />
        </Pressable>
        <View className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1">
          <Text className="text-xs font-semibold uppercase tracking-wide text-white">
            {category}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between p-5">
        <View className="flex-1 flex-col pr-3">
          <Text className="text-lg text-[#1B1B1D]" style={{ fontFamily: Fonts.semiBoldGeist }}>
            {title}
          </Text>
          <Text className="mt-0.5 text-sm text-[#76777D]">{category}</Text>
        </View>
        <Text className="text-2xl text-[#1B1B1D]" style={{ fontFamily: Fonts.boldGeist }}>
          ${price}
        </Text>
      </View>
    </View>
  );
}

export default function CategoryProductsScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    fetchProductsByCategory(id)
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
  }, [id]);

  return (
    <Container>
      <View className="mb-8 mt-2 flex-row items-center gap-4">
        <Pressable
          onPress={() => router.navigate('/(tabs)/categories')}
          className="h-11 w-11 items-center justify-center rounded-full bg-white active:opacity-80"
          style={{
            shadowColor: 'rgba(15,23,42,0.08)',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 3,
          }}>
          <ChevronLeft size={22} color="#1B1B1D" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-xs uppercase tracking-widest text-[#0058BE]">Collection</Text>
          <Text
            className="text-3xl text-[#1B1B1D]"
            style={{ fontFamily: Fonts.boldPlayfair, letterSpacing: -0.5 }}>
            {name ?? 'Products'}
          </Text>
        </View>
      </View>

      {loading ? (
        <View className="items-center justify-center py-20">
          <ActivityIndicator color="#0058BE" size="large" />
        </View>
      ) : error ? (
        <View className="items-center justify-center rounded-2xl bg-[#FDECEC] py-10">
          <Text className="text-[#BA1A1A]">{error}</Text>
        </View>
      ) : products.length === 0 ? (
        <View className="items-center justify-center rounded-3xl bg-white py-16">
          <PackageOpen size={40} color="#C6C6CD" />
          <Text className="mt-4 text-[#76777D]">No products in this category yet.</Text>
        </View>
      ) : (
        <>
          <Text className="mb-5 text-[#45464D]">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </Text>
          <View className="flex flex-col gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        </>
      )}
    </Container>
  );
}
