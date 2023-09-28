import { MD3LightTheme as DefaultTheme, MD3Theme, configureFonts } from "react-native-paper"
import { colors } from "./colors"

export const theme: MD3Theme = {
    ...DefaultTheme,

    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
        secondary: colors.secondary,
    },
}
