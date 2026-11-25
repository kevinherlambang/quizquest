"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/lib/accounts";

const inputClass =
  "mt-1 min-h-[44px] w-full rounded-xl border border-slate-400 px-3";

type Fields = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<Fields>({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Partial<Fields> & { form?: string }>({});

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Nama wajib diisi.";
    if (!form.email.trim()) next.email = "Email wajib diisi.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Format email tidak valid, contoh: nama@quizquest.id.";
    if (form.password.length < 8)
      next.password = "Password minimal 8 karakter.";
    if (form.confirm !== form.password)
      next.confirm = "Konfirmasi password tidak cocok.";

    if (Object.keys(next).length === 0) {
      const result = register(form.name, form.email, form.password);
      if (result.user) return router.push("/dashboard");
      next.form = result.error;
    }
    setErrors(next);
  }

  const field = (k: keyof Fields, label: string, type: string) => (
    <label className="block font-semibold">
      {label}
      <input
        type={type}
        className={inputClass}
        value={form[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
      />
      {errors[k] && (
        <span role="alert" className="text-sm font-normal text-red-700">
          {errors[k]}
        </span>
      )}
    </label>
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-8">
      <Link
        href="/login"
        className="mb-4 text-sm font-semibold text-indigo-700 underline"
      >
        ← Kembali ke login
      </Link>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"
      >
        <h1 className="text-2xl font-extrabold">Daftar akun baru</h1>
        {errors.form && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800"
          >
            {errors.form}
          </p>
        )}
        {field("name", "Nama", "text")}
        {field("email", "Email", "email")}
        {field("password", "Password", "password")}
        {field("confirm", "Konfirmasi password", "password")}
        <button className="min-h-[44px] w-full rounded-xl bg-indigo-600 font-semibold text-white hover:bg-indigo-700">
          Daftar
        </button>
      </form>
    </main>
  );
}
