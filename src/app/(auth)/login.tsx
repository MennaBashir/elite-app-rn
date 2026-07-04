import ExternalLogin from '@/components/auth/externalLogin';
import HeaderAuth from '@/components/auth/header';
import Container from '@/components/container';
import InputController from '@/components/shared/inputController';
import { LoginFormValues, loginSchema } from '@/schema/auth';
import { signInWithEmail } from '@/services/auth';
import { mapAuthError } from '@/utils/authErrors';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

const Login = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = async (data: LoginFormValues) => {
    setFormError(null);
    setSubmitting(true);
    try {
      await signInWithEmail({ email: data.email, password: data.password });
      router.replace('/(tabs)');
    } catch (error) {
      setFormError(mapAuthError(error));
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Container>
      <HeaderAuth title="Welcome Back" description="Sign in to access your exclusive curation." />
      <View className="mt-6 flex flex-col gap-6">
        <InputController
          title="Email"
          control={control}
          errors={errors}
          name="email"
          placeholder="Enter your email"
        />
        <InputController
          title="Password"
          control={control}
          errors={errors}
          name="password"
          placeholder="Enter your password"
        />
        {formError && (
          <View className="rounded-2xl bg-[#FDECEC] px-4 py-3">
            <Text className="text-[#BA1A1A]">{formError}</Text>
          </View>
        )}
        <Pressable
          disabled={submitting}
          onPress={handleSubmit(onSubmit)}
          className="mt-5 h-[64px] w-full items-center justify-center rounded-full bg-[#0058BE]"
          style={{ opacity: submitting ? 0.6 : 1 }}>
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-semibold text-white">Submit</Text>
          )}
        </Pressable>
      </View>
      <View className="my-10 flex flex-row items-center justify-center gap-2">
        <View className="h-px w-[100px] bg-[#C6C6CD]" />
        <Text className="text-[#45464D]">OR CONTINUE WITH</Text>
        <View className="h-px w-[100px] bg-[#C6C6CD]" />
      </View>
      <ExternalLogin />
      <Text className="mt-8 text-center text-xl text-[#45464D]">
        Don&apos;t have an account?{' '}
        <Link
          href="/(auth)/signup"
          style={{ color: '#0058BE', fontWeight: 'semibold', marginLeft: 4 }}>
          Sign Up
        </Link>
      </Text>
      <Link href="/(tabs)" className="mt-4 text-center text-[#0058BE]">
        Home
      </Link>
    </Container>
  );
};

export default Login;
