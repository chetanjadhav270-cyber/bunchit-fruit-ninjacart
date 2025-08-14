import { useState } from "react"
import { Instructions } from "@/components/Instructions"
import { GameScreen } from "@/components/GameScreen"
import { GameOver } from "@/components/GameOver"
import { LeaderboardForm } from "@/components/LeaderboardForm"
import { Leaderboard } from "@/components/Leaderboard"

type GameState = 'instructions' | 'playing' | 'gameOver' | 'leaderboardForm' | 'leaderboard'

interface PlayerData {
  name: string
  contact: string
  score: number
}

export default function Game() {
  const [gameState, setGameState] = useState<GameState>('instructions')
  const [playerData, setPlayerData] = useState<PlayerData>({ name: '', contact: '', score: 0 })

  const handleStartGame = () => {
    setGameState('playing')
  }

  const handleGameEnd = (score: number) => {
    setPlayerData(prev => ({ ...prev, score }))
    setGameState('gameOver')
  }

  const handleCheckLeaderboard = () => {
    setGameState('leaderboardForm')
  }

  const handleFormSubmit = (name: string, contact: string) => {
    setPlayerData(prev => ({ ...prev, name, contact }))
    setGameState('leaderboard')
  }

  switch (gameState) {
    case 'instructions':
      return <Instructions onStartGame={handleStartGame} />
    
    case 'playing':
      return <GameScreen onGameEnd={handleGameEnd} />
    
    case 'gameOver':
      return <GameOver score={playerData.score} onCheckLeaderboard={handleCheckLeaderboard} />
    
    case 'leaderboardForm':
      return <LeaderboardForm score={playerData.score} onSubmit={handleFormSubmit} />
    
    case 'leaderboard':
      return <Leaderboard userScore={playerData.score} userName={playerData.name} userContact={playerData.contact} />
    
    default:
      return <Instructions onStartGame={handleStartGame} />
  }
}