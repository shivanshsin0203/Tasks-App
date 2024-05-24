import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const RootLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="index" options={{headerShown:false}} />
        <Stack.Screen name='modal' options={{presentation:'transparentModal', headerTitle:'Create a Task', headerStyle:{backgroundColor:"#708090"}, headerTitleStyle:{color:"white"}}}/>
         
    </Stack>
  )
}

export default RootLayout

const styles = StyleSheet.create({})