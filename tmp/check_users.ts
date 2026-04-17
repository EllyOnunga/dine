
import { storage } from "../server/storage";

async function checkUsers() {
    try {
        console.log("Checking users in database...");
        // Since getOrders/getReservations exist, I'll just use the db directly if needed, 
        // but storage.ts doesn't have a 'getAllUsers' method.
        // I'll import db and schema directly.
        const { db } = await import("../server/db");
        const schema = await import("../shared/schema");
        
        const allUsers = await db.select().from(schema.users);
        console.log("All Users:");
        console.table(allUsers);
        
        const adminCount = await storage.countAdmins();
        console.log(`Total Admins: ${adminCount}`);
        
        process.exit(0);
    } catch (error) {
        console.error("Error checking users:", error);
        process.exit(1);
    }
}

checkUsers();
