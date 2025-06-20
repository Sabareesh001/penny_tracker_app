import { Button } from "@/components/atoms/button/button"
import { Label } from "@/components/atoms/label/label"
import Select from "@/components/atoms/select/select"
import { StyledSlider } from "@/components/atoms/slider/slider"
import { TextField } from "@/components/atoms/textField/textField"
import axios from "axios"
import { Link, router } from "expo-router"
import { use, useEffect, useState } from "react"
import { Control, Controller, FieldErrors, UseFormGetFieldState, UseFormGetValues, UseFormHandleSubmit, UseFormTrigger } from "react-hook-form"
import { ItemType } from "react-native-dropdown-picker"
import { BASE_URL } from "../utils/apiHost"
import { navigate } from "expo-router/build/global-state/routing"
import { StyleSheet } from "react-native"
import { useTheme } from "@/theme/themeProvider"
import Toast from "react-native-toast-message"
import { FormErrorHandler } from "@/components/handlers/error"


type section1Fields = {
     firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

type section2Fields = {
    age: number;
    gender: null;
    country: null;
    occupation:null;
}

type section3Fields = {
    username :string;
    password:string;
    confirmPassword:string;
} 

type FormFields = section1Fields & section2Fields & section3Fields


const Section1 = ({control,errors,trigger,setCurrentSection,getFieldState}:{control:Control<FormFields, any, FormFields>,errors:FieldErrors<FormFields>,trigger:UseFormTrigger<FormFields>,setCurrentSection:React.Dispatch<React.SetStateAction<number>>,getFieldState:UseFormGetFieldState<FormFields>})=>{
    
    const[loading,setLoading] = useState(false);
    const[valid,setValid] = useState([false,true]);
    const {theme} = useTheme()

    const styles = StyleSheet.create({
        oldUser : {
            color:theme?.colors.text,
            textDecorationLine:'underline',
            textAlign:'center'
        }
    })

    useEffect(()=>{
       console.log(valid)
    },[valid])

    const getValidation = async(error?:boolean)=>{
        const validCreds =  await(trigger(['firstName','lastName','email']).finally(()=>{setLoading(false)}));
        if(validCreds){
            setValid([true,true]);
        }
        else{
            if(valid[0]){
                setValid([false,error?errors.email==null:true])   
            };
        }
        return valid
    };

    const onSubmit = async(data : any)=>{

        setLoading(true);
        const validate = await getValidation();
       
        if(!validate){
            if(errors.firstName){
                FormErrorHandler("First Name",errors.firstName.type)
            }
            else if(errors.lastName){
                FormErrorHandler("Last Name",errors.lastName.type)
            }
            else if(errors.email){
                FormErrorHandler("Email",errors.email.type)
                console.log(errors.email)
            }
            return;
        }
        setCurrentSection(1)
    }


    return(
     <>
                <Label required>
                    First Name
                </Label>
                <Controller
                control={control}
               rules={{
                  required:true
               }}
                render={({field:{onChange,value}})=>(
                    <TextField value={value} onChangeText={async(v)=>{onChange(v); await getValidation();}}  />
                )}
                name="firstName"
                />
                <Label required>
                    Last Name
                </Label>
              <Controller
              control={control}
              rules={{
                required:true
              }}
                render={({field:{onChange,value}})=>(
                    <TextField value={value} onChangeText={async (v)=>{onChange(v); await getValidation();}}  />
                )}
                name="lastName"
                />
                <Label error={!valid[1]} required>
                    Email
                </Label>
                <Controller
                rules={{
                    required:true,
                    pattern:{
                        value:/^(?!.*\.\@)(?!\.)([a-zA-Z0-9_+-]+(?:\.[a-zA-Z0-9_+-]+)*)@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,
                        message:"Email is Invalid"
                    }
                }}
                control={control}
                render={({field:{onChange,value}})=>(
                    <TextField error={!valid[1]} value={value} 
                    onChangeText={
                        async(v)=>{
                            onChange(v); 
                            await getValidation(true);
                    }
                    }  />
                )}
                name="email"
                />
                <Label>
                    Phone
                </Label>
                <Controller
                control={control}
                render={({field:{onChange,value}})=>(
                    <TextField value={value} onChange={(e)=>{onChange(e.target)}}  />
                )}
                name="phone"
                />
                <Button disabled={!valid[0]} loading={loading} onPress={onSubmit} title={"Next"}/>
                <Link href={"/login"} style={styles.oldUser}>Old User? Log In</Link>
                </>
) }

const section1Defaults = {
    "firstName" : "",
    "lastName" : "",
    "email" : "",
    "phone" : ""
}

const Section2 =({control}:{control:Control<FormFields, any, FormFields>})=>{
    
    const [genderOpen,setGenderOpen] = useState(false);
    const [genderItems,setGenderItems] = useState([]);
    
    const [countryOpen,setCountryOpen] = useState(false);
    const [countryItems,setCountryItems] = useState([]);

    const [occupationOpen,setOccupationOpen] = useState(false);
    const [occupationItems,setOccupationItems] = useState([]);

    useEffect(()=>{
        if(!genderOpen) return;
        setCountryOpen(false)
        setOccupationOpen(false)
        if(genderItems.length) return;
        fetchGenders();
    },[genderOpen])
    useEffect(()=>{
        if(!countryOpen) return;
        setGenderOpen(false)
        setOccupationOpen(false)
        if(countryItems.length) return;
        fetchCountries();
    },[countryOpen])
    useEffect(()=>{
        if(!occupationOpen) return;
        setGenderOpen(false)
        setCountryOpen(false)
        if(occupationItems.length) return;
        fetchOccupations();
    },[occupationOpen])



    const fetchGenders = ()=>{
         axios.get(`${BASE_URL}/api/v1/gender?format=select`).then((res)=>{
         if(res.data?.data){
            setGenderItems(res.data.data)
         }         
       }).catch((res)=>{
         console.log(res)
       }).finally()
    }
    const fetchCountries = ()=>{
         axios.get(`${BASE_URL}/api/v1/country?format=select`).then((res)=>{
         if(res.data?.data){
            setCountryItems(res.data.data)
         }         
       }).catch((res)=>{
         console.log(res)
       }).finally()
    }
    const fetchOccupations = ()=>{
         axios.get(`${BASE_URL}/api/v1/occupation?format=select`).then((res)=>{
         if(res.data?.data){
            setOccupationItems(res.data.data)
         }         
       }).catch((res)=>{
         console.log(res)
       }).finally()
    }

    return(
     <>
             <Controller
             control={control}
             render={({field:{onChange,value}})=>(
                <>
                <Label required>
                    Age - {value}
                </Label>
                 <StyledSlider  min={18} max={100} onValueChange={(age)=>{
                   onChange(Math.floor(age))
                 }} style={{height:20}}  value={value}/>
                </>
             )}
             name="age"
             />
                <Label required>
                    Gender
                </Label>
                      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
            <Select placeholder="Select your gender" dropDownDirection="TOP" open={genderOpen} setOpen={setGenderOpen} setValue={onChange} value={value}  items={genderItems} />
        )}
        name="gender"
      />
        <Label required>
                    Country
                </Label>
                      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
            <Select placeholder="Select your country" dropDownDirection="TOP" open={countryOpen} setOpen={setCountryOpen} setValue={onChange} value={value}  items={countryItems} />
        )}
        name="country"
      />
        <Label required>
                    Occupation
                </Label>
                      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
            <Select placeholder="Select your occupation" dropDownDirection="TOP" open={occupationOpen} setOpen={setOccupationOpen} setValue={onChange} value={value}  items={occupationItems} />
        )}
        name="occupation"
      />
       <Button inverted title={"Back" } onPress={()=>{}}  />
          <Button onPress={()=>{router.push('/signup/2')}} title={"Next"}/>
                </>
)}

