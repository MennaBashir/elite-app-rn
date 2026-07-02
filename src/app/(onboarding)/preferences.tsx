import Container from '@/components/container'
import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

function OnboardingPreferences() {
  return (
  <Container>
    <Text>OnboardingPreferences</Text>
   <View className="flex-row justify-between">
     <Link href="/(onboarding)">
        <Text>Back</Text>
    </Link>
    
    <Link href="/(tabs)">
        <Text>Next</Text>
    </Link>
    <Link href="/(auth)/login">
        <Text>Skip</Text>
    </Link>
   </View>
  </Container>
  )
}

export default OnboardingPreferences
