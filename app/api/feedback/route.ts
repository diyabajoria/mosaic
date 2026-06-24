import { NextResponse } from "next/server";
import { z } from "zod";
import clientPromise from "../../../lib/mongodb";

const feedbackSchema = z.object({
  name: z.string().trim().min(2, "Add your name.").max(80),
  email: z.string().trim().email("Use a valid email address.").max(160),
  message: z.string().trim().min(10, "Write at least 10 characters.").max(2000),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = feedbackSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid feedback." }, { status: 400 });
  }

  const client = await clientPromise;
  const now = new Date();

  await client.db().collection("feedback").insertOne({
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    message: parsed.data.message,
    createdAt: now,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
