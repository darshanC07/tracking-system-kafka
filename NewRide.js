import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { startBackgroundLocation } from "./App";
import { setSocket, getSocket } from "./tasks/utils";
import * as Location from "expo-location";
import config from "./config.json";

const COLORS = {
  primary: "#5B6EF5",
  bg: "#F7F8FA",
  card: "#FFFFFF",
  text: "#1A1A1A",
  subText: "#6B7280",
  border: "#E5E7EB",
};

let new_socket = null;
const NewRide = () => {

  const navigation = useNavigation();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [rideType, setRideType] = useState("pick");
  const [loading, setLoading] = useState(false);


  const navigator = async () => {
    try {
      setLoading(true);
      const isActiveRide = await AsyncStorage.getItem("isActiveRide");
      console.log("Active ride status:", isActiveRide);
      if (isActiveRide === "true") {
        const activeRideStr = await AsyncStorage.getItem("activeRideData");
        const { school, name, rideType } = activeRideStr ? JSON.parse(activeRideStr) : {};
        if (!school || !name || !rideType) {
          console.log("No active ride data found. Navigating to NewRide.");
          return;
        }
        const topic_name = `${school.slice(0, 2)}-${name.slice(0, 2)}-${rideType}`;
        console.log("Connecting to websocket with topic:", topic_name);

        const wsUrl = `${config.serverUrl.replace("http", "ws")}/ws?topic=${topic_name}&group_id=producer&offset=earliest&client_type=producer`;

        new_socket = new WebSocket(wsUrl);

        new_socket.onopen = () => {
          setLoading(false);
          console.log("WebSocket connected");
          setSocket(new_socket);

          startBackgroundLocation();
          navigation.replace("ActiveRide");
        };

        new_socket.onerror = (err) => {
          setLoading(false);
          console.log("WebSocket error:", err);
          alert("Connection failed");
        };

        new_socket.onclose = () => {
          setLoading(false);
          console.log("WebSocket closed");
        };
      } else {
        setLoading(false);
        console.log("checking if location permission is granted");
        const fg = await Location.requestForegroundPermissionsAsync();
        if (fg.granted) {
          console.log("Location permission granted");
        } else {
          console.log("Location permission denied");
        }

        const bg = await Location.requestBackgroundPermissionsAsync();
        if (bg.granted) {
          console.log("Background location permission granted");
        } else {
          console.log("Background location permission denied");
        }

      }
    } catch (e) {
      console.log("Error in navigator function:", e);
    } 
  }
  useEffect(() => {
    try {
      navigator();
    } catch (e) {
      console.log("Error checking active ride status:", e);
    }
  }, [])

  const vehicles = [
    {
      name: "Bicycle",
      img: require("./assets/bicycle.png"),
      desc: "Eco-friendly and healthy ride",
    },
    {
      name: "Bike",
      img: require("./assets/bike.png"),
      desc: "Fast and efficient for short trips",
    },
    {
      name: "Car",
      img: require("./assets/car.png"),
      desc: "Comfortable for daily commuting",
    },
    {
      name: "Van",
      img: require("./assets/van.png"),
      desc: "Ideal for groups and school rides",
    },
    {
      name: "Truck",
      img: require("./assets/truck.png"),
      desc: "Best for heavy-duty transport",
    },
  ];

  const startRide = async () => {
    if (!name || !school || !selectedVehicle) {
      alert("Please fill all fields and select a vehicle");
      return;
    }

    const rideData = {
      name,
      school,
      rideType,
      vehicle: selectedVehicle,
      timestamp: new Date().toISOString(),
    };

    try {
      setLoading(true);
      await AsyncStorage.setItem("isActiveRide", "true");
      await AsyncStorage.setItem("activeRideData", JSON.stringify(rideData));

      const topic_name = `${school.slice(0, 2)}-${name.slice(0, 2)}-${rideType}`;
      console.log("Connecting to websocket with topic:", topic_name);

      const wsUrl = `${config.serverUrl.replace("http", "ws")}/ws?topic=${topic_name}&group_id=producer&offset=none&client_type=producer`;

      new_socket = new WebSocket(wsUrl);

      new_socket.onopen = () => {
        setLoading(false);
        console.log("WebSocket connected");
        setSocket(new_socket);

        startBackgroundLocation();
        navigation.replace("ActiveRide");
      };

      new_socket.onerror = (err) => {
        setLoading(false);
        console.log("WebSocket error:", err);
        alert("Connection failed");
      };

      new_socket.onclose = () => {
        setLoading(false);
        console.log("WebSocket closed");
      };
    } catch (e) {
      console.log("Error starting ride:", e);
    }
  };

  return (
    <>
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#4560F4" />
        </View>
      )}
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>

          <View style={styles.header}>
            <Text style={styles.headerText}>Track Kafka</Text>
          </View>

          <View style={styles.container}>
            <Text style={styles.title}>Start a New Ride</Text>

            <ScrollView
              style={{ width: "100%", marginTop: 10 }}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.form}>

                <View style={styles.inputContainer}>
                  <Text>Name</Text>
                  <TextInput style={styles.input} placeholder="Enter your name" value={name} onChangeText={setName} placeholderTextColor='grey' />
                </View>

                <View style={styles.inputContainer}>
                  <Text>School Name</Text>
                  <TextInput style={styles.input} placeholder="Enter school name" value={school} onChangeText={setSchool} placeholderTextColor='grey' />
                </View>

                <View style={styles.inputContainer}>
                  <Text>Type</Text>
                  <View style={styles.typeContainer}>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        rideType === "pick" && styles.typeButtonActive,
                      ]}
                      onPress={() => setRideType("pick")}
                    >
                      <Text
                        style={[
                          styles.typeText,
                          rideType === "pick" && styles.typeTextActive,
                        ]}
                      >
                        Pick Up
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        rideType === "drop" && styles.typeButtonActive,
                      ]}
                      onPress={() => setRideType("drop")}
                    >
                      <Text
                        style={[
                          styles.typeText,
                          rideType === "drop" && styles.typeTextActive,
                        ]}
                      >
                        Drop
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={{ marginTop: 10, fontWeight: "600" }}>Vehicle</Text>

                <View style={styles.vehicleGrid}>
                  {vehicles.map((v, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.vehicleButton}
                      activeOpacity={0.8}
                      onPress={() => setSelectedVehicle(v.name)}
                    >
                      <View
                        style={[
                          styles.vehicleOption,
                          selectedVehicle === v.name && styles.selectedVehicle,
                        ]}
                      >
                        <Image
                          source={v.img}
                          style={{
                            width: 60,
                            height: 60,
                            resizeMode: "contain",
                          }}
                        />
                        <Text style={styles.vehicleTitle}>{v.name}</Text>
                        <Text style={styles.vehicleDesc}>{v.desc}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={startRide}
            >
              <Text style={styles.startButtonText}>Start Ride</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
};

export default NewRide;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#5B6EF5",
    padding: 16,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#5B6EF5",
  },

  typeTextActive: {
    color: "#FFFFFF",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 10,
  },

  form: {
    width: "100%",
    marginTop: 12,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    elevation: 3,
  },
  loaderOverlay: {
    position: "absolute",
    zIndex: 10,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginBottom: 14,
  },

  input: {
    height: 44,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 6,
    backgroundColor: "#FFF",
    color: 'black'
  },

  typeContainer: {
    flexDirection: "row",
    marginTop: 8,
  },

  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
    backgroundColor: "#EEF2FF",
  },

  typeText: {
    color: "#5B6EF5",
    fontWeight: "600",
  },

  vehicleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },

  vehicleButton: {
    width: "48%",
    marginBottom: 12,
  },

  vehicleOption: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
  },

  selectedVehicle: {
    borderColor: "#5B6EF5",
    borderWidth: 2,
  },

  vehicleTitle: {
    color: "#1A1A1A",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 6,
  },

  vehicleDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },

  startButton: {
    backgroundColor: "#5B6EF5",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    elevation: 6,
  },

  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});