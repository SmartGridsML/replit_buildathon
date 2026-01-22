import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

export function useFadeSlideIn(delay: number = 0, duration: number = 400) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return {
    opacity,
    transform: [{ translateY }],
  };
}

export function useStaggeredList(itemCount: number, baseDelay: number = 50) {
  const animations = useRef(
    Array.from({ length: itemCount }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(15),
    }))
  ).current;

  useEffect(() => {
    const anims = animations.map((anim, index) => {
      return Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 300,
          delay: baseDelay * index,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: 300,
          delay: baseDelay * index,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(baseDelay, anims).start();
  }, [itemCount]);

  return animations;
}

export function useCardAnimation(index: number, baseDelay: number = 80) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const delay = baseDelay * index;
    
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        speed: 12,
        bounciness: 6,
      }),
      Animated.spring(scale, {
        toValue: 1,
        delay,
        useNativeDriver: true,
        speed: 12,
        bounciness: 6,
      }),
    ]).start();
  }, []);

  return {
    opacity,
    transform: [{ translateY }, { scale }],
  };
}
