import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json().catch(() => ({ email: "" }));
  const authorized = process.env.AUTHORIZED_EMAIL?.trim().toLowerCase();
  const permitted = Boolean(authorized && typeof email === "string" && email.trim().toLowerCase() === authorized);
  return NextResponse.json({ permitted });
}
