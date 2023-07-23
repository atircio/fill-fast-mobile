import React, { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform, TextInput } from "react-native";
import { Notifications } from "expo";
import * as Device from "expo-device";

const Ab = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [notificationDate, setNotificationDate] = useState("");
  const [notificationTime, setNotificationTime] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const schedulePushNotification = async () => {
    if (!notificationDate || !notificationTime) {
      alert("Please provide both date and time for the notification.");
      return;
    }

    const dateTime = new Date(`${notificationDate}T${notificationTime}`);
    const now = new Date();

    if (dateTime <= now) {
      alert("Please select a future date and time for the notification.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail",
        body: "Here is the notification body",
        data: { data: "goes here" },
      },
      trigger: { date: dateTime },
    });

    alert("Notification scheduled successfully.");
  };

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-around" }}
    >
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 10,
        }}
      >
        <Text>Notification Date:</Text>
        <TextInput
          value={notificationDate}
          onChangeText={(text) => setNotificationDate(text)}
          placeholder="YYYY-MM-DD"
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 5,
            width: 200,
          }}
        />
        <Text>Notification Time:</Text>
        <TextInput
          value={notificationTime}
          onChangeText={(text) => setNotificationTime(text)}
          placeholder="HH:MM"
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 5,
            width: 200,
          }}
        />
      </View>
      <Button
        title="Schedule Notification"
        onPress={schedulePushNotification}
      />
    </View>
  );
};

async function registerForPushNotificationsAsync() {
  // ... (Código de registro de notificações - mantido igual)
}

export default Ab;
