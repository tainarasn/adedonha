import React, { useEffect, useState } from "react"
import { View, Text, Button } from "react-native"
import { NavigationProp } from "@react-navigation/native"
import { TextInput } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"

interface HomeProps {
    navigation: NavigationProp<any, any>
}

import { io } from "socket.io-client"

export const Home: React.FC<HomeProps> = ({ navigation }) => {
    return (
        <View>
            <Text>Tela 1</Text>
            <Button title="Ir para a Tela 2" onPress={() => navigation.navigate("Room")} />
        </View>
    )
}
