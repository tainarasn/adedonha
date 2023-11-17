import { NavigationProp } from "@react-navigation/native"
import React, { useEffect, useRef, useState } from "react"
import { View, Image, Button, TextInput, Modal as ModalN } from "react-native"
import { Modal, Text, Portal, Button as ButtonPaper, IconButton } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { useIo } from "../hooks/useIo"
import images from "../images"
import { DrawerJogadores } from "../components/DrawerJogadores"
import { JoinRoomModal } from "../components/JoinRoomModal"
import { colors } from "../style/colors"
import { useUser } from "../hooks/useUser"
import { RouteProp } from "@react-navigation/native"
import { ModalInitRound } from "../components/ModalInitRound"

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
    DrawerJogadores.defaultProps = {
        users: [],
    }
    const socket = useIo()
    const { username } = useUser()
    //const [roomId, setRoomId] = useState<string | null>(null)
    const roomid = route.params.roomId

    const [users, setUsers] = useState<Array<{ id: string; username: string }>>([])
    const [userMap, setUserMap] = useState<{ [userID: string]: string }>({})

    const [letter, setLetter] = useState<string | null>(null)
    const [answers, setAnswers] = useState<{ [category: string]: string }>({})
    const [userWord, setUserWord] = useState("")
    const [allUserAnswers, setAllUserAnswers] = useState<{ [userId: string]: { [category: string]: string } }>({})

    const categories = ["Animal", "País", "Comida"]

    const [isRoundActive, setIsRoundActive] = useState(false) // Estado para rastrear se a rodada está ativa
    const [gameResults, setGameResults] = useState<{ [userId: string]: number }>({})

    const [visibleStop, setVisibleStop] = React.useState(false)
    const [visible, setVisible] = React.useState(true)
    const showModal = () => setVisible(true)
    const hideModal = () => setVisible(false)
    const [showStopModal, setShowStopModal] = useState(false)
    const [stopActivatedBy, setStopActivatedBy] = useState("")

    const answersRef = useRef<{ [category: string]: string }>({})

    // Verificar se todos os campos de texto foram preenchidos
    const areAllFieldsFilled = categories.every((cat) => answers[cat])

    const joinRoom = (id: string) => {
        //setRoomId(id)
        socket.emit("join-room", { roomId: id, username: username })
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

        // socket.on("user-left", (data) => {
        //     const { userId, username } = data
        //     console.log("User left:", username)
        // })

        // Quando o evento request-answers for recebido, o cliente enviará todas as suas respostas de todos os jogadores:
        socket.on("request-answers", () => {
            console.log("Current answers state:", answersRef.current)
            socket.emit("submit-answer", { roomId: roomid, answer: answersRef.current })
        })
        socket.on("stop-activated", (data) => {
            console.log("Received stop-activated with data:", data)
            setStopActivatedBy(data.username)
            setShowStopModal(true)
        })

        return () => {
          
            socket.off("user-list")
            socket.off("new-answer")
            socket.off("game-data")
            socket.off("game-stopped")
            socket.off("request-answers")
            socket.off("stop-activated")
        }
    }, [socket])
    console.log("Room users state:", users)
    return (
        <SafeAreaView style={{ flex: 1, alignItems: "center", padding: 10, gap: 30 }}>
            {/* <Image source={images.studio} style={{ width: 120, height: 120, resizeMode: "contain" }} /> */}
            {!isRoundActive && <DrawerJogadores users={users} />}
            <View
                style={{
                    flex: 1,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: 55,
                }}
            >
                {letter ? (
                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Text
                            variant="displayLarge"
                            style={{
                                paddingTop: 70,
                                color: colors.background.modalY,
                                fontSize: 100,
                            }}
                        >
                            {letter}
                        </Text>
                        <View
                            style={{
                                width: "75%",
                                padding: 15,
                                alignItems: "center",
                                backgroundColor: colors.primary,
                                borderRadius: 15,
                            }}
                        >
                            {categories.map((category) => (
                                <View key={category}>
                                    <Text
                                        style={{
                                            color: colors.color.white,
                                            fontWeight: "600",
                                            fontSize: 23,
                                            textAlign: "center",
                                        }}
                                    >
                                        {category}
                                    </Text>
                                    <TextInput
                                        style={{
                                            width: 200,
                                            margin: 8,
                                            height: 35,
                                            paddingHorizontal: 0,
                                            textAlign: "center",
                                            borderRadius: 25,
                                            color: colors.color.black,
                                            backgroundColor: "#fff",
                                            fontSize: 23,
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
                    </View>
                ) : null}

                {/* Modal para o botão Stop */}
                {isRoundActive && areAllFieldsFilled && (
                    <Portal>
                        <Modal visible={visibleStop} onDismiss={hideModal}>
                            <View
                                style={{
                                    flex: 0.8,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "red",
                                }}
                            >
                                <IconButton
                                    icon="pause"
                                    style={{ marginTop: 30, borderRadius: 100, width: 120, height: 120 }}
                                    onPress={() => {
                                        socket.emit("request-answers")
                                        socket.emit("stop-game", { roomId: roomid, username: username })
                                        setVisibleStop(false)
                                    }}
                                    iconColor="#fff"
                                    containerColor="red"
                                    size={70}
                                />

                                <Image source={images.logo} style={{ width: 240 }} resizeMode="contain" />
                            </View>
                        </Modal>
                    </Portal>
                )}

                {showStopModal && isRoundActive && (
                    <ModalN visible={showStopModal} transparent={true} onRequestClose={() => setShowStopModal(false)}>
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
                            <View
                                style={{
                                    height: "50%",
                                    padding: 30,
                                    borderRadius: 10,
                                    backgroundColor: colors.background.modalY,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 40,
                                }}
                            >
                                <Image source={require("../../assets/stop.png")} />
                                <View style={{ backgroundColor: "#fff", borderRadius: 15, padding: 15 }}>
                                    <Text style={{ fontSize: 35, fontWeight: "600" }}>{stopActivatedBy} deu stop!</Text>
                                </View>
                            </View>
                        </View>
                    </ModalN>
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
                        <ButtonPaper
                            buttonColor={colors.button2}
                            textColor={colors.color.white}
                            style={{ borderRadius: 15, width: "50%" }}
                            onPress={() => {
                                socket.emit("start-game", { roomId: roomid })
                                setVisibleStop(true)
                            }}
                            labelStyle={{ fontSize: 30, paddingTop: 12 }}
                        >
                            Vamos lá
                        </ButtonPaper>
                        <ButtonPaper
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
                        </ButtonPaper>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}
