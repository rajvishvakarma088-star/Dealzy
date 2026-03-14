import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

export const syncOfflineVisits = async () => {

  try {

    const offlineData = await AsyncStorage.getItem("offlineVisits");

    if (!offlineData) return;

    const visits = JSON.parse(offlineData);

    if (visits.length === 0) return;

    const syncedVisits = [];

    for (const visit of visits) {

      try {

        await addDoc(collection(db, "visits"), {
          ...visit,
          syncStatus: "synced"
        });

      } catch {

        syncedVisits.push(visit);

      }

    }

    await AsyncStorage.setItem(
      "offlineVisits",
      JSON.stringify(syncedVisits)
    );

  } catch (error) {

    console.log("Sync error:", error);

  }

};