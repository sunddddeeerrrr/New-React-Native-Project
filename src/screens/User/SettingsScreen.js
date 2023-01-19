import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
  Share,
} from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import {
  PhoneIcon,
  UserIcon,
  MapIcon,
  ShareIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
  TrashIcon,
  ShoppingBagIcon,
  ChevronRightIcon,
} from "react-native-heroicons/outline";
import * as WebBrowser from "expo-web-browser";
import COLORS from "../../styles/COLORS";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../../config/firebase";
import SettingsList from "../../components/SettingsList";
import { doc, onSnapshot } from "firebase/firestore";
import moment from "moment/moment";
import { Skeleton } from "@rneui/themed";
import Constants from "expo-constants";

const SettingsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Mon compte",
    });
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;
    getUserData();
  }, []);

  async function getUserData() {
    const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      setTimeout(() => {
        setUserData(doc.data());
      }, 1000);
    });

    return () => unsub();
  }

  const validateSignOut = () => {
    Alert.alert(
      "Se déconnecter",
      "Êtes vous sure?",
      [
        { text: "Déconnexion", onPress: () => logOut() },
        {
          text: "Annuler",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const validateDelete = () => {
    Alert.alert(
      "Supprimer",
      "Êtes vous sure?",
      [
        { text: "Envoyer", onPress: () => alert("Demande envoyée") },
        {
          text: "Annuler",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const logOut = () => {
    setIsLoading(true);
    setTimeout(() => {
      signOut(auth);
    }, 1000);
  };

  const shareData = async () => {
    const appStoreURL = "https://apps.apple.com/us/app/nappylocks/id1661966757";
    const playStoreURL =
      "https://play.google.com/store/apps/details?id=com.sunder.nappylocks";
    await Share.share({
      message: `Acheter vos produits capilaires et réservez des services à des prix imbattables chez NAPPYLOCKS, le spécialiste des DreadsLocks ${
        Platform.OS === "ios" ? appStoreURL : playStoreURL
      }`,
      // url: Platform.OS === "ios" ? appStoreURL : playStoreURL,
    });
  };

  if (isLoading) 
    return null;
  

  if (!auth.currentUser)
    return (
      <View
        style={{ marginTop: "-50%" }}
        className="flex-1 bg-white justify-center items-center px-5"
      >
        <View
          className="bg-gray-100 items-center justify-center"
          style={{ height: 150, width: 150, borderRadius: 75 }}
        >
          <Text style={{ fontSize: 80 }} className="text-center pt-2 mb-2">
            ⚙️
          </Text>
        </View>
        <Text
          style={{ fontFamily: "bold" }}
          className="mt-4 mb-2 text-center text-xl"
        >
          Vous n'êtes pas authentifié
        </Text>
        <Text style={{ fontSize: 17 }} className="text-center">
          Gestion des commandes, des informations personnelles et bien
          d'autres...
        </Text>
        <Pressable
          onPress={() => navigation.jumpTo("HomeTab")}
          className="flex-row items-center justify-center mt-2 px-7 rounded-full py-3"
          style={{
            width: "95%",
            alignSelf: "center",
            zIndex: 2,
          }}
        >
          <Text className="text-md text-blue-500">
            Ou consultez les offres du jour
          </Text>
        </Pressable>

        <View
          style={{
            width: "100%",
          }}
        >
          <Pressable
            onPress={() => navigation.navigate("LoginScreen")}
            className="self-center items-center justify-center mt-2 px-7 rounded-md py-3"
            style={{
              width: "100%",
              zIndex: 2,
              backgroundColor: COLORS.primary,
            }}
          >
            <Text className="text-md text-center">
              Connectez-vous à votre compte
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("RegisterScreen")}
            className="self-center items-center justify-center mt-3 px-7 rounded-md py-3"
            style={{
              width: "100%",
              zIndex: 2,
              backgroundColor: "white",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 5,
            }}
          >
            <Text className="text-md text-center">
              Inscrivez-vous maintenant
            </Text>
          </Pressable>
        </View>
      </View>
    );

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      <View className="rounded-md bg-gray-100 px-7 py-4 mb-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image
            className="mr-3"
            source={require("../../../assets/img/profile-user.png")}
            style={{ height: 50, width: 50 }}
          />
          {userData.lastName !== undefined ? (
            <View>
              <Text
                style={{ fontFamily: "bold" }}
                className="text-lg text-gray-700"
              >
                {userData.lastName !== "" ? (
                  userData.lastName + " " + userData.firstName
                ) : (
                  <Pressable
                    onPress={() => {
                      navigation.navigate("EditNameScreen", {
                        lastName: userData.lastName,
                        firstName: userData.firstName,
                      });
                    }}
                  >
                    <Text
                      style={{ fontFamily: "bold" }}
                      className="text-lg text-gray-700"
                    >
                      Ajouter un nom
                    </Text>
                  </Pressable>
                )}
              </Text>
              <Text className="text-sm">
                Inscrit depuis le{" "}
                {moment(userData.createdAt).format("DD/MM/YY")}
              </Text>
            </View>
          ) : (
            <View>
              <Skeleton
                style={{
                  height: 10,
                  width: 200,
                }}
                animation="wave"
              />
              <Skeleton
                style={{
                  marginTop: 5,
                  height: 7,
                  width: 150,
                }}
                animation="wave"
              />
            </View>
          )}
        </View>
        <TouchableOpacity onPress={validateSignOut}>
          <ArrowLeftOnRectangleIcon size={25} color={COLORS.body} />
        </TouchableOpacity>
      </View>

      <>
        <View className="px-4">
          <Text className="ml-2 mt-4 text-md text-gray-500 mb-3">Modifier</Text>
          <SettingsList
            onPress={() => {
              navigation.navigate("EditNameScreen", {
                lastName: userData.lastName,
                firstName: userData.firstName,
              });
            }}
            title="Nom & prénom"
            icon={() => <UserIcon color={COLORS.body} size={22} />}
          />
          <SettingsList
            onPress={() =>
              navigation.navigate("EditPhoneScreen", {
                phone: userData.phone,
              })
            }
            title="Numéro de téléphone"
            icon={() => <PhoneIcon color={COLORS.body} size={22} />}
          />
          <SettingsList
            onPress={() => {
              navigation.navigate("AddressScreen", {
                address: userData.address,
              });
            }}
            title="Mes adresses"
            icon={() => <MapIcon color={COLORS.body} size={22} />}
          />
        </View>
      </>
      <View className="p-4">
        <Text className="ml-2 text-md text-gray-500 mb-3">Assistance</Text>
        <SettingsList
          onPress={() => {
            Linking.openURL(`tel:${"+2220708704530"}`);
          }}
          title="Appeler le service client"
          icon={() => <PhoneIcon color={COLORS.body} size={22} />}
        />
        <SettingsList
          onPress={shareData}
          title="Partager l'application à des amis"
          icon={() => <ShareIcon color={COLORS.body} size={22} />}
        />
        <SettingsList
          onPress={() => {
            WebBrowser.openBrowserAsync("https://nappylocks.com/terms");
          }}
          title="Termes et conditions, Politique DC"
          icon={() => <DocumentTextIcon color={COLORS.body} size={22} />}
        />
      </View>
      <TouchableOpacity onPress={validateDelete}>
        <Text className="underline text-gray-400 text-center mt-10">
          Fermer mon compte
        </Text>
      </TouchableOpacity>
      <Text className="underline text-gray-400 text-center my-10">
        {Constants.manifest.version}
      </Text>
    </ScrollView>
  );
};

export default SettingsScreen;
