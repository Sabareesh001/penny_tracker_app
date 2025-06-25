import { BASE_URL } from "@/app/utils/apiHost";
import { Button } from "@/components/atoms/button/button";
import { SectionHeading } from "@/components/atoms/heading/heading";
import { Label } from "@/components/atoms/label/label";
import { TextField } from "@/components/atoms/textField/textField";
import { FormErrorHandler } from "@/components/handlers/error";
import { SomethingWentWrong } from "@/components/toasts/toasts";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

const Section3 = ({email}:{email:string}) => {
  const [valid, setValid] = useState([true, true]);
  const [loading,setLoading] = useState(false);
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

  const getValidation = async(target:"newPassword" | "confirmNewPassword") => {
     
    const valid = await trigger(['newPassword','confirmNewPassword']);
  
    const targetIndices = {
        "newPassword":0,
        "confirmNewPassword":1
    }
    setValid((prev)=>{
    const newPrev = [...prev];
    newPrev[targetIndices[target]] = errors[target]==null;
    return newPrev;
    })
  };

    useEffect(()=>{
       trigger();
    },[])

  const onSubmit = (data:any) => {
    setLoading(true);
    axios.put(`${BASE_URL}/api/v1/user/forgot/password/change-password`,{email,newPassword:data?.newPassword}).then((res)=>{
        console.log(res.data)
        if(res?.data?.message){
            Toast.show({
                type:'error',
                text1:res.data.message
            })
        }
        else{
            SomethingWentWrong();
        }
    }).catch((err)=>{
        if(err?.response?.data?.error){
             Toast.show({
                type:'error',
                text1:err.response.data.error
             })
        }
        else{
            SomethingWentWrong();
        }
    }).finally(()=>{
        setLoading(false);
    })
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
      <Label required error={!valid[0]}>
        New Password
      </Label>
      <Controller
        control={control}
        name="newPassword"
        rules={{
          required: true,
          pattern: /^\S+$/,
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            error={!valid[0]}
            errorNote={!valid[0]}
            note="Password must not contain spaces"
            secureTextEntry
            value={value}
            onChangeText={async (v) => {
              onChange(v.trim());
              await getValidation("newPassword");
            }}
          />
        )}
      />
      <Label required error={!valid[1]}>
        Confirm New Password
      </Label>
      <Controller
        control={control}
        rules={{
          required: true,
          validate: (v) => {
            return getValues("newPassword") === v || "Password Must match";
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            secureTextEntry
            value={value}
            onChangeText={async (v) => {
              onChange(v.trim());
              await getValidation("confirmNewPassword");
            }}
            error={!valid[1]}
            errorNote={!valid[1]}
          />
        )}
        name="confirmNewPassword"
      />
      <Button
        loading={loading}
        disabled={!valid[0] || !valid[1]}
        onPress={handleSubmit(onSubmit, onFailure)}
        title="Reset Password"
      />
    </>
  );
};

export { Section3 };
