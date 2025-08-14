import { useState } from "react"
import { GameButton } from "@/components/ui/game-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Phone } from "lucide-react"

interface LeaderboardFormProps {
  score: number
  onSubmit: (name: string, contact: string) => void
}

export function LeaderboardForm({ score, onSubmit }: LeaderboardFormProps) {
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !contact.trim()) return

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
    onSubmit(name.trim(), contact.trim())
    setIsSubmitting(false)
  }

  const isValid = name.trim().length > 0 && contact.trim().length >= 10

  return (
    <div className="min-h-screen gradient-game-bg flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">📋</div>
          <h1 className="text-2xl font-bold text-primary mb-2">Enter Your Details</h1>
          <p className="text-muted-foreground">Join the leaderboard with your score of {score} points!</p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl p-6 shadow-card mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-card-foreground font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base rounded-lg border-2 focus:border-primary"
                required
              />
            </div>

            {/* Contact Input */}
            <div className="space-y-2">
              <Label htmlFor="contact" className="text-card-foreground font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Contact Number
              </Label>
              <Input
                id="contact"
                type="tel"
                placeholder="Enter your phone number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="h-12 text-base rounded-lg border-2 focus:border-primary"
                required
                minLength={10}
              />
            </div>

            {/* Submit Button */}
            <GameButton 
              type="submit"
              variant="primary" 
              size="lg" 
              className="w-full"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
                  Submitting...
                </>
              ) : (
                "🚀 Submit & View Leaderboard"
              )}
            </GameButton>
          </form>
        </div>

        {/* Privacy Note */}
        <div className="text-xs text-muted-foreground text-center">
          Your contact information will be used only for prize distribution and order processing.
        </div>
      </div>
    </div>
  )
}