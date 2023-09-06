import { useContext } from "react"
import { UserContext } from "../context/userContext"
import { useIo } from "./useIo"

export const useUser = () => {
    const io = useIo()

    const { user, setUser } = useContext(UserContext)

    return { user }
}
