import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center max-w-2xl">
        <div className="px-6 py-2 rounded-full bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm shadow-sm">
          <p className="text-sm text-gray-600 dark:text-gray-300 italic">
            In Japanese, "kozi" means "brain" or "mind"
          </p>
        </div>
        <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text [text-shadow:_0_0_30px_rgb(147_51_234_/_0.3)]">Kozi</h1>
        <p className="text-2xl text-gray-600 dark:text-gray-300">
          A team-based project management tool designed to streamline information organization and enhance collaboration.
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <Link
            href={userId ? "/app" : "/waitlist"}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-base h-12 px-8"
          >
            {userId ? "Go to App" : "Join the waitlist"}
          </Link>
        </div>
      </main>
    </div>
  );
}
