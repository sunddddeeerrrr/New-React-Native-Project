import {
  View,
  Text,
  ScrollView,
  Pressable,
  Keyboard,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  MapIcon,
  ChevronLeftIcon,
  TrashIcon,
  PlusIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";
import COLORS from "../../styles/COLORS";
import { useState } from "react";
import { auth, db } from "../../../config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import {
  BottomSheetTextInput,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { styles } from "../../styles/styles";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";

const AddressScreen = ({ navigation }) => {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["80%", "95%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleModalClosePress = () => bottomSheetRef.current.dismiss();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <Pressable onPress={navigation.goBack}>
          <ChevronLeftIcon color={COLORS.body} size={25} />
        </Pressable>
      ),
      headerTitle: "Mes adresses",
      headerRight: (props) => (
        <Pressable onPress={handlePresentModalPress}>
          <PlusIcon size={25} color={COLORS.body} />
        </Pressable>
      ),
    });
  }, []);

  useEffect(() => {
    navigation.addListener("focus", () => {
      getAddress();
    });
  }, []);

  async function getAddress() {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const addressRef = collection(userRef, "addresses");
    const q = query(addressRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dataArr = [];
      querySnapshot.forEach((res) => {
        const { name, street, city, country, postalCode } = res.data();
        dataArr.push({
          id: res.id,
          name,
          street,
          city,
          country,
          postalCode,
        });
      });
      setAddress(dataArr);
      setTimeout(() => setIsLoading(false), 500);
    });
    return () => unsubscribe();
  }

  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Nous n'avons pas accès à votre position",
        "Veuillez nous l'accorder dans vos paramètres?",
        [
          {
            text: "Ouvrir les paramètres",
            onPress: () => Linking.openSettings(),
          },
          {
            text: "Annuler",
            style: "cancel",
          },
        ],
        {
          cancelable: true,
        }
      );

      return;
    }

    let geoReverse = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    let location = await Location.reverseGeocodeAsync(geoReverse.coords);
    setPostalCode(location[0].postalCode);
    setCountry(location[0].country);
    setCity(location[0].city);
    setStreet(
      location[0].name !== null ? location[0].name : location[0].street
    );
  }

  async function addAddress() {
    setCreateLoading(true);
    if (address.length >= 2) {
      Alert.alert("Erreur", "Vous ne pouvez créer que 2 adresses");
      return;
    }
    Keyboard.dismiss();
    const userRef = doc(db, "users", auth.currentUser.uid);
    const addressRef = collection(userRef, "addresses");
    await addDoc(addressRef, {
      street: street,
      country: country,
      city: city,
      postalCode: postalCode,
    }).then(() => {
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCreateLoading(false);
        handleModalClosePress();
      }, 1500);
    });
  }

  async function validateDeleteAddress(id) {
    Alert.alert(
      "Supprimer l'adresse",
      "Êtes vous sure?",
      [
        { text: "Supprimer", onPress: () => deleteAddress(id) },
        {
          text: "Annuler",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  async function deleteAddress(id) {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const addressRef = collection(userRef, "addresses");
    const thisDoc = doc(addressRef, id);
    await deleteDoc(thisDoc);
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 100);
  }

  if (isLoading) return null;

  return (
    <>
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View className="p-4">
          {address.length > 0 ? (
            address.map((item, i) => (
              <View key={i} className="mb-3">
                <View className="flex-row justify-between items-center bg-gray-100 py-3 px-5 rounded-xl">
                  <View>
                    <Text
                      style={{ fontFamily: "bold" }}
                      className="text-lg text-gray-600"
                    >
                      {item.city}, {item.country}
                    </Text>
                    <View className="">
                      <Text className="text-md capitalize">
                        {item.postalCode}, {item.street}
                      </Text>
                    </View>
                  </View>
                  <Pressable onPress={() => validateDeleteAddress(item.id)}>
                    <TrashIcon color={"red"} size={18} />
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <View
              style={{ marginTop: "10%" }}
              className="flex-1 bg-white justify-center items-center px-5"
            >
              <View
                className="bg-gray-100 items-center justify-center"
                style={{ height: 150, width: 150, borderRadius: 75 }}
              >
                <Text
                  style={{ fontSize: 80 }}
                  className="text-center pt-2 mb-2"
                >
                  📍
                </Text>
              </View>
              <Text
                style={{ fontFamily: "bold" }}
                className="mt-4 mb-2 text-center text-xl"
              >
                Vous n'êtes pas authentifié
              </Text>
              <Text
                style={{ fontSize: 17, marginBottom: 20 }}
                className="text-center"
              >
                Gestion des commandes, des informations personnelles et bien
                d'autres...
              </Text>

              <Pressable
                onPress={handlePresentModalPress}
                className="self-center items-center justify-center mt-2 px-7 rounded-md py-3"
                style={{
                  width: "100%",
                  zIndex: 2,
                  backgroundColor: COLORS.primary,
                }}
              >
                <Text className="text-md text-center">Ajouter une adresse</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
          }}
        >
          <ScrollView className="flex-1 px-5">
            <View className="mb-10">
              <Text
                style={{ fontFamily: "bold" }}
                className="text-center my-2 text-lg text-gray-600"
              >
                Ajouter une adresse
              </Text>
              <View className="mt-3 w-full">
                <Text className="font-semibold mb-2 ml-2">Pays</Text>
                <BottomSheetTextInput
                  placeholderTextColor={"gray"}
                  placeholder="Côte d'ivoire"
                  style={styles.input}
                  autoCapitalize="words"
                  value={country}
                  onChangeText={(val) => {
                    setCountry(val);
                  }}
                />
              </View>

              <View className="mt-3 w-full">
                <Text className="font-semibold mb-2 ml-2">Ville</Text>
                <BottomSheetTextInput
                  placeholderTextColor={"gray"}
                  placeholder="Abidjan"
                  style={styles.input}
                  autoCapitalize="words"
                  value={city}
                  onChangeText={(val) => {
                    setCity(val);
                  }}
                />
              </View>

              <View className="mt-3 w-full">
                <Text className="font-semibold mb-2 ml-2">Adresse</Text>
                <BottomSheetTextInput
                  placeholderTextColor={"gray"}
                  placeholder="L237 tapis rouge"
                  style={styles.input}
                  autoCapitalize="words"
                  value={street}
                  onChangeText={(val) => {
                    setStreet(val);
                  }}
                />
              </View>

              <View className="mt-3 w-full">
                <Text className="font-semibold mb-2 ml-2">Code postal</Text>
                <BottomSheetTextInput
                  placeholderTextColor={"gray"}
                  placeholder="45002"
                  style={styles.input}
                  autoCapitalize="words"
                  value={postalCode}
                  onChangeText={(val) => {
                    setPostalCode(val);
                  }}
                />
              </View>
            </View>
            <Pressable
              disabled={
                street.length < 3 ||
                country.length < 3 ||
                city.length < 3 ||
                postalCode.length < 3
                  ? true
                  : false
              }
              onPress={addAddress}
              className="self-center items-center justify-center mt-2 px-7 rounded-md py-3"
              style={{
                width: "100%",
                zIndex: 2,
                backgroundColor: COLORS.primary,
                opacity:
                  street.length < 3 ||
                  country.length < 3 ||
                  city.length < 3 ||
                  postalCode.length < 3
                    ? 0.5
                    : 1,
              }}
            >
              {createLoading ? (
                <ActivityIndicator size={"small"} color={"black"} />
              ) : (
                <Text className="text-md text-center">Valider</Text>
              )}
            </Pressable>
            <Pressable
              onPress={getLocation}
              className="rounded-full flex-row items-center justify-center px-7 py-3"
              style={{
                width: "100%",
                zIndex: 2,
              }}
            >
              <>
                <Text className="font-bold text-md mr-2 text-center text-gray-600 underline">
                  Laissez nous remplir ça à votre place
                </Text>
              </>
            </Pressable>
          </ScrollView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
};

export default AddressScreen;
