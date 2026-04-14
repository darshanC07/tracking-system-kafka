import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSocket } from "./utils";
import config from "../config.json";

// export const produce = (topic, message) => {
//     socket.emit(topic, message);
//     console.log("sent to websocket");
// };

export const LOCATION_TASK = "BACKGROUND_LOCATION_TASK";

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }: any) => {
  if (error) {
    console.log("Task error:", error);
    return;
  }


  const isActiveRide = await AsyncStorage.getItem("isActiveRide");
  console.log("Is active ride:", isActiveRide);
  if (isActiveRide !== "true") {
    console.log("No active ride. Skipping location update.");
    return;
  }


  if (!data?.locations?.length) return;

  const rideData = await AsyncStorage.getItem("activeRideData");
  if (!rideData) {
    console.log("No active ride data found. Skipping location update.");
    return;
  }
  console.log("Active ride data:", rideData);

  const { name, school, rideType } = JSON.parse(rideData);

  const { latitude, longitude } = data.locations[0].coords;

  const topic = `${school.slice(0, 2)}-${name.slice(0, 2)}-${rideType}`;
  console.log("Constructed topic:", topic);
  console.log("Background location:", latitude, longitude);
  const socket = getSocket();

  if (!socket) {
    console.log("WebSocket not available");
    return;
  }

  // 1 = OPEN
  if (socket.readyState !== 1) {
    console.log("WebSocket not open. Cannot send.");
    return;
  }

  socket.send(JSON.stringify({
    topic: topic,
    loc: { lat: latitude, long: longitude },
    driver_id: name,
    school: school
  }));

  console.log("Location sent via WebSocket");
});