import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Home } from "./screens/Home"
import { Room } from "./screens/Room"

interface RouterProps {}

export const Router: React.FC<RouterProps> = ({}) => {
    const Stack = createNativeStackNavigator()

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Room" component={Room} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
