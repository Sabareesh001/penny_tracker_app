import { Button } from "@/components/atoms/button/button";
import { Label } from "@/components/atoms/label/label";
import Select from "@/components/atoms/select/select";
import { StyledSlider } from "@/components/atoms/slider/slider";
import { FormErrorHandler } from "@/components/handlers/error";
import { BASE_URL } from "@/utils/apiHost";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetFieldState,
  UseFormTrigger,
  useFormState,
} from "react-hook-form";
import { FormFields } from "./types";
import { StyleSheet } from "react-native";
import { useTheme } from "@/theme/themeProvider";
import { View } from "react-native";

type section2Fields = {
  age: number;
  gender: null;
  country: null;
  occupation: null;
};

const Section2 = ({
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

  const {theme} = useTheme();

  const [genderOpen, setGenderOpen] = useState(false);
  const [genderItems, setGenderItems] = useState([]);

  const [countryOpen, setCountryOpen] = useState(false);
  const [countryItems, setCountryItems] = useState([]);

  const [occupationOpen, setOccupationOpen] = useState(false);
  const [occupationItems, setOccupationItems] = useState([]);

  const [loading, setLoading] = useState(false);

  // Get isValid from react-hook-form instead of managing `valid` state
  const { isValid } = useFormState({ control });

  // Fetch functions
  const fetchGenders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/gender?format=select`);
      if (res.data?.data) setGenderItems(res.data.data);
    } catch (err) {
      FormErrorHandler("Gender list", "fetch_failed");
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/country?format=select`);
      if (res.data?.data) {
        // Pre-map data
        const mapped = res.data.data.map((data: any) => ({
          label: `${data?.unicodeFlag} ${data?.name}`,
          value: `${data?.iso3}-${data?.name}`,
        }));
        setCountryItems(mapped);
      }
    } catch (err) {
      FormErrorHandler("Country list", "fetch_failed");
    }
  };

  const fetchOccupations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/occupation?format=select`);
      if (res.data?.data) setOccupationItems(res.data.data);
    } catch (err) {
      FormErrorHandler("Occupation list", "fetch_failed");
    }
  };

  // Handle dropdown open events
  useEffect(() => {
    if (genderOpen && genderItems.length === 0) {
      setCountryOpen(false);
      setOccupationOpen(false);
      fetchGenders();
    }
  }, [genderOpen]);

  useEffect(() => {
    if (countryOpen && countryItems.length === 0) {
      setGenderOpen(false);
      setOccupationOpen(false);
      fetchCountries();
    }
  }, [countryOpen]);

  useEffect(() => {
    if (occupationOpen && occupationItems.length === 0) {
      setGenderOpen(false);
      setCountryOpen(false);
      fetchOccupations();
    }
  }, [occupationOpen]);

  const onSubmit = async () => {
    setLoading(true);
    const validCreds = await trigger(["age", "gender", "country", "occupation"]);

    if (!validCreds) {
      setLoading(false);
      if (errors?.age) {
        FormErrorHandler("Age", errors?.age?.type);
        setCurrentSection(2);
      } else if (errors?.gender) {
        FormErrorHandler("Gender", errors?.gender?.type);
      } else if (errors?.country) {
        FormErrorHandler("Country", errors?.country?.type);
      } else if (errors?.occupation) {
        FormErrorHandler("Occupation", errors?.occupation?.type);
      }
      return;
    }

    setCurrentSection(2);
    setLoading(false);
  };

  const styles = StyleSheet.create(
     {container:{
      width:'100%',
      gap:theme?.gaps.form
    }}
  )

  return (
    <View style= {styles.container}>
      {/* Age Slider */}
      <Controller
        control={control}
        name="age"
        render={({ field: { onChange, value } }) => (
          <>
            <Label required>Age - {value}</Label>
            <StyledSlider
              min={18}
              max={100}
              onValueChange={async (age) => {
                onChange(Math.floor(age));
                await trigger("age");
              }}
              style={{ height: 20, width: "100%" }}
              value={value}
            />
          </>
        )}
      />

      {/* Gender */}
      <Label required>Gender</Label>
      <Controller
        rules={{ required: true }}
        control={control}
        name="gender"
        render={({ field: { onChange, value } }) => (
          <Select
            placeholder="Select your gender"
            dropDownDirection="TOP"
            open={genderOpen}
            setOpen={setGenderOpen}
            onChangeValue={async (v) => {
              onChange(v);
              await trigger("gender");
            }}
            setValue={onChange}
            value={value}
            items={genderItems}
          />
        )}
      />

      {/* Country */}
      <Label required>Country</Label>
      <Controller
        rules={{ required: true }}
        control={control}
        name="country"
        render={({ field: { onChange, value } }) => (
          <Select
            placeholder="Select your country"
            dropDownDirection="TOP"
            open={countryOpen}
            setOpen={setCountryOpen}
            onChangeValue={async (v) => {
              onChange(v);
              await trigger("country");
            }}
            searchable
            setValue={onChange}
            listMode="FLATLIST"
            flatListProps={{ maxToRenderPerBatch: 10, windowSize: 5 }}
            value={value}
            items={countryItems}
          />
        )}
      />

      {/* Occupation */}
      <Label required>Occupation</Label>
      <Controller
        rules={{ required: true }}
        control={control}
        name="occupation"
        render={({ field: { onChange, value } }) => (
          <Select
            placeholder="Select your occupation"
            dropDownDirection="TOP"
            open={occupationOpen}
            setOpen={setOccupationOpen}
            onChangeValue={async (v) => {
              onChange(v);
              await trigger("occupation");
            }}
            setValue={onChange}
            value={value}
            items={occupationItems}
          />
        )}
      />

      {/* Navigation Buttons */}
      <Button
        title={"Back"}
        onPress={() => {
          setCurrentSection(0);
        }}
        disabled={loading}
      />
      <Button
        disabled={!isValid}
        loading={loading}
        onPress={onSubmit}
        title={"Next"}
      />
    </View>
  );
};

const section2Defaults = {
  age: 18,
  gender: null,
  country: null,
  occupation: null,
};

export { Section2, section2Defaults, section2Fields };
