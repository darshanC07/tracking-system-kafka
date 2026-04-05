import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

const ActiveRide = () => {
  const initialLocation = {
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const mapRef = useRef(null);

  const screenHeight = Dimensions.get("window").height;

  const MIN_HEIGHT = 150;
  const MAX_HEIGHT = screenHeight * 0.3;
  console.log("Screen Height:", screenHeight, "Min Height:", MIN_HEIGHT, "Max Height:", MAX_HEIGHT);
  const animatedHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;
  const lastHeight = useRef(MIN_HEIGHT);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > 5,

      onPanResponderMove: (_, gesture) => {
        let newHeight = lastHeight.current - gesture.dy;

        if (newHeight > MAX_HEIGHT) newHeight = MAX_HEIGHT;
        if (newHeight < MIN_HEIGHT) newHeight = MIN_HEIGHT;

        animatedHeight.setValue(newHeight);
      },

      onPanResponderRelease: (_, gesture) => {
        let finalHeight = lastHeight.current - gesture.dy;

        if (finalHeight > MAX_HEIGHT) finalHeight = MAX_HEIGHT;
        if (finalHeight < MIN_HEIGHT) finalHeight = MIN_HEIGHT;

        const shouldExpand =
          finalHeight > (MIN_HEIGHT + MAX_HEIGHT) / 2;

        const toValue = shouldExpand ? MAX_HEIGHT : MIN_HEIGHT;

        Animated.spring(animatedHeight, {
          toValue,
          useNativeDriver: false,
        }).start(() => {
          lastHeight.current = toValue;
        });
      },
    })
  ).current;

  useEffect(() => {
    (async () => {
      let { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let location = await Location.getCurrentPositionAsync({});

      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            ...initialLocation,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          1000
        );
      }
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Track Kafka</Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.title}>Active Ride</Text>

          <View style={styles.mapView}>
            <MapView
              ref={mapRef}
              style={{ width: "100%", height: "100%" }}
              provider={PROVIDER_GOOGLE}
              initialRegion={initialLocation}
              showsUserLocation
              showsMyLocationButton
              toolbarEnabled
            />
          </View>
        </View>

        <Animated.View
          style={[styles.footer, { height: animatedHeight }]}
          {...panResponder.panHandlers}
        >
          <View
            style={styles.dragHandleContainer}
          >
            <View style={styles.dragHandle} />
          </View>

          <View style={styles.content}>
            <View style={styles.tripInfo}>
              <Text style={styles.tripHeader}>
                Ride#1 Chinchwad
              </Text>
              <Text style={styles.tripText}>
                Duration: 15 mins
              </Text>

              <Animated.View
                style={{
                  opacity: animatedHeight.interpolate({
                    inputRange: [MIN_HEIGHT, MAX_HEIGHT],
                    outputRange: [0, 1],
                    extrapolate: "clamp",
                  }),
                  marginTop: 6,
                }}
              >
                <Text style={styles.tripText}>
                  Distance: 8.2 km
                </Text>
                <Text style={styles.tripText}>
                  Speed: 32 km/h
                </Text>
                <Text style={styles.tripText}>
                  Status: Ongoing
                </Text>
              </Animated.View>
            </View>

          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>End Ride</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ActiveRide;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#5B6EF5",
    padding: 16,
    alignItems: "center",
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

  mapView: {
    width: "100%",
    height: "74%",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 16,
    overflow: "hidden",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#6775F8",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    elevation: 10,
    paddingVertical: 20,
  },

  dragHandleContainer: {
    alignItems: "center",
    marginBottom: 8,
  },

  dragHandle: {
    height: 4,
    width: 40,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },

  content: {
    flex: 1,
    justifyContent: "space-between",
  },

  tripInfo: {
    width: "100%",
  },

  tripHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  tripText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 4,
  },

  button: {
    backgroundColor: "#FFA39E",
    paddingVertical: 14,
    borderRadius: 12,
    borderColor: "#A10500",
    borderWidth: 1,
    width: "100%",
    marginTop: 10,
  },

  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});