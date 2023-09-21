import { NavigationProp } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
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

    const [name, setName] = React.useState("")
    const [letter, setLetter] = useState<string | null>(null)
    const [answers, setAnswers] = useState<{ [category: string]: string }>({})
    const [userWord, setUserWord] = useState("")

    const categories = ["Animal", "País", "Cidade", "Comida", "Profissão", "Nome"]

    const [isRoundActive, setIsRoundActive] = useState(false) // Estado para rastrear se a rodada está ativa
    const [visibleStop, setVisibleStop] = React.useState(false)
    const [visible, setVisible] = React.useState(true)
    const showModal = () => setVisible(true)
    const hideModal = () => setVisible(false)

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

        socket.on("game-stopped", () => {
            setLetter(null)
            setUserWord("")
            setIsRoundActive(false) // Definir a rodada como ativa
        })

        socket.on("new-answer", (data: { userId: string; answer: string }) => {
            // Lidar com a nova resposta aqui (por exemplo, atualizar a UI)
        })

        socket.on("user-joined", (data) => {
            const { userId, username } = data
            console.log(`User joined: ${username} (ID: ${userId})`)
        })

        socket.on("user-left", (data) => {
            const { userId, username } = data
            console.log("User left:", username)
        })
        return () => {
            // Desligar os listeners quando o componente for desmontado
            socket.off("user-list")
            socket.off("new-answer")
            socket.off("game-data")
            socket.off("game-stopped")
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
                                    onChangeText={(word) => setAnswers((prev) => ({ ...prev, [category]: word }))}
                                    value={answers[category] || ""}
                                    placeholder={`Palavra com ${letter}`}
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
                                        // 3. Oculte o modal quando o botão Stop for pressionado
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
