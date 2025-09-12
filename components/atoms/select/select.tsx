import { useTheme } from '@/theme/themeProvider';
import { StyleSheet } from 'react-native';
import DropDownPicker, { DropDownPickerProps, ValueType } from 'react-native-dropdown-picker';


const Select = <T extends ValueType>(props: DropDownPickerProps<T>) => {

  const {theme} = useTheme()

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme?.colors.secondary,
      borderColor: theme?.border.color,
    },
    text: {
      color: theme?.colors.primary,
    },
    arrow: {
      tintColor: theme?.border.color,
    },
    dropdownContainer: {},
    placeholder: {
      color: theme?.border.color,
    },
    searchContainerStyle: {
      borderColor: theme?.border.color,
    },
    searchTextInputStyle: {
      borderColor: theme?.border.color,
      color:theme?.colors.primary
    },
  });
  
  return <DropDownPicker 
  style={styles.container}
  dropDownContainerStyle={{...styles.container,...styles.dropdownContainer}}
  textStyle={styles.text}
  placeholderStyle={styles.placeholder}
  listMode='SCROLLVIEW'
  searchContainerStyle={styles.searchContainerStyle}
  searchTextInputStyle={styles.searchTextInputStyle}
  searchPlaceholderTextColor={theme?.colors.primaryDisabled}
  tickIconStyle={styles.arrow}
  arrowIconStyle={styles.arrow}
   {...props} />;
} 

export default Select;