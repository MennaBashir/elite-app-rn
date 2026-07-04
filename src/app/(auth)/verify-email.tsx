import Container from '@/components/container';
import { Fonts } from '@/constants/theme';
import { resendVerification } from '@/services/auth';
import { mapAuthError } from '@/utils/authErrors';
import { Link, useLocalSearchParams } from 'expo-router';
import { MailCheck } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

const COOLDOWN_SECONDS = 45;

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (cooldown <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldown]);

  const onResend = async () => {
    if (!email || cooldown > 0 || sending) return;
    setError(null);
    setMessage(null);
    setSending(true);
    try {
      await resendVerification(email);
      setMessage('Verification email sent. Check your inbox.');
      setCooldown(COOLDOWN_SECONDS);
    } catch (e) {
      setError(mapAuthError(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <Container>
      <View className="mt-24 items-center">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-[#0058BE]/10">
          <MailCheck size={36} color="#0058BE" />
        </View>
        <Text
          className="mt-8 text-center text-3xl text-[#1B1B1D]"
          style={{ fontFamily: Fonts.boldPlayfair, letterSpacing: -0.5 }}>
          Check your inbox
        </Text>
        <Text className="mt-4 text-center text-base text-[#45464D]">
          We sent a verification link to
        </Text>
        {email ? (
          <Text
            className="mt-1 text-center text-base text-[#1B1B1D]"
            style={{ fontFamily: Fonts.semiBoldGeist }}>
            {email}
          </Text>
        ) : null}
        <Text className="mt-4 text-center text-sm text-[#76777D]">
          Tap the link in the email to activate your account, then return here.
        </Text>

        {message && <Text className="mt-6 text-center text-[#0058BE]">{message}</Text>}
        {error && <Text className="mt-6 text-center text-[#BA1A1A]">{error}</Text>}

        <Pressable
          disabled={cooldown > 0 || sending}
          onPress={onResend}
          className="mt-10 h-[64px] w-full items-center justify-center rounded-full bg-[#0058BE]"
          style={{ opacity: cooldown > 0 || sending ? 0.6 : 1 }}>
          {sending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-semibold text-white">
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email'}
            </Text>
          )}
        </Pressable>

        <Text className="mt-8 text-center text-base text-[#45464D]">
          Already verified?{' '}
          <Link href="/(auth)/login" style={{ color: '#0058BE' }}>
            Log in
          </Link>
        </Text>
      </View>
    </Container>
  );
}
