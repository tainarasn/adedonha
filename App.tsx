import React, { useEffect, useState } from "react"
import { PaperProvider } from "react-native-paper"
import { Routes } from "./src/Router"
import { theme } from "./src/style/theme"
import * as Font from "expo-font"
import { IoProvider } from "./src/context/ioContext"
import { UserProvider } from "./src/context/userContext"

async function loadFonts() {
    await Font.loadAsync({})
}

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false)

    useEffect(() => {
        async function loadApp() {
            await loadFonts()
            setFontsLoaded(true)
        }

        loadApp()
    }, [])

    if (!fontsLoaded) {
        return <></> // Ou qualquer outro indicador de carregamento que você preferir
    }

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

