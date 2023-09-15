import React, { useEffect, useState } from "react"
import { PaperProvider } from "react-native-paper"
import { Routes } from "./src/Router"
import { ImageBackground, StyleSheet } from "react-native"
import images from "./src/images"

export default function App() {
    console.log("Caminho da imagem:", images.background)
    return (
        <PaperProvider>
            <ImageBackground source={images.background} style={{ flex: 1 }}>
                <Routes />
            </ImageBackground>
        </PaperProvider>
    )
}

