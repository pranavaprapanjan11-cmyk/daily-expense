import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center font-bold" href="#">
          Expense Manager
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register">
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center text-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Track Your Daily Expenses
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Simple, efficient, and student-friendly. Manage your budget, visualize your spending, and save more.
                </p>
              </div>
              <div className="space-y-4">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto h-14 text-lg">Enter App (No Login Required)</Button>
                </Link>
                <div className="flex justify-center gap-4">
                  <Link href="/login" className="text-sm text-slate-500 hover:underline">Login</Link>
                  <span className="text-slate-300">|</span>
                  <Link href="/register" className="text-sm text-slate-500 hover:underline">Register</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Daily Expense Manager. All rights reserved.</p>
      </footer>
    </div>
  );
}
