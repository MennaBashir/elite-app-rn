import { View, Text } from 'react-native';
import React from 'react';
import { Product } from '@/mock/products';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';

const Feature = ({ product }: { product: Product }) => {
  const { title, category, price, imageUrl } = product;

  return (
    <View className="w-[280px]">
      <View>
        <Image source={imageUrl} style={{ width: '100%', height: 360, borderRadius: 16 }} />
        <View className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80">
          <SymbolView
            name={{ ios: 'info.circle', android: 'favorite', web: 'info' }}
            tintColor="#black"
            size={20}
          />
        </View>
      </View>
      <View className="mt-4 flex-row items-center justify-between">
        <View className="flex-col">
          <Text className="text-lg font-semibold text-[#1B1B1D] ">{title}</Text>
          <Text className="text-[#6C757D]">{category}</Text>
        </View>
        <Text className="text-2xl font-bold text-[#1B1B1D]">{price}</Text>
      </View>
    </View>
  );
};

export default Feature;
