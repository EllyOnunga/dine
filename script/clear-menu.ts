import "dotenv/config";
import { db } from "../server/db";
import { menuItems } from "../shared/schema";

async function clearMenu() {
    console.log("Clearing menu items...");
    await db.delete(menuItems);
    console.log("Menu items cleared.");
    process.exit(0);
}

clearMenu().catch((err) => {
    console.error(err);
    process.exit(1);
});
