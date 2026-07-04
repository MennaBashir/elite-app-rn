import { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Container({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView className="flex-1 pb-16">
      <ScrollView className="flex-1 px-4">{children}</ScrollView>
    </SafeAreaView>
  );
}
