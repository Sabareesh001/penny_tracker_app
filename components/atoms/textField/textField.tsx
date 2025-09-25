import { useTheme } from "@/theme/themeProvider";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { Note } from "../note/note";

export type TextFieldProps = 
{
  error?:boolean,
  errorNote?:boolean,
  note?:string,
  height?:number,
  width?:number | string,
  flex?:number
} & TextInputProps


const TextField = (props:TextFieldProps)=>{
    const {theme} = useTheme()
    const styles = StyleSheet.create({
      textInput: {
        borderWidth: theme?.border.borderWidth,
        borderColor: theme?.border.color,
        padding: theme?.border.padding,
        borderRadius: theme?.border.radius,
        color: theme?.colors.input,
        fontSize: theme?.text.section.label.fontSize,
      },
      container:{
        flex:props.flex,
        height:props.height || 50,
      },
      textInputError: {
        borderColor: theme?.colors.danger.danger,
      },
      noteBox: {
        flexDirection: "row",
        gap: theme?.gaps.info,
      },
    });
    return (
      <View>
        <View style={styles.container}>
          <TextInput
            {...props}
            
            style={[{
              ...styles.textInput,
              ...(props?.error && styles.textInputError),
            } ,props?.style]}
            
          ></TextInput>
              </View>
          {props.note && (
            <View style={styles.noteBox}>
              <Note error={props.errorNote}>{`ⓘ`}</Note>
              <Note error={props.errorNote}>{props?.note}</Note>
            </View>
          )}
      </View>
    );
}

export {TextField}