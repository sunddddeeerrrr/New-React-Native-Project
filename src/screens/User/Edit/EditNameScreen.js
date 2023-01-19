import {
  View,
  Text,
  ScrollView,
  Pressable,
  Keyboard,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useLayoutEffect } from "react";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
} from "react-native-heroicons/outline";
import COLORS from "../../../styles/COLORS";
import { useState } from "react";
import { auth, db } from "../../../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { styles } from "../../../styles/styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const EditNameScreen = ({ navigation,route }) => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable onPress={navigation.goBack}>
          <ChevronLeftIcon color={COLORS.body} size={25} />
        </Pressable>
      ),
      headerTitle: "Modifier nom et prénom",
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus();
    }, 500);
  }, []);

  async function update() {
    setIsLoading(true);
    Keyboard.dismiss();
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      lastName: lastName,
      firstName: firstName,
    })
      .then(() => navigation.goBack())
      .catch(() => Alert.alert("Erreur", "Un problème est survenu"));
    setIsLoading(false);
  }

  return (
    <KeyboardAwareScrollView
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled
      className="flex-1 bg-white"
    >
      <View className="p-4">
        <View className="mt-3 w-full">
          <Text className="font-semibold mb-2 ml-2">Nouveau nom</Text>
          <TextInput
            ref={inputRef}
            placeholderTextColor={"gray"}
            placeholder={route.params.lastName}
            style={styles.input}
            autoCapitalize="words"
            value={lastName}
            onChangeText={(val) => {
              setLastName(val);
            }}
          />
        </View>
        <View className="mt-3 w-full">
          <Text className="font-semibold mb-2 ml-2">Nouveau prénom</Text>
          <TextInput
            placeholderTextColor={"gray"}
            placeholder={route.params.firstName}
            style={styles.input}
            autoCapitalize="words"
            value={firstName}
            onChangeText={(val) => {
              setFirstName(val);
            }}
          />
        </View>
      </View>
      <Pressable
        onPress={update}
        disabled={
          isLoading || lastName.length < 3 || firstName.length < 3
            ? true
            : false
        }
        className="flex-row items-center justify-center mt-5 px-7 rounded-full py-3"
        style={{
          width: "95%",
          alignSelf: "center",
          zIndex: 2,
          backgroundColor: "rgba(0,0,0,0.9)",
          borderColor: COLORS.primary,
          borderWidth: 1,
          opacity:
            isLoading || lastName.length < 3 || firstName.length < 3 ? 0.5 : 1,
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
              MODIFIER
            </Text>
            <ArrowRightIcon color={COLORS.primary} size={15} />
          </>
        )}
      </Pressable>
    </KeyboardAwareScrollView>
  );
};

export default EditNameScreen;
