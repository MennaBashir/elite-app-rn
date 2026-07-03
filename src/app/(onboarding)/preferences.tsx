import { Colors, Fonts } from '@/constants/theme';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Gem,
  Monitor,
  Palette,
  Plane,
  Shirt,
  Sparkles,
  type LucideIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Preference {
  label: string;
  icon: LucideIcon;
  wide?: boolean;
}

const preferences: Preference[] = [
  { label: 'Fashion', icon: Shirt },
  { label: 'Tech', icon: Monitor },
  { label: 'Beauty', icon: Sparkles },
  { label: 'Art & Design', icon: Palette },
  { label: 'Jewelry', icon: Gem },
  { label: 'Travel & Leisure', icon: Plane, wide: true },
];

const colors = Colors.light;

function OnboardingPreferences() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (label: string) => {
    let newSelected: string[];
    if (selected.includes(label)) {
      newSelected = selected.filter((item) => item !== label);
    } else {
      newSelected = [...selected, label];
    }
    setSelected(newSelected);
  };

  return (
    <SafeAreaView className="bg-background flex-1 pb-4">
      <View className="flex-1 justify-end px-4">
        <View className="w-full flex-row items-center justify-between py-6">
          <Text className="text-2xl font-bold" style={{ fontFamily: Fonts.germaniaOne }}>
            ELITE
          </Text>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={{ color: colors.textSecondary }}>Skip</Text>
          </Pressable>
        </View>

        <View className="mb-8 w-full flex-row items-center justify-center gap-2 ">
          <View
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: colors.surfaceHighest }}
          />
          <View className="h-1 w-12 rounded-full" style={{ backgroundColor: colors.primary }} />
          <View
            className="h-1 w-12 rounded-full"
            style={{ backgroundColor: colors.surfaceHighest }}
          />
        </View>

        <View className="flex-1 justify-between">
          <View className="mb-12 items-center">
            <Text className="mb-2 text-3xl font-semibold" style={{ color: colors.primary }}>
              Tailored for You
            </Text>
            <Text
              className="max-w-[280px] text-center text-base"
              style={{ color: colors.textSecondary }}>
              Personalize your feed based on your style and preferences.
            </Text>
          </View>

          <View className="flex-1 flex-row flex-wrap justify-between gap-y-4">
            {preferences.map(({ label, icon: Icon, wide }) => {
              const isSelected = selected.includes(label);
              return (
                <Pressable
                  key={label}
                  onPress={() => toggle(label)}
                  className="rounded-2xl border p-4"
                  style={{
                    width: wide ? '100%' : '48%',
                    borderColor: isSelected ? colors.primary : colors.outlineVariant,
                    backgroundColor: isSelected ? colors.surfaceLow : colors.surfaceLowest,
                  }}>
                  <View className={`${wide ? 'flex-row items-center gap-3' : 'flex-col'}`}>
                    <View
                      className="h-10 w-10 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: isSelected ? colors.primary : colors.backgroundElement,
                      }}>
                      <Icon size={20} color={isSelected ? colors.onPrimary : colors.primary} />
                    </View>
                    <Text
                      className={`text-base font-semibold ${wide ? 'flex-1' : 'mt-3'}`}
                      style={{ color: colors.primary }}>
                      {label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View className=" pb-4">
          <Pressable
            onPress={() => router.push('/(onboarding)/membership')}
            className="h-14 w-full flex-row items-center justify-center gap-2 rounded-full"
            style={{ backgroundColor: colors.primary }}>
            <Text className="text-base font-medium" style={{ color: colors.onPrimary }}>
              Next
            </Text>
            <ArrowRight size={18} color={colors.onPrimary} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default OnboardingPreferences;
