import { Stack } from 'expo-router';

function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="index">
      <Stack.Screen name="index" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="membership" />
    </Stack>
  );
}

export default OnboardingLayout;
