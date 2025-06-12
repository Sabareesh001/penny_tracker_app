import { useTheme } from "@/theme/themeProvider";
import Toast, { BaseToast, ErrorToast, SuccessToast } from "react-native-toast-message"

const ToastStyled = ()=>{
    const {theme} = useTheme()
    return(
        <Toast

        config={{
            
            error:(props)=>(
              <ErrorToast
                {...props}
                style={{
                    backgroundColor:theme?.colors.primary,
                    borderLeftColor:theme?.colors.danger.danger
                }}
                text1Style={
                    {
                    color:theme?.colors.danger.text,
                    fontSize:theme?.text.section.label.fontSize
                    }
                }
                text2Style={{
                    color:theme?.colors.danger.text
                }}
              />
            ),
            success:(props)=>(
              <SuccessToast
                {...props}
                style={{
                    backgroundColor:theme?.colors.primary,
                    borderLeftColor:theme?.colors.success.success,
                }}
                text1Style={
                    {
                    color:theme?.colors.success.text,
                    fontSize:theme?.text.section.label.fontSize
                    }
                }
                text2Style={{
                    color:theme?.colors.success.success
                }}
              />
            ),
        }}
        
        />
    )
}

export {ToastStyled};