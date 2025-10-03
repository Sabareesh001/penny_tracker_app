import { SectionHeading } from "@/components/atoms/heading/heading";
import { Loader } from "@/components/atoms/loader";
import { FloatingActionButton } from "@/components/floatingActionButton";
import { TrackingCard } from "@/components/cards/tracking";
import { getFullPageLoader } from "@/store/pageContext";
import { useTheme } from "@/theme/themeProvider";
import { BASE_URL } from "@/utils/apiHost";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Text } from "@rneui/themed";
import axios from "axios";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SpendingBalance } from "@/components/cards/spendingBalance";




export default function Dashboard() {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    greetingText : {
        fontWeight:'bold',
        fontSize:16
    },
    container: {
      gap: theme?.gaps.form
    }
  })

  return (
    <View style={styles.container} >
    <Text style={styles.greetingText}>
      Good Morning, Sabareesh
      </Text>
      <SpendingBalance/>
    </View>
  );
}
