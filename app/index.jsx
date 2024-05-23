import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
} from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import LottieView from "lottie-react-native";

const index = () => {
  const [task, setTask] = useState([]);
  const [quickTask, setQuickTask] = useState("");
  const [fadeOutAnimations, setFadeOutAnimations] = useState([]);

  const addTask = () => {
    setTask([...task, { text: quickTask, checked: false }]);
    setQuickTask("");
    setFadeOutAnimations([...fadeOutAnimations, new Animated.Value(1)]);
  };

  const handleCheckboxChange = (index) => {
    const updatedTasks = task.map((item, i) => {
      if (i === index) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });

    setTask(updatedTasks);

    Animated.timing(fadeOutAnimations[index], {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTask((prevTasks) => prevTasks.filter((_, i) => i !== index));
      setFadeOutAnimations((prevAnimations) =>
        prevAnimations.filter((_, i) => i !== index)
      );
    });
  };

  return (
    <>
      <SafeAreaView className="h-full bg-slate-800 flex flex-col ">
        <ScrollView>
          <View className=" flex-1 p-5 ">
            {task.length > 0 ? (
              task.map((item, index) => (
                <Animated.View
                  key={index}
                  style={{ opacity: fadeOutAnimations[index] }}
                  className=" flex flex-row w-[98%] p-2 bg-gray-700 h-[45px] mb-3 rounded-lg items-center justify-start space-x-8"
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
              <View className=" flex flex-col justify-center items-center space-y-6">
                <LottieView
                  autoPlay
                  loop
                  style={{
                    width: 300,
                    height: 300,
                    
                  }}
                 
                  source={require("../assets/notask.json")}
                />
                <Text className="text-white text-2xl">No Task Added !</Text>
              </View>
            )}
          </View>
        </ScrollView>
        <View className="flex flex-row mb-1 w-[95%] p-1">
          <TextInput
            value={quickTask}
            onChangeText={(text) => {
              setQuickTask(text);
            }}
            placeholder="Add Quick Task Here !"
            placeholderTextColor="#64748B"
            className="h-[47px]  flex-1 bg-gray-900 text-slate-200 pl-4  rounded-xl "
          />
          <Pressable className="pt-3 " onPress={addTask}>
            <FontAwesome name="send-o" size={28} color="green" />
          </Pressable>
        </View>
        <StatusBar style="light" />
      </SafeAreaView>
    </>
  );
};

export default index;

const styles = StyleSheet.create({
  checkbox: {
    // Add any custom styles for the checkbox here
  },
});
