import React, { useEffect, useState } from "react"
import { View, Text, Button, Alert } from "react-native"
import { PaperProvider } from "react-native-paper"
// import { useIo } from "./src/hooks/useIo"
// import { IoProvider } from "./src/context/ioContext"
// import { UserProvider } from "./src/context/userContext"

import { Routes } from "./src/Router"

// const Screen = () => {
//     const socket = useIo()
//     const [text, setText] = React.useState("")

//     const joinRoom = () => {
//         const data = {
//             roomId: "1",
//             username: text,
//         }
//         socket.emit("join-room", data)
//     }

//     const leaveRoom = () => {
//         const data = {
//             roomId: "1",
//             username: text,
//         }
//         socket.emit("leave-room", data)
//     }

// return (
//     // <View style={{ flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", gap: 15 }}>
//     //     <TextInput
//     //         label="Username"
//     //         style={{ minWidth: "50%" }}
//     //         mode="outlined"
//     //         value={text}
//     //         onChangeText={(text) => setText(text)}
//     //     />
//     //     <Text>{text}</Text>
//     //     <Button title="Entrar na sala" onPress={joinRoom} />
//     //     <Button title="Sair da sala" onPress={leaveRoom} />
//     // </View>
// )
//}

export default function App() {
    return (
        <PaperProvider>
            {/* <IoProvider>
                 <UserProvider>/ */}
            <Routes />
            {/*    </UserProvider>
             </IoProvider> */}
        </PaperProvider>
    )
}
