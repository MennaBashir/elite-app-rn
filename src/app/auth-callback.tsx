import { verifyEmailOtp } from '@/services/auth';
import { supabase } from '@/utils/supabase';
import { mapAuthError } from '@/utils/authErrors';
import type { EmailOtpType } from '@supabase/supabase-js';
import { getQueryParams } from 'expo-auth-session/build/QueryParams';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{
    token_hash?: string;
    type?: string;
    code?: string;
    error_description?: string;
  }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function handle() {
      try {
        const initialUrl = await Linking.getInitialURL();
        const parsed = initialUrl ? getQueryParams(initialUrl).params : {};

        const tokenHash = searchParams.token_hash ?? parsed.token_hash;
        const type = (searchParams.type ?? parsed.type) as EmailOtpType | undefined;
        const code = searchParams.code ?? parsed.code;
        const accessToken = parsed.access_token;
        const refreshToken = parsed.refresh_token;
        const errorDescription = searchParams.error_description ?? parsed.error_description;

        if (errorDescription) throw new Error(errorDescription);

        if (tokenHash && type) {
          await verifyEmailOtp({ token_hash: tokenHash, type });
        } else if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else if (accessToken && refreshToken) {
          const { error: setError2 } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (setError2) throw setError2;
        } else {
          throw new Error('This link is invalid or has already been used.');
        }

        if (active) router.replace('/(tabs)');
      } catch (e) {
        if (active) setError(mapAuthError(e));
      }
    }

    handle();
    return () => {
      active = false;
    };
  }, [searchParams, router]);

  return (
    <View className="flex-1 items-center justify-center px-6">
      {error ? (
        <>
          <Text className="text-center text-lg font-semibold text-[#1B1B1D]">
            Verification failed
          </Text>
          <Text className="mt-2 text-center text-[#BA1A1A]">{error}</Text>
          <Pressable
            onPress={() => router.replace('/(auth)/login')}
            className="mt-8 h-[56px] w-full items-center justify-center rounded-full bg-[#0058BE]">
            <Text className="text-lg font-semibold text-white">Back to login</Text>
          </Pressable>
        </>
      ) : (
        <>
          <ActivityIndicator color="#0058BE" size="large" />
          <Text className="mt-6 text-[#45464D]">Verifying…</Text>
        </>
      )}
    </View>
  );
}
