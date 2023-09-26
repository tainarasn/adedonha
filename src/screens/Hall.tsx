import React, { useEffect, useState } from "react"
import { View, Text, Image, Modal, TextInput, Dimensions } from "react-native"
import { NavigationProp } from "@react-navigation/native"
import images from "../images"
import { colors } from "../style/colors"
import { Avatar, Button, RadioButton } from "react-native-paper"
import axios from "axios"

interface HallProps {
    navigation: NavigationProp<any, any>
}

export const Hall: React.FC<HallProps> = ({ navigation }) => {
    const [rooms, setRooms] = useState<string[]>([]) //Estado para armazenar a lista de salas
    const [modalVisible, setModalVisible] = useState(false)
    const [roomName, setRoomName] = useState("")
    const [username, setUsername] = useState("")
    const [privacy, setPrivacy] = useState("public")

    const maxHeight = Dimensions.get("window").height
    const maxWidth = Dimensions.get("window").width

    // Criação de nova sala
    const createRoom = async () => {
        try {
            const response = await axios.post("http://192.168.15.8:3000/create-room", {
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
                const response = await axios.get("http://192.168.15.8:3000/rooms")
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
                gap: 60,
                paddingBottom: 110,
            }}
        >
            <Image source={images.studio} style={{ width: 120, height: 160, resizeMode: "center" }} />
            <View style={{ gap: 30, alignItems: "center" }}>
                <Avatar.Image size={150} source={require("../../assets/avatar/porco.png")} style={{ alignSelf: "center" }} />
                <TextInput
                    style={{
                        width: 170,
                        borderWidth: 1,
                        borderColor: colors.color.black,
                        marginBottom: 15,
                        paddingVertical: 10,
                        paddingHorizontal: 5,
                        textAlign: "center",
                        borderRadius: 25,
                        color: colors.color.black,
                    }}
                    placeholder="Digite seu nome    "
                    value={username}
                    onChangeText={setUsername}
                />
                <View style={{ alignItems: "center" }}>
                    <View style={{ gap: 10, width: 170, alignItems: "center" }}>
                        <Button
                            mode="contained"
                            buttonColor={colors.button2}
                            style={{ width: "100%", borderRadius: 15 }}
                            onPress={() => navigation.navigate("RoomList")}
                        >
                            Sala Aleatória
                        </Button>
                        <Button
                            mode="contained"
                            style={{ width: "100%", borderRadius: 15 }}
                            onPress={() => navigation.navigate("RoomList")}
                        >
                            Salas
                        </Button>
                        <Button
                            mode="contained"
                            style={{ width: "100%", borderRadius: 15 }}
                            buttonColor={colors.secondary}
                            onPress={() => setModalVisible(true)}
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
                    <Text style={{ fontSize: 25, marginBottom: 15, color: colors.secondary, fontWeight: "800" }}>
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
                                width: "70%",
                                marginBottom: 15,
                                paddingVertical: 10,
                                paddingHorizontal: 5,
                                textAlign: "center",
                                borderRadius: 25,
                                color: colors.color.black,
                                backgroundColor: "#fff",
                            }}
                            placeholder="Nome da Sala"
                            value={roomName}
                            onChangeText={setRoomName}
                        />
                        <Text style={{ fontSize: 19, fontWeight: "600", color: colors.color.white }}>Privacidade</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
                            <RadioButton
                                value="public"
                                color={"checked" ? colors.background.modalY : "white"}
                                status={privacy === "public" ? "checked" : "unchecked"}
                                onPress={() => setPrivacy("public")}
                            />
                            <Text style={{ color: colors.color.white, fontSize: 17 }}>Pública</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
                            <RadioButton
                                value="private"
                                color={"checked" ? colors.background.modalY : "white"}
                                status={privacy === "private" ? "checked" : "unchecked"}
                                onPress={() => setPrivacy("private")}
                            />
                            <Text style={{ color: colors.color.white, fontSize: 17 }}>Privada</Text>
                        </View>
                        <View style={{ width: "100%", alignItems: "center", gap: 10 }}>
                            <Button
                                mode="contained"
                                style={{ width: "50%", borderRadius: 15 }}
                                buttonColor={colors.buttonSave}
                                onPress={createRoom}
                            >
                                Salvar
                            </Button>
                            <Button
                                mode="contained"
                                style={{ width: "40%", borderRadius: 15 }}
                                buttonColor={colors.buttonSave}
                                onPress={() => setModalVisible(false)}
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
