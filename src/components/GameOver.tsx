import { GameButton } from "@/components/ui/game-button"
import { Trophy, Star, Clock } from "lucide-react"

interface GameOverProps {
  score: number
  onCheckLeaderboard: () => void
}

export function GameOver({ score, onCheckLeaderboard }: GameOverProps) {
  return (
    <div className="min-h-screen gradient-game-bg flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-primary mb-2">Game Over!</h1>
          <p className="text-lg text-muted-foreground">Great job catching those fruits!</p>
        </div>

        {/* Score Card */}
        <div className="bg-card rounded-2xl p-8 shadow-card mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6 text-accent" />
            <h2 className="text-xl font-bold text-card-foreground">Final Score</h2>
            <Star className="w-6 h-6 text-accent" />
          </div>
          
          <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-4">
            {score}
          </div>
          
          <p className="text-muted-foreground">Points earned</p>
        </div>

        {/* Prize Info */}
        <div className="gradient-accent rounded-xl p-6 mb-6 text-center shadow-special">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Trophy className="w-6 h-6 text-accent-foreground" />
            <h3 className="text-lg font-bold text-accent-foreground">Win a Bunchit coupon of ₹500!</h3>
          </div>
          
          <p className="text-accent-foreground font-semibold mb-2">
            Top the leaderboard by 3 PM to claim your prize!
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-accent-foreground/80">
            <Clock className="w-4 h-4" />
            <span>Hurry up! Time is ticking</span>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <p className="text-xs text-muted-foreground text-center">
            *If you have already picked your order, we will waive off your order value (orders below ₹500 will be waived off) *T&C
          </p>
        </div>

        {/* Action Button */}
        <GameButton 
          variant="primary" 
          size="lg" 
          className="w-full"
          onClick={onCheckLeaderboard}
        >
          🏆 Check Leaderboard
        </GameButton>
      </div>
    </div>
  )
}