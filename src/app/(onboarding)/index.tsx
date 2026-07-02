import { assets } from 'assets/assets';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingIndex() {
  const router = useRouter();
  const handleNext = () => {
    router.push('/(onboarding)/preferences');
  };
  return (
    <SafeAreaView>
      <View className="flex h-screen w-full flex-col relative">
        <View className="w-full h-full  flex-1">
          <Image source={assets.onboard1} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        </View>
        <View className="w-full absolute h-[460px] rounded-t-3xl bottom-0 flex-col items-center justify-center gap-2 bg-white p-4">
         <View className="flex-row items-center justify-center gap-2 pb-10">
          <View className="h-2 w-8 rounded-[40px] bg-black" />
          <View className="h-2 w-2 rounded-full bg-[#C6C6CD]" />
          <View className="h-2 w-2 rounded-full bg-[#C6C6CD]" />
         </View>
          <Text className="text-4xl mb-3 font-bold text-black w-[206px] text-center ">Curated Excellence</Text>
          <Text className="w-80 text-center text-lg text-[#45464D]">
            Discover a handpicked selection of premium footwear and accessories.{' '}
          </Text>
          <Pressable
            onPress={() => {
              handleNext();
            }}
            className="my-8 h-[54px] w-full flex-row items-center justify-center gap-2 rounded-full bg-black">
            <Text className="text-xl font-semibold text-white">Next</Text>
            <ArrowRight size={20} color="white" />
          </Pressable>
          <Link href="/(auth)/login">
            <Text className="text-center text-lg font-semibold text-black">Skip</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