const section2Defaults = {
    "age" : 18,
    "gender" : null,
    "country" : null,
    "occupation":null
}


const Section3 =({control}:{control:Control<FormFields, any, FormFields>})=>{
    
    

    return(
     <>
     <Label required>
        Username
     </Label>
          <Controller
          control={control}
          render={({field:{value,onChange}})=>(
              <>
            <TextField onChange={(e)=>{onChange(e.target)}}  value={value}/>
            </>
          )}
          name = "username"
          />
     <Label required>
        Password
     </Label>
          <Controller
          control={control}
          render={({field:{value,onChange}})=>(
              <>
            <TextField secureTextEntry onChange={(e)=>{onChange(e.target)}} value={value}/>
            </>
          )}
          name = "password"
          />
     <Label required>
        Confim Password
     </Label>
          <Controller
          control={control}
          render={({field:{value,onChange}})=>(
              <>
            <TextField secureTextEntry onChange={(e)=>{onChange(e.target)}} value={value}/>
            </>
          )}
          name = "confirmPassword"
          />
          <Button inverted title={"Back" } onPress={()=>{navigate('/signup/1')}}  />
          <Button  onPress={()=>{}} title={"Submit"}  />
                </>
)}

const section3Defaults = {
   "username":"",
   "password":"",
   "confirmPassword":""
}


export {Section1,Section2,section1Defaults,section2Defaults,Section3,section3Defaults}