import { Button } from "@/components/atoms/button/button"
import { SectionHeading } from "@/components/atoms/heading/heading"
import { Label } from "@/components/atoms/label/label"
import { TextField } from "@/components/atoms/textField/textField"
import { FormErrorHandler } from "@/components/handlers/error"
import { useTheme } from "@/theme/themeProvider"
import axios from "axios"
import { Link } from "expo-router"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { KeyboardAvoidingView, StyleSheet, View } from "react-native"
import Toast from "react-native-toast-message"
import { BASE_URL } from "../utils/apiHost"
const Login = ()=>{
  
    const [valid,setValid] = useState(false);
    const [loading,setLoading] = useState(false);
      const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  })
    const onSubmit = (data:any) => {
       setLoading(true)
        axios.post(`${BASE_URL}/api/v1/user/auth/userpass`,data,{timeout:5000,timeoutErrorMessage:"Server is not responding"}).then((res)=>{
           Toast.show({
              type:'success',
              text1:res.data.message
            })
          }).catch((error)=>{
            if(!error.response){
              Toast.show({
                type:'info',
                text1:error.message
              })
              return;
            }
            Toast.show({
              type:'error',
              text1:error.response.data.error
            })
            console.log(error.response.data)
          }).finally(()=>{
            setLoading(false)
          })
          
      }
      
    const handleFormError = ()=>{
          if(errors.username){
            console.log(errors.username)
            FormErrorHandler("User Name",errors.username.type)
          }
          else if(errors.password){
            FormErrorHandler("Password",errors.password.type)
          }
    }
     

    const {setBackground,theme} = useTheme()
    const styles  = StyleSheet.create({
        loginContainer : {
            height:'100%',
            width:'100%',
            justifyContent:'center',
            alignItems:'center',
            padding : theme?.paddings.screen
        },
        loginSection:{
            padding:theme?.border.padding,
            gap:theme?.gaps.form,
            width:'100%',
        },
        assistContainer : {
            gap:theme?.gaps.form,
            alignItems:'center'
        },
        forgotPassword : {
            color:theme?.colors.text,
            textDecorationLine:'underline'
        }
    })
  
    useEffect(()=>{
        if(setBackground){
            setBackground(theme?theme.colors.secondary:"")
        }
    },[theme])

    const getValidation = async()=>{
       const validCred = await trigger(['username','password']);
       if(errors?.username?.type=='maxLength'){
          FormErrorHandler('Username',errors.username.type);
       }

       setValid(validCred);
       
    }
     
    return (
      <View style={styles.loginContainer}>
        <KeyboardAvoidingView behavior="padding" style={styles.loginSection}>
          <SectionHeading>Login</SectionHeading>
          <Label>Username</Label>
          <Controller
            control={control}
            rules={{
              required: true,
              maxLength: 20,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={async (v) => {
                  onChange(v);
                  await getValidation();
                }}
                value={value}
              />
            )}
            name="username"
          />
          <Label>Password</Label>
          <Controller
            control={control}
            rules={{
              required: true,
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                secureTextEntry
                onBlur={onBlur}
                onChangeText={async (v) => {
                  onChange(v);
                  await getValidation();
                }}
                value={value}
              />
            )}
            name="password"
          />

          <Button
            disabled={!valid}
            loading={loading}
            title="Log In"
            onPress={handleSubmit(onSubmit, handleFormError)}
          />
          <View style={styles.assistContainer}>
            <Link href={"/"} style={styles.forgotPassword}>
              Forgot Password
            </Link>
            <Link href={"/signup/0"} style={styles.forgotPassword}>
              New User? Sign Up
            </Link>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
}

export default Login
