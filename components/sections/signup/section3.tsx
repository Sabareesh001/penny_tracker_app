import { Button } from "@/components/atoms/button/button";
import { Label } from "@/components/atoms/label/label";
import { TextField } from "@/components/atoms/textField/textField";
import { navigate } from "expo-router/build/global-state/routing";
import { Control, Controller } from "react-hook-form";
import { FormFields } from "./types";

type section3Fields = {
  username: string;
  password: string;
  confirmPassword: string;
};

const Section3 = ({
  control,
}: {
  control: Control<FormFields, any, FormFields>;
}) => {
  return (
    <>
      <Label required>Username</Label>
      <Controller
        control={control}
        render={({ field: { value, onChange } }) => (
          <>
            <TextField
              onChange={(e) => {
                onChange(e.target);
              }}
              value={value}
            />
          </>
        )}
        name="username"
      />
      <Label required>Password</Label>
      <Controller
        control={control}
        render={({ field: { value, onChange } }) => (
          <>
            <TextField
              secureTextEntry
              onChange={(e) => {
                onChange(e.target);
              }}
              value={value}
            />
          </>
        )}
        name="password"
      />
      <Label required>Confim Password</Label>
      <Controller
        control={control}
        render={({ field: { value, onChange } }) => (
          <>
            <TextField
              secureTextEntry
              onChange={(e) => {
                onChange(e.target);
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
          navigate("/signup/1");
        }}
      />
      <Button onPress={() => {}} title={"Submit"} />
    </>
  );
};

const section3Defaults = {
  username: "",
  password: "",
  confirmPassword: "",
};

export { Section3, section3Defaults, section3Fields };
