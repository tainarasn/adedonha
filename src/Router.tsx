import React from "react"
import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { Home } from "./screens/Home"
import { Room } from "./screens/Room"
import { Dimensions, ImageBackground, Text } from "react-native"
import images from "./images"

interface RouterProps {}

export const Routes: React.FC<RouterProps> = ({}) => {
    const Stack = createNativeStackNavigator()
    const navigator_options: NativeStackNavigationOptions = {
        headerStyle: {
            backgroundColor: "#fff",
        },
        headerTitleStyle: {
            fontWeight: "bold",
        },
        headerTitleAlign: "center",
        animation: "slide_from_right",
        headerShown: false,
    }

    const theme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: "transparent",
        },
    }

    return (
        <NavigationContainer theme={theme}>
            <ImageBackground source={images.background} resizeMode="cover" style={{ flex: 1 }}>
                <Stack.Navigator initialRouteName="Home" screenOptions={navigator_options}>
                    <Stack.Screen name="Home" component={Home} />
                    <Stack.Screen name="Room" component={Room} />
                </Stack.Navigator>
            </ImageBackground>
        </NavigationContainer>
    )
}
