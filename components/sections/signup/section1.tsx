import { Button } from "@/components/atoms/button/button";
import { Label } from "@/components/atoms/label/label";
import { TextField } from "@/components/atoms/textField/textField";
import { FormErrorHandler } from "@/components/handlers/error";
import { useTheme } from "@/theme/themeProvider";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetFieldState,
  UseFormTrigger,
} from "react-hook-form";
import { StyleSheet } from "react-native";
import { FormFields } from "./types";


type section1Fields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};


const Section1 = ({
  control,
  errors,
  trigger,
  setCurrentSection,
  getFieldState,
}: {
  control: Control<FormFields, any, FormFields>;
  errors: FieldErrors<FormFields>;
  trigger: UseFormTrigger<FormFields>;
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
  getFieldState: UseFormGetFieldState<FormFields>;
}) => {
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState([false, true]);
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    oldUser: {
      color: theme?.colors.text,
      textDecorationLine: "underline",
      textAlign: "center",
    },
  });

  useEffect(()=>{
      getValidation();
  },[])

  const getValidation = async (error?: boolean) => {
    const validCreds = await trigger([
      "firstName",
      "lastName",
      "email",
    ]).finally(() => {
      setLoading(false);
    });
    if (validCreds) {
      setValid([true, true]);
    } else {
      setValid([false, error ? errors.email == null : true]);
    }
    return valid;
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const validate = await getValidation();

    if (!validate) {
      if (errors.firstName) {
        FormErrorHandler("First Name", errors.firstName.type);
      } else if (errors.lastName) {
        FormErrorHandler("Last Name", errors.lastName.type);
      } else if (errors.email) {
        FormErrorHandler("Email", errors.email.type);
        console.log(errors.email);
      }
      return;
    }
    setCurrentSection(1);
  };

  return (
    <>
      <Label required>First Name</Label>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            value={value}
            onChangeText={async (v) => {
              onChange(v);
              await getValidation();
            }}
          />
        )}
        name="firstName"
      />
      <Label required>Last Name</Label>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            value={value}
            onChangeText={async (v) => {
              onChange(v);
              await getValidation();
            }}
          />
        )}
        name="lastName"
      />
      <Label error={!valid[1]} required>
        Email
      </Label>
      <Controller
        rules={{
          required: true,
          pattern: {
            value:
              /^(?!.*\.\@)(?!\.)([a-zA-Z0-9_+-]+(?:\.[a-zA-Z0-9_+-]+)*)@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
            message: "Email is Invalid",
          },
        }}
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextField
            error={!valid[1]}
            value={value}
            onChangeText={async (v) => {
              onChange(v);
              await getValidation(true);
            }}
          />
        )}
        name="email"
      />
      {/* <Label>
                    Phone
                </Label>
                <Controller
                control={control}
                render={({field:{onChange,value}})=>(
                    <TextField value={value} onChange={(e)=>{onChange(e.target)}}  />
                )}
                name="phone"
                /> */}
      <Button
        disabled={!valid[0]}
        loading={loading}
        onPress={onSubmit}
        title={"Next"}
      />
      <Link href={"/login"} style={styles.oldUser}>
        Old User? Log In
      </Link>
    </>
  );
};

const section1Defaults = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};




export {
  Section1,
  section1Defaults,
  section1Fields
};
