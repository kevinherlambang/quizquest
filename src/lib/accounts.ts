// Pendaftaran akun baru, disimpan di localStorage browser.
// Akun demo tetap ditangani storage.ts (tidak diubah).
import { users } from "@/data/quizData";
import {
  getCurrentUser as getDemoUser,
  login as loginDemo,
} from "@/lib/storage";
import type { User } from "@/types";

const ACCOUNTS_KEY = "qq:accounts";
const LOGIN_KEY = "qq:login"; // kunci yang sama dengan di storage.ts, jadi logout() di sana tetap berfungsi
const AVATARS = ["🙂", "😎", "🦊", "🐼", "🚀", "🧑‍🎓"];

interface Account {
  name: string;
  email: string;
  avatar: string;
  password: string;
}

const readAccounts = (): Account[] =>
  JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? "[]");
const toUser = (a: Account): User => ({
  name: a.name,
  email: a.email,
  avatar: a.avatar,
  xp: 0,
  streak: 0,
});

// Akun yang sedang login: akun demo dulu, lalu akun hasil daftar.
export function getCurrentUser(): User | null {
  const demo = getDemoUser();
  if (demo) return demo;
  const email = localStorage.getItem(LOGIN_KEY);
  const account = readAccounts().find((a) => a.email === email);
  return account ? toUser(account) : null;
}

export function login(email: string, password: string): User | null {
  const demo = loginDemo(email, password);
  if (demo) return demo;

  const clean = email.trim().toLowerCase();
  const account = readAccounts().find(
    (a) => a.email === clean && a.password === password,
  );
  if (!account) return null;
  localStorage.setItem(LOGIN_KEY, account.email);
  return toUser(account);
}

export function register(
  name: string,
  email: string,
  password: string,
): { user: User | null; error?: string } {
  const clean = email.trim().toLowerCase();
  const taken =
    users.some((u) => u.email === clean) ||
    readAccounts().some((a) => a.email === clean);
  if (taken) return { user: null, error: "Email sudah terdaftar." };

  const account: Account = {
    name: name.trim(),
    email: clean,
    avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    password,
  };
  localStorage.setItem(
    ACCOUNTS_KEY,
    JSON.stringify([...readAccounts(), account]),
  );
  localStorage.setItem(LOGIN_KEY, clean); // langsung masuk setelah daftar
  return { user: toUser(account) };
}
