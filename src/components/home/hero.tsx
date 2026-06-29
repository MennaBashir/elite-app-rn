import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { assets } from 'assets/assets';
import { Fonts } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

const Hero = () => {
  return (
     <View className="relative mx-auto mt-4 h-[400px] w-full">
        <View>
          <Image
            source={assets.hero}
            style={{ width: '100%', height: '100%', borderRadius: 14 }}
            contentFit="cover"
          />
        </View>

        <LinearGradient
          style={{ borderRadius: 14, position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%' }}
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.6)']}>
          <View className="flex flex-1 items-start justify-end gap-4 px-8 pb-12">
            <Text
              className="text-4xl font-bold text-white leading-tight"
              style={{ fontFamily: Fonts.boldGeist }}>
              Premium Footwear
            </Text>
            <Text className="max-w-[260px] text-lg leading-relaxed text-white">
              Discover our latest collection of handcrafted sneakers designed for ultimate comfort
              and style.
            </Text>
            <Pressable>
              <Text className="rounded-full bg-[#0058BE] px-8 py-4 text-white">SHOP NOW</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
  )
}

export default Hero