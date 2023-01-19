import { Dimensions, Platform, StatusBar, StyleSheet } from "react-native";
import COLORS from "./COLORS";



export const styles = StyleSheet.create({
  title: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 18,
  },
  body: {
    color: "gray",
  },
  authInput: {
    color: "white",
    width: "100%",
    height: 40,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 9999,
    fontSize: 13,
  },
  input: {
    width: "100%",
    fontFamily:"regular",
    height: 40,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: COLORS.epicGray,
    borderRadius: 9999,
    fontSize: 13,
  },
});

export const SPACES = {
  xs: 10,
  md: 20,
  phonePadding: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10,
  phoneHeight: Dimensions.get("window").height,
  phoneWidth: Dimensions.get("window").width,
};
