import { View, Text, Pressable } from "react-native";
import React from "react";
import { ArrowRightIcon } from "react-native-heroicons/solid";
import COLORS from "../styles/COLORS";
import { ChevronRightIcon } from "react-native-heroicons/outline";

const SettingsList = ({ title, icon, onPress }) => {
  return (
    <Pressable
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
      }}
      onPress={onPress}
      className="mb-3"
    >
      <View className="flex-row justify-between items-center bg-white py-3 px-5 rounded-xl">
        <View className="flex-row items-center">
          {icon()}
          <Text className="ml-3 text-md">{title}</Text>
        </View>
        <ChevronRightIcon color={COLORS.body} size={18} />
      </View>
    </Pressable>
  );
};

export default SettingsList;
