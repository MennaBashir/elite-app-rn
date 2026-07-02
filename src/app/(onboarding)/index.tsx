import Container from '@/components/container'
import { Link } from 'expo-router'
import { View, Text } from 'react-native'

export default function OnboardingIndex() {
  return (
    <Container>
        <Text>OnboardingIndex</Text>
        <Link href="/(onboarding)/preferences">
            <Text>Next</Text>
        </Link>
    </Container>
  )
}