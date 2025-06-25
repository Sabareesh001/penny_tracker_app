import { BASE_URL } from "@/app/utils/apiHost";
import { Button } from "@/components/atoms/button/button";
import { Label } from "@/components/atoms/label/label";
import Select from "@/components/atoms/select/select";
import { StyledSlider } from "@/components/atoms/slider/slider";
import { FormErrorHandler } from "@/components/handlers/error";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetFieldState,
  UseFormTrigger,
} from "react-hook-form";
import { FormFields } from "./types";

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
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderItems, setGenderItems] = useState([]);

  const [countryOpen, setCountryOpen] = useState(false);
  const [countryItems, setCountryItems] = useState([]);

  const [occupationOpen, setOccupationOpen] = useState(false);
  const [occupationItems, setOccupationItems] = useState([]);

  const [valid, setValid] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!genderOpen) return;
    setCountryOpen(false);
    setOccupationOpen(false);
    if (genderItems.length!=0) return;
    fetchGenders();
  }, [genderOpen]);
  useEffect(() => {
    if (!countryOpen) return;
    setGenderOpen(false);
    setOccupationOpen(false);
    if (countryItems.length!=0) return;
    fetchCountries();
  }, [countryOpen]);
  useEffect(() => {
    if (!occupationOpen) return;
    setGenderOpen(false);
    setCountryOpen(false);
    if (occupationItems.length!=0) return;
    fetchOccupations();
  }, [occupationOpen]);

  const fetchGenders = () => {
    axios
      .get(`${BASE_URL}/api/v1/gender?format=select`)
      .then((res) => {
        if (res.data?.data) {
          setGenderItems(res.data.data);
        }
      })
      .catch((res) => {
        console.log(res);
      })
      .finally();
  };
  const fetchCountries = () => {
    axios
      .get(`${BASE_URL}/api/v1/country?format=select`)
      .then((res) => {
        if (res.data?.data) {
          setCountryItems(res.data.data);
        }
      })
      .catch((res) => {
        console.log(res);
      })
      .finally();
  };
  const fetchOccupations = () => {
    axios
      .get(`${BASE_URL}/api/v1/occupation?format=select`)
      .then((res) => {
        if (res.data?.data) {
          setOccupationItems(res.data.data);
        }
      })
      .catch((res) => {
        console.log(res);
      })
      .finally();
  };

  const getValidation = async (): Promise<boolean> => {
    const validCreds = await trigger([
      "age",
      "gender",
      "country",
      "occupation",
    ]);
    if (!validCreds) {
      setLoading(false);
    }
    else{
      fetchCountries();
      fetchGenders();
      fetchOccupations();
    }
    setValid(validCreds);
    return validCreds;
  };


  const onSubmit = async () => {
    setLoading(true);
    const validCreds = await getValidation();
    if (!validCreds) {
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
  };

  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <Label required>Age - {value}</Label>
            <StyledSlider
              min={18}
              max={100}
              onValueChange={async (age) => {
                onChange(Math.floor(age));
                await getValidation();
              }}
              style={{ height: 20, width: "100%" }}
              value={value}
            />
          </>
        )}
        name="age"
      />
      <Label required>Gender</Label>
      <Controller
        rules={{ required: true }}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            placeholder="Select your gender"
            dropDownDirection="TOP"
            open={genderOpen}
            setOpen={setGenderOpen}
            onChangeValue={async (v) => {
              onChange(v);
              await getValidation();
            }}
            setValue={(v) => {
              onChange(v);
            }}
            value={value}
            items={genderItems}
          />
        )}
        name="gender"
      />
      <Label required>Country</Label>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <Select
            placeholder="Select your country"
            dropDownDirection="TOP"
            open={countryOpen}
            setOpen={setCountryOpen}
            onChangeValue={async (v) => {
              onChange(v);
              await getValidation();
            }}
            setValue={(v) => {
              onChange(v);
            }}
            value={value}
            items={countryItems}
          />
        )}
        name="country"
      />
      <Label required>Occupation</Label>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <Select
            placeholder="Select your occupation"
            dropDownDirection="TOP"
            open={occupationOpen}
            setOpen={setOccupationOpen}
            onChangeValue={async (v) => {
              onChange(v);
              await getValidation();
            }}
            setValue={(v) => {
              onChange(v);
            }}
            value={value}
            items={occupationItems}
          />
        )}
        name="occupation"
      />
      <Button
        inverted
        title={"Back"}
        onPress={() => {
          setCurrentSection(0);
        }}
      />
      <Button
        disabled={!valid}
        loading={loading}
        onPress={onSubmit}
        title={"Next"}
      />
    </>
  );
};

const section2Defaults = {
  age: 18,
  gender: null,
  country: null,
  occupation: null,
};

export { Section2, section2Defaults, section2Fields };
