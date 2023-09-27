import { NavigationProp } from "@react-navigation/native"
import React, { useEffect, useRef, useState } from "react"
import { View, Image, Button, TextInput } from "react-native"
import { Modal, Text, Portal, Button as ButtonPaper, IconButton } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useIo } from "../hooks/useIo"
import images from "../images"
import { DrawerJogadores } from "../components/DrawerJogadores"
import { colors } from "../style/colors"
import { useUser } from "../hooks/useUser"
import { RouteProp } from "@react-navigation/native"
type RootStackParamList = {
    Home: undefined
    RoomList: undefined
    Room: { roomId: string } // Certifique-se de que "roomId" está definido aqui
}
type RoomScreenRouteProp = RouteProp<RootStackParamList, "Room"> // Substitua "RootStackParamList" pelo nome de sua pilha de navegação

interface RoomProps {
    navigation: NavigationProp<any, any>
    route: RoomScreenRouteProp // Adicione esta prop para receber o roomId
}

export const Room: React.FC<RoomProps> = ({ navigation, route }) => {
    const socket = useIo()
    const { username } = useUser()
    const [roomId, setRoomId] = useState<string | null>(null)
    const roomid = route.params.roomId

    const [users, setUsers] = useState<Array<{ id: string; username: string }>>([])
    const [userMap, setUserMap] = useState<{ [userID: string]: string }>({})

    const [letter, setLetter] = useState<string | null>(null)
    const [answers, setAnswers] = useState<{ [category: string]: string }>({})
    const [userWord, setUserWord] = useState("")
    const [allUserAnswers, setAllUserAnswers] = useState<{ [userId: string]: { [category: string]: string } }>({})

    const categories = ["Animal", "País", "Comida", "Música"]

    const [isRoundActive, setIsRoundActive] = useState(false) // Estado para rastrear se a rodada está ativa
    const [gameResults, setGameResults] = useState<{ [userId: string]: number }>({})

    const [visibleStop, setVisibleStop] = React.useState(false)
    const [visible, setVisible] = React.useState(true)

    const showModal = () => setVisible(true)
    const hideModal = () => setVisible(false)
    const answersRef = useRef<{ [category: string]: string }>({})

    const containerStyle = {
        padding: 10,
        borderRadius: 80,
    }

    // Verificar se todos os campos de texto foram preenchidos
    const areAllFieldsFilled = categories.every((cat) => answers[cat])

    const joinRoom = (id: string) => {
        setRoomId(id)
        socket.emit("join-room", { roomId: id, username: username })
    }

    const leaveRoom = (roomid: string) => {
        if (roomId) {
            socket.emit("leave-room", { roomId: roomId, username: username })
            setRoomId(null) // Reset the roomId after leaving
        }
    }

    useEffect(() => {
        joinRoom(roomid)
        // Ouvir o evento user-list e atualizar o estado local
        socket.on("user-list", (userList: Array<{ id: string; username: string }>) => {
            setUsers(userList)
        })

        socket.on("game-data", (data: { letter: string; category: string }) => {
            setLetter(data.letter)
            setIsRoundActive(true) // Definir a rodada como ativa
        })
        socket.on("start-game", (data) => {
            console.log("Starting game:", data) // Log para verificar início do jogo
            setVisibleStop(true)
            setLetter(data.letter)
            setIsRoundActive(true)
        })

        socket.on("game-stopped", () => {
            setLetter(null)
            setUserWord("")
            setIsRoundActive(false) // Definir a rodada como ativa
        })

        socket.on("game-results", (data) => {
            console.log("Received game results:", data.scores)
            setGameResults(data.scores)
            setAllUserAnswers(data.answers)
        })

        socket.on("user-joined", (data) => {
            const { userId, username } = data
            console.log(`User joined: ${username} (ID: ${userId})`)
        })

        socket.on("user-left", (data) => {
            const { userId, username } = data
            console.log("User left:", username)
        })

        // Quando o evento request-answers for recebido, o cliente enviará todas as suas respostas de todos os jogadores:
        socket.on("request-answers", () => {
            console.log("Current answers state:", answersRef.current)
            socket.emit("submit-answer", { roomId: roomid, answer: answersRef.current })
        })

        return () => {
            // Desligar os listeners quando o componente for desmontado
            socket.off("user-list")
            socket.off("new-answer")
            socket.off("game-data")
            socket.off("game-stopped")
            socket.off("request-answers")
        }
    }, [socket])
    return (
        <SafeAreaView style={{ flex: 1, alignItems: "center", padding: 10, gap: 0 }}>
            {/* <Image source={images.studio} style={{ width: 120, height: 120, resizeMode: "contain" }} /> */}
            <Image source={images.studio} style={{ width: 120, height: 160, resizeMode: "center" }} />

            {!isRoundActive && <DrawerJogadores users={users} />}
            <View
                style={{
                    flex: 1,
                    width: "90%",
                    justifyContent: "center",

                    alignItems: "center",
                    paddingBottom: 200,
                }}
            >
                {letter ? (
                    <View
                        style={{
                            width: "90%",
                            padding: 30,
                            alignItems: "center",
                            backgroundColor: colors.primary,
                            borderRadius: 20,
                        }}
                    >
                        <Text variant="displayLarge" style={{ color: colors.color.white }}>
                            {letter}
                        </Text>
                        {categories.map((category) => (
                            <View key={category}>
                                <Text style={{ color: colors.color.white, fontWeight: "600" }}>{category}:</Text>
                                <TextInput
                                    style={{
                                        width: 200,
                                        margin: 8,

                                        paddingHorizontal: 5,
                                        textAlign: "center",
                                        borderRadius: 25,
                                        color: colors.color.black,
                                        backgroundColor: "#fff",
                                    }}
                                    key={category}
                                    value={answers[category] || ""}
                                    onChangeText={(text) => {
                                        setAnswers((prev) => {
                                            const updatedAnswers = { ...prev, [category]: text }
                                            answersRef.current = updatedAnswers // Atualizar a referência aqui, pegando o input mais atualizado
                                            return updatedAnswers
                                        })
                                    }}
                                />
                            </View>
                        ))}
                    </View>
                ) : null}

                {isRoundActive && areAllFieldsFilled && (
                    <Portal>
                        <Modal visible={visibleStop} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                }}
                            >
                                <IconButton
                                    icon="pause"
                                    style={{ marginTop: 30, borderRadius: 100, width: 120, height: 120 }}
                                    onPress={() => {
                                        socket.emit("stop-game", { roomId: "1" })
                                        setVisibleStop(false)
                                    }}
                                    iconColor="#fff"
                                    containerColor="red"
                                    size={70}
                                />
                            </View>
                        </Modal>
                    </Portal>
                )}
                {gameResults && Object.keys(gameResults).length > 0 && (
                    <View>
                        <Text>Resultados:</Text>
                        {Object.entries(gameResults).map(([username, score]) => (
                            <Text key={username}>{`Usuário ${username}: ${score} pontos`}</Text>
                        ))}
                    </View>
                )}

                {!isRoundActive && (
                    <View style={{ width: "100%", gap: 10, alignItems: "center" }}>
                        <ButtonPaper
                            buttonColor={colors.button2}
                            textColor={colors.color.white}
                            style={{ borderRadius: 15, width: "50%" }}
                            onPress={() => {
                                socket.emit("start-game", { roomId: roomid })
                                setVisibleStop(true)
                            }}
                        >
                            Iniciar
                        </ButtonPaper>
                        <ButtonPaper
                            mode="contained"
                            buttonColor={colors.background.modalY}
                            textColor={colors.color.white}
                            style={{ borderRadius: 15, width: "50%" }}
                            onPress={() => {
                                socket.emit("leave-room", { roomId: roomid })
                                navigation.navigate("RoomList")
                            }}
                        >
                            Sair da Sala
                        </ButtonPaper>
                    </View>
                )}

                {/* <Button title="Sair da sala" onPress={leaveRoom} /> */}
            </View>
        </SafeAreaView>
    )
}
