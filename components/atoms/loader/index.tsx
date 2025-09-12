import { ActivityIndicator,ActivityIndicatorProps } from "react-native";
import { useTheme } from "@/theme/themeProvider";
import { FullPageLoader } from "./fullPageLoader";

const Loader = (props:ActivityIndicatorProps) => {
  const { theme } = useTheme();
  return (
    
    <ActivityIndicator
      size="large"
      color={theme?.colors.secondary}
      style={{ width: 28, height: 28 }}
      {...props}
    />
  );
};

export { Loader ,FullPageLoader};
