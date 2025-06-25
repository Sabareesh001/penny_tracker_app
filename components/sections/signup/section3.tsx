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
  const [valid, setValid] = useState([true, true, true]);
  const [loading,setLoading] = useState(false);
  const getValidation = async (
    target?: "username" | "password" | "confirmPassword"
  ) => {
    const validCred = await trigger([
      "username",
      "password",
      "confirmPassword",
    ]);
    const targetIndices: Record<string, number> = {
      username: 0,
      password: 1,
      confirmPassword: 2,
    };
    const updateError = (target: string, valid: boolean) => {
      setValid((prev) => {
        const newPrev = [...prev];
        newPrev[targetIndices[target]] = valid;
        return newPrev;
      });
    };
    if (target) {
      updateError(target, errors[target] == null);
    } else {
    }

    return validCred;
  };

  useEffect(() => {
    getValidation();
  }, []);

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
        navigate('../login');
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
      }).finally(()=>{setLoading(false)});
  };

  return (
    <>
      <Label error={!valid[0]} required>
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
        render={({ field: { value, onChange } }) => (
          <>
            <TextField
              note="Username must start with alphabet and should not contain special characters"
              errorNote={!valid[0]}
              autoCapitalize="none"
              error={!valid[0]}
              onChangeText={async (e) => {
                onChange(e.trim());
                await getValidation("username");
              }}
              value={value}
            />
          </>
        )}
        name="username"
      />
      <Label error={!valid[1]} required>
        Password
      </Label>
      <Controller
        rules={{
          required: {
            value: true,
            message: "",
          },
          pattern: {
            value: /^\S*$/gi,
            message: "",
          },
        }}
        control={control}
        render={({ field: { value, onChange } }) => (
          <>
            <TextField
              note="Password must not contain spaces"
              error={!valid[1]}
              secureTextEntry
              onChangeText={async (e) => {
                onChange(e);
                await getValidation("password");
              }}
              value={value}
            />
          </>
        )}
        name="password"
      />
      <Label error={!valid[2]} required>
        Confirm Password
      </Label>
      <Controller
        rules={{
          required: true,
          validate: (v) => v === getFieldValue("password"),
        }}
        control={control}
        render={({ field: { value, onChange } }) => (
          <>
            <TextField
              error={!valid[2]}
              secureTextEntry
              onChangeText={async (e) => {
                onChange(e);
                await getValidation("confirmPassword");
              }}
              value={value}
            />
          </>
        )}
        name="confirmPassword"
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
        disabled={!valid[0] || !valid[1] || !valid[2]}
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
