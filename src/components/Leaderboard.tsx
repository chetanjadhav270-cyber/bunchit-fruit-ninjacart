import { useState, useEffect } from "react"
import { GameButton } from "@/components/ui/game-button"
import { Crown, Medal, Award, ExternalLink } from "lucide-react"

interface LeaderboardEntry {
  id: string
  name: string
  score: number
  rank: number
  isCurrentUser?: boolean
}

interface LeaderboardProps {
  userScore: number
  userName: string
}

// Mock leaderboard data - in a real app this would come from a backend
const generateMockLeaderboard = (userScore: number, userName: string): LeaderboardEntry[] => {
  const mockPlayers = [
    { name: "Rajesh Kumar", score: 850 },
    { name: "Priya Sharma", score: 720 },
    { name: "Amit Singh", score: 680 },
    { name: "Sneha Patel", score: 590 },
    { name: "Vikram Joshi", score: 540 },
    { name: "Anita Gupta", score: 510 },
    { name: "Rohit Mehta", score: 480 },
    { name: "Kavya Reddy", score: 450 },
  ]

  // Add current user
  const allPlayers = [...mockPlayers, { name: userName, score: userScore }]
  
  // Sort by score
  allPlayers.sort((a, b) => b.score - a.score)
  
  // Add ranks and mark current user
  return allPlayers.map((player, index) => ({
    id: index.toString(),
    name: player.name,
    score: player.score,
    rank: index + 1,
    isCurrentUser: player.name === userName
  }))
}

export function Leaderboard({ userScore, userName }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLeaderboard(generateMockLeaderboard(userScore, userName))
      setLoading(false)
    }, 1000)
  }, [userScore, userName])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-accent" />
      case 2:
      case 3:
        return <Medal className="w-6 h-6 text-secondary" />
      default:
        return <Award className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getRankBg = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return "gradient-primary text-primary-foreground"
    switch (rank) {
      case 1:
        return "gradient-accent text-accent-foreground"
      case 2:
      case 3:
        return "gradient-secondary text-secondary-foreground"
      default:
        return "bg-card text-card-foreground"
    }
  }

  const handleOrderNow = () => {
    window.open('https://bunchit.in/', '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-game-bg flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  const currentUserEntry = leaderboard.find(entry => entry.isCurrentUser)
  const topEntries = leaderboard.slice(0, 10)

  return (
    <div className="min-h-screen gradient-game-bg p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">🏆 Leaderboard</h1>
          <p className="text-muted-foreground">See how you rank against other players!</p>
        </div>

        {/* Current User Highlight */}
        {currentUserEntry && (
          <div className="bg-card rounded-xl p-4 shadow-card mb-6 border-2 border-primary/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Your Position</p>
              <div className="flex items-center justify-center gap-3">
                {getRankIcon(currentUserEntry.rank)}
                <span className="text-2xl font-bold text-primary">#{currentUserEntry.rank}</span>
              </div>
              <p className="text-lg font-semibold text-card-foreground">{currentUserEntry.score} points</p>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-3 mb-8">
          {topEntries.map((entry) => (
            <div
              key={entry.id}
              className={`rounded-xl p-4 shadow-card flex items-center justify-between ${getRankBg(entry.rank, entry.isCurrentUser || false)}`}
            >
              <div className="flex items-center gap-3">
                {getRankIcon(entry.rank)}
                <div>
                  <p className="font-semibold">
                    {entry.name}
                    {entry.isCurrentUser && <span className="ml-2 text-sm">(You)</span>}
                  </p>
                  <p className="text-sm opacity-80">#{entry.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{entry.score}</p>
                <p className="text-sm opacity-80">points</p>
              </div>
            </div>
          ))}
        </div>

        {/* Prize Banner */}
        <div className="gradient-accent rounded-xl p-6 text-center shadow-special mb-6">
          <h3 className="text-lg font-bold text-accent-foreground mb-2">
            🎁 Prize Winner by 3 PM gets Bunchit coupon of ₹500!
          </h3>
          <p className="text-sm text-accent-foreground/80">
            Keep playing to improve your rank!
          </p>
        </div>

        {/* Order Button */}
        <GameButton 
          variant="secondary" 
          size="lg" 
          className="w-full"
          onClick={handleOrderNow}
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          Order Now on Bunchit
        </GameButton>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Fresh fruits delivered to your doorstep • bunchit.in
          </p>
        </div>
      </div>
    </div>
  )
}