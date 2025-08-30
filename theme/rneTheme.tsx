import { createTheme, CreateThemeOptions } from "@rneui/themed";
import { useTheme } from "./themeProvider";

const getRneTheme = ():CreateThemeOptions=>{

    const {theme} = useTheme();

    console.log(theme?.colors.primary)

    const rneTheme = createTheme({
      lightColors: {
        primary: theme?.colors.primary,
        secondary:theme?.colors.secondary
      },
      darkColors: {
        primary: theme?.colors.primary,
        secondary: theme?.colors.secondary,
      },
      
      components: {
        Button: {
          raised: true,
        },
        CheckBox:{
            containerStyle:{
              margin:0,
              backgroundColor:"transparent",
                padding:0
            },
            wrapperStyle:{
              backgroundColor:theme?.colors.secondary,
                borderRadius:theme?.border.radius,
                borderColor:theme?.border.color,
                borderWidth:theme?.border.borderWidth,
                paddingLeft:5,
                paddingTop:3,
                paddingBottom:3
            },
            
            center:true,
            size:24
            
        },
        Card:{
            containerStyle:{
                backgroundColor:theme?.colors.primary,
                borderRadius:theme?.border.radius,
                borderColor:theme?.border.color,
                borderWidth:theme?.border.borderWidth,
                margin:0,
            }
        }
      },

    });

    return rneTheme;
}

export {getRneTheme};
