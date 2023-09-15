import { NavigationProp } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import { View, Text, Button } from "react-native"
import { TextInput } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"

interface RoomProps {
    navigation: NavigationProp<any, any>
}

export const Room: React.FC<RoomProps> = ({navigation}) => {
    return (
        <SafeAreaView>
            <View style={{ flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", gap: 15 }}>
                <View>
                    <Text>Tela 2</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}
