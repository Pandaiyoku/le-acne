import { doc, runTransaction, collection, getDocs, serverTimestamp, Timestamp, type Firestore } from "firebase/firestore";
import type { Balance, Severity } from "./types";

export const DEFAULT_SEVERITIES: Severity[] = [
  { level: 1, label: "Minimal Discomfort", description: "Brief and low-intensity physical discomfort.", price: 1 },
  { level: 2, label: "Low Discomfort", description: "Noticeable discomfort with limited sensitivity.", price: 2 },
  { level: 3, label: "Moderate Discomfort", description: "Sustained sensitivity requiring attention.", price: 3 },
  { level: 4, label: "Elevated Discomfort", description: "Clear pressure and localized sensitivity.", price: 4 },
  { level: 5, label: "High Discomfort", description: "Significant sensitivity with persistent pressure.", price: 5 },
  { level: 6, label: "Intense Discomfort", description: "High-intensity pressure and pronounced sensitivity.", price: 6 },
  { level: 7, label: "Lasting Pain with Bleeding", description: "Lasting pain accompanied by bleeding; maximum standard classification.", price: 7 },
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

export async function removeHistoryEntry(db: Firestore, historyId: string) {
  const balanceRef = doc(db, root, "balance", "current");
  const historyRef = collection(db, root, "history");
  const historySnapshot = await getDocs(historyRef);
  await runTransaction(db, async tx => {
    const remaining = historySnapshot.docs
      .filter(entry => entry.id !== historyId)
      .map(entry => ({ ref: entry.ref, ...entry.data() as { impact?: number; createdAt?: { seconds: number; nanoseconds?: number } } }))
      .sort((a, b) => ((a.createdAt?.seconds ?? 0) * 1_000_000_000 + (a.createdAt?.nanoseconds ?? 0)) - ((b.createdAt?.seconds ?? 0) * 1_000_000_000 + (b.createdAt?.nanoseconds ?? 0)));
    let official = 0;
    let hypothetical = 0;
    for (const entry of remaining) {
      const impact = Number(entry.impact ?? 0);
      official = Math.min(0, official + impact);
      hypothetical += impact;
      tx.update(entry.ref, { officialAfter: official, hypotheticalAfter: hypothetical });
    }
    tx.delete(doc(historyRef, historyId));
    tx.set(balanceRef, { official, hypothetical });
  });
}
