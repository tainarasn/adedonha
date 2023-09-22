import { NavigationProp } from "@react-navigation/native"
import React, { useEffect, useRef, useState } from "react"
import { View, Image, Button } from "react-native"
import { TextInput, Modal, Text, Portal, Button as ButtonPaper, IconButton } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useIo } from "../hooks/useIo"
import images from "../images"
import { DrawerJogadores } from "../components/DrawerJogadores"
import { JoinRoomModal } from "../components/JoinRoomModal"
import { colors } from "../style/colors"

interface RoomProps {
    navigation: NavigationProp<any, any>
}

export const Room: React.FC<RoomProps> = ({ navigation }) => {
    const socket = useIo()
    const [users, setUsers] = useState<Array<{ id: string; username: string }>>([])
    const [userMap, setUserMap] = useState<{ [userID: string]: string }>({})

    const [name, setName] = React.useState("")
    const [letter, setLetter] = useState<string | null>(null)
    const [answers, setAnswers] = useState<{ [category: string]: string }>({})
    const [userWord, setUserWord] = useState("")
    const [allUserAnswers, setAllUserAnswers] = useState<{ [userId: string]: { [category: string]: string } }>({})

    const categories = ["Animal", "País"]

    const [isRoundActive, setIsRoundActive] = useState(false) // Estado para rastrear se a rodada está ativa
    const [gameResults, setGameResults] = useState<{ [userId: string]: number }>({})

    const [visibleStop, setVisibleStop] = React.useState(false)
    const [visible, setVisible] = React.useState(true)
    const showModal = () => setVisible(true)
    const hideModal = () => setVisible(false)
    const answersRef = useRef<{ [category: string]: string }>({})

    const containerStyle = {
        backgroundColor: colors.primary,
        padding: 10,
    }

    // Verificar se todos os campos de texto foram preenchidos
    const areAllFieldsFilled = categories.every((cat) => answers[cat])

    const joinRoom = () => {
        socket.emit("join-room", { roomId: "1", username: name })
    }

    const leaveRoom = () => {
        socket.emit("leave-room", { roomId: "1", username: name })
    }

    useEffect(() => {
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
            socket.emit("submit-answer", { roomId: "1", answer: answersRef.current })
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
        <SafeAreaView style={{ flex: 1, alignItems: "center", padding: 10, gap: 30 }}>
            {/* <Image source={images.studio} style={{ width: 120, height: 120, resizeMode: "contain" }} /> */}
            {!isRoundActive && <DrawerJogadores users={users} />}
            <View style={{ flex: 0.8, justifyContent: "center", alignItems: "center", paddingBottom: 80 }}>
                <View style={{ padding: 100 }}>
                    <Portal>
                        <Modal visible={visible} onDismiss={showModal} contentContainerStyle={containerStyle}>
                            <TextInput
                                style={{
                                    height: 40,
                                    borderColor: "gray",
                                    borderWidth: 1,
                                    width: 200,
                                    margin: 10,
                                    padding: 5,
                                }}
                                onChangeText={(text) => setName(text)}
                                value={name}
                                placeholder="Digite seu nome"
                            />
                            <ButtonPaper
                                buttonColor={colors.button2}
                                textColor={colors.color.white}
                                onPress={() => {
                                    joinRoom()
                                    hideModal()
                                }}
                            >
                                Entrar
                            </ButtonPaper>
                        </Modal>
                    </Portal>
                    {/* <ButtonPaper style={{ marginTop: 30 }} onPress={showModal}>
                    Entrar na sala novamente
                </ButtonPaper> */}
                </View>
                {letter ? (
                    <View style={{ alignItems: "center" }}>
                        <Text variant="displayLarge">{letter}</Text>
                        {categories.map((category) => (
                            <View key={category}>
                                <Text>{category}:</Text>
                                <TextInput
                                    style={{
                                        height: 40,
                                        borderColor: "gray",
                                        borderWidth: 1,
                                        width: 200,
                                        margin: 10,
                                        padding: 5,
                                    }}
                                    key={category}
                                    label={category}
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

                {/* Modal para o botão Stop */}
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
                {/* <IconButton
                    icon="pause"
                    style={{ marginTop: 30, borderRadius: 100, width: 120, height: 120 }}
                    onPress={() => {
                        socket.emit("stop-game", { roomId: "1" })
                    }}
                    iconColor="#fff"
                    containerColor="red"
                    size={70}
                /> */}

                {!isRoundActive && (
                    <Button
                        title="Play"
                        onPress={() => {
                            socket.emit("start-game", { roomId: "1" })
                            setVisibleStop(true)
                        }}
                    />
                )}

                {/* <Button title="Sair da sala" onPress={leaveRoom} /> */}
            </View>
        </SafeAreaView>
    )
}
