import { BASE_URL } from "@/app/utils/apiHost";
import { Button } from "@/components/atoms/button/button";
import { Label } from "@/components/atoms/label/label";
import { TextField } from "@/components/atoms/textField/textField";
import { FormErrorHandler } from "@/components/handlers/error";
import { SomethingWentWrong } from "@/components/toasts/toasts";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormTrigger,
} from "react-hook-form";
import Toast from "react-native-toast-message";
import { FormFields } from "./types";
import { navigate } from "expo-router/build/global-state/routing";

type section3Fields = {
  username: string;
  password: string;
  confirmPassword: string;
};

const Section3 = ({
  control,
  errors,
  trigger,
  handleSubmit,
  setCurrentSection,
  getFieldValue,
}: {
  control: Control<FormFields, any, FormFields>;
  errors: FieldErrors<FormFields>;
  trigger: UseFormTrigger<FormFields>;
  handleSubmit: UseFormHandleSubmit<FormFields>;
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
  getFieldValue: UseFormGetValues<FormFields>;
}) => {
  const [valid, setValid] = useState({
    username: true,
    password: true,
    confirmPassword: true,
  });

  const [touched, setTouched] = useState({
    username: false,
    password: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);

  const getValidation = async (target?: keyof typeof valid) => {
    const validCred = await trigger([
      "username",
      "password",
      "confirmPassword",
    ]);

    setValid((prev) => ({
      username: touched.username ? errors.username == null : prev.username,
      password: touched.password ? errors.password == null : prev.password,
      confirmPassword: touched.confirmPassword
        ? errors.confirmPassword == null
        : prev.confirmPassword,
    }));

    return validCred;
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const validSection = await getValidation();

    if (!validSection) {
      if (errors?.username) {
        FormErrorHandler("Username", errors.username.type);
      } else if (errors?.password) {
        FormErrorHandler("Password", errors.password.type);
      } else if (errors?.confirmPassword) {
        FormErrorHandler(
          "Confirm Password",
          errors.confirmPassword.type,
          "Password Must Match"
        );
      } else {
        FormErrorHandler();
      }
      setLoading(false);
      return;
    }

    axios
      .post(`${BASE_URL}/api/v1/user/register`, data)
      .then((res) => {
        Toast.show({ type: "success", text1: res.data.message });
        navigate("../login");
      })
      .catch((error) => {
        if (error?.response?.data?.error) {
          Toast.show({
            type: "error",
            text1: error.response.data.error,
          });
        } else {
          SomethingWentWrong();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Label error={!valid.username} required>
        Username
      </Label>
      <Controller
        rules={{
          required: true,
          pattern: {
            value: /^[A-Z]+[0-9]*$/gi,
            message: "",
          },
        }}
        control={control}
        name="username"
        render={({ field: { value, onChange } }) => (
          <TextField
            note="Username must start with alphabet and should not contain special characters"
            errorNote={!valid.username}
            autoCapitalize="none"
            error={!valid.username}
            onFocus={() => setTouched((prev) => ({ ...prev, username: true }))}
            onChangeText={async (e) => {
              onChange(e.trim());
              if (touched.username) {
                await getValidation("username");
              }
            }}
            value={value}
          />
        )}
      />

      <Label error={!valid.password} required>
        Password
      </Label>
      <Controller
        rules={{
          required: { value: true, message: "" },
          pattern: {
            value: /^\S{14,}$/gi,
            message: "",
          },
        }}
        control={control}
        name="password"
        render={({ field: { value, onChange } }) => (
          <TextField
            note="Password must not contain spaces and be at least 14 characters long"
            error={!valid.password}
            secureTextEntry
            onFocus={() => setTouched((prev) => ({ ...prev, password: true }))}
            onChangeText={async (e) => {
              onChange(e.trim());
              if (touched.password) {
                await getValidation("password");
              }
            }}
            value={value}
          />
        )}
      />

      <Label error={!valid.confirmPassword} required>
        Confirm Password
      </Label>
      <Controller
        rules={{
          required: true,
          validate: (v) => v === getFieldValue("password"),
        }}
        control={control}
        name="confirmPassword"
        render={({ field: { value, onChange } }) => (
          <TextField
            error={!valid.confirmPassword}
            secureTextEntry
            onFocus={() =>
              setTouched((prev) => ({ ...prev, confirmPassword: true }))
            }
            onChangeText={async (e) => {
              onChange(e);
              if (touched.confirmPassword) {
                await getValidation("confirmPassword");
              }
            }}
            value={value}
          />
        )}
      />

      <Button
        inverted
        title={"Back"}
        onPress={() => {
          setCurrentSection(1);
        }}
      />
      <Button
        loading={loading}
        disabled={!valid.username || !valid.password || !valid.confirmPassword}
        onPress={handleSubmit(onSubmit)}
        title={"Submit"}
      />
    </>
  );
};

const section3Defaults = {
  username: "",
  password: "",
  confirmPassword: "",
};

export { Section3, section3Defaults, section3Fields };
