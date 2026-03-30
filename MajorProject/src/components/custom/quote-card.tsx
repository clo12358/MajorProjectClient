import { ImageBackground, Text, useColorScheme, View } from "react-native";

import { Colors } from "../../constants/theme";

type QuoteCardProps = {
  quote: string;
};

export function QuoteCard({ quote }: QuoteCardProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <ImageBackground
      source={require("../../assets/images/Background_Image3.png")}
      className="rounded-3xl overflow-hidden"
      imageStyle={{ borderRadius: 24 }}
    >
      <View
        style={{
          backgroundColor:
            colorScheme === "dark" ? "rgba(0,0,0,0.35)" : "transparent",
          paddingHorizontal: 20,
          paddingVertical: 24,
        }}
      >
        <Text
          className="text-base text-center italic"
          style={{ color: theme.text }}
        >
          {quote}
        </Text>
      </View>
    </ImageBackground>
  );
}
