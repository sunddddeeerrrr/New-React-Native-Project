import { View, Text, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useRef } from "react";
import logo from "../../assets/logo.png";
import { SPACES } from "../styles/styles";
import Lottie from "lottie-react-native";

export default function Loader() {
//   const animationRef = useRef(null);

//   useEffect(() => {
//     animationRef.current?.play();
//   }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      {/* <Lottie
        ref={animationRef}
        source={require("../../assets/loader/loader.json")}
        autoPlay
        loop
        style={{ height: 200, width: 200 }}
      /> */}
      <ActivityIndicator size={"small"} color={"black"}/>
    </View>
  );
}
