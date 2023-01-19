import {
  View,
  Text,
  ScrollView,
  Pressable,
  Keyboard,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ShoppingCartIcon,
} from "react-native-heroicons/outline";
import COLORS from "../../styles/COLORS";
import { useState } from "react";
import { auth, db } from "../../../config/firebase";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  BottomSheetTextInput,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { styles } from "../../styles/styles";
import { Skeleton } from "@rneui/themed";
import moment from "moment";
import axios from "axios";
import { CINETPAY_API_KEY, CINETPAY_SITE_ID } from "@env";


const CommandsScreen = ({ navigation }) => {
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [commands, setCommands] = useState([]);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["50%", "50%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleModalClosePress = () => bottomSheetRef.current.dismiss();

  const MySkeleton = () => {
    return (
      <Skeleton
        style={{
          width: "95%",
          height: 60,
          borderRadius: 5,
          marginBottom: 10,
        }}
        animation="wave"
      />
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Mes commandes",
    });
  }, []);

  useEffect(() => {
    if (!auth.currentUser) {
      setIsLoading(false);
      return;
    }
    navigation.addListener("focus", () => {
      getCommands();
    });
  }, []);

  async function getCommands() {
    const addressRef = collection(db, "commands");
    const q = query(
      addressRef,
      where("userId", "==", auth.currentUser.uid)
      // orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dataArr = [];
      querySnapshot.forEach((res) => {
        const {
          ref,
          total,
          isPaied,
          products,
          transactionId,
          address,
          createdAt,
        } = res.data();
        dataArr.push({
          id: res.id,
          ref,
          total,
          isPaied,
          products,
          transactionId,
          address,
          createdAt,
        });
      });
      setCommands(dataArr);
      checkPayment(dataArr);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }

  const checkPayment = async (dataArr) => {
    dataArr.forEach(async (e) => {
      const data = {
        apikey: CINETPAY_API_KEY,
        site_id: CINETPAY_SITE_ID,
        transaction_id: e.transactionId,
      };

      const config = {
        method: "post",
        url: "https://api-checkout.cinetpay.com/v2/payment/check",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      };

      axios(config)
      .then((res) => {
        if (res.data.data.status == "ACCEPTED") {
          const updateRef = doc(db, "commands", e.id);
          updateDoc(updateRef, {
            isPaied: true,
            paymentMethod: res.data.data.payment_method,
            paiedAt: moment(res.data.data.payment_date).format(),
          });
          return;
        }
      })
      .catch((err) => {
        // if (err.response) {
        //   console.log(err.response.data);
        // } else if (err.request) {
        //   console.log(err.response.data);
        // } else {
        //   console.log(err.response.data);
        // }
        return;
      });
    });

   
  };

  if (isLoading) return null;

  if (commands.length < 1)
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
            🛍️
          </Text>
        </View>
        <Text
          style={{ fontFamily: "bold" }}
          className="mt-4 mb-2 text-center text-xl"
        >
          Vous n'avez aucune commande
        </Text>
        <Text style={{ fontSize: 17 }} className="text-center">
          Il n'y a rien ici, si ce n'est des possibilités
        </Text>
        <Pressable
          onPress={navigation.goBack}
          className="flex-row items-center justify-center mt-2 px-7 rounded-full py-3"
          style={{
            width: "95%",
            alignSelf: "center",
            zIndex: 2,
          }}
        >
          <Text className="text-md text-blue-500">
            Consultez les offres du jour
          </Text>
        </Pressable>
        {!auth.currentUser && (
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
        )}
      </View>
    );

  return (
    <>
      <SafeAreaView className="flex-1 bg-white">
        <View>
          <FlatList
            contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
            data={commands}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("ValidateScreen", {
                    command: JSON.stringify(item),
                  })
                }
                className="mb-2 pb-2 border-b border-gray-200"
              >
                <View className="bg-white flex-row justify-between items-center">
                  <View>
                    <View className="flex-row items-center">
                      <Text
                        style={{ fontFamily: "bold" }}
                        className="text-gray-700 text-lg"
                      >
                        {"#" + item.ref}{" "}
                      </Text>
                    </View>
                    <Text className="text-sm">
                      {"Commandé le " +
                        moment(item.createdAt).format("DD/MM/YY h:mm a")}
                    </Text>
                  </View>

                  <View
                    className="rounded-full px-2 py-1"
                    style={{
                      backgroundColor: item.isPaied ? "#27ae60" : "#e74c3c",
                    }}
                  >
                    <Text
                      style={{ fontSize: 13 }}
                      className="text-white text-center"
                    >
                      {item.isPaied ? "(Payé)" : "(Non payé)"}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
          />
        </View>
      </SafeAreaView>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          backgroundStyle={{
            backgroundColor: COLORS.lightGray,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <View className="flex-1 bg-gray-100 p-5">
            <View className="mb-10">
              <View className="mt-3 w-full">
                <Text className="font-semibold mb-2 ml-2">Ville</Text>
                <BottomSheetTextInput
                  placeholderTextColor={"gray"}
                  placeholder="Votre ville"
                  style={styles.input}
                  autoCapitalize="words"
                  value={city}
                  onChangeText={(val) => {
                    setCity(val);
                  }}
                />
              </View>
              <View className="mt-3 w-full">
                <Text className="font-semibold mb-2 ml-2">Rue</Text>
                <BottomSheetTextInput
                  placeholderTextColor={"gray"}
                  placeholder="Votre rue"
                  style={styles.input}
                  autoCapitalize="words"
                  value={street}
                  onChangeText={(val) => {
                    setStreet(val);
                  }}
                />
              </View>
            </View>
            <Pressable
              disabled={city.length < 3 || street.length < 3 ? true : false}
              // onPress={addAddress}
              className="rounded-full flex-row items-center justify-center px-7 py-3"
              style={{
                width: "100%",
                zIndex: 12,
                backgroundColor: "rgba(0,0,0,0.9)",
                borderColor: COLORS.primary,
                borderWidth: 1,
                opacity: city.length < 3 || street.length < 3 ? 0.5 : 1,
              }}
            >
              <>
                <Text
                  style={{
                    color: COLORS.primary,
                  }}
                  className="font-bold text-md mr-2 text-yellow-600"
                >
                  Continuer
                </Text>
                <ChevronRightIcon color={COLORS.primary} size={15} />
              </>
            </Pressable>
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
};

export default CommandsScreen;
