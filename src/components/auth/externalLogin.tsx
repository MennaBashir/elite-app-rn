import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import { assets } from 'assets/assets'

const ExternalLogin = () => {
  return (
    <View className="flex flex-col">
     <View className="flex flex-row h-16  items-center justify-center border border-[#C6C6CD] rounded-full gap-4"> 
        <Image source={assets.google} style={{ height: 24, width: 24 }} />
        <Text className='text-black text-lg'>Continue with Google</Text>
     </View>
     <View className="mt-4 flex flex-row h-16  items-center justify-center gap-4 rounded-full bg-black">
        <Image source={assets.apple} style={{ height: 24, width: 24 }} />
        <Text className='text-white text-lg'>Continue with Apple</Text>
     </View>
    </View>
  )
}

export default ExternalLogin