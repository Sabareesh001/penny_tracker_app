import { useTheme } from "@/theme/themeProvider";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { Note } from "../note/note";

const TextField = (props:(TextInputProps & {error?:boolean,errorNote?:boolean,note?:string}))=>{
    const {theme} = useTheme()
    const styles = StyleSheet.create({
      textInput: {
        borderWidth: theme?.border.borderWidth,
        borderColor: theme?.border.color,
        padding: theme?.border.padding,
        borderRadius: theme?.border.radius,
        color: theme?.colors.input,
        fontSize: theme?.text.section.label.fontSize,
        flex:1
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
      <>
        <TextInput
          {...props}
          style={{
            ...styles.textInput,
            ...(props?.error && styles.textInputError),
          }}
          
        ></TextInput>
        {props.note && (
          <View style={styles.noteBox}>
            <Note error={props.errorNote}>{`ⓘ`}</Note>
            <Note error={props.errorNote}>{props?.note}</Note>
          </View>
        )}
      </>
    );
}

export {TextField}