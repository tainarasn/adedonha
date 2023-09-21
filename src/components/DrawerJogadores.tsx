import React from "react"
import { Text } from "react-native"
import { Drawer } from "react-native-paper"

interface DrawerJogadoresProps {
    users: User[]
}

export const DrawerJogadores: React.FC<DrawerJogadoresProps> = ({ users }) => {
    const [active, setActive] = React.useState("")

    return (
        <Drawer.Section title="" style={{ paddingHorizontal: 30, gap: 13, alignItems: "center" }}>
            {/* Renderizar a lista de usuários */}
            {users.map((user) => (
                <Text style={{ fontSize: 18 }} key={user.id}>
                    {user.username}
                </Text>
            ))}
        </Drawer.Section>
    )
}
