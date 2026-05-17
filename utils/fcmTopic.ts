import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";

export async function subscribeHaloRSATopic() {
  try {
    await messaging().requestPermission();

    if (Platform.OS === "android") {
      await messaging().registerDeviceForRemoteMessages();
    }

    await messaging().subscribeToTopic("halorsa");

    console.log("Berhasil subscribe topic halorsa");
  } catch (error) {
    console.log("Gagal subscribe topic halorsa:", error);
  }
}