export type Balance = { official: number; hypothetical: number };
export type ShopItem = { id: string; name: string; value: number; createdAt?: { seconds: number } };
export type LedgerEvent = { id: string; type: "acne" | "purchase" | "item_created"; description: string; impact: number; officialAfter: number; hypotheticalAfter: number; createdAt?: { seconds: number } };
export type Severity = { level: number; label: string; description: string; price: number };
