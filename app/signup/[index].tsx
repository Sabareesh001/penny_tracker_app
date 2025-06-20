import { Button } from "@/components/atoms/button/button";
import { SectionHeading } from "@/components/atoms/heading/heading";
import { Label } from "@/components/atoms/label/label";
import { TextField } from "@/components/atoms/textField/textField";
import { useTheme } from "@/theme/themeProvider";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Section1, section1Defaults, Section2, section2Defaults, Section3, section3Defaults } from "./section";
import { useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";

export default function SignUp(){
      const index = Number(useLocalSearchParams().index)
     const {theme,setBackground} = useTheme()
      const [currentSection,setCurrentSection] = useState(index);
      const {control,trigger,getFieldState,handleSubmit,formState:{errors}} = useForm({
      defaultValues:{
          ...section1Defaults,
          ...section2Defaults,
          ...section3Defaults
      }})
      const sections = [
          <Section1 trigger={trigger} getFieldState={getFieldState} errors={errors} setCurrentSection={setCurrentSection} control={control} />,<Section2 control={control} />,<Section3 control={control} />
        ]
      useEffect(()=>{
            if(setBackground){
                setBackground(theme?theme.colors.secondary:"")
            }
        },[theme])

    const styles = StyleSheet.create({
         signUpContainer : {
            height:'100%',
            width:'100%',
            justifyContent:'center',
            alignItems:'center',
            padding : theme?.paddings.screen
        },
        signUpSection:{
            padding:theme?.border.padding,
            gap:theme?.gaps.form,
            width:'100%',
        },
    })


    return(
        <View style={styles.signUpContainer}>
            <View style={styles.signUpSection}>
            <SectionHeading>Sign Up</SectionHeading>
              {sections && sections[currentSection]}
            </View>
        </View>
    )
}