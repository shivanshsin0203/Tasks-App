import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from '@expo/vector-icons';
import { Link } from "expo-router";
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [quickTask, setQuickTask] = useState("");
  const [fadeOutAnimations, setFadeOutAnimations] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasks = await AsyncStorage.getItem("tasks");
      if (tasks) {
        const parsedTasks = JSON.parse(tasks);
        setTasks(parsedTasks);
        setFadeOutAnimations(parsedTasks.map(() => new Animated.Value(1)));
      }
    };
    getTasks();
  }, []);

  const addTask = async () => {
    const newTask = { text: quickTask, checked: false };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setQuickTask("");
    setFadeOutAnimations([...fadeOutAnimations, new Animated.Value(1)]);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleCheckboxChange = (index) => {
    const updatedTasks = tasks.map((item, i) => {
      if (i === index) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });

    const animation = fadeOutAnimations[index];
    Animated.timing(animation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(async () => {
      const newTasks = updatedTasks.filter((_, i) => i !== index);
      const newAnimations = fadeOutAnimations.filter((_, i) => i !== index);
      setTasks(newTasks);
      setFadeOutAnimations(newAnimations);
      await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
    });

    setTasks(updatedTasks);
  };

  return (
    <>
      <SafeAreaView className="h-full bg-slate-800 flex flex-col ">
        <ScrollView>
          <View className="flex-1 p-5 mt-2 ">
            {tasks.length > 0 ? (
              tasks.map((item, index) => (
                <Animated.View
                  key={index}
                  style={{ opacity: fadeOutAnimations[index] }}
                  className="flex flex-row w-[98%] p-2 bg-gray-700 h-[50px] mb-3 rounded-lg items-center justify-start space-x-8"
                >
                  <Checkbox
                    style={styles.checkbox}
                    value={item.checked}
                    onValueChange={() => handleCheckboxChange(index)}
                    color={item.checked ? "green" : undefined}
                  />
                  <Text className="text-white ml-2">{item.text}</Text>
                </Animated.View>
              ))
            ) : (
              <View className="flex flex-col justify-center items-center space-y-6">
                <LottieView
                  autoPlay
                  loop
                  style={{ width: 300, height: 300 }}
                  source={require("../assets/notask.json")}
                />
                <Text className="text-white text-2xl">No Task Added !</Text>
              </View>
            )}
          </View>
        </ScrollView>
        <View className="absolute bottom-[49px] right-4  mb-2 rounded-full justify-center items-center h-[60px] w-[60px] bg-blue-600 flex z-20">
         <Link href='/modal'>
        <Entypo name="plus" size={24} color="white"  />
        </Link>
        </View>
        <View className="flex flex-row mb-1 w-[95%] p-1 pl-2 pr-0">
          <TextInput
            value={quickTask}
            onChangeText={(text) => setQuickTask(text)}
            placeholder="Add Quick Task Here !"
            placeholderTextColor="#64748B"
            className="h-[47px] flex-1 bg-gray-900 text-slate-200 pl-4 rounded-xl"
          />
          <Pressable className="pt-3" onPress={addTask}>
            <FontAwesome name="send-o" size={28} color="green" />
          </Pressable>
        </View>
        <StatusBar style="light" />
      </SafeAreaView>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  checkbox: {
    // Add any custom styles for the checkbox here
  },
});