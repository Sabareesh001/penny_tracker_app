import { SectionHeading } from "@/components/atoms/heading/heading";
import { FloatingActionButton } from "@/components/floatingActionButton";
import { TrackingCard } from "@/components/trackingCard";
import { useTheme } from "@/theme/themeProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BASE_URL } from "@/utils/apiHost";
import { Loader } from "@/components/atoms/loader/loader";

// ----------------------
// Exported Types
// ----------------------
export type ResourceData = {
  Id: number;
  Name: string;
  Image: string;
  Symbol: string;
  Status: string; // "0" means inactive, "1" means active
};

export type ApiResponse<T> = {
  message: string;
  data: T[];
};

export type CardItem = {
  imgUrl: string;
  metal: string;
};

export type SectionData = {
  title: string;
  unitMeasure: string;
  data: CardItem[];
};

export default function Dashboard() {
  const { theme } = useTheme();
  const weightMeasureStore = useAsyncStorage("weightMeasure");
  const [weightMeasure, setWeightMeasure] = useState("ounce");
  const [metals, setMetals] = useState<ResourceData[]>([]);
  const [coins, setCoins] = useState<ResourceData[]>([]);
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get("window").width;
  const cardSpacing = theme?.gaps?.form || 16;
  const numColumns = 2;
  const cardWidth = (screenWidth - cardSpacing * (numColumns + 2)) / numColumns;

  const styles = StyleSheet.create({
    container: {
      padding: cardSpacing,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme?.colors?.text,
    },
    cardWrapper: {
      width: cardWidth,
    },
    cardsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: 20,
      gap: theme?.gaps.form,
    },
    loaderView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  // Load saved weight measure
  useEffect(() => {
    (async () => {
      const savedMeasure = await weightMeasureStore.getItem();
      setWeightMeasure(savedMeasure || "ounce");
    })();
  }, [weightMeasureStore]);

  // Fetch metals and coins from backend
  useFocusEffect(
  useCallback(() => {
    const fetchResources = async () => {
      try {
        const [metalsRes, coinsRes] = await Promise.all([
          axios.get<ApiResponse<ResourceData>>(`${BASE_URL}/api/v1/metal`),
          axios.get<ApiResponse<ResourceData>>(`${BASE_URL}/api/v1/coin`),
        ]);

        setMetals(metalsRes.data.data);
        setCoins(coinsRes.data.data);
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [])
);

  // Build sections
  const sections: SectionData[] = [
    {
      title: "Metals",
      unitMeasure: weightMeasure,
      data: metals
        .map((m) => {
          if (m.Status === "0") return null;
          return {
            imgUrl: m.Image,
            metal: m.Symbol,
          };
        })
        .filter((x): x is CardItem => Boolean(x)),
    },
    {
      title: "Coins",
      unitMeasure: "coin",
      data: coins
        .map((m) => {
          if (m.Status === "0") return null;
          return {
            imgUrl: m.Image,
            metal: m.Symbol,
          };
        })
        .filter((x): x is CardItem => Boolean(x)),
    },
  ];

  if (loading)
    return (
      <View style={styles.loaderView}>
        <Loader color={theme?.colors.primary} />
      </View>
    );

  return (
    <>
      <FlatList
        data={sections}
        keyExtractor={(section) => section.title}
        renderItem={({ item: section }) =>
  section.data.length > 0 ? (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.cardsContainer}>
        {section.data.map((item) => {
          const CurrentCard = ({ isModal }: { isModal?: boolean }) => (
            <TrackingCard
              height={200}
              imgUrl={item.imgUrl}
              metal={item.metal}
              unitMeasure={section.unitMeasure}
              isModal={isModal}
            />
          );

          return (
            <Pressable
              key={item.metal}
              onPress={() =>
                router.push({
                  pathname: "/userpanel/dashboard/trackingDetails",
                  params: {
                    imgUrl: item.imgUrl,
                    metal: item.metal,
                    unitMeasure: section.unitMeasure,
                  },
                })
              }
            >
              <View style={styles.cardWrapper}>
                <CurrentCard />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  ) : null
}
      />
      <FloatingActionButton
        onPress={() => {
          router.push({ pathname: "/userpanel/dashboard/addTracking" });
        }}
        placement="right"
        size="large"
        icon={
          <Ionicons name="pencil" size={24} color={theme?.colors.primary} />
        }
      />
    </>
  );
}
