import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, FlatList } from "react-native"
import axios from "axios" // Importing axios for HTTP requests
import { useUser } from "../hooks/useUser"

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
                const response = await axios.get("http://192.168.15.8:3000/rooms")
                setRooms(response.data.rooms)
            } catch (error) {
                console.error("Error fetching rooms:", error)
            }
        }
        fetchRooms()
    }, [])

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Salas Disponíveis</Text>
            <FlatList
                data={rooms}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate("Room", { roomId: item })}>
                        <Text>Sala: {item}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}
