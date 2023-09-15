import { NavigationProp } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import { View, Text, Image } from "react-native"
import { TextInput, Button } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useIo } from "../hooks/useIo"
import images from "../images"

interface RoomProps {
    navigation: NavigationProp<any, any>
}

export const Room: React.FC<RoomProps> = ({ navigation }) => {
    return (
        <SafeAreaView>
            <View style={{ flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", gap: 15 }}>
                <View style={{ flex: 1, paddingTop: 200 }}>
                    <Button mode="contained">Entrar Sala</Button>
                    <Image source={images.studio} style={{ width: 120, height: 160, resizeMode: "contain" }} />
                </View>
            </View>
        </SafeAreaView>
    )
}
