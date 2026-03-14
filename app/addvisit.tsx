import React, { useState } from "react";
import { StyleSheet, ScrollView, Alert, View } from "react-native";
import {
  TextInput,
  Button,
  Card,
  Text,
  ActivityIndicator,
  Menu,
  Appbar,
  useTheme
} from "react-native-paper";

import { db } from "../src/services/firebaseConfig";
import { useRouter } from "expo-router";
import { collection, addDoc, updateDoc } from "firebase/firestore";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddVisit() {

  const router = useRouter();
  const { colors, dark } = useTheme();

  /* TextField theme */

  const inputBg = dark ? "#1E1E1E" : "#F9FAFB";
  const inputText = dark ? "#FFFFFF" : "#000000";

  const [customer, setCustomer] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const [outcome, setOutcome] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  const [summary, setSummary] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const OPENROUTER_KEY = "YOUR_OPENROUTER_API_KEY";

  /* AI SUMMARY */

  const generateSummary = async () => {

    if (!notes.trim()) {
      Alert.alert("Write meeting notes first");
      return;
    }

    try {

      setLoadingAI(true);

      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "meta-llama/llama-3.1-8b-instruct",
          messages: [
            {
              role: "user",
              content: `Analyze this sales meeting and extract:

Meeting Summary
Pain Points
Action Items
Recommended Next Step

Return plain text.

Meeting Notes:
${notes}`
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${OPENROUTER_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const aiText = res.data.choices[0].message.content;
      setSummary(aiText);

    } catch {

      Alert.alert("AI summary failed");

    } finally {

      setLoadingAI(false);

    }

  };

  /* SAVE VISIT */

  const saveVisit = async () => {

    if (!customer || !contact || !location || !notes || !outcome) {
      Alert.alert("Missing Fields", "Please fill all fields");
      return;
    }

    const visitData = {
      customerName: customer,
      contactPerson: contact,
      location,
      meetingNotes: notes,
      aiSummary: summary,
      outcome,
      followUpDate,
      visitDate: new Date().toDateString(),
      syncStatus: "syncing"
    };

    try {

      const ref = await addDoc(collection(db, "visits"), visitData);

      await updateDoc(ref, { syncStatus: "synced" });

      Alert.alert("Success", "Visit synced successfully");
      router.back();

    } catch {

      const offlineVisit = {
        ...visitData,
        syncStatus: "draft"
      };

      const existing = await AsyncStorage.getItem("offlineVisits");
      const visits = existing ? JSON.parse(existing) : [];

      visits.push(offlineVisit);

      await AsyncStorage.setItem("offlineVisits", JSON.stringify(visits));

      Alert.alert("Saved Offline", "Visit saved locally");

    }

  };

  return (

<View style={{ flex:1 }}>

  {/* Appbar */}

  <Appbar.Header style={styles.appbar}>
    <Appbar.BackAction color="white" onPress={() => router.back()} />
    <Appbar.Content title="Add Sales Visit" titleStyle={styles.appbarTitle} />
  </Appbar.Header>

  <ScrollView style={[styles.container,{ backgroundColor: colors.background }]}>

  <Card style={styles.card}>
  <Card.Content>

  <Text style={styles.sectionTitle}>Visit Information</Text>

  {/* CUSTOMER */}

  <TextInput
    label="Customer Name"
    value={customer}
    onChangeText={setCustomer}
    mode="outlined"
    textColor={inputText}
    style={[styles.input,{ backgroundColor: inputBg }]}
    outlineColor={dark ? "#444" : "#ccc"}
    activeOutlineColor="#1C3A7A"
    left={<TextInput.Icon icon="account" />}
  />

  {/* CONTACT */}

  <TextInput
    label="Contact Person"
    value={contact}
    onChangeText={setContact}
    mode="outlined"
    textColor={inputText}
    style={[styles.input,{ backgroundColor: inputBg }]}
    outlineColor={dark ? "#444" : "#ccc"}
    activeOutlineColor="#1C3A7A"
    left={<TextInput.Icon icon="account-tie" />}
  />

  {/* LOCATION */}

  <TextInput
    label="Location"
    value={location}
    onChangeText={setLocation}
    mode="outlined"
    textColor={inputText}
    style={[styles.input,{ backgroundColor: inputBg }]}
    outlineColor={dark ? "#444" : "#ccc"}
    activeOutlineColor="#1C3A7A"
    left={<TextInput.Icon icon="map-marker" />}
  />

  {/* OUTCOME MENU */}

  <Menu
    visible={menuVisible}
    onDismiss={() => setMenuVisible(false)}
    anchor={
      <Button
        mode="outlined"
        onPress={() => setMenuVisible(true)}
        style={styles.input}
      >
        {outcome || "Select Outcome"}
      </Button>
    }
  >

  <Menu.Item onPress={()=>{setOutcome("Closed Deal");setMenuVisible(false)}} title="Closed Deal"/>
  <Menu.Item onPress={()=>{setOutcome("Follow-up Needed");setMenuVisible(false)}} title="Follow-up Needed"/>
  <Menu.Item onPress={()=>{setOutcome("Not Interested");setMenuVisible(false)}} title="Not Interested"/>

  </Menu>

  {outcome === "Follow-up Needed" && (

  <TextInput
    label="Follow-up Date"
    value={followUpDate}
    onChangeText={setFollowUpDate}
    mode="outlined"
    textColor={inputText}
    style={[styles.input,{ backgroundColor: inputBg }]}
    outlineColor={dark ? "#444" : "#ccc"}
    activeOutlineColor="#1C3A7A"
    left={<TextInput.Icon icon="calendar" />}
  />

  )}

  {/* NOTES */}

  <TextInput
    label="Meeting Notes"
    value={notes}
    onChangeText={setNotes}
    multiline
    numberOfLines={4}
    mode="outlined"
    textColor={inputText}
    style={[styles.notesInput,{ backgroundColor: inputBg }]}
    outlineColor={dark ? "#444" : "#ccc"}
    activeOutlineColor="#1C3A7A"
    left={<TextInput.Icon icon="note-text" />}
  />

  <Button
    mode="contained"
    style={styles.button}
    onPress={generateSummary}
  >
    Generate AI Summary
  </Button>

  {loadingAI && <ActivityIndicator />}

  {summary && (

  <Card style={styles.summaryCard}>
  <Card.Content>

  <Text style={styles.aiTitle}>AI Visit Insights</Text>

  <Text>{summary}</Text>

  </Card.Content>
  </Card>

  )}

  <Button
    mode="contained"
    style={styles.saveButton}
    onPress={saveVisit}
  >
    Save Visit
  </Button>

  </Card.Content>
  </Card>

  </ScrollView>

</View>

  );

}

const styles = StyleSheet.create({

container:{
flex:1,
padding:16
},

appbar:{
backgroundColor:"#1C3A7A"
},

appbarTitle:{
color:"white",
fontWeight:"bold"
},

card:{
borderRadius:16,
padding:10,
elevation:3
},

sectionTitle:{
fontSize:20,
fontWeight:"bold",
marginBottom:15
},

input:{
marginBottom:14
},

notesInput:{
marginBottom:14,
minHeight:100
},

button:{
marginBottom:15,
backgroundColor:"#5B8DBF"
},

summaryCard:{
marginTop:10,
marginBottom:20,
borderRadius:12
},

aiTitle:{
fontSize:18,
fontWeight:"bold",
marginBottom:12,
color:"#1C3A7A"
},

saveButton:{
backgroundColor:"#1C3A7A"
}

});