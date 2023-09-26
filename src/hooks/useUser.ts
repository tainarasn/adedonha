import { useIo } from "./useIo"
import { useContext } from "react"
import { UserContext } from "../context/userContext"

export const useUser = () => {
    const { username, setUsername } = useContext(UserContext)
    return { username, setUsername }
}
