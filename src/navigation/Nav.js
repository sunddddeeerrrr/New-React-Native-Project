import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import {
  HomeIcon,
  HeartIcon,
  UserIcon,
  RectangleStackIcon,
  SquaresPlusIcon,
} from "react-native-heroicons/solid";
import {
  RectangleStackIcon as RectangleStackIconOutline,
  HomeIcon as HomeIconOutline,
  HeartIcon as HeartIconOutline,
  UserIcon as UserIconOutline,
  ShoppingCartIcon as ShoppingCartIconOutline,
  SquaresPlusIcon as SquaresPlusIconOutline,
} from "react-native-heroicons/outline";
import COLORS from "../styles/COLORS";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import * as Haptics from "expo-haptics";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerStyle: { borderColor: "white" },
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ presentation: "containedModal", headerShown: false }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ presentation: "containedModal", headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: "absolute", bottom: 0, display: "flex" }
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HomeIcon color={COLORS.body} size={25} />
            ) : (
              <HomeIconOutline color={COLORS.gray} size={25} />
            ),

          tabBarLabel: "Accueil",
          tabBarLabelStyle: { color: COLORS.body },
        }}
        listeners={({ navigation }) => ({
          tabPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        })}
      />
    </Tab.Navigator>
  );
};

const Nav = () => {
  return (
    <NavigationContainer>
      <BottomTab></BottomTab>
    </NavigationContainer>
  );
};

export default Nav;
