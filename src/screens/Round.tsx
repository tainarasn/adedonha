import React, { useEffect, useState } from "react"
import { useIo } from "../hooks/useIo"

interface RoundProps {}

export const Round: React.FC<RoundProps> = ({}) => {
    const socket = useIo()

    const [letter, setLetter] = useState<string | null>(null)
    const [answers, setAnswers] = useState<{ [category: string]: string }>({})
    const [userWord, setUserWord] = useState("")

    useEffect(() => {
        socket.on("game-data", (data: { letter: string; category: string }) => {
            setLetter(data.letter)
            //setIsRoundActive(true) // Definir a rodada como ativa
        })
    })
    return <div className="Round-Component"></div>
}
