"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div style={{ padding: '48px 16px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '420px', maxWidth: '100%', border: '1px solid #e0e0e0', borderRadius: 8, padding: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 16 }}>ログイン</h2>
        {error && (
          <div style={{ marginBottom: 12, color: '#b71c1c' }}>ログインに失敗しました</div>
        )}
        <div style={{ display: 'grid', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '10px 12px', border: '1px solid #ccc', borderRadius: 6 }}
              placeholder="demo@example.com"
            />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '10px 12px', border: '1px solid #ccc', borderRadius: 6 }}
              placeholder="••••••••"
            />
          </label>
          <button
            onClick={async () => {
              setError(null);
              const cb =
                typeof window !== "undefined"
                  ? new URLSearchParams(window.location.search).get("callbackUrl") || "/"
                  : "/";
              // Use redirect: false and navigate manually for reliability in App Router
              const res = await signIn("credentials", { email, password, redirect: false });
              if (res?.error) {
                setError("1");
                return;
              }
              // Navigate to callback or home after successful sign-in
              router.replace(cb);
            }}
            disabled={!email || !password}
            style={{ padding: '10px 12px', borderRadius: 6, background: '#1976d2', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            ログイン
          </button>
          <div style={{ fontSize: 12, color: '#666' }}>デモユーザー: demo@example.com / demo1234</div>
        </div>
      </div>
    </div>
  );
}
