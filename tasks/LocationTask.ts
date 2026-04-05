import * as TaskManager from "expo-task-manager";
import { produce } from "./utils";


export const LOCATION_TASK = "BACKGROUND_LOCATION_TASK";

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }: any) => {
  if (error) {
    console.log("Task error:", error);
    return;
  }

  if (!data?.locations?.length) return;

  const { latitude, longitude } = data.locations[0].coords;

  console.log("Background location:", latitude, longitude);
  produce("loc_update", { "loc": { "lat": latitude, "long": longitude }, "topic": "s1-r1-pick", "driver_id": driverId });
});