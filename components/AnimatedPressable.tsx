import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, ViewStyle, StyleProp } from 'react-native';

interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  scaleValue?: number;
  children: React.ReactNode;
}

export default function AnimatedPressable({
  children,
  style,
  scaleValue = 0.98,
  onPressIn,
  onPressOut,
  ...props
}: AnimatedPressableProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e: any) => {
    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
    onPressOut?.(e);
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} {...props}>
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
