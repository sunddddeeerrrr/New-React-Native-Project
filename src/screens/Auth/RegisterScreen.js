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
import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
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
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordIsVisible, setPasswordIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigation = useNavigation();

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

  const register = async () => {
    setIsLoading(true);
    Keyboard.dismiss();
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await setDoc(doc(db, "users", res.user.uid), {
          email: email,
          lastName: "",
          firstName: "",
          phone: "",
          photo: "https://i.pravatar.cc/500",
          referCode: res.user.uid.substr(0, 4),
          createdAt: moment().format(),
        });
        navigation.popToTop();
      })
      .catch(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Une erreur est survenue", "Veuillez réessayer");
      });
    setIsLoading(false);
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
          <Text className="font-bold text-2xl text-white">Inscription</Text>
          <Text className="text-md text-white">
            Créer votre compte siplement
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
            onPress={register}
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
                  S'inscrire
                </Text>
                <ArrowRightIcon color={COLORS.primary} size={15} />
              </>
            )}
          </Pressable>
        </View>
        <Pressable onPress={navigation.goBack}>
          <Text
            style={{ fontSize: 14, fontFamily: "bold" }}
            className="underline text-center mt-10 mr-2 text-gray-300 px-5"
          >
            Vous avez déjà un compte? Connectez-vous ici
          </Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
