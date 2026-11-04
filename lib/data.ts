import { doc, runTransaction, collection, serverTimestamp, Timestamp, type Firestore } from "firebase/firestore";
import type { Balance, Severity } from "./types";

export const DEFAULT_SEVERITIES: Severity[] = [
  { level: 1, label: "Minimal Discomfort", description: "Brief and low-intensity physical discomfort.", price: 1 },
  { level: 2, label: "Low Discomfort", description: "Noticeable discomfort with limited sensitivity.", price: 2 },
  { level: 3, label: "Moderate Discomfort", description: "Sustained sensitivity requiring attention.", price: 4 },
  { level: 4, label: "Elevated Discomfort", description: "Clear pressure and localized sensitivity.", price: 7 },
  { level: 5, label: "High Discomfort", description: "Significant sensitivity with persistent pressure.", price: 11 },
  { level: 6, label: "Intense Discomfort", description: "High-intensity pressure and pronounced sensitivity.", price: 16 },
  { level: 7, label: "Lasting Pain with Bleeding", description: "Lasting pain accompanied by bleeding; maximum standard classification.", price: 25 },
];

const root = "private/ledger";
export async function changeBalance(db: Firestore, impact: number, type: "acne" | "purchase", description: string, occurredAt?: Date) {
  const balanceRef = doc(db, root, "balance", "current");
  const historyRef = collection(db, root, "history");
  await runTransaction(db, async tx => {
    const previous = (await tx.get(balanceRef)).data() as Balance | undefined;
    const current = previous ?? { official: 0, hypothetical: 0 };
    const next = { official: Math.min(0, current.official + impact), hypothetical: current.hypothetical + impact };
    tx.set(balanceRef, next);
    tx.set(doc(historyRef), { type, description, impact, officialAfter: next.official, hypotheticalAfter: next.hypothetical, createdAt: occurredAt ? Timestamp.fromDate(occurredAt) : serverTimestamp() });
  });
}
