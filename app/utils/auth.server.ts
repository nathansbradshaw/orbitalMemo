// app/utils/auth.server.ts

import { prisma } from "./prisma.server";
import { createUser, deleteUser } from "./users.server";
import { RegisterForm, LoginForm } from "./types.server";
import bcrypt from "bcryptjs";
import { redirect, json, createCookieSessionStorage } from "@remix-run/node";
import { createToken } from "~/lib/jwt";
import { sendResetPasswordEmail } from "./mail.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET is not set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "orbitalMemo-session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function sendResetPasswordLink({ email }: { email: string }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = createToken({ id: user.id });
    await sendResetPasswordEmail(user, token);
  }
  return true;
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "set-cookie": await storage.commitSession(session),
    },
  });
}

export async function register(user: RegisterForm) {
  const exists = await prisma.user.count({ where: { email: user.email } });
  if (exists) {
    return json(
      { error: `User already exists with that email` },
      { status: 400 }
    );
  }

  const newUser = await createUser(user);
  if (!newUser) {
    return json(
      {
        error: `Something went wrong trying to creatte a new user`,
        fields: { email: user.email, password: user.password },
      },
      { status: 400 }
    );
  }
  return createUserSession(newUser.id, "/");
}

export async function login({ email, password }: LoginForm) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return json(
      { error: `Invalid email or password`, fields: { email: user?.email } },
      { status: 400 }
    );
  }

  return createUserSession(user.id, "/");
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirect", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, profile: true },
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "set-cookie": await storage.destroySession(session),
    },
  });
}

export async function deleteUserAndSession(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }
  await prisma.reminder.deleteMany({
    where: { userId },
  });
  await deleteUser(userId);
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "set-cookie": await storage.destroySession(session),
    },
  });
}
