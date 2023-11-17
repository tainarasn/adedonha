import React, { useEffect, useState } from "react"
import { View, Text, Image, Modal, TextInput, Dimensions } from "react-native"
import { NavigationProp } from "@react-navigation/native"
import images from "../images"
import { colors } from "../style/colors"
import { Avatar, Button, RadioButton } from "react-native-paper"
import axios from "axios"
import { useUser } from "../hooks/useUser"
import { useIo } from "../hooks/useIo"

interface HallProps {
    navigation: NavigationProp<any, any>
}

export const Hall: React.FC<HallProps> = ({ navigation }) => {
    const { username, setUsername } = useUser()
    const socket = useIo()

    const [rooms, setRooms] = useState<string[]>([]) //Estado para armazenar a lista de salas
    const [modalVisible, setModalVisible] = useState(false)
    const [roomName, setRoomName] = useState("")

    const [privacy, setPrivacy] = useState("public")
    const port = "http://192.168.15.25:3000"

    const maxHeight = Dimensions.get("window").height
    const maxWidth = Dimensions.get("window").width

    const randomAvatar = (max: number) => {
        return Math.floor(Math.random() * max)
    }
    const randomNumber = randomAvatar(images.avatar.length)
    const imageSort = images.avatar[randomNumber]

    const handleUsernameChange = (newUsername: string) => {
        setUsername(newUsername)
        socket.emit("set-username", newUsername)
    }
    // Criação de nova sala
    const createRoom = async () => {
        try {
            const response = await axios.post(`${port}/create-room`, {
                name: roomName,
                privacy: privacy,
            })
            navigation.navigate("Room", { roomId: response.data.roomId })
        } catch (error) {
            console.error("Error creating room:", error)
        }
    }

    //Obtenha a lista de salas quando o componente for montado
    useEffect(() => {
        async function fetchRooms() {
            try {
                const response = await axios.get(`${port}/rooms`)
                setRooms(response.data.rooms)
            } catch (error) {
                console.error("Error fetching rooms:", rooms)
            }
        }
        fetchRooms()
    }, [])

    return (
        <View
            style={{
                alignItems: "center",
                height: "100%",
                justifyContent: "center",
                gap: 20,
                paddingBottom: 90,
            }}
        >
            <Image source={images.studio} style={{ width: 120, height: 160, resizeMode: "center" }} />
            <View style={{ gap: 30, alignItems: "center" }}>
                <Avatar.Image size={150} source={imageSort} style={{ alignSelf: "center" }} />

                <TextInput
                    style={{
                        width: 195,
                        borderWidth: 1,
                        borderColor: colors.color.black,
                        marginBottom: 15,
                        paddingVertical: 10,
                        paddingHorizontal: 5,
                        textAlign: "center",
                        borderRadius: 25,
                        color: colors.color.black,
                        fontFamily: "KGPrimaryPenmanship",
                        fontSize: 25,
                    }}
                    placeholder="Digite seu nome "
                    value={username}
                    onChangeText={(text) => {
                        setUsername(text)
                        socket.emit("update-username", text)
                    }}
                />
                <View style={{ alignItems: "center" }}>
                    <View style={{ gap: 10, width: 240, alignItems: "center" }}>
                        <Button
                            mode="contained"
                            buttonColor={colors.button2}
                            style={{ width: "100%", borderRadius: 15 }}
                            onPress={() => navigation.navigate("RoomList")}
                            labelStyle={{ fontSize: 30, paddingTop: 12 }}
                        >
                            Sala Aleatória
                        </Button>
                        <Button
                            mode="contained"
                            style={{ width: "100%", borderRadius: 15 }}
                            onPress={() => navigation.navigate("RoomList")}
                            labelStyle={{ fontSize: 30, paddingTop: 12 }}
                        >
                            Salas
                        </Button>
                        <Button
                            mode="contained"
                            style={{ width: "100%", borderRadius: 15 }}
                            buttonColor={colors.secondary}
                            onPress={() => setModalVisible(true)}
                            labelStyle={{ fontSize: 30, paddingTop: 12 }}
                        >
                            Criar Sala
                        </Button>
                    </View>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
                    <Text
                        style={{
                            fontSize: 38,
                            fontFamily: "KGPrimaryPenmanship",
                            marginBottom: 15,
                            color: colors.secondary,
                            fontWeight: "bold",
                        }}
                    >
                        Criar Sala
                    </Text>
                    <View
                        style={{
                            width: maxWidth * 0.7,
                            height: "65%",
                            padding: 20,
                            borderRadius: 10,
                            backgroundColor: colors.secondary,
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 20,
                        }}
                    >
                        <TextInput
                            style={{
                                width: "90%",
                                marginBottom: 15,
                                paddingVertical: 10,
                                paddingHorizontal: 5,
                                textAlign: "center",
                                borderRadius: 25,
                                color: colors.color.black,
                                backgroundColor: "#fff",
                                fontFamily: "KGPrimaryPenmanship",
                                fontSize: 25,
                            }}
                            placeholder="Nome da Sala"
                            value={roomName}
                            onChangeText={setRoomName}
                        />
                        <Text
                            style={{
                                fontSize: 35,
                                fontWeight: "600",
                                color: colors.color.white,
                                fontFamily: "KGPrimaryPenmanship",
                            }}
                        >
                            Privacidade
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 15,
                            }}
                        >
                            <RadioButton
                                value="public"
                                color={"checked" ? colors.background.modalY : "white"}
                                status={privacy === "public" ? "checked" : "unchecked"}
                                onPress={() => setPrivacy("public")}
                            />
                            <Text style={{ color: colors.color.white, fontSize: 28, fontFamily: "KGPrimaryPenmanship" }}>
                                Pública
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 15,
                            }}
                        >
                            <RadioButton
                                value="private"
                                color={"checked" ? colors.background.modalY : "white"}
                                status={privacy === "private" ? "checked" : "unchecked"}
                                onPress={() => setPrivacy("private")}
                            />
                            <Text style={{ color: colors.color.white, fontSize: 28, fontFamily: "KGPrimaryPenmanship" }}>
                                Privada
                            </Text>
                        </View>
                        <View style={{ width: "100%", alignItems: "center", gap: 10 }}>
                            <Button
                                mode="contained"
                                style={{ width: "50%", borderRadius: 15 }}
                                buttonColor={colors.buttonSave}
                                onPress={createRoom}
                                labelStyle={{ fontSize: 30, paddingTop: 12 }}
                            >
                                Salvar
                            </Button>
                            <Button
                                mode="contained"
                                style={{ width: "40%", borderRadius: 15 }}
                                buttonColor={colors.buttonSave}
                                onPress={() => setModalVisible(false)}
                                labelStyle={{ fontSize: 20, paddingTop: 5 }}
                            >
                                Voltar
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
