import { useContext } from "react"
import IoContext from "../context/ioContext"

export const useIo = () => {
    const ioContext = useContext(IoContext)

    return ioContext.io
}
