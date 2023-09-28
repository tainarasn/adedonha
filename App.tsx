import React, { useCallback, useEffect, useState } from "react"
import { DefaultTheme, PaperProvider, Text, configureFonts } from "react-native-paper"
import { Routes } from "./src/Router"
import { useFonts } from "expo-font"
import { IoProvider } from "./src/context/ioContext"
import { UserProvider } from "./src/context/userContext"
import { theme } from "./src/style/theme"

export default function App() {
    // const [fontsLoaded] = useFonts({
    //     KGPrimaryPenmanship: require("./assets/fonts/kg_primary_penmanship/KGPrimaryPenmanship.ttf"), // Certifique-se de que o caminho está correto
    // })

    // if (!fontsLoaded) {
    //     return null // ou retorne algum componente de carregamento
    // }

    return (
        <PaperProvider theme={theme}>
            <IoProvider>
                <UserProvider>
                    <Routes />
                </UserProvider>
            </IoProvider>
        </PaperProvider>
    )
}
