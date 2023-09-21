import React from "react"
import { View } from "react-native"
import { Modal, Portal, Text, Button as ButtonPaper } from "react-native-paper"

interface JoinRoomModalProps {}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({}) => {
    const [visible, setVisible] = React.useState(true)

    const showModal = () => setVisible(true)
    const hideModal = () => setVisible(false)
    const containerStyle = { backgroundColor: "white", padding: 20 }

    return (
        <View>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <Text>Example Modal. Click outside this area to dismiss.</Text>
                </Modal>
            </Portal>
            <ButtonPaper style={{ marginTop: 30 }} onPress={showModal}>
                Entrar na
            </ButtonPaper>
        </View>
    )
}
