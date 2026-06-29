import { featuredProducts } from '@/mock/products';
import { ScrollView, Text, View } from 'react-native';
import Feature from './feature';

export default function Features() {
  return (
    <View className="mt-16">
      <Text className="mb-6 text-2xl font-bold text-[#1B1B1D]">Featured</Text>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16 }}>
          {featuredProducts.map((product, index) => (
            <Feature key={index} product={product} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
