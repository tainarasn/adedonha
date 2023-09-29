import React from "react"
import { Text } from "react-native"
import { Drawer } from "react-native-paper"

interface DrawerJogadoresProps {
    users: User[]
}

export const DrawerJogadores: React.FC<DrawerJogadoresProps> = ({ users }) => {
    const [active, setActive] = React.useState("")
    console.log("DrawerJogadores users:", users)
    console.log("Tipo de users:", typeof users)
    console.log("Valor de users:", users)
    return (
        <Drawer.Section title="" style={{ paddingHorizontal: 30, gap: 13, alignItems: "center" }}>
            {/* Renderizar a lista de usuários */}
            {Array.isArray(users) && (
                <>
                    {console.log("Rendering users:", users)}
                    {users.map((user) => (
                        <Text style={{ fontSize: 25 }} key={user.id}>
                            {user.username}
                        </Text>
                    ))}
                </>
            )}
        </Drawer.Section>
    )
}
