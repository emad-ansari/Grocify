import "dotenv/config";
import { db } from "../lib/server/db/client";
import { groceryItems } from "../lib/server/db/schema";

export const dummyGroceryItems = [
  {
    id: "1",
    name: "Milk",
    category: "Dairy",
    quantity: 2,
    purchased: false,
    priority: "high",
    updated_at: Date.now(),
  },
  {
    id: "2",
    name: "Bread",
    category: "Bakery",
    quantity: 1,
    purchased: true,
    priority: "medium",
    updated_at: Date.now(),
  },
  {
    id: "3",
    name: "Eggs",
    category: "Dairy",
    quantity: 12,
    purchased: false,
    priority: "high",
    updated_at: Date.now(),
  },
  {
    id: "4",
    name: "Rice",
    category: "Grains",
    quantity: 5,
    purchased: false,
    priority: "medium",
    updated_at: Date.now(),
  },
  {
    id: "5",
    name: "Apples",
    category: "Fruits",
    quantity: 6,
    purchased: true,
    priority: "low",
    updated_at: Date.now(),
  },
  {
    id: "6",
    name: "Chicken",
    category: "Meat",
    quantity: 1,
    purchased: false,
    priority: "high",
    updated_at: Date.now(),
  },
  {
    id: "7",
    name: "Tomatoes",
    category: "Vegetables",
    quantity: 4,
    purchased: false,
    priority: "medium",
    updated_at: Date.now(),
  },
  {
    id: "8",
    name: "Onions",
    category: "Vegetables",
    quantity: 3,
    purchased: true,
    priority: "low",
    updated_at: Date.now(),
  },
  {
    id: "9",
    name: "Cooking Oil",
    category: "Essentials",
    quantity: 1,
    purchased: false,
    priority: "high",
    updated_at: Date.now(),
  },
  {
    id: "10",
    name: "Sugar",
    category: "Essentials",
    quantity: 2,
    purchased: false,
    priority: "medium",
    updated_at: Date.now(),
  },
];

async function seed() {
  try {
    console.log("Seeding started...");

    await db.insert(groceryItems).values(dummyGroceryItems);

    console.log("Seeding completed ✅");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed ❌", error);
    process.exit(1);
  }
}

seed();