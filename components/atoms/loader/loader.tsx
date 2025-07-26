import { ActivityIndicator } from "react-native";
import { useTheme } from "@/theme/themeProvider";

const Loader = () => {
  const { theme } = useTheme();
  return (
    <ActivityIndicator
      size="large"
      color={theme?.colors.secondary}
      style={{ width: 28, height: 28 }}
    />
  );
};

export { Loader };
