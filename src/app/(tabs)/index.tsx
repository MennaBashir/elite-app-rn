import Container from '@/components/container';
import { ScrollView, Text, View } from 'react-native';
import { Fonts } from '@/constants/theme';
import Hero from '@/components/home/hero';
import { categories } from '@/mock/categories';
import Categories from '@/components/home/categories';
import Features from '@/components/home/features';

export default function App() {
  return (
    <Container>
      <Text className="text-center text-2xl" style={{ fontFamily: Fonts.germaniaOne }}>
        ELITE
      </Text>
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
