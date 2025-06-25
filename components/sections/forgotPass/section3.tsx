import { BASE_URL } from "@/app/utils/apiHost";
import { Button } from "@/components/atoms/button/button";
import { SectionHeading } from "@/components/atoms/heading/heading";
import { Label } from "@/components/atoms/label/label";
import { TextField } from "@/components/atoms/textField/textField";
import { FormErrorHandler } from "@/components/handlers/error";
import { SomethingWentWrong } from "@/components/toasts/toasts";
import axios from "axios";
import { navigate } from "expo-router/build/global-state/routing";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

const Section3 = ({ email }: { email: string }) => {
  const [valid, setValid] = useState({
    newPassword: true,
    confirmNewPassword: true,
  });

  const [touched, setTouched] = useState({
    newPassword: false,
    confirmNewPassword: false,
  });

  const [loading, setLoading] = useState(false);

  const {
    control,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const getValidation = async (target?: keyof typeof valid) => {
    const validCred = await trigger(["newPassword", "confirmNewPassword"]);

    setValid((prev) => ({
      newPassword: touched.newPassword
        ? errors.newPassword == null
        : prev.newPassword,
      confirmNewPassword: touched.confirmNewPassword
        ? errors.confirmNewPassword == null
        : prev.confirmNewPassword,
    }));

    return validCred;
  };

  useEffect(() => {
    // Don't trigger on mount
  }, []);

  const onSubmit = (data: any) => {
    setLoading(true);
    axios
      .put(`${BASE_URL}/api/v1/user/forgot/password/change-password`, {
        email,
        newPassword: data?.newPassword,
      })
      .then((res) => {
        if (res?.data?.message) {
          Toast.show({
            type: "success",
            text1: res.data.message,
          });
          navigate('../login')
        } else {
          SomethingWentWrong();
        }
      })
      .catch((err) => {
        if (err?.response?.data?.error) {
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
  };

  const onFailure = () => {
    if (errors.newPassword) {
      FormErrorHandler("New Password", errors.newPassword.type);
    } else {
      FormErrorHandler(
        "Confirm Password",
        errors.confirmNewPassword?.type,
        errors.confirmNewPassword?.message
      );
    }
  };

  return (
    <>
      <SectionHeading>Reset Password</SectionHeading>

      <Label required error={!valid.newPassword}>
        New Password
      </Label>
      <Controller
        control={control}
        name="newPassword"
        rules={{
          required: true,
          pattern: /^\S{14,}$/,
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            error={!valid.newPassword}
            errorNote={!valid.newPassword}
            note="Password must not contain spaces and be at least 14 characters long"
            secureTextEntry
            value={value}
            onFocus={() =>
              setTouched((prev) => ({ ...prev, newPassword: true }))
            }
            onChangeText={async (v) => {
              onChange(v.trim());
              if (touched.newPassword) {
                await getValidation("newPassword");
              }
            }}
          />
        )}
      />

      <Label required error={!valid.confirmNewPassword}>
        Confirm New Password
      </Label>
      <Controller
        control={control}
        name="confirmNewPassword"
        rules={{
          required: true,
          validate: (v) =>
            getValues("newPassword") === v || "Password must match",
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            secureTextEntry
            value={value}
            error={!valid.confirmNewPassword}
            errorNote={!valid.confirmNewPassword}
            onFocus={() =>
              setTouched((prev) => ({
                ...prev,
                confirmNewPassword: true,
              }))
            }
            onChangeText={async (v) => {
              onChange(v.trim());
              if (touched.confirmNewPassword) {
                await getValidation("confirmNewPassword");
              }
            }}
          />
        )}
      />

      <Button
        loading={loading}
        disabled={!valid.newPassword || !valid.confirmNewPassword}
        onPress={handleSubmit(onSubmit, onFailure)}
        title="Reset Password"
      />
    </>
  );
};

export { Section3 };
