import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native"
import axios from "axios" // Importing axios for HTTP requests
import { useUser } from "../hooks/useUser"
import { Button } from "react-native-paper"
import { colors } from "../style/colors"
import images from "../images"

interface RoomListProps {
    navigation: any // Navigation prop to navigate to different screens
}

export const RoomList: React.FC<RoomListProps> = ({ navigation }) => {
    const { username } = useUser()
    // const [rooms, setRooms] = useState<string[]>([]) // State to store the list of rooms
    const [rooms, setRooms] = useState([{ id: "", name: "", users: [] }])

    // Fetch the list of rooms when the component mounts
    useEffect(() => {
        async function fetchRooms() {
            try {
                const response = await axios.get("http://192.168.15.25:3000/rooms")
                setRooms(response.data.rooms)
            } catch (error) {
                console.error("Error fetching rooms:", error)
            }
        }
        fetchRooms()
    }, [])

    return (
        <View style={{ flex: 0.9, alignItems: "center", justifyContent: "center" }}>
            <Image source={images.studio} style={{ width: 120, height: 160, resizeMode: "center", alignItems: "center" }} />

            <Text
                style={{
                    fontSize: 38,
                    marginBottom: 20,
                    fontWeight: "800",
                    color: colors.primary,
                    fontFamily: "KGPrimaryPenmanship",
                }}
            >
                SALAS DISPONÍVEIS
            </Text>
            <FlatList
                style={{ width: "100%", flex: 0.8, paddingBottom: 5 }}
                data={rooms}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={{ padding: 10 }}>
                        <Button
                            mode="contained"
                            style={{ width: "60%", borderRadius: 15, alignSelf: "center" }}
                            buttonColor={colors.primary}
                            onPress={() => navigation.navigate("Room", { roomId: item })}
                            labelStyle={{ fontSize: 26, paddingTop: 6 }}
                        >
                            {item.name}
                        </Button>
                    </TouchableOpacity>
                )}
            />
            <Button
                mode="contained"
                style={{ width: "40%", borderRadius: 15 }}
                buttonColor={colors.button2}
                onPress={() => {
                    navigation.navigate("Hall")
                }}
                labelStyle={{ fontSize: 20, paddingTop: 5 }}
            >
                Voltar
            </Button>
        </View>
    )
}
