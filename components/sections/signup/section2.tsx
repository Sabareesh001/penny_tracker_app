import { Button } from "@/components/atoms/button/button";
import { Label } from "@/components/atoms/label/label";
import Select from "@/components/atoms/select/select";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Control, Controller } from "react-hook-form";
import { FormFields } from "./types";
import axios from "axios";
import { BASE_URL } from "@/app/utils/apiHost";
import { StyledSlider } from "@/components/atoms/slider/slider";

type section2Fields = {
  age: number;
  gender: null;
  country: null;
  occupation: null;
};

const Section2 = ({
  control,
}: {
  control: Control<FormFields, any, FormFields>;
}) => {
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderItems, setGenderItems] = useState([]);

  const [countryOpen, setCountryOpen] = useState(false);
  const [countryItems, setCountryItems] = useState([]);

  const [occupationOpen, setOccupationOpen] = useState(false);
  const [occupationItems, setOccupationItems] = useState([]);

  useEffect(() => {
    if (!genderOpen) return;
    setCountryOpen(false);
    setOccupationOpen(false);
    if (genderItems.length) return;
    fetchGenders();
  }, [genderOpen]);
  useEffect(() => {
    if (!countryOpen) return;
    setGenderOpen(false);
    setOccupationOpen(false);
    if (countryItems.length) return;
    fetchCountries();
  }, [countryOpen]);
  useEffect(() => {
    if (!occupationOpen) return;
    setGenderOpen(false);
    setCountryOpen(false);
    if (occupationItems.length) return;
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
              onValueChange={(age) => {
                onChange(Math.floor(age));
              }}
              style={{ height: 20 }}
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
            setValue={onChange}
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
            setValue={onChange}
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
            setValue={onChange}
            value={value}
            items={occupationItems}
          />
        )}
        name="occupation"
      />
      <Button inverted title={"Back"} onPress={() => {}} />
      <Button
        onPress={() => {
          router.push("/signup/2");
        }}
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
