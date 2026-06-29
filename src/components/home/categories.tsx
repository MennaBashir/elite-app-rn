import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CategoryItem } from '@/mock/categories';

export default function Categories({ icon: Icon, label }: CategoryItem) {
  return (
    <Pressable className="items-center justify-center gap-2">
      {({ pressed }) => (
        <>
          <View
            className="h-16 w-16 items-center justify-center "
            style={{ borderRadius: 9999, backgroundColor: pressed ? '#1B1B1D' : '#E0E0E0' }}>
            <Icon size={20} color={pressed ? 'white' : 'black'} />
          </View>
          <Text className="text-sm font-medium">{label}</Text>
        </>
      )}
    </Pressable>
  );
}
