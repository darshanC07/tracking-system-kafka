import { io } from "socket.io-client";

export const socket = io("https://30vkdstn-5000.inc1.devtunnels.ms/", {
    transports: ["websocket"],
    auth: {
        topic: "s1-r1-pick",
        driver_id: "darshan"
    }
});

export const produce = (topic, message) => {
    socket.emit(topic, message);
    console.log("sent to websocket");
};