import db from "./client.js";
import { createUser } from "./queries/users.js";
import { createItem } from "./queries/items.js";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user = await createUser(
    "Ghandalf",
    "mordormustfall.69@hobbitmail.com",
    "Hobbit123",
    5555555555,
  );

  for (let i = 1; i <= 10; i++) {
    await createItem(
      "Name" + i,
      "Description" + i,
      "skuNumber" + i,
      "unit" + i,
      Math.floor(Math.random() * 20),
      Math.floor(Math.random() * 6),
      null,
      1,
    );
  }
}
