import "./tasks/LocationTask";

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform } from 'react-native';
import React, { useEffect } from 'react';
import * as Location from "expo-location";
import { LOCATION_TASK } from "./tasks/LocationTask";
import { socket } from "./tasks/utils";

export const startBackgroundLocation = async () => {
  const fg = await Location.requestForegroundPermissionsAsync();
  if (!fg.granted) return;

  const bg = await Location.requestBackgroundPermissionsAsync();
  if (!bg.granted) return;

  const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);

  if (hasStarted) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK);
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 6000,
    distanceInterval: 10,
    pausesUpdatesAutomatically: false,
    activityType:
      Platform.OS === "android"
        ? Location.LocationActivityType.OtherNavigation
        : undefined,
    foregroundService: {
      notificationTitle: "Location Tracking",
      notificationBody: "Tracking your location in background",
    },
  });

  console.log("Tracking started");
};

export default function App() {
  useEffect(() => {
    // if (socket) {
    //   console.log("Websocket connected");
    //   socket.emit("connect", {"topic" : "s1-r1-pick","driver_id": "darshan"});
      startBackgroundLocation();
    // } else {
    //   console.log("Websocket connection failed");
    // }
  }, []);

  return (
    <View style={styles.container}>
      <Text>Tracking...</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});