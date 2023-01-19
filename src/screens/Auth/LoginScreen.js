import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  Keyboard,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from "react-native";
import { styles } from "../../styles/styles";
import COLORS from "../../styles/COLORS";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
} from "react-native-heroicons/solid";
import React,{ useState, useEffect, useRef,useLayoutEffect } from "react";
import * as Haptics from "expo-haptics";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../config/firebase";
import moment from "moment";
import { ChevronLeftIcon, XMarkIcon } from "react-native-heroicons/outline";

const LoginScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordIsVisible, setPasswordIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);


  useLayoutEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
      },
    });
    return () =>
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: "flex" },
      });
      
  }, []);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 500);
  }, []);

  const login = async () => {
    setIsLoading(true);
    Keyboard.dismiss();
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsLoading(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      })
      .catch((error) => {
        if (error.code == "auth/user-not-found") {
          setIsLoading(false);
          Alert.alert("Erreur", "Ce compte est introuvable");
          return;
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setIsLoading(false);
        Alert.alert("Une erreur est survenue", "Veuillez réessayer");
      });
  };

  const logindemo = async () => {
    setIsLoading(true);
    Keyboard.dismiss();
    await signInWithEmailAndPassword(auth, "test@gmail.com", "test@gmail.com")
      .then(() => {
        setIsLoading(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      })
      .catch(() => {
        setIsLoading(false);
        Alert.alert("Une erreur est survenue", "Veuillez réessayer");
      });
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: "rgba(0,0,0,1)" }}
    >
      <KeyboardAwareScrollView
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled
        className="flex-1 px-4"
        contentContainerStyle={{
          paddingTop: "15%",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={navigation.goBack}
          style={{ position: "absolute", top: 10, left: 0 }}
        >
          <XMarkIcon size={30} color={"white"} />
        </Pressable>
        <View className="w-5/6 justify-center items-center">
          <Text className="font-bold text-2xl text-white">Connexion</Text>
          <Text className="text-md text-white">
            Connectez-vous à votre compte
          </Text>
        </View>
        <View className="mt-5 w-5/6 justify-center items-center">
          <View className="mt-3 w-full">
            <Text className="font-semibold mb-2 ml-2 text-white">Email</Text>
            <TextInput
              ref={inputRef}
              placeholderTextColor={"gray"}
              placeholder="exemple@gmail.com"
              style={styles.authInput}
              autoCapitalize="none"
              keyboardType={"email-address"}
              value={email}
              onChangeText={(val) => {
                setEmail(val);
              }}
            />
          </View>
          <View className="mt-3 w-full">
            <Text className="font-semibold mb-2 ml-2 text-white">
              Mot de passe
            </Text>
            <TextInput
              placeholderTextColor={"gray"}
              placeholder="******"
              style={styles.authInput}
              secureTextEntry={passwordIsVisible}
              value={password}
              onChangeText={(val) => {
                setPassword(val);
              }}
            />
            <Pressable
              className="absolute top-9 right-5"
              onPress={() => setPasswordIsVisible(!passwordIsVisible)}
            >
              {passwordIsVisible ? (
                <EyeIcon color={"white"} size={25} />
              ) : (
                <EyeSlashIcon color={"white"} size={25} />
              )}
            </Pressable>
          </View>
          <Pressable
            onPress={login}
            disabled={
              isLoading || email.length < 5 || password.length < 6
                ? true
                : false
            }
            className="flex-row items-center justify-center mt-5 px-7 rounded-full py-3"
            style={{
              width: "100%",
              alignSelf: "flex-end",
              zIndex: 2,
              backgroundColor: "rgba(0,0,0,0.9)",
              borderColor: COLORS.primary,
              borderWidth: 1,
              opacity:
                isLoading || email.length < 5 || password.length < 6 ? 0.5 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator
                className="self-center w-full"
                size={"small"}
                color={"white"}
              />
            ) : (
              <>
                <Text
                  style={{
                    color: COLORS.primary,
                  }}
                  className="font-bold text-md mr-2 text-yellow-600"
                >
                  Se connecter
                </Text>
                <ArrowRightIcon color={COLORS.primary} size={15} />
              </>
            )}
          </Pressable>
          <Pressable
            onPress={logindemo}
            className="flex-row items-center justify-center mt-2 px-7 rounded-full py-3"
            style={{
              width: "100%",
              zIndex: 2,
              backgroundColor: "rgba(0,0,0,0.9)",
              borderColor: COLORS.primary,
              borderWidth: 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator
                className="self-center w-full"
                size={"small"}
                color={"white"}
              />
            ) : (
              <>
                <Text
                  style={{
                    color: COLORS.primary,
                  }}
                  className="font-bold text-md mr-2 text-yellow-600"
                >
                  ou COMPTE DE DEMO
                </Text>
                <ArrowRightIcon color={COLORS.primary} size={15} />
              </>
            )}
          </Pressable>
        </View>
        <Pressable onPress={() => navigation.navigate("RegisterScreen")}>
          <Text
            style={{ fontSize: 14, fontFamily: "bold" }}
            className="underline text-center mt-10 mr-2 text-gray-300 px-5"
          >
            C'est votre première fois? Créer un compte ici
          </Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
