import { BASE_URL } from "@/app/utils/apiHost";
import { Button } from "@/components/atoms/button/button";
import { SectionHeading } from "@/components/atoms/heading/heading";
import { Label } from "@/components/atoms/label/label";
import { TextField } from "@/components/atoms/textField/textField";
import { FormErrorHandler } from "@/components/handlers/error";
import { SomethingWentWrong } from "@/components/toasts/toasts";
import { useTheme } from "@/theme/themeProvider";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

const Section1 = ({
  setEmail,
  setCurrentSection,
}: {
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { theme } = useTheme();

  const [valid, setValid] = useState(true);

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  useEffect(()=>{
     trigger();
  },[])

  const getValidation = async()=>{
      const valid = await trigger();
      setValid(valid);
  }

  const onSumbit = (data: any) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/api/v1/user/forgot/password/email/requestOtp`, data)
      .then((res) => {
        Toast.show({
          type: "success",
          text1: res.data.message,
        });
        setEmail(data?.email || "");
        setCurrentSection(1);
      })
      .catch((err) => {
        if (err.response) {
          Toast.show({
            type: "error",
            text1: err.response.data.error,
          });
        } else {
          SomethingWentWrong();
        }
      })
      .finally(() => {
        setLoading(false);
      });
    console.log(data);
  };

  const onFailure = () => {
    FormErrorHandler("Email", errors.email?.type);
  };

  const styles = StyleSheet.create({
    fieldBox: {
      gap: theme?.gaps.form,
    },
  });

  return (
    <>
      <SectionHeading>Forgot Password</SectionHeading>
      <View style={styles.fieldBox}>
        <Label error={!valid} required>
          Email
        </Label>
        <Controller
          control={control}
          name="email"
          rules={{
            required: true,
            pattern: /^\S+@([A-Z])+\.[A-Z]+$/gi,
          }}
          render={({ field: { onChange, value } }) => (
            <TextField error={!valid} value={value} onChangeText={(v)=>{onChange(v);}} />
          )}
        />
      </View>
      <Button
        disabled={!valid}
        loading={loading}
        onPress={handleSubmit(onSumbit, onFailure)}
        title="Request OTP"
      />
    </>
  );
};

type Section1Types = {
  email: string;
};

export { Section1 };
