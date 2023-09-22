import React, { useEffect, useState } from "react"
import { View, Text, ImageBackground, Dimensions, Image } from "react-native"
import { NavigationProp } from "@react-navigation/native"
import images from "../images"
import { colors } from "../style/colors"
import { Button } from "react-native-paper"

interface HomeProps {
    navigation: NavigationProp<any, any>
}

export const Home: React.FC<HomeProps> = ({ navigation }) => {
    const maxHeight = Dimensions.get("window").height
    const maxWidth = Dimensions.get("window").height
    return (
        <View style={{ paddingVertical: 10, alignItems: "center" }}>
            <Image source={images.studio} style={{ width: 120, height: 160, resizeMode: "contain" }} />
            <View style={{ alignItems: "center", paddingTop: 95 }}>
                <Image source={images.logo} style={{ width: 265, height: 160, resizeMode: "contain" }} />
                <View style={{ gap: 10 }}>
                    <Button mode="contained" style={{ width: 100 }} onPress={() => navigation.navigate("Room")}>
                        Jogar
                    </Button>
                    <Button
                        buttonColor={colors.button2}
                        textColor={colors.color.white}
                        style={{ width: 100 }}
                        onPress={() => navigation.navigate("")}
                    >
                        Sair
                    </Button>
                </View>
            </View>
        </View>
    )
}
