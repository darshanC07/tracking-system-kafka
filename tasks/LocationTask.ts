import * as TaskManager from "expo-task-manager";

export const LOCATION_TASK = "BACKGROUND_LOCATION_TASK";

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }: any) => {
  if (error) {
    console.log("Task error:", error);
    return;
  }

  if (!data?.locations?.length) return;

  const { latitude, longitude } = data.locations[0].coords;

  console.log("Background location:", latitude, longitude);

});