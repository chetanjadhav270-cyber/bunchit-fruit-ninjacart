import { GameButton } from "@/components/ui/game-button"
import { Apple, Cherry, Banana, Zap, Clock, Target } from "lucide-react"

interface InstructionsProps {
  onStartGame: () => void
}

export function Instructions({ onStartGame }: InstructionsProps) {
  return (
    <div className="min-h-screen gradient-game-bg flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">🧺 Bunchit Catch</h1>
          <p className="text-lg text-muted-foreground">Catch the falling fruits!</p>
        </div>

        {/* Instructions Card */}
        <div className="bg-card rounded-2xl p-6 shadow-card mb-8">
          <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            How to Play
          </h2>
          
          <div className="space-y-4">
            {/* Good Items */}
            <div className="flex items-start gap-3">
              <div className="flex gap-1">
                <Apple className="w-5 h-5 text-secondary" />
                <Cherry className="w-5 h-5 text-destructive" />
                <Banana className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-secondary">Catch Good Fruits</p>
                <p className="text-sm text-muted-foreground">+10 points each</p>
              </div>
            </div>

            {/* Special Crate */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-6 gradient-accent rounded flex items-center justify-center">
                <span className="text-xs font-bold">📦</span>
              </div>
              <div>
                <p className="font-semibold text-accent">Bunchit Special Crate</p>
                <p className="text-sm text-muted-foreground">+50 points! At least 1 per game</p>
              </div>
            </div>

            {/* Bad Items */}
            <div className="flex items-start gap-3">
              <div className="flex gap-1">
                <span className="text-lg">🪨</span>
                <span className="text-lg">🍎‍🟫</span>
              </div>
              <div>
                <p className="font-semibold text-destructive">Avoid These!</p>
                <p className="text-sm text-muted-foreground">Stones & rotten fruits</p>
              </div>
            </div>

            {/* Game Mechanics */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="font-semibold">1 minute game</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className="font-semibold">Speed increases every 10 seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reward Info */}
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mb-6">
          <p className="text-center font-bold text-accent-foreground">
            🏆 Top the leaderboard by 3 PM to win a Bunchit coupon of ₹500!
          </p>
          <p className="text-xs text-center text-muted-foreground mt-2">
            *If you have already picked your order, we will waive off your order value (orders below ₹500 will be waived off) *T&C
          </p>
        </div>

        {/* Start Button */}
        <GameButton 
          variant="primary" 
          size="lg" 
          className="w-full"
          onClick={onStartGame}
        >
          🚀 Start Game
        </GameButton>
      </div>
    </div>
  )
}