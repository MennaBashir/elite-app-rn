import { Colors, ElitePalette, Fonts } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { ArrowRight, Diamond, X } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const colors = Colors.light;

function OnboardingMembership() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="w-full flex-row items-center justify-between px-5 py-4">
        <Pressable onPress={() => router.back()} className="-ml-2 p-2">
          <X size={24} color={colors.textSecondary} />
        </Pressable>
        <Text className="text-2xl" style={{ fontFamily: Fonts.germaniaOne, color: colors.primary }}>
          ELITE
        </Text>
        <View className="w-10" />
      </View>
      <View className="flex-1 justify-between px-5">
        <View className="flex-1 items-center justify-center">
          <LinearGradient
            colors={['#1b1b1d', '#303032']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 16, width: '100%', aspectRatio: 1.586 }}>
            <View className="flex-1 justify-between p-6">
              <View className="flex-row items-start justify-between">
                <Text
                  className="text-2xl"
                  style={{ fontFamily: Fonts.germaniaOne, color: colors.onPrimary, opacity: 0.9 }}>
                  ELITE
                </Text>
                <Diamond size={24} color={colors.onPrimary} style={{ opacity: 0.7 }} />
              </View>
              <View>
                <Text
                  className="mb-1 text-xs font-bold uppercase tracking-widest"
                  style={{ color: colors.onPrimary, opacity: 0.6 }}>
                  Membership Status
                </Text>
                <Text className="text-2xl font-semibold" style={{ color: colors.onPrimary }}>
                  Founding Member
                </Text>
              </View>
            </View>
          </LinearGradient>

          <View className="mt-12 max-w-md items-center">
            <View className="mb-4 flex-row items-center justify-center gap-2">
              <View
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.outlineVariant }}
              />
              <View
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.outlineVariant }}
              />
              <View className="h-2 w-6 rounded-full" style={{ backgroundColor: colors.primary }} />
            </View>
            <Text className="mb-4 text-3xl font-semibold" style={{ color: colors.primary }}>
              Join the Elite
            </Text>
            <Text
              className="text-center text-base leading-6"
              style={{ color: colors.textSecondary }}>
              Unlock exclusive rewards, early access to drops, and seamless shopping experiences
              crafted for our most valued members.
            </Text>
          </View>
        </View>

        <View className="mb-8 mt-12 gap-4">
          <Pressable
            onPress={() => router.push('/(auth)/signup')}
            className="h-14 w-full flex-row items-center justify-center rounded-full"
            style={{ backgroundColor: ElitePalette.secondaryContainer }}>
            <Text className="text-xl font-semibold" style={{ color: colors.onSecondary }}>
              Get Started
            </Text>
            <ArrowRight size={20} color={colors.onSecondary} style={{ marginLeft: 8 }} />
          </Pressable>
          <Text className="text-center" style={{ color: colors.textSecondary }}>
            Already have an account?{' '}
            <Link href="/(auth)/login" style={{ color: colors.primary, fontWeight: '600' }}>
              Log in
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default OnboardingMembership;
