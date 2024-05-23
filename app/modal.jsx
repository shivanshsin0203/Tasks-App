import { Text, View } from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
export default function Modal() {
  return (
    <View className="w-full h-full bg-slate-800">
          <Text className="tetxt-3xl text-white">Abhi nahi bana hai chutiye</Text>
      <StatusBar style="light" />
    </View>
  );
}
