import { useTheme } from "@/theme/themeProvider";
import { BASE_URL } from "@/utils/apiHost";
import { ounceToGram } from "@/utils/weightConvertor";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import axios from "axios";
import getSymbolFromCurrency from "currency-symbol-map";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Card } from "../../atoms/card/card";
import { LiveIcon } from "../../atoms/liveIcon/liveIcon";
import { Loader } from "../../atoms/loader";
import ClampText from "../../textClamper";

type TrackingCardProps = {
  metal: string;
  imgUrl: string;
  unitMeasure: string; // "gram" or "ounce"
  isModal?: boolean;
  height?: number;
  barColor?: string;
  onPress?: any;
  setHolding?: React.Dispatch<React.SetStateAction<number>>;
};

const TrackingCard = (props: TrackingCardProps) => {
  const { theme } = useTheme();

  const [tracking, setTracking] = useState({
    price: -1,
    holdings: -1,
    name: "",
  });

  const [convertedPrice, setConvertedPrice] = useState(-1);
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [weightMultiplier, setWeightMultiplier] = useState(
    props.unitMeasure === "gram" ? ounceToGram(1) : 1
  );

  const currencyStore = useAsyncStorage("currency");
  const weightMeasureStore = useAsyncStorage("weightMeasure");

  const fetchMetalPrice = async () => {
    setLoading(true);
    let multiplier = props.unitMeasure === "gram" ? ounceToGram(1) : 1;

    if (props.unitMeasure !== "coin") {
      const storedWeight = await weightMeasureStore.getItem();
      multiplier = storedWeight === "gram" ? ounceToGram(1) : 1;
      setWeightMultiplier(multiplier);
    }

    try {
      const res = await axios.get(
        `${BASE_URL}/api/v1/${
          props.unitMeasure == "coin" ? "coin" : "metal"
        }/price/${props.metal}`
      );

      const metalPrice = res.data?.price?.price || -1;
      const metalName = res.data?.price?.name || "";
      const holdings = res.data?.holding >= 0 ? res.data?.holding : -1;

      setTracking({
        price: metalPrice / multiplier,
        holdings: holdings * multiplier,
        name: metalName,
      });

      console.log(metalPrice);
    } catch (err) {
      console.error("Error fetching metal price:", err);
    } finally {
      setLoading(false);
    }
  };

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

        const rate = res.data?.data?.rate || 1;
        setConvertedPrice(tracking.price * rate);
        setCurrencySymbol(getSymbolFromCurrency(currencyCode) || "$");
      } catch (err) {
        console.error("Currency conversion error:", err);
      }
    })();
  }, [tracking.price]);

  useEffect(() => {
    if (props.setHolding != null) props.setHolding(tracking.holdings);
  }, [tracking.holdings]);

  const content = `${currencySymbol}${convertedPrice.toFixed(2)}/${
    props.unitMeasure
  }`;
  const displayText = props.isModal
    ? content
    : ClampText(content, props.isModal ? 8 : 14);

  const TOP_RIGHT_ICON_SIZE = props.isModal ? 32 : 24;
  const INFO_ICON_SIZE = props.isModal ? 24 : 16;

  const styles = StyleSheet.create({
    cardContainer: {
      margin: 0,
      display: "flex",
      flexDirection: props.isModal ? "column" : "row",
      height: props.height || "auto",
      gap: props.isModal ? theme?.gaps.form : 0,
    },
    infoContainer: {
      flexDirection: props.isModal ? "column" : "row",
      gap: theme?.gaps.form,
      alignItems: props.isModal ? "flex-start" : "center",
      justifyContent: "flex-start",
    },
    iconsContainer: {
      flexDirection: props.isModal ? "column" : "row",
      alignItems: "flex-start",
      justifyContent: !props.isModal ? "space-between" : "center",
      gap: theme?.gaps.form,
      width: !props.isModal ? 160 : "auto",
    },
    icon: {
      justifyContent: "center",
      alignItems: "center",
    },
    fieldBox: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      gap: theme?.gaps.info,
    },
    loaderBox: {
      alignItems: "center",
      justifyContent: "center",
      margin: 30,
    },
    trackingName: {
      color: theme?.colors.text,
      fontWeight: "bold",
      width: 100,
      fontSize: props.isModal ? theme?.text.section.heading.fontSize : 18,
    },
    topIconContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    infoText: {
      color: theme?.colors.text,
      fontWeight: "bold",
      fontSize: props.isModal ? 18 : 18,
    },
    topRightIcons: {
      flexDirection: "row",
      gap: 12,
    },
    topBar: {
      height: 5,
      backgroundColor: props.barColor,
      borderRadius: theme?.border.radius,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  });

  return (
    <Pressable style={{width:'100%'}} onPress={props.onPress}>
      <View style={styles.topBar}></View>
      <Card
        containerStyle={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          backgroundColor: props.isModal?theme?.colors.neutral2:theme?.colors.secondary,
        }}
      >
        <View style={styles.cardContainer}>
          <View style={styles.topIconContainer}>
            <Image
              source={{ uri: props.imgUrl }}
              height={props.isModal ? 50 : 25}
              width={props.isModal ? 50 : 25}
              style={{
                objectFit: "contain",
                alignSelf: "center",
                marginRight: 3,
              }}
            />
            {props.isModal && (
              <View style={styles.topRightIcons}>
                <Ionicons
                  size={TOP_RIGHT_ICON_SIZE}
                  color={theme?.colors.text}
                  name="reload-circle"
                  onPress={fetchMetalPrice}
                />
              </View>
            )}
          </View>

          <Text style={styles.trackingName}>{tracking.name}</Text>
          <View style={styles.infoContainer}>
            {!loading ? (
              <View style={styles.iconsContainer}>
                {/* Live Price */}
                <View style={styles.fieldBox}>
                  <LiveIcon size={INFO_ICON_SIZE} />
                  <Text style={styles.infoText}>{displayText}</Text>
                </View>

                {props.isModal && (
                  <>
                    {/* Total Value */}
                    <View style={styles.fieldBox}>
                      <View style={styles.icon}>
                        <MaterialIcons
                          color={theme?.colors.text}
                          size={INFO_ICON_SIZE}
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
                          color={theme?.colors.text}
                          size={INFO_ICON_SIZE}
                          name="bag"
                        />
                      </View>
                      <Text style={styles.infoText}>
                        {`${tracking.holdings.toFixed(2)} ${
                          props.unitMeasure
                        }s`}
                      </Text>
                    </View>
                  </>
                )}
                {!props.isModal && (
                  <View style={styles.topRightIcons}>
                    <Ionicons
                      size={TOP_RIGHT_ICON_SIZE}
                      color={theme?.colors.text}
                      name="reload-circle"
                      onPress={fetchMetalPrice}
                    />
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.loaderBox}>
                <Loader />
              </View>
            )}
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

export { TrackingCard };
