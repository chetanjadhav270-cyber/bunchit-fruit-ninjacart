import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

export interface PlayerData {
  contactNumber: string;
  name: string;
  score: number;
  lastUpdated: any; // Firestore timestamp
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  rank: number;
  isCurrentUser?: boolean;
}

// Check if player exists and handle score submission
export async function submitPlayerScore(contactNumber: string, name: string, score: number): Promise<boolean> {
  try {
    const playerRef = doc(db, "players", contactNumber);
    const playerSnap = await getDoc(playerRef);
    
    if (playerSnap.exists()) {
      // Player exists, check if new score is higher
      const existingData = playerSnap.data() as PlayerData;
      if (score > existingData.score) {
        // Update with higher score
        await updateDoc(playerRef, {
          score,
          lastUpdated: serverTimestamp()
        });
        return true;
      }
      return false; // Score not improved
    } else {
      // New player, create document
      await setDoc(playerRef, {
        contactNumber,
        name,
        score,
        lastUpdated: serverTimestamp()
      });
      return true;
    }
  } catch (error) {
    console.error("Error submitting player score:", error);
    throw error;
  }
}

// Fetch leaderboard data from Firestore
export async function getLeaderboard(userContactNumber?: string): Promise<LeaderboardEntry[]> {
  try {
    const playersRef = collection(db, "players");
    const q = query(playersRef, orderBy("score", "desc"), limit(50));
    const querySnapshot = await getDocs(q);
    
    const leaderboard: LeaderboardEntry[] = [];
    let rank = 1;
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as PlayerData;
      leaderboard.push({
        id: doc.id,
        name: data.name,
        score: data.score,
        rank,
        isCurrentUser: userContactNumber ? data.contactNumber === userContactNumber : false
      });
      rank++;
    });
    
    return leaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
}

// Get specific player data
export async function getPlayerData(contactNumber: string): Promise<PlayerData | null> {
  try {
    const playerRef = doc(db, "players", contactNumber);
    const playerSnap = await getDoc(playerRef);
    
    if (playerSnap.exists()) {
      return playerSnap.data() as PlayerData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching player data:", error);
    throw error;
  }
}