import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Landing from '../screens/Landing';
import Onboarding from '../screens/Onboarding';
import Home from '../screens/Home';
import Plan from '../screens/Plan';
import Library from '../screens/Library';
import Learn from '../screens/Learn';
import FormCoach from '../screens/FormCoach';
import WorkoutSession from '../screens/WorkoutSession';
import WorkoutComplete from '../screens/WorkoutComplete';
import Achievements from '../screens/Achievements';
import Credits from '../screens/Credits';
import { STORAGE_KEYS } from '../data/storage';
import { COLORS, FONT } from '../theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon = ({ icon, focused }: { icon: string; focused: boolean }) => (
  <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
);

function Tabs() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 10);
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.borderLight,
          paddingTop: 10,
          paddingBottom: bottomPadding,
          height: 70 + bottomPadding,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontFamily: FONT.body,
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="Plan" 
        component={Plan}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="📋" focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="Library" 
        component={Library}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="📚" focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="Learn" 
        component={Learn}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🧠" focused={focused} />,
        }}
      />
      <Tab.Screen 
        name="Coach" 
        component={FormCoach}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon icon="🎯" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <Text style={styles.loadingText}>PINNACLE</Text>
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
        {!hasProfile && <Stack.Screen name="Landing" component={Landing} />}
        {!hasProfile && <Stack.Screen name="Onboarding" component={Onboarding} />}
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="WorkoutSession" component={WorkoutSession} />
        <Stack.Screen name="WorkoutComplete" component={WorkoutComplete} />
        <Stack.Screen name="Achievements" component={Achievements} />
        <Stack.Screen name="Credits" component={Credits} />
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
    color: '#000000',
    fontSize: 42,
    fontWeight: '900',
    fontFamily: FONT.heading,
    letterSpacing: 10,
  },
});
