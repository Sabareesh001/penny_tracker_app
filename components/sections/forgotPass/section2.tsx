import { BASE_URL } from "@/app/utils/apiHost";
import { Button } from "@/components/atoms/button/button";
import { Note } from "@/components/atoms/note/note";
import { OtpInputStyled } from "@/components/atoms/otp/otp";
import { SomethingWentWrong } from "@/components/toasts/toasts";
import axios from "axios";
import { useEffect, useState } from "react";
import { Text } from "react-native"
import Toast from "react-native-toast-message";
const Section2 = ({
  email,
  setCurrentSection,
}: {
  email: string,
  setCurrentSection:React.Dispatch<React.SetStateAction<number>>
}) => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [disabled, setDisabled] = useState(true);
  const onSumbit = () => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/api/v1/user/forgot/password/email/validateOtp`, {
        email,
        otp: Number(otp),
      })
      .then((res) => {
        if (res?.data?.message) {
          Toast.show({
            type: "success",
            text1: res.data.message,
          });
          setCurrentSection(2);
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

  useEffect(() => {
    setDisabled(otp.length !== 4);
  }, [otp]);

  return (
    <>
      <Note center>{`Otp has been successfully sent to ${email}`}</Note>
      <OtpInputStyled
        onTextChange={setOtp}
        numberOfDigits={4}
        onFilled={onSumbit}
      />
      <Button
        loading={loading}
        disabled={disabled}
        onPress={onSumbit}
        title="Submit OTP"
      />
      x
    </>
  );
};

export {Section2};