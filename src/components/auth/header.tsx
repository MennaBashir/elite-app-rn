import { View, Text } from 'react-native';

const HeaderAuth = ({ title, description }: { title: string; description: string }) => {
  return (
    <View className="flex flex-col items-center justify-center gap-2 py-4 pt-12">
      <Text className="text-5xl font-bold">ELITE</Text>
      <Text className="text-3xl font-semibold">{title}</Text>
      <Text className="text-[#45464D]">{description}</Text>
    </View>
  );
};

export default HeaderAuth;
