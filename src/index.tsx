import React, { useEffect, useState } from "react"
import { View, Text, Button } from "react-native"
import { TextInput } from "react-native-paper"
import { useIo } from "./hooks/useIo"

export default function Home() {
    const socket = useIo()
    const [text, setText] = React.useState("")

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", gap: 15 }}>
            <TextInput
                label="Username"
                style={{ minWidth: "50%" }}
                mode="outlined"
                value={text}
                onChangeText={(text) => setText(text)}
            />
            <Text>{text}</Text>

        </View>
    )
}
