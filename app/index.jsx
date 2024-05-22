import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import {SafeAreaView} from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
const index = () => {
  const [task,setTask]=useState([]);
  const [quickTask,setQuickTask]=useState('');
  const [isChecked, setChecked] = useState(false);

  const addTask=()=>{
     setTask([...task,quickTask]);
     
  }
  return (
    <>
    <SafeAreaView className="h-full bg-slate-800 flex flex-col">
      <ScrollView>
    <View className= " flex-1 p-5 ">
     {task.length>0?task.map((item,index)=><View key={index} className=" flex flex-row w-[98%] p-2 bg-gray-700 h-[45px] mb-3 rounded-lg items-center justify-start space-x-8">
     <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? 'green' : undefined}
        />
       <Text className="text-white ml-2">{item}</Text>
     </View>
    ):<Text className=" text-white">No Task</Text>}
    </View>
    </ScrollView>
    <View className="flex flex-row">
      <TextInput value={task} onChangeText={text=>{setQuickTask(text)}} placeholder='Add Quick Task Here !'placeholderTextColor="#64748B" className="h-[45px] flex-1 bg-gray-900  text-slate-200 pl-4 " />
      <Pressable className="pt-3" onPress={addTask}>
      <FontAwesome name="send-o" size={24} color="green"  />
      </Pressable>
      </View>
     <StatusBar style="auto" />
     </SafeAreaView>
    </>
  )
}

export default index

const styles = StyleSheet.create({})