import React, { useEffect, useState } from "react"
import { PaperProvider } from "react-native-paper"
import { Routes } from "./src/Router"
import { theme } from "./src/style/theme"
import * as Font from "expo-font"
import { IoProvider } from "./src/context/ioContext"
import { UserProvider } from "./src/context/userContext"



export default function App() {
    let [loaded, error] = Font.useFonts({
        KGPrimaryPenmanship: require("./assets/fonts/KGPrimaryPenmanship.ttf"),
    })

    if (!loaded) {
        return <></>
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

