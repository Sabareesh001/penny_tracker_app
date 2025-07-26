import { useTheme } from "@/theme/themeProvider";
import { BASE_URL } from "@/utils/apiHost";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import axios from "axios";
import getSymbolFromCurrency from "currency-symbol-map";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Card } from "../atoms/card/card";
import { LiveIcon } from "../atoms/liveIcon/liveIcon";
import { Loader } from "../atoms/loader/loader";

type TrackingCardProps = {
  metal: string;
  imgUrl: string;
  unitMeasure: string; // "gram" or "ounce"
};

const TrackingCard = (props: TrackingCardProps) => {
  const { theme } = useTheme();

  const [tracking, setTracking] = useState({
    price: -1,
    holdings: 0,
    name: "",
  });

  const [convertedPrice, setConvertedPrice] = useState(-1);
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [loading,setLoading] = useState(false);
  const [weightMultiplier, setWeightMultiplier] = useState(
    props.unitMeasure === "gram" ? 28.35 : 1
  );

  const currencyStore = useAsyncStorage("currency");
  const weightMeasureStore = useAsyncStorage("weightMeasure");

  const fetchMetalPrice = async () => {
      setLoading(true)
      let multiplier = props.unitMeasure === "gram" ? 28.35 : 1;

      if (props.unitMeasure !== "coin") {
        const storedWeight = await weightMeasureStore.getItem();
        multiplier = storedWeight === "gram" ? 28.35 : 1;
        setWeightMultiplier(multiplier);
      }

      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/metal/price/${props.metal}`
        );

        const metalPrice = res.data?.price?.price || -1;
        const metalName = res.data?.price?.name || "";
        const holdings = res.data?.holding || 0;

        setTracking({
          price: metalPrice / multiplier,
          holdings: holdings * multiplier,
          name: metalName,
        });

        console.log(metalPrice)

      } catch (err) {
        console.error("Error fetching metal price:", err);
      }
      finally{
        setLoading(false)
      }
    }

  // Fetch weight unit and metal price
  useEffect(() => {
     fetchMetalPrice();
  }, [props.metal, props.unitMeasure]);

  // Fetch currency and convert
  useEffect(() => {
    (async () => {
      if (tracking.price <= 0) return;

      const currencyRaw = (await currencyStore.getItem()) || "";
      const currencyCode = currencyRaw.split("-")[0];

      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/currency/convert?from=USD&to=${currencyCode}`
        );

        const rate = res.data?.data?.rate?.rate || 1;
        setConvertedPrice(tracking.price * rate);
        setCurrencySymbol(getSymbolFromCurrency(currencyCode) || "$");
      } catch (err) {
        console.error("Currency conversion error:", err);
      }
    })();
  }, [tracking.price,currencyStore]);

  const styles = StyleSheet.create({
    cardContainer: {
      flex: 1,
      gap: theme?.gaps.form,
    },
    infoContainer: {},
    iconsContainer: {
      alignItems: "flex-start",
    },
    icon: {
      margin: 7,
      justifyContent: "center",
      alignItems: "center",
    },
    fieldBox: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    loaderBox: {
      alignItems: "center",
      justifyContent: "center",
      margin: 30,
    },
    trackingName: {
      color: theme?.colors.secondary,
      fontWeight: "bold",
      fontSize: 18,
    },
    topIconContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    infoText: {
      color: theme?.colors.secondary,
    },
  });

  return (
    <Card style={styles.cardContainer}>
      <View style={styles.topIconContainer}>
        <Image
          source={{ uri: props.imgUrl }}
          height={50}
          width={50}
          style={{
            objectFit: "contain",
            alignSelf: "center",
          }}
        />
        <Ionicons
          size={24}
          color={theme?.colors.secondary}
          name="reload-circle"
          onPress={fetchMetalPrice}
        />
      </View>

      <Text style={styles.trackingName}>{tracking.name}</Text>

      <View style={styles.infoContainer}>
        {!loading ? (
          <View style={styles.iconsContainer}>
            {/* Live Price */}
            <View style={styles.fieldBox}>
              <LiveIcon />
              <Text style={styles.infoText}>
                {`${currencySymbol}${convertedPrice.toFixed(2)}/${
                  props.unitMeasure
                }`}
              </Text>
            </View>

            {/* Total Value */}
            <View style={styles.fieldBox}>
              <View style={styles.icon}>
                <MaterialIcons
                  color={theme?.colors.secondary}
                  size={16}
                  name="savings"
                />
              </View>
              <Text style={styles.infoText}>
                {`${currencySymbol}${(
                  convertedPrice * tracking.holdings
                ).toFixed(2)}`}
              </Text>
            </View>

            {/* Holdings */}
            <View style={styles.fieldBox}>
              <View style={styles.icon}>
                <Ionicons
                  color={theme?.colors.secondary}
                  size={16}
                  name="bag"
                />
              </View>
              <Text style={styles.infoText}>
                {`${tracking.holdings.toFixed(2)} ${props.unitMeasure}s`}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.loaderBox}>
            <Loader />
          </View>
        )}
      </View>
    </Card>
  );
};

export { TrackingCard };
