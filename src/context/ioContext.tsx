import { Socket, io as ioSocket } from "socket.io-client"
import { createContext, useEffect } from "react"

interface IoContextValue {
    io: Socket
}

interface IoProviderProps {
    children: React.ReactNode
}

const IoContext = createContext<IoContextValue>({} as IoContextValue)
export default IoContext

// const io = ioSocket("ws://localhost:4104")
<<<<<<< HEAD
//const io = ioSocket("http://192.168.15.4:3000")
=======
>>>>>>> parent of 5d876d9 (feat: room id correct and random avatar)
const io = ioSocket("http://192.168.15.8:3000")

export const IoProvider: React.FC<IoProviderProps> = ({ children }) => {
    useEffect(() => {
        io.once("connect_error", () => {
            // snackbar({
            //     severity: "error",
            //     text: "Não foi possível se conectar com o servidor, verifique sua conexão com a internet",
            // })
        })

        io.on("connection", (message) => {
            // snackbar({ severity: "success", text: "Conectado com o servidor" })
            console.log(message)
        })

        io.on("disconnect", (reason) => {
            if (reason == "io client disconnect" || reason == "io server disconnect") {
                // snackbar({ severity: "info", text: "Desconectado do servidor" })
            } else {
                // snackbar({ severity: "error", text: "Conexão com o servidor perdida! Tentando reconectar automaticamente" })
            }
        })

        return () => {
            io.off("connect_error")
            io.off("connection")
            io.off("disconnect")
        }
    }, [])
    return <IoContext.Provider value={{ io }}>{children}</IoContext.Provider>
}
