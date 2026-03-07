import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  View,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { colors } from '../../tokens';

export type SpinnerSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'ring' | 'dots' | 'pulse';

export interface SpinnerProps {
  size?:    SpinnerSize;
  variant?: SpinnerVariant;
  color?:   string;
  style?:   ViewStyle;
}

const sizePx: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

const RingSpinner: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue:         1,
        duration:        800,
        easing:          Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const rotate = spin.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const stroke = Math.max(2, Math.round(size * 0.1));

  return (
    <Animated.View style={{ width: size, height: size, transform: [{ rotate }] }}>
      <View
        style={{
          width:        size,
          height:       size,
          borderRadius: size / 2,
          borderWidth:  stroke,
          borderColor:  `${color}30`,
          borderTopColor: color,
        }}
      />
    </Animated.View>
  );
};

const DotsSpinner: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const dot = Math.max(4, Math.round(size * 0.3));
  const anims = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const makeBounce = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 280, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 280, useNativeDriver: true }),
          Animated.delay(600 - delay),
        ]),
      );
    anims.forEach((a, i) => makeBounce(a, i * 120).start());
  }, []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Math.round(dot * 0.6) }}>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width:           dot,
            height:          dot,
            borderRadius:    dot / 2,
            backgroundColor: color,
            transform:       [{ translateY: anim.interpolate({ inputRange: [0,1], outputRange: [0,-dot] }) }],
          }}
        />
      ))}
    </View>
  );
};

const PulseSpinner: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const scale   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale,   { toValue: 1.5, duration: 700, useNativeDriver: true }),
          Animated.timing(scale,   { toValue: 1,   duration: 700, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.2, duration: 700, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.8, duration: 700, useNativeDriver: true }),
        ]),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        width:           size,
        height:          size,
        borderRadius:    size / 2,
        backgroundColor: color,
        transform:       [{ scale }],
        opacity,
      }}
    />
  );
};

export const Spinner: React.FC<SpinnerProps> = ({
  size    = 'md',
  variant = 'ring',
  color   = colors.violet400,
  style,
}) => {
  const px = sizePx[size];

  return (
    <View
      style={[styles.container, { width: px, height: px }, style]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    >
      {variant === 'ring'  && <RingSpinner  size={px} color={color} />}
      {variant === 'dots'  && <DotsSpinner  size={px} color={color} />}
      {variant === 'pulse' && <PulseSpinner size={px} color={color} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems:     'center',
    justifyContent: 'center',
  },
});
