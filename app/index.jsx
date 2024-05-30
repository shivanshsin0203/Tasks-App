import React, { useState, useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
  Modal,
  Button,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { Picker } from "@react-native-picker/picker";
import * as Notifications from 'expo-notifications';
import DateTimePickerModal from "react-native-modal-datetime-picker";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [quickTask, setQuickTask] = useState("");
  const [fadeOutAnimations, setFadeOutAnimations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const [modalTask, setModalTask] = useState("");
  const [modalPriority, setModalPriority] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date);
    setSelectedTime(date);
    hideDatePicker();
  };
  const addTask = async (task = quickTask, priority = "") => {
    const newTask = { text: task, checked: false, priority };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setQuickTask("");
    setModalTask("");
    setModalPriority("");
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

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const handleSaveTask = () => {
    if (modalTask && modalPriority) {
      if(selectedTime){
        scheduleNotification();
      }
      addTask(modalTask, modalPriority);
      closeModal();
      
    } else {
      alert("Please enter a task name and select a priority.");
    }
  };

  const slideUp = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });
  const scheduleNotification = () => {
    console.log('Scheduling notification for', selectedTime);
    const currentTime = new Date();
    const timeDiff = selectedTime.getTime() - currentTime.getTime();
    const halfwayTime = new Date(currentTime.getTime() + timeDiff / 2);
    const fullTime = new Date(currentTime.getTime() + timeDiff);
    Notifications.scheduleNotificationAsync({
      content: {
        title: '!! Task Reminder !!',
        body: `Don't forget to complete your task ${modalTask}`,
      },
      trigger: halfwayTime,
    });
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Times Up !!',
        body: `Time for your ${modalTask} task is up.`,
      },
      trigger: fullTime,
    });
    setSelectedTime('');
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
                  {item.priority === "high" && (
                    <FontAwesome
                      name="flag"
                      size={17}
                      color="red"
                      style={{ position: "absolute", right: 10 }}
                    />
                  )}
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
        <View className="absolute bottom-[49px] right-4  mb-4 rounded-full justify-center items-center h-[60px] w-[60px] bg-blue-600 flex z-20">
          <Pressable onPress={openModal}>
            <Entypo name="plus" size={24} color="white" />
          </Pressable>
        </View>
        <View className="flex flex-row mb-1 w-[95%] p-1 pl-2 pr-0">
          <TextInput
            value={quickTask}
            onChangeText={(text) => setQuickTask(text)}
            placeholder="Add Quick Task Here !"
            placeholderTextColor="#64748B"
            className="h-[47px] flex-1 bg-gray-900 text-slate-200 pl-4 rounded-xl"
          />
          <Pressable className="pt-3" onPress={() => addTask()}>
            <FontAwesome name="send-o" size={28} color="green" />
          </Pressable>
        </View>
        <StatusBar style="light" />
      </SafeAreaView>

      {modalVisible && (
        <Modal transparent={true} visible={modalVisible} animationType="none">
          <BlurView intensity={100} style={styles.absolute}>
            <Animated.View
              style={[styles.modal, { transform: [{ translateY: slideUp }] }]}
            >
              <Pressable onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
              <Text style={styles.modalText}>Add New Task</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Task Name"
                placeholderTextColor="#64748B"
                value={modalTask}
                onChangeText={setModalTask}
              />
              <Picker
                selectedValue={modalPriority}
                style={styles.modalPicker}
                onValueChange={(itemValue) => setModalPriority(itemValue)}
              >
                <Picker.Item label="Select Priority" value="" />
                <Picker.Item label="High" value="high" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="Low" value="low" />
              </Picker>
              <Button
                className="mt-2"
                title="Select Time"
                onPress={showDatePicker}
              />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
              <Text style={styles.selectedTime}>Selected Time: {selectedTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
              <Pressable onPress={handleSaveTask} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Task</Text>
              </Pressable>
            </Animated.View>
          </BlurView>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  checkbox: {},
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modal: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "46%",
    backgroundColor: "#1E293B",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "#2563EB",
    fontSize: 16,
  },
  modalText: {
    fontSize: 18,
    marginTop: 10,
    color: "#fff",
  },
  modalInput: {
    backgroundColor: "#374151",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  modalPicker: {
    backgroundColor: "#374151",
    color: "#fff",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginTop: "auto",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  selectedTime:{
    fontSize: 15,
    marginVertical: 10,
    color: "#64748B"
  }
});
export default App;
