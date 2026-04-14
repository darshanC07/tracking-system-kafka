// import { AsyncStorage } from "@react-native-async-storage/async-storage";
// import { io } from "socket.io-client";


// async function getTopic() {
//   try {
//     console.log("Fetching topic from AsyncStorage...");
//     const activeRideStr = await AsyncStorage.getItem("activeRideData");
//     const { school, name, rideType } = activeRideStr ? JSON.parse(activeRideStr) : {};
//     if (!school || !name || !rideType) {
//       console.log("Missing ride data in AsyncStorage:", { school, name, rideType });
//       return null;
//     }
//     console.log("Retrieved from AsyncStorage while connection - School:", school, "Name:", name, "Ride Type:", rideType);
//     return `${school.slice(0, 2)}-${name.slice(0, 2)}-${rideType}`;
//   } catch (e) {
//     console.log("Error retrieving topic from AsyncStorage:", e);
//     return null;
//   }
// }

// let topic_name = null;
// topic_name = getTopic();

// export const socket = io("https://30vkdstn-5000.inc1.devtunnels.ms/", {
//     transports: ["websocket"],
//     auth: {
//         // topic: "s1-r1-pick",
//         topic: topic_name,
//         driver_id: "darshan",
//         type: "producer"
//     }
// });


let socketInstance = null;

export const setSocket = (s) => {
  socketInstance = s;
};

export const getSocket = () => socketInstance;