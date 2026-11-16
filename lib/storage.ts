import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const filePath = path.join(process.cwd(), "data", "reflections.json");

export type Reflection = {
  id: string;
  text: string;
  createdAt: string;
};

async function ensureFile() {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try { await fs.access(filePath); }
  catch { await fs.writeFile(filePath, "[]", "utf8"); }
}

export async function getReflections(): Promise<Reflection[]> {
  await ensureFile();
  const raw = await fs.readFile(filePath, "utf8");
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function addReflection(text: string): Promise<Reflection> {
  const items = await getReflections();
  const item: Reflection = {
    id: randomUUID(),
    text,
    createdAt: new Date().toISOString()
  };
  items.unshift(item);
  await fs.writeFile(filePath, JSON.stringify(items.slice(0, 200), null, 2), "utf8");
  return item;
}

export async function deleteReflection(id: string): Promise<boolean> {
  const items = await getReflections();
  const next = items.filter((item) => item.id !== id);
  await fs.writeFile(filePath, JSON.stringify(next, null, 2), "utf8");
  return next.length !== items.length;
}
