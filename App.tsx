import React, { useEffect, useState } from "react"
import { PaperProvider } from "react-native-paper"
import { Routes } from "./src/Router"
import { theme } from "./src/style/theme"
import * as Font from "expo-font"

export default function App() {
    return (
        <PaperProvider theme={theme}>
            <Routes />
        </PaperProvider>
    )
}

