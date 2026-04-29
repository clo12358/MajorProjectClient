import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { FlatList, Image, Modal, Pressable, Text, View } from "react-native";

import { useTheme } from "@/context/ThemeContext";
import { Colors } from "../../constants/theme";

//Defines the props
type ProfileImageCardProps = {
  userId: number;
  profileImage: string | null;
  onSelect: (url: string) => void;
};

const AVATAR_SEEDS = [
  "alpha",
  "bravo",
  "charlie",
  "delta",
  "echo",
  "foxtrot",
  "golf",
  "hotel",
  "india",
  "juliet",
  "kilo",
  "lima",
  "mike",
  "november",
  "oscar",
  "papa",
  "quebec",
  "romeo",
  "sierra",
  "tango",
  "uniform",
  "victor",
  "whiskey",
  "xray",
  "yankee",
  "zulu",
  "aurora",
  "bloom",
  "cedar",
  "daisy",
  "ember",
  "fern",
  "grace",
  "hazel",
  "iris",
  "jade",
  "kaia",
  "luna",
  "maple",
  "nova",
];

//Creates an array of avatar image URLs by mapping over the AVATAR_SEEDS array and giving each seed to the Dicebear API
const avatarOptions = AVATAR_SEEDS.map(
  (seed) => `https://api.dicebear.com/9.x/lorelei/png?seed=${seed}&size=200`,
);

export function ProfileImageCard({
  userId,
  profileImage,
  onSelect,
}: ProfileImageCardProps) {
  const { themeName, setTheme } = useTheme();
  const theme = Colors[themeName];
  const [modalVisible, setModalVisible] = useState(false);

  //Saves the selected avatar URL to AsyncStorage
  async function handleSelect(url: string) {
    await AsyncStorage.setItem(`avatar_url_${userId}`, url);
    onSelect(url);
    setModalVisible(false);
  }

  return (
    <View
      className="rounded-3xl border p-5 mb-5 items-center"
      style={{
        backgroundColor: theme.backgroundElement,
        borderColor: theme.backgroundSelected,
      }}
    >
      <Pressable onPress={() => setModalVisible(true)} className="items-center">
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={{
              width: 96,
              height: 96,
              borderRadius: 999,
              marginBottom: 12,
            }}
          />
        ) : (
          <View
            className="h-24 w-24 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: theme.backgroundSelected }}
          >
            <Ionicons
              name="person-outline"
              size={38}
              color={theme.textSecondary}
            />
          </View>
        )}
        <View
          className="rounded-full px-4 py-2"
          style={{ backgroundColor: theme.primary }}
        >
          <Text style={{ color: theme.text, fontWeight: "600" }}>
            Choose Avatar
          </Text>
        </View>
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setModalVisible(false)}
          />
          <View
            style={{
              backgroundColor: theme.backgroundElement,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 36,
              maxHeight: "70%",
            }}
          >
            <View className="items-center mb-4">
              <View
                style={{
                  width: 48,
                  height: 5,
                  borderRadius: 999,
                  backgroundColor: theme.backgroundSelected,
                }}
              />
            </View>

            <Text
              className="text-lg font-semibold mb-4"
              style={{ color: theme.text }}
            >
              Pick your avatar
            </Text>

            <FlatList
              data={avatarOptions}
              numColumns={3}
              keyExtractor={(item) => item}
              columnWrapperStyle={{ gap: 12 }}
              contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
              renderItem={({ item }) => {
                const isSelected = profileImage === item;
                return (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    style={{
                      flex: 1,
                      aspectRatio: 1,
                      borderRadius: 16,
                      overflow: "hidden",
                      borderWidth: isSelected ? 3 : 0,
                      borderColor: isSelected ? theme.primary : "transparent",
                      backgroundColor: theme.backgroundSelected,
                    }}
                  >
                    <Image
                      source={{ uri: item }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
