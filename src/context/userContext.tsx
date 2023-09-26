import { createContext, useState, useEffect } from "react"
import React from "react"
import { useIo } from "../hooks/useIo"

interface UserContextValue {
    user?: User
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>
    username?: string
    setUsername: React.Dispatch<React.SetStateAction<string | undefined>>
}

interface UserProviderProps {
    children: React.ReactNode
}

export const UserContext = createContext<UserContextValue>({} as UserContextValue)

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const socket = useIo()
    const [user, setUser] = useState<User>()
    const [username, setUsername] = useState<string>()

    useEffect(() => {
        socket.on("user-joined", (data: User) => {
            const { id, username } = data
            console.log(`User joined: ${username} (ID: ${id})`)
        })

        socket.on("user-left", (data: User) => {
            const { id, username } = data
            console.log("User left:", username)
        })
        return () => {
            socket.off("user-joined")
            socket.off("user-left")
        }
    }, [user])
    return <UserContext.Provider value={{ user, setUser, username, setUsername }}>{children}</UserContext.Provider>
}
