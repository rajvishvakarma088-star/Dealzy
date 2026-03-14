import React, { useState } from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import { TextInput, Button, Text, Checkbox, useTheme } from "react-native-paper";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/services/firebaseConfig";

export default function LoginScreen() {

  const router = useRouter();
  const { dark } = useTheme();

  const inputBg = dark ? "#2A2A2A" : "#FFFFFF";
  const inputText = dark ? "#FFFFFF" : "#000000";
  const cardBg = dark ? "#1E1E1E" : "#FFFFFF";
  const titleColor = dark ? "#FFFFFF" : "#1C3A7A";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const handleLogin = async () => {

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      if (userCredential.user) {
        router.replace("/dashboard");
      }

    } catch (error:any) {

      if (error.code === "auth/user-not-found") {
        alert("User not found");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password");
      } else {
        alert("Login failed. Try again.");
      }

    }

  };

  return (

    <View style={styles.container}>

      <ImageBackground
        source={require("../assets/login_bg.png")}
        style={styles.header}
      />

      {/* Login Card */}

      <View style={[styles.card,{ backgroundColor: cardBg }]}>

        <Text style={[styles.title,{ color: titleColor }]}>
          Login
        </Text>

        {/* Email */}

        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          textColor={inputText}
          style={[styles.input,{ backgroundColor: inputBg }]}
          outlineColor={dark ? "#444" : "#ccc"}
          activeOutlineColor="#1C3A7A"
        />

        {/* Password */}

        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          textColor={inputText}
          style={[styles.input,{ backgroundColor: inputBg }]}
          outlineColor={dark ? "#444" : "#ccc"}
          activeOutlineColor="#1C3A7A"
        />

        {/* Remember Row */}

        <View style={styles.row}>

          <View style={styles.rememberRow}>

            <Checkbox
              status={remember ? "checked" : "unchecked"}
              onPress={() => setRemember(!remember)}
            />

            <Text>Remember me</Text>

          </View>

          <Text style={styles.forgot}>
            Forgot password?
          </Text>

        </View>

        {/* Sign In */}

        <Button
          mode="contained"
          style={styles.signIn}
          onPress={handleLogin}
        >
          Sign in
        </Button>

        <Text style={styles.signup}>
          Don't have an account?{" "}
          <Text
            style={{color:"#4F46E5"}}
            onPress={() => router.push("/signup")}
          >
            Sign up
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

  row:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },

  rememberRow:{
    flexDirection:"row",
    alignItems:"center"
  },

  forgot:{
    color:"#4F46E5"
  },

  signIn:{
    marginTop:20,
    borderRadius:10,
    backgroundColor:"#5B8DBF"
  },

  signup:{
    textAlign:"center",
    marginTop:20
  }

});