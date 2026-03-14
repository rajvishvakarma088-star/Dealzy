import React from "react";
import { View, StyleSheet, ImageBackground, TouchableOpacity, Image } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";

export default function Welcome() {

  const router = useRouter();

  return (

    <ImageBackground
      source={require("../assets/login_bg.png")}
      style={styles.container}
      resizeMode="cover"
    >

      {/* Top Logo */}

      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/dealzy_logo.png")}
          style={styles.logo}
        />
      </View>

      {/* Center Text */}

      <View style={styles.textContainer}>

        <Text style={styles.title}>
          Welcome to Dealzy
        </Text>

        <Text style={styles.subtitle}>
          Enter Your  Personal Details
        </Text>

      </View>

      {/* Bottom Buttons */}

      <View style={styles.buttonContainer}>

        <TouchableOpacity
          style={styles.signIn}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.signInText}>
            Sign in
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUp}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.signUpText}>
            Sign up
          </Text>
        </TouchableOpacity>

      </View>

    </ImageBackground>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:"space-between"
  },

  logoContainer:{
    alignItems:"center",
    marginTop:150
  },

  logo:{
    width:110,
    height:110,
    resizeMode:"contain"
  },

textContainer:{
  alignItems:"center",
  paddingHorizontal:10,
  marginTop:-180   // moves title & subtitle upward
},

  title:{
    fontSize:32,
    color:"#1C3A7A",
    fontWeight:"bold",
    textAlign:"center"
  },

  subtitle:{
    color:"#1C3A7A",
    marginTop:10,
    textAlign:"center",
    fontSize:16
  },

  buttonContainer:{
    flexDirection:"row",
    justifyContent:"space-between",
    paddingHorizontal:20,
    marginBottom:40
  },

  signIn:{
    flex:1,
    backgroundColor:"#5B8DBF",
    padding:18,
    alignItems:"center",
    borderRadius:30,
    marginRight:10,
    elevation:6,
    shadowColor:"#000",
    shadowOffset:{width:0,height:3},
    shadowOpacity:0.2,
    shadowRadius:4
  },

  signInText:{
    color:"#FFFFFF",
    fontSize:18,
    fontWeight:"bold"
  },

  signUp:{
    flex:1,
    backgroundColor:"white",
    padding:18,
    alignItems:"center",
    borderRadius:30,
    marginLeft:10,
    elevation:6,
    shadowColor:"#000",
    shadowOffset:{width:0,height:3},
    shadowOpacity:0.2,
    shadowRadius:4
  },

  signUpText:{
    color:"#5B8DBF",
    fontSize:18,
    fontWeight:"bold"
  }

});