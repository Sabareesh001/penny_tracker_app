import { Button } from "@/components/atoms/button/button"
import { SectionHeading } from "@/components/atoms/heading/heading"
import { Label } from "@/components/atoms/label/label"
import { TextField } from "@/components/atoms/textField/textField"
import { useTheme } from "@/theme/themeProvider"
import axios, { toFormData } from "axios"
import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { StyleSheet, Text, TextInput, View } from "react-native"
import Toast from "react-native-toast-message"
const Login = ()=>{
  
    const [loading,setLoading] = useState(false);
    const BASE_URL = process.env.EXPO_PUBLIC_API_URL

      const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  })
    const onSubmit = (data:any) => {
       setLoading(true)
       const controller =  new AbortController
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
      
      useEffect(()=>{
      if(!errors.username){
        return
      }
      const name:string = (errors.username?.ref)?errors.username?.ref?.name:""
      console.log(errors.username?.ref)
         Toast.show({
          type:'error',
          text1: `${name[0]?.toUpperCase()}${name.substring(1)}`+"  " + (errors.username?.type=='maxLength'?"max length reached":errors.username?.type)
        })
      },[errors.username])

    useEffect(()=>{
      if(!errors.password || errors.username){
        return
      }
      const name:string = (errors.password?.ref)?errors.password?.ref?.name:""
      console.log(errors.password?.ref)
         Toast.show({
          type:'error',
          text1: `${name[0]?.toUpperCase()}${name.substring(1)}`+"  "+ errors.password?.type
         })
    },[errors.password])

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
     
    return(
        <View style={styles.loginContainer}>
            <View style={styles.loginSection}>
            <SectionHeading>Login</SectionHeading>
            <Label>Username</Label>
                <Controller
        control={control}
        rules={{
          required: true,
          maxLength:20,
          
        }}
        
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="username"
      />
            <Label>Password</Label>
                  <Controller
        control={control}
        rules={{
          required:true,
          maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="password"
      />
      
            <Button loading={loading}  title="Log In" onPress={handleSubmit(onSubmit)} />
            <View style={styles.assistContainer}  >
            <Text style={styles.forgotPassword} >Forgot Password</Text>
            <Text  style={styles.forgotPassword}>New User? Sign Up</Text>
            </View>
            </View>
        </View>
    )
}

export default Login
