import React, { useCallback, useEffect, useState } from "react";
import { PaymentCard } from "@/components/cards/payment";
import { useTheme } from "@/theme/themeProvider";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button } from "@/components/atoms/button/button";
import { TextField } from "@/components/atoms/textField/textField";
import axios from "axios";
import { BASE_URL } from "@/utils/apiHost";
import { usePreferenceContext } from "@/store/currencyContext";
import { useFocusEffect } from "expo-router";

export default function SpendingHistory() {
  const { theme } = useTheme();
  const {currency } = usePreferenceContext();
  const [payments, setPayments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    label: "",
    amount: "",
  });

  const styles = StyleSheet.create({
    container: {
      gap: theme?.gaps.form,
    },
    pageContainer: {
      flex: 1,
    },
    fab: {
      position: "absolute",
      bottom: 25,
      right: 25,
      backgroundColor: theme?.colors.primary || "#007bff",
      borderRadius: 50,
      width: 60,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 5,
    },
    fabText: {
      color: "#fff",
      fontSize: 32,
      fontWeight: "bold",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: theme?.colors.neutral2,
      marginHorizontal: 20,
      borderRadius: 12,
      padding: 20,
      gap: 10,
    },
    addButton: {
      backgroundColor: theme?.colors.primary || "#007bff",
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
    },
    addButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });

 const handleAddPayment = async () => {
   if (!newPayment.label || !newPayment.amount) {
     Alert.alert("Error", "Please fill all fields");
     return;
   }
   await axios.post(`${BASE_URL}/api/v1/payment/add`, {
       category: 1, 
       label: newPayment.label,
       amount: parseFloat(newPayment.amount),
       currency:currency
   });
   setShowModal(false);
   fetchPayments();
 };
  
  const fetchPayments = () => {
    axios
      .get(`${BASE_URL}/api/v1/payment/all`)
      .then((res) => {
        console.log(res.data.data)
          const formattedPayments = res.data.data.map((p: any) => ({
            label: p.Label,
            amount: p.Amount,
            date: new Date(p.Datetime).toLocaleDateString(),
            time: new Date(p.Datetime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            color: "#00bcd4", 
          }));
          setPayments(formattedPayments);
      })
      .catch((err) => {
        console.error("Fetch payments error:", err);
        Alert.alert("Error", "Unable to fetch payments from server");
      });
  };

  
  useFocusEffect(useCallback(() => {
     fetchPayments();
   }, []));
  
  
  return (
    <View style={{height:"100%"}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.pageContainer}>
          <View style={styles.container}>
            {payments.map((p, i) => (
              <PaymentCard
                key={i}
                label={p.label}
                amount={p.amount}
                date={p.date}
                time={p.time}
                color={p.color}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal for Adding Payment */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 8,
                color: theme?.colors.text,
              }}
            >
              Add New Payment
            </Text>
            <TextField
              placeholder="Label (e.g., Groceries)"
              value={newPayment.label}
              onChangeText={(text) =>
                setNewPayment((prev) => ({ ...prev, label: text }))
              }
            />
            <TextField
              placeholder="Amount"
              keyboardType="numeric"
              value={newPayment.amount}
              onChangeText={(text) =>
                setNewPayment((prev) => ({ ...prev, amount: text }))
              }
            />
            <Button title={"Add Payment"} onPress={handleAddPayment} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export { SpendingHistory };
