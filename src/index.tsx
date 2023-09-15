import React, { useEffect, useState } from "react"
import { View, Text, Button } from "react-native"
import { TextInput } from "react-native-paper"
import { useIo } from "./hooks/useIo"

export default function Home() {
    const socket = useIo()
    const [text, setText] = React.useState("")

    // const joinRoom = () => {
    //     const data = {
    //         roomId: "1",
    //         username: text,
    //     }
    //     socket.emit("join-room", data)
    // }

    // const leaveRoom = () => {
    //     const data = {
    //         roomId: "1",
    //         username: text,
    //     }
    //     socket.emit("leave-room", data)
    // }

    // useEffect(() => {
    //     socket.on("user-joined", (data) => {
    //         const { userId, username } = data
    //         console.log(`User joined: ${username} (ID: ${userId})`)
    //     })

    //     socket.on("user-left", (data) => {
    //         const { userId, username } = data
    //         console.log("User left:", username)
    //     })
    // }, [])

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
            {/* <Button title="Entrar na sala" onPress={joinRoom} />
            <Button title="Sair da sala" onPress={leaveRoom} /> */}
        </View>
    )
}
