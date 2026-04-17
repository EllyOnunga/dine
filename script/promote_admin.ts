
import { getStorage } from "../server/storage";
import { connectToDatabase, closeDatabase } from "../server/db";

const clerkId = process.argv[2];

if (!clerkId) {
    console.error("Usage: npx tsx script/promote_admin.ts <CLERK_USER_ID>");
    process.exit(1);
}

async function promote() {
    try {
        await connectToDatabase();
        const storage = getStorage();
        
        console.log(`Checking user: ${clerkId}...`);
        const user = await storage.getUser(clerkId);
        
        if (!user) {
            console.log(`User with Clerk ID ${clerkId} not found in local database.`);
            console.log("Creating new user record and promoting to admin...");
            
            const newUser = await storage.createUser({
                id: clerkId,
                username: clerkId, // Using ID as placeholder username
                isAdmin: true,
                loyaltyPoints: 0
            });
            
            if (newUser && newUser.isAdmin) {
                console.log("Success! New user record created and promoted to admin.");
            } else {
                console.error("Failed to create and promote new user.");
            }
        } else {
            console.log(`Found user: ${user.username}. Promoting to admin...`);
            const updatedUser = await storage.setAdminStatus(clerkId, true);
            
            if (updatedUser && updatedUser.isAdmin) {
                console.log("Success! User has been promoted to admin.");
            } else {
                console.error("Failed to update user admin status.");
            }
        }
        
        await closeDatabase();
        process.exit(0);
    } catch (error) {
        console.error("Error promoting user:", error);
        await closeDatabase();
        process.exit(1);
    }
}

promote();
