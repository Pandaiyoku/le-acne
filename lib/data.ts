import { doc, runTransaction, collection, serverTimestamp, type Firestore } from "firebase/firestore";
import type { Balance, Severity } from "./types";

export const DEFAULT_SEVERITIES: Severity[] = [
  { level: 1, label: "Paper cut energy", description: "Barely a whisper. Your mirror may not even notice.", price: 1 },
  { level: 2, label: "Mild betrayal", description: "A small sting and a larger sense of injustice.", price: 2 },
  { level: 3, label: "Spicy dot", description: "The face has filed a minor complaint.", price: 4 },
  { level: 4, label: "Knuckle sandwich", description: "A distinctly rude little pain packet.", price: 7 },
  { level: 5, label: "Orbital distress", description: "You briefly reconsider your skincare routine and your life.", price: 11 },
  { level: 6, label: "Cursed constellation", description: "It hurts with confidence and a backstory.", price: 16 },
  { level: 7, label: "Apocalypse now", description: "A soul-cleansing trauma. The debt collectors heard it.", price: 25 },
];

const root = "private/ledger";
export async function changeBalance(db: Firestore, impact: number, type: "acne" | "purchase", description: string) {
  const balanceRef = doc(db, root, "balance", "current");
  const historyRef = collection(db, root, "history");
  await runTransaction(db, async tx => {
    const previous = (await tx.get(balanceRef)).data() as Balance | undefined;
    const current = previous ?? { official: 0, hypothetical: 0 };
    const next = { official: Math.min(0, current.official + impact), hypothetical: current.hypothetical + impact };
    tx.set(balanceRef, next);
    tx.set(doc(historyRef), { type, description, impact, officialAfter: next.official, hypotheticalAfter: next.hypothetical, createdAt: serverTimestamp() });
  });
}
