import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native"
import axios from "axios" // Importing axios for HTTP requests
import { useUser } from "../hooks/useUser"
import images from "../images"
import { Button } from "react-native-paper"
import { colors } from "../style/colors"

interface RoomListProps {
    navigation: any // Navigation prop to navigate to different screens
}

export const RoomList: React.FC<RoomListProps> = ({ navigation }) => {
    const { username } = useUser()
    const [rooms, setRooms] = useState<string[]>([]) // State to store the list of rooms

    // Fetch the list of rooms when the component mounts
    useEffect(() => {
        async function fetchRooms() {
            try {
                //const response = await axios.get("http://192.168.15.8:3000/rooms")
                const response = await axios.get("http://192.168.15.4:3000/rooms")
                setRooms(response.data.rooms)
            } catch (error) {
                console.error("Error fetching rooms:", error)
            }
        }
        fetchRooms()
    }, [])

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Image source={images.studio} style={{ width: 120, height: 160, resizeMode: "center", alignItems: "center" }} />

            <Text style={{ fontSize: 22, marginBottom: 20, fontWeight: "800", color: colors.primary }}>
                SALAS DISPONÍVEIS
            </Text>
            <FlatList
                style={{ width: "100%", paddingBottom: 20 }}
                data={rooms}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity style={{ padding: 10 }}>
                        <Button
                            mode="contained"
                            style={{ width: "60%", borderRadius: 15, alignSelf: "center" }}
                            buttonColor={colors.primary}
                            onPress={() => navigation.navigate("Room", { roomId: item })}
                        >
                            {item}
                        </Button>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}
