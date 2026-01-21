import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet } from 'react-native';
import Onboarding from '../screens/Onboarding';
import Home from '../screens/Home';
import Plan from '../screens/Plan';
import Library from '../screens/Library';
import FormCoach from '../screens/FormCoach';
import { STORAGE_KEYS } from '../data/storage';
import { COLORS, FONT } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.backgroundAlt,
          borderTopColor: COLORS.border,
        },
        tabBarActiveTintColor: COLORS.accentStrong,
        tabBarInactiveTintColor: COLORS.textDim,
        tabBarLabelStyle: {
          fontFamily: FONT.body,
          fontSize: 11,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Plan" component={Plan} />
      <Tab.Screen name="Library" component={Library} />
      <Tab.Screen name="FormCoach" component={FormCoach} options={{ title: 'Form Coach' }} />
    </Tab.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <Text style={styles.loadingText}>Loading FitForm...</Text>
    </View>
  );
}

export default function Navigation() {
  const [ready, setReady] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      const storedProfile = await AsyncStorage.getItem(STORAGE_KEYS.profile);
      setHasProfile(!!storedProfile);
      setReady(true);
    };

    checkProfile();
  }, []);

  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasProfile && <Stack.Screen name="Onboarding" component={Onboarding} />}
        <Stack.Screen name="Tabs" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.text,
    fontWeight: '600',
    fontFamily: FONT.heading,
  },
});
