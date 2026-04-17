import { connectToDatabase, closeDatabase } from './server/db.js';
import dotenv from 'dotenv';

// Load environment variables manually for this script since it's run at root
dotenv.config();

async function testConnection() {
  try {
    console.log("Using URI from env:", process.env.MONGODB_URI);
    console.log("Using URL from env:", process.env.MONGODB_URL);
    console.log("Testing connection...");
    
    // Check if the current .env logic applies properly
    const db = await connectToDatabase();
    
    console.log("Connection successful!");
    
    const collections = await db.collections();
    console.log("Collections:", collections.map(c => c.collectionName));
    
    await closeDatabase();
    console.log("Disconnected properly.");
  } catch (error) {
    console.error("Connection failed:", error);
    process.exit(1);
  }
}

testConnection();
