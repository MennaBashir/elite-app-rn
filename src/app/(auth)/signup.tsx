import ExternalLogin from '@/components/auth/externalLogin';
import HeaderAuth from '@/components/auth/header';
import Container from '@/components/container';
import InputController from '@/components/shared/inputController';
import { RegisterFormValues, registerSchema } from '@/schema/auth';
import { signUpWithEmail } from '@/services/auth';
import { mapAuthError } from '@/utils/authErrors';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

const Signup = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      checked: false,
    },
  });
  const onSubmit = async (data: RegisterFormValues) => {
    setFormError(null);
    setSubmitting(true);
    try {
      await signUpWithEmail({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });
      router.replace({
        pathname: '/(auth)/verify-email',
        params: { email: data.email.trim().toLowerCase() },
      });
    } catch (error) {
      setFormError(mapAuthError(error));
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Container>
      <HeaderAuth
        title="Create Account"
        description="Join ELITE to unlock your exclusive curation."
      />
      <View className="mt-6 flex flex-col gap-6">
        <InputController
          title="Full Name"
          control={control}
          errors={errors}
          name="fullName"
          placeholder="Enter your full name"
        />
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
        <View>
          <Controller
            control={control}
            name="checked"
            render={({ field: { onChange, value } }) => (
              <Pressable
                onPress={() => onChange(!value)}
                className="flex flex-row items-center gap-2">
                <View className={`h-5 w-5 rounded border ${value ? 'bg-[#0058BE]' : 'bg-white'}`} />
                <Text className="text-[#45464D]">
                  I agree to the <Text className="underline">Terms of Service</Text> and{' '}
                  <Text className="underline">Privacy Policy</Text>
                </Text>
              </Pressable>
            )}
          />
          {errors.checked && (
            <Text className="mt-1 text-sm text-red-500">{errors.checked.message}</Text>
          )}
        </View>
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
            <Text className="text-lg font-semibold text-white">Create Account</Text>
          )}
        </Pressable>
      </View>
      <View className="my-10 flex flex-row items-center justify-center gap-2">
        <View className="h-px w-[100px] bg-[#C6C6CD]" />
        <Text className="text-[#45464D]">OR SIGN UP WITH</Text>
        <View className="h-px w-[100px] bg-[#C6C6CD]" />
      </View>
      <ExternalLogin />
      <Text className="mt-8 text-center text-xl text-[#45464D]">
        Already have an account?{' '}
        <Link
          href="/(auth)/login"
          style={{ color: '#0058BE', fontWeight: 'semibold', marginLeft: 4 }}>
          Login
        </Link>
      </Text>
    </Container>
  );
};

export default Signup;
