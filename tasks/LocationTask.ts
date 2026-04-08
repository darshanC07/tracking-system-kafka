import * as TaskManager from "expo-task-manager";
import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import {getSocket} from "./utils";

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

  const AsyncStorage = createAsyncStorage("kafkaStorage");

  const isActiveRide = await AsyncStorage.getItem("isActiveRide");
  console.log("Is active ride:", isActiveRide);
  if (isActiveRide === "false" || isActiveRide === null) {
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

  const { name, school,rideType } = JSON.parse(rideData);

  const { latitude, longitude } = data.locations[0].coords;

  const topic = `${school.slice(0,2)}-${name.slice(0,2)}-${rideType}`;
  console.log("Constructed topic:", topic);
  console.log("Background location:", latitude, longitude);
  const socket = getSocket();
  if (!socket) {
    console.log("Websocket not connected. Cannot send location update.");
    return;
  }

  socket.emit("loc_update-producer", { "loc": { "lat": latitude, "long": longitude }, "topic": topic, "driver_id": name, "school": school });
});