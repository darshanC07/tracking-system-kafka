import "./tasks/LocationTask";

import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';
import React, { use, useEffect, useState } from 'react';
import * as Location from "expo-location";
import { LOCATION_TASK } from "./tasks/LocationTask";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NewRide from "./NewRide";
import ActiveRide from "./ActiveRide";


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
  // useEffect(() => {
  //   if (socket) {
  //     console.log("Websocket connected");
  //     // socket.emit("connect", {"topic" : "s1-r1-pick","driver_id": "darshan"});
  //   // startBackgroundLocation();
  //   } else {
  //     console.log("Websocket connection failed");
  //   }
  // }, []);

  
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="NewRide">
        <Stack.Screen name="NewRide" component={NewRide} options={{ headerShown: false }} />
        <Stack.Screen name="ActiveRide" component={ActiveRide} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
