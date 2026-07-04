import { signInWithGoogle } from '@/services/auth';
import { mapAuthError } from '@/utils/authErrors';
import { assets } from 'assets/assets';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

const ExternalLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGoogle = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const session = await signInWithGoogle();
      if (session) {
        router.replace('/(tabs)');
      }
    } catch (e) {
      setError(mapAuthError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex flex-col">
      <Pressable
        onPress={onGoogle}
        disabled={loading}
        className="h-16 flex-row items-center justify-center gap-4 rounded-full border border-[#C6C6CD]"
        style={{ opacity: loading ? 0.6 : 1 }}>
        {loading ? (
          <ActivityIndicator color="#1B1B1D" />
        ) : (
          <>
            <Image source={assets.google} style={{ height: 24, width: 24 }} />
            <Text className="text-lg text-black">Continue with Google</Text>
          </>
        )}
      </Pressable>
      <View className="mt-4 flex h-16 flex-row items-center justify-center gap-4 rounded-full bg-black">
        <Image source={assets.apple} style={{ height: 24, width: 24 }} />
        <Text className="text-lg text-white">Continue with Apple</Text>
      </View>
      {error && <Text className="mt-3 text-center text-[#BA1A1A]">{error}</Text>}
    </View>
  );
};

export default ExternalLogin;
