import { useTheme } from "@/theme/themeProvider";
import { FAB,FABProps } from '@rneui/themed';

const FloatingActionButton = (props : FABProps )=>{

    const {theme} = useTheme()
 
    return(
        <FAB
        color={theme?.colors.secondary}
        containerStyle={
            {
                borderColor:theme?.colors.primary,
                borderWidth:theme?.border.borderWidth,
                shadowColor: theme?.colors.secondary
            }
        }
        
        {...props}>

        </FAB>
    )
     

}

export {FloatingActionButton};