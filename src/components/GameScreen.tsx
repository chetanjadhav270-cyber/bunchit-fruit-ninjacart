import { useState, useEffect, useCallback, useRef } from "react"
import { GameButton } from "@/components/ui/game-button"

interface FallingItem {
  id: string
  type: 'apple' | 'banana' | 'cherry' | 'orange' | 'stone' | 'rotten' | 'special-crate'
  x: number
  y: number
  points: number
  isDangerous: boolean
}

interface GameScreenProps {
  onGameEnd: (score: number) => void
}

const GAME_DURATION = 60 // 60 seconds
const SPEED_INCREASE_INTERVAL = 10 // Every 10 seconds
const BASE_FALL_SPEED = 2
const ITEM_SIZE = 50

const itemEmojis = {
  apple: '🍎',
  banana: '🍌', 
  cherry: '🍒',
  orange: '🍊',
  stone: '🪨',
  rotten: '🤢',
  'special-crate': '📦'
}

export function GameScreen({ onGameEnd }: GameScreenProps) {
  const [items, setItems] = useState<FallingItem[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [gameSpeed, setGameSpeed] = useState(1)
  const [dragPosition, setDragPosition] = useState({ x: 50, y: 80 }) // Percentage based
  const [isDragging, setIsDragging] = useState(false)
  const [specialCratesSpawned, setSpecialCratesSpawned] = useState(0)
  const [scorePopup, setScorePopup] = useState<{show: boolean, points: number, x: number, y: number}>({
    show: false, points: 0, x: 0, y: 0
  })
  
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  // Generate random items
  const generateItem = useCallback((): FallingItem => {
    const gameArea = gameAreaRef.current
    if (!gameArea) return { id: '', type: 'apple', x: 0, y: 0, points: 0, isDangerous: false }

    const gameWidth = gameArea.clientWidth
    const shouldSpawnSpecial = specialCratesSpawned === 0 && timeLeft < 30 && Math.random() < 0.1
    
    let type: FallingItem['type']
    let points = 0
    let isDangerous = false

    if (shouldSpawnSpecial) {
      type = 'special-crate'
      points = 50
      setSpecialCratesSpawned(prev => prev + 1)
    } else {
      const speedFactor = Math.floor((GAME_DURATION - timeLeft) / SPEED_INCREASE_INTERVAL)
      const badItemChance = Math.min(0.3 + speedFactor * 0.1, 0.6) // Increases with speed
      
      if (Math.random() < badItemChance) {
        type = Math.random() < 0.5 ? 'stone' : 'rotten'
        isDangerous = true
      } else {
        const fruits: Array<'apple' | 'banana' | 'cherry' | 'orange'> = ['apple', 'banana', 'cherry', 'orange']
        type = fruits[Math.floor(Math.random() * fruits.length)]
        points = 10
      }
    }

    return {
      id: Date.now().toString() + Math.random(),
      type,
      x: Math.random() * (gameWidth - ITEM_SIZE),
      y: -ITEM_SIZE,
      points,
      isDangerous
    }
  }, [timeLeft, specialCratesSpawned])

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      setItems(prevItems => {
        const gameArea = gameAreaRef.current
        if (!gameArea) return prevItems

        return prevItems
          .map(item => ({
            ...item,
            y: item.y + BASE_FALL_SPEED * gameSpeed
          }))
          .filter(item => item.y < gameArea.clientHeight + ITEM_SIZE)
      })

      animationRef.current = requestAnimationFrame(gameLoop)
    }

    animationRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameSpeed])

  // Spawn items
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (timeLeft > 0) {
        setItems(prev => [...prev, generateItem()])
      }
    }, Math.max(800 - gameSpeed * 100, 300))

    return () => clearInterval(spawnInterval)
  }, [generateItem, gameSpeed, timeLeft])

  // Timer and speed increase
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
        
        // Increase speed every 10 seconds
        if ((GAME_DURATION - timeLeft + 1) % SPEED_INCREASE_INTERVAL === 0) {
          setGameSpeed(prev => prev + 0.5)
        }
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      onGameEnd(score)
    }
  }, [timeLeft, onGameEnd, score])

  // Collision detection
  useEffect(() => {
    const checkCollisions = () => {
      const gameArea = gameAreaRef.current
      const player = playerRef.current
      if (!gameArea || !player) return

      const playerRect = {
        x: (dragPosition.x / 100) * gameArea.clientWidth,
        y: (dragPosition.y / 100) * gameArea.clientHeight,
        width: 60,
        height: 60
      }

      setItems(prevItems => {
        const remainingItems: FallingItem[] = []
        
        prevItems.forEach(item => {
          const itemRect = {
            x: item.x,
            y: item.y,
            width: ITEM_SIZE,
            height: ITEM_SIZE
          }

          // Check collision
          const isColliding = 
            playerRect.x < itemRect.x + itemRect.width &&
            playerRect.x + playerRect.width > itemRect.x &&
            playerRect.y < itemRect.y + itemRect.height &&
            playerRect.y + playerRect.height > itemRect.y

          if (isColliding && !item.isDangerous) {
            // Caught a good item
            setScore(prev => prev + item.points)
            
            // Show score popup
            setScorePopup({
              show: true,
              points: item.points,
              x: item.x + ITEM_SIZE / 2,
              y: item.y
            })
            setTimeout(() => setScorePopup(prev => ({ ...prev, show: false })), 600)
          } else if (isColliding && item.isDangerous) {
            // Caught a dangerous item - reduce score
            const penalty = -10
            setScore(prev => Math.max(0, prev + penalty)) // Don't let score go below 0
            
            // Show penalty popup
            setScorePopup({
              show: true,
              points: penalty,
              x: item.x + ITEM_SIZE / 2,
              y: item.y
            })
            setTimeout(() => setScorePopup(prev => ({ ...prev, show: false })), 600)
          } else if (!isColliding) {
            // Item continues falling
            remainingItems.push(item)
          }
        })

        return remainingItems
      })
    }

    const collisionInterval = setInterval(checkCollisions, 16) // ~60fps
    return () => clearInterval(collisionInterval)
  }, [dragPosition])

  // Mouse/touch handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !gameAreaRef.current) return
    
    const rect = gameAreaRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setDragPosition({
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(70, Math.min(95, y))
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !gameAreaRef.current) return
    
    const touch = e.touches[0]
    const rect = gameAreaRef.current.getBoundingClientRect()
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    const y = ((touch.clientY - rect.top) / rect.height) * 100
    
    setDragPosition({
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(70, Math.min(95, y))
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen gradient-game-bg relative overflow-hidden select-none">
      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <div className="gradient-primary text-primary-foreground px-4 py-2 rounded-lg font-bold shadow-fruit">
          Score: {score}
        </div>
        <div className="bg-timer text-destructive-foreground px-4 py-2 rounded-lg font-bold shadow-fruit">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Game Area */}
      <div 
        ref={gameAreaRef}
        className="absolute inset-0 w-full h-full cursor-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Falling Items */}
        {items.map(item => (
          <div
            key={item.id}
            className={`absolute text-4xl transition-transform duration-75 ${
              item.type === 'special-crate' ? 'shadow-special' : ''
            }`}
            style={{
              left: item.x,
              top: item.y,
              width: ITEM_SIZE,
              height: ITEM_SIZE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {item.type === 'special-crate' ? (
              <div className="gradient-accent rounded-lg w-full h-full flex items-center justify-center text-2xl font-bold border-2 border-accent-glow">
                📦
                <span className="absolute bottom-0 text-xs text-accent-foreground font-bold">BUNCHIT</span>
              </div>
            ) : (
              itemEmojis[item.type]
            )}
          </div>
        ))}

        {/* Player (Basket) */}
        <div
          ref={playerRef}
          className="absolute z-20 cursor-grab active:cursor-grabbing"
          style={{
            left: `${dragPosition.x}%`,
            top: `${dragPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            width: 60,
            height: 60
          }}
        >
          <div className="text-5xl">🧺</div>
        </div>

        {/* Score Popup */}
        {scorePopup.show && (
          <div
            className={`absolute z-30 text-2xl font-bold score-pop pointer-events-none ${
              scorePopup.points > 0 ? 'text-primary' : 'text-destructive'
            }`}
            style={{
              left: scorePopup.x,
              top: scorePopup.y
            }}
          >
            {scorePopup.points > 0 ? '+' : ''}{scorePopup.points}
          </div>
        )}
      </div>

      {/* Speed Indicator */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm px-3 py-1 rounded-lg text-sm">
        Speed: {gameSpeed}x
      </div>
    </div>
  )
}