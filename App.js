import { LogBox, StatusBar } from "react-native";
import Nav from "./src/navigation/Nav";
import "react-native-gesture-handler";
import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { setCustomText, setCustomTextInput } from "react-native-global-props";
import { useFonts } from "expo-font";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCustomText(customTextProps);
    setCustomTextInput(customTextInputProps);
    LogBox.ignoreAllLogs();
    checkAuth();
  }, []);

  const customTextProps = {
    style: {
      fontFamily: "regular",
    },
  };

  const customTextInputProps = {
    style: {
      fontFamily: "bold",
      fontSize: 17,
    },
  };

  const checkAuth = async () => {
    const unsusbcribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setLoaded(true);
    });
    return () => unsusbcribe();
  };

  const [fontsLoaded] = useFonts({
    light: require("./assets/fonts/Roboto-Light.ttf"),
    regular: require("./assets/fonts/Roboto-Regular.ttf"),
    bold: require("./assets/fonts/Roboto-Bold.ttf"),
    italic: require("./assets/fonts/Roboto-Italic.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (!fontsLoaded) {
      Font.loadAsync();
    }
  }, [fontsLoaded]);

  if (!loaded) return null;

  return (
    <>
      {authenticated ? (
        <>
          <StatusBar barStyle={"dark-content"} />
          <Nav onLayout={onLayoutRootView} />
        </>
      ) : (
        <Nav onLayout={onLayoutRootView} />
      )}
    </>
  );
};
export default App;
