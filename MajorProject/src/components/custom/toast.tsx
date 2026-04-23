import { useTheme } from "@/context/ThemeContext";
import { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";
import { Colors } from "../../constants/theme";

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export function Toast({
  message,
  visible,
  onHide,
  duration = 2500,
}: ToastProps) {
  const { themeName, setTheme } = useTheme();
  const theme = Colors[themeName];
  const opacity = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (visible) {
      opacity.setValue(0);

      animationRef.current = Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]);

      animationRef.current.start(({ finished }) => {
        if (finished) onHide();
      });
    }

    return () => {
      animationRef.current?.stop();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        opacity,
        position: "absolute",
        bottom: 40,
        alignSelf: "center",
        backgroundColor: theme.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      <Text
        style={{ color: theme.background, fontWeight: "600", fontSize: 14 }}
      >
        {message}
      </Text>
    </Animated.View>
  );
}
