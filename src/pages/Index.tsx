import { GameButton } from "@/components/ui/game-button"
import { Link } from "react-router-dom"
import { Play, QrCode, Gift } from "lucide-react"

const Index = () => {
  return (
    <div className="min-h-screen gradient-game-bg">
      {/* Navigation Header */}
      <header className="p-6 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">🧺 Bunchit Catch</h1>
        <p className="text-muted-foreground">The ultimate fruit-catching game!</p>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-6 pb-20">
        <div className="max-w-md w-full">
          {/* Welcome Card */}
          <div className="bg-card rounded-2xl p-8 shadow-card text-center mb-8">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold text-card-foreground mb-4">Welcome to Bunchit Catch!</h2>
            <p className="text-muted-foreground mb-6">
              Catch falling fruits, avoid obstacles, and compete for amazing prizes!
            </p>
            
            <div className="space-y-4">
              <Link to="/game">
                <GameButton variant="primary" size="lg" className="w-full">
                  <Play className="w-5 h-5 mr-2" />
                  Start Playing
                </GameButton>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid gap-4 mb-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4">
              <div className="text-2xl">🍎</div>
              <div>
                <h3 className="font-semibold text-card-foreground">Catch Fresh Fruits</h3>
                <p className="text-sm text-muted-foreground">Earn 10 points for each fruit</p>
              </div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4">
              <div className="text-2xl">📦</div>
              <div>
                <h3 className="font-semibold text-card-foreground">Special Bunchit Crates</h3>
                <p className="text-sm text-muted-foreground">Bonus 50 points for special crates</p>
              </div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4">
              <div className="text-2xl">🏆</div>
              <div>
                <h3 className="font-semibold text-card-foreground">Win Bunchit Coupon</h3>
                <p className="text-sm text-muted-foreground">₹500 coupon for top players</p>
              </div>
            </div>
          </div>

          {/* Prize Banner */}
          <div className="gradient-accent rounded-xl p-6 text-center shadow-special">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gift className="w-6 h-6 text-accent-foreground" />
              <h3 className="text-lg font-bold text-accent-foreground">Bunchit Coupon of ₹500!</h3>
            </div>
            <p className="text-accent-foreground font-semibold">
              Top the leaderboard by 3 PM and win a ₹500 coupon from Bunchit!
            </p>
          </div>
        </div>
      </main>

      {/* QR Code Info */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t p-4">
        <div className="text-center flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <QrCode className="w-4 h-4" />
          <span>Scan QR code to start playing • bunchit.in</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
