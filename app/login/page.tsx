import AuthForm from "../../components/AuthForm";
import { authOptions } from "../../lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Sign in | MONO AI",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/generate");
  }

  return (
    <main className="auth-page">
      <Suspense fallback={null}>
        <AuthForm mode="login" />
      </Suspense>
      <div className="auth-visual" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </main>
  );
}
