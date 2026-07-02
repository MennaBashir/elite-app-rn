import ExternalLogin from '@/components/auth/externalLogin';
import HeaderAuth from '@/components/auth/header';
import Container from '@/components/container';
import InputController from '@/components/shared/inputController';
import { LoginFormValues, loginSchema } from '@/schema/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { View, Text, Pressable } from 'react-native';

const Login = () => {
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
  const onSubmit = (data: LoginFormValues) => {
    console.log('data', data);
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
        <Pressable
          onPress={handleSubmit(onSubmit)}
          className="mt-5 h-[64px] w-full items-center justify-center rounded-full bg-[#0058BE] ">
          <Text className="text-lg font-semibold text-white">Submit</Text>
        </Pressable>
      </View>
      <View className="my-10 flex flex-row items-center justify-center gap-2">
        <View className="h-px w-[100px] bg-[#C6C6CD]" />
        <Text className="text-[#45464D]">OR CONTINUE WITH</Text>
        <View className="h-px w-[100px] bg-[#C6C6CD]" />
      </View>
      <ExternalLogin />
      <Text className="mt-8 text-center text-xl text-[#45464D]">
        Don't have an account?{' '}
        <Link
          href="/(auth)/signup"
          style={{ color: '#0058BE', fontWeight: 'semibold', marginLeft: 4 }}>
          Sign Up
        </Link>
      </Text>
    </Container>
  );
};

export default Login;
