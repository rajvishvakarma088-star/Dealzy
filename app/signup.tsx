import React, { useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { TextInput, Button, Text, Checkbox, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/services/firebaseConfig";

export default function Signup() {

  const router = useRouter();
  const { dark } = useTheme();

  /* Theme Colors */

  const cardBg = dark ? "#1E1E1E" : "#FFFFFF";
  const titleColor = dark ? "#FFFFFF" : "#1C3A7A";
  const inputBg = dark ? "#2A2A2A" : "#FFFFFF";
  const inputText = dark ? "#FFFFFF" : "#000000";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSignup = async () => {

    if (!agree) {
      alert("Please accept terms");
      return;
    }

    try {

      await createUserWithEmailAndPassword(auth, email, password);

      alert("Account created. Please login.");

      router.replace("/login");

    } catch (error:any) {

      alert(error.message);

    }

  };

  return (

    <View style={styles.container}>

      <ImageBackground
        source={require("../assets/login_bg.png")}
        style={styles.header}
      />

      {/* Signup Card */}

      <View style={[styles.card,{ backgroundColor: cardBg }]}>

        <Text style={[styles.title,{ color: titleColor }]}>
          Get Started
        </Text>

        {/* Name */}

        <TextInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          textColor={inputText}
          style={[styles.input,{ backgroundColor: inputBg }]}
          outlineColor={dark ? "#444" : "#ccc"}
          activeOutlineColor="#1C3A7A"
        />

        {/* Email */}

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          textColor={inputText}
          style={[styles.input,{ backgroundColor: inputBg }]}
          outlineColor={dark ? "#444" : "#ccc"}
          activeOutlineColor="#1C3A7A"
        />

        {/* Password */}

        <TextInput
          label="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          mode="outlined"
          textColor={inputText}
          style={[styles.input,{ backgroundColor: inputBg }]}
          outlineColor={dark ? "#444" : "#ccc"}
          activeOutlineColor="#1C3A7A"
        />

        {/* Agreement */}

        <View style={styles.agreeRow}>

          <Checkbox
            status={agree ? "checked" : "unchecked"}
            onPress={() => setAgree(!agree)}
          />

          <Text>
            I agree to processing of{" "}
            <Text style={{color:"#4F46E5"}}>
              Personal data
            </Text>
          </Text>

        </View>

        {/* Signup Button */}

        <Button
          mode="contained"
          style={styles.signupBtn}
          onPress={handleSignup}
        >
          Sign up
        </Button>

        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text
            style={{color:"#4F46E5"}}
            onPress={() => router.push("/login")}
          >
            Sign in
          </Text>
        </Text>

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#E6EAF5"
  },

  header:{
    height:260,
    padding:20
  },

  card:{
    flex:1,
    marginTop:-50,
    borderTopLeftRadius:40,
    borderTopRightRadius:40,
    padding:25
  },

  title:{
    fontSize:26,
    fontWeight:"bold",
    textAlign:"center",
    marginBottom:20
  },

  input:{
    marginBottom:15
  },

  agreeRow:{
    flexDirection:"row",
    alignItems:"center"
  },

  signupBtn:{
    marginTop:20,
    borderRadius:10,
    backgroundColor:"#5B8DBF"
  },

  loginText:{
    textAlign:"center",
    marginTop:20
  }

});