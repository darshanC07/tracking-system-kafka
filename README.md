# track-kafka — Real-time Ride Tracking with Kafka

This project is an experimental implementation of a real-time ride-tracking system using Apache Kafka for event delivery. It demonstrates producers and consumers, topic/partition distribution, and a simple admin portal for real-time monitoring.

**Features**

- **Real-time ride events**: Producers publish ride location and status events to Kafka topics.
- **Consumer-backed processing**: Consumers read ride events for persistence, analytics, and admin UI updates.
- **Partitioned topics**: Topics are partitioned to demonstrate ordering, scalability, and consumer group behavior.
- **React Native mobile app**: Mobile UI to create and update rides; sample screens include `NewRide.js` and `ActiveRide.js`.
- **Admin monitoring**: Instructions to monitor topics, partitions, consumer groups, and message rates using an admin dashboard.

**Repository layout (key files/folders)**

- `App.js`, `index.js` — React Native app entry points.
- `ActiveRide.js`, `NewRide.js` — example screens for tracking rides.
- `config.json` — runtime URLs and configuration used by the app.

**Prerequisites**

- Node.js (v16+ recommended)
- Java and Android SDK (for Android builds) if running on Android
- A Kafka cluster (local: Apache Kafka or a hosted provider such as Confluent Cloud)
- If using Confluent Platform locally, Confluent Control Center is useful for monitoring


**Install and run (React Native app)**

1. Install dependencies at the project root:

```bash
npm install
```

2. Run the app on Android (device/emulator):

```bash
npx react-native run-android
```

3. The app will use the endpoints in `config.json` to send ride events to the backend, which then publishes to Kafka topics.

**Monitoring — Admin Dashboard**

The project supports monitoring via an external admin dashboard. You can use Confluent Control Center, Kafka Manager, Kafka UI, or any Kafka monitoring tool. Below are instructions and example URLs.

Monitoring steps (typical)

1. Open the admin dashboard in a browser using the URL - [https://tracking-system-kafka-backend.onrender.com/admin](https://tracking-system-kafka-backend.onrender.com/admin)
2. Select topic which you want to monitor.
3. For group-id, you can either enter any group id or you can opt for random.
4. Offset refers to how you want to consume events from kafka topic
   - latest - consumes only the latest event 
   - earliest - consumes events from start
5. To start ride, you need driver app which can be downloaded from [releases](https://github.com/darshanC07/tracking-system-kafka/releases/tag/v1)

**Troubleshooting**

- Confirm network/firewall rules allow connectivity between producers/consumers and the Kafka cluster.
- Or else email me issue on github or `darshanchoudhary2007@gmail.com`

