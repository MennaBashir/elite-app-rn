import Container from '@/components/container';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Fonts } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import Hero from '@/components/home/hero';
import { categories } from '@/mock/categories';
import Categories from '@/components/home/categories';
import Features from '@/components/home/features';
import { LogOut } from 'lucide-react-native';

export default function App() {
  const { signOut } = useAuth();
  return (
    <Container>
      <View className="flex-row items-center justify-between">
        <View className="w-8" />
        <Text className="text-center text-2xl" style={{ fontFamily: Fonts.germaniaOne }}>
          ELITE
        </Text>
        <Pressable onPress={() => signOut()} hitSlop={8}>
          <LogOut size={22} color="#1B1B1D" />
        </Pressable>
      </View>
      <Hero />
      <View className="mt-10">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16 }}>
          {categories.map((category) => (
            <Categories key={category.label} {...category} />
          ))}
        </ScrollView>
      </View>
      <Features />
    </Container>
  );
}
