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
}: {
  control: Control<FormFields, any, FormFields>;
  errors: FieldErrors<FormFields>;
  trigger: UseFormTrigger<FormFields>;
  setCurrentSection: React.Dispatch<React.SetStateAction<number>>;
  getFieldState: UseFormGetFieldState<FormFields>;
}) => {
  const [loading, setLoading] = useState(false);

  const [valid, setValid] = useState({
    firstName: true,
    lastName: true,
    email: true,
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
  });

  const { theme } = useTheme();

  const styles = StyleSheet.create({
    oldUser: {
      color: theme?.colors.text,
      textDecorationLine: "underline",
      textAlign: "center",
      alignSelf: "center",
    },
  });

  const validateField = async (field: keyof typeof valid) => {
    const result = await trigger(field);
    setValid((prev) => ({ ...prev, [field]: result }));
  };

  const onSubmit = async () => {
    setLoading(true);
    const isValid = await trigger(["firstName", "lastName", "email"]);

    setValid({
      firstName: errors.firstName == null,
      lastName: errors.lastName == null,
      email: errors.email == null,
    });

    if (!isValid) {
      if (errors.firstName) {
        FormErrorHandler("First Name", errors.firstName.type);
      } else if (errors.lastName) {
        FormErrorHandler("Last Name", errors.lastName.type);
      } else if (errors.email) {
        FormErrorHandler("Email", errors.email.type);
      }
      setLoading(false);
      return;
    }

    setCurrentSection(1);
  };

  return (
    <>
      <Label error={!valid.firstName && touched.firstName} required>
        First Name
      </Label>
      <Controller
        control={control}
        name="firstName"
        rules={{
          required: true,
          pattern: /^[A-Z]+$/gi,
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            value={value}
            error={!valid.firstName && touched.firstName}
            onFocus={() => setTouched((prev) => ({ ...prev, firstName: true }))}
            onChangeText={async (v) => {
              onChange(v.trim());
              await validateField("firstName");
            }}
          />
        )}
      />

      <Label error={!valid.lastName && touched.lastName} required>
        Last Name
      </Label>
      <Controller
        control={control}
        name="lastName"
        rules={{
          required: true,
          pattern: /^[A-Z]+$/gi,
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            value={value}
            error={!valid.lastName && touched.lastName}
            onFocus={() => setTouched((prev) => ({ ...prev, lastName: true }))}
            onChangeText={async (v) => {
              onChange(v.trim());
              await validateField("lastName");
            }}
          />
        )}
      />

      <Label error={!valid.email && touched.email} required>
        Email
      </Label>
      <Controller
        control={control}
        name="email"
        rules={{
          required: true,
          pattern: {
            value:
              /^(?!.*\.\@)(?!\.)([a-zA-Z0-9_+-]+(?:\.[a-zA-Z0-9_+-]+)*)@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
            message: "Email is Invalid",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            value={value}
            error={!valid.email && touched.email}
            onFocus={() => setTouched((prev) => ({ ...prev, email: true }))}
            onChangeText={async (v) => {
              onChange(v.trim());
              await validateField("email");
            }}
          />
        )}
      />

      <Button
        disabled={!valid.firstName || !valid.lastName || !valid.email}
        loading={loading}
        onPress={onSubmit}
        title="Next"
      />

      <Link href="/login" style={styles.oldUser}>
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

export { Section1, section1Defaults, section1Fields };
