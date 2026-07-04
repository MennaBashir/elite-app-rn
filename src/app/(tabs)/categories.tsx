import Container from '@/components/container';
import { Fonts } from '@/constants/theme';
import { Category, fetchCategories } from '@/utils/categories';
import { useRouter } from 'expo-router';
import { ChevronRight, LayoutGrid, Package } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

export default function CategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchCategories()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch(() => {
        if (active) setError('Failed to load categories.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);

  return (
    <Container>
      <Text className="text-center text-2xl" style={{ fontFamily: Fonts.germaniaOne }}>
        ELITE
      </Text>

      <View className="mb-8 mt-8">
        <Text
          className="text-4xl text-[#1B1B1D]"
          style={{ fontFamily: Fonts.boldPlayfair, letterSpacing: -0.5 }}>
          Categories
        </Text>
        {!loading && !error ? (
          <Text className="mt-2 text-[#45464D]">
            {categories.length} collections · {totalProducts} products
          </Text>
        ) : null}
      </View>

      {loading ? (
        <View className="items-center justify-center py-20">
          <ActivityIndicator color="#0058BE" size="large" />
        </View>
      ) : error ? (
        <View className="items-center justify-center rounded-2xl bg-[#FDECEC] py-10">
          <Text className="text-[#BA1A1A]">{error}</Text>
        </View>
      ) : (
        <View className="flex flex-col gap-4">
          {categories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/category/[id]',
                  params: { id: category.id, name: category.name },
                })
              }
              className="flex-row items-center gap-4 rounded-3xl bg-white p-4 active:opacity-90"
              style={{
                shadowColor: 'rgba(15,23,42,0.08)',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.18,
                shadowRadius: 12,
                elevation: 4,
              }}>
              <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#0058BE]/10">
                <LayoutGrid size={24} color="#0058BE" />
              </View>
              <View className="flex-1 flex-col">
                <Text
                  className="text-xl text-[#1B1B1D]"
                  style={{ fontFamily: Fonts.semiBoldGeist }}>
                  {category.name}
                </Text>
                <View className="mt-1 flex-row items-center gap-1.5">
                  <Package size={14} color="#76777D" />
                  <Text className="text-sm text-[#76777D]">
                    {category.productCount} {category.productCount === 1 ? 'item' : 'items'}
                  </Text>
                </View>
              </View>
              <View className="h-9 w-9 items-center justify-center rounded-full bg-[#F0EDEF]">
                <ChevronRight size={20} color="#1B1B1D" />
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </Container>
  );
}
