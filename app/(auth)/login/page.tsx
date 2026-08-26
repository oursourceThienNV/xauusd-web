import LoginBanner from "./LoginBanner";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        <LoginBanner />
        <LoginForm />
      </div>
    </main>
  );
}
