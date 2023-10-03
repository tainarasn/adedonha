import React, { useEffect } from "react"
import { useIo } from "../hooks/useIo"
import { View } from "react-native"
import { colors } from "../style/colors"
import { Button, IconButton, Text } from "react-native-paper"
import { NavigationProp } from "@react-navigation/native"

interface ModalInitRoundProps {
    navigation: NavigationProp<any, any>
    roomid: string
    username: string | undefined
    setVisibleStop: React.SetStateAction<boolean>
}

export const ModalInitRound: React.FC<ModalInitRoundProps> = ({ navigation, roomid, username, setVisibleStop }) => {
    const socket = useIo()

    const leaveRoom = () => {
        if (roomid) {
            socket.emit("leave-room", { roomId: roomid, username: username })
            // setRoomId(null) // Reset the roomId after leaving
        }
    }
    useEffect(() => {
        socket.on("user-left", (data) => {
            const { userId, username } = data
            console.log("User left:", username)
        })
    })
    return (
        <View
            style={{
                width: "75%",
                gap: 15,
                alignItems: "center",
                backgroundColor: colors.primary,
                flex: 0.8,
                borderRadius: 15,
                padding: 20,
                paddingVertical: 0,
                justifyContent: "center",
            }}
        >
            <View
                style={{
                    backgroundColor: "white",
                    width: "90%",
                    gap: 15,
                    alignItems: "center",
                    flex: 0.8,
                    borderRadius: 15,
                    padding: 30,
                    justifyContent: "center",
                }}
            >
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 40 }}>Sala</Text>
                    <Text style={{ fontWeight: "bold", fontSize: 40 }}>#BOZ</Text>
                </View>
                <View style={{ alignItems: "center", gap: 20 }}>
                    <Text style={{ textAlign: "center", fontSize: 20 }}>
                        Jogue com seus amigos. Copie o link abaixo e compartilhe.
                    </Text>
                    <IconButton icon="content-copy" size={38} />
                </View>
            </View>
            <Button
                buttonColor={colors.button2}
                textColor={colors.color.white}
                style={{ borderRadius: 15, width: "50%" }}
                onPress={() => {
                    socket.emit("start-game", { roomId: roomid })
                    setVisibleStop
                }}
                labelStyle={{ fontSize: 30, paddingTop: 12 }}
            >
                Vamos lá
            </Button>
            <Button
                mode="contained"
                buttonColor={colors.background.modalY}
                textColor={colors.color.white}
                style={{ borderRadius: 15, width: "30%" }}
                labelStyle={{ fontSize: 21 }}
                onPress={() => {
                    socket.emit("leave-room", { roomId: roomid })
                    navigation.navigate("RoomList")
                }}
            >
                Sair
            </Button>
        </View>
    )
}
