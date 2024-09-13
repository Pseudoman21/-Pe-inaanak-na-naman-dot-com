import localFont from "next/font/local";
import { HomePage } from "@/components/Home";
import { Github, Gitlab } from "lucide-react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-8 row-start-2 w-full items-center">
        <HomePage />
      </main>
      <footer className="row-start-3 text-blue-600 flex bg-gradient-to-b from-blue-100 to-indigo-200 p-5 gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/Pseudoman21"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://gitlab.com/Pseudoman"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Gitlab />
        </a>
          Pinagtripang gawin ni @Pseudoman21
      </footer>
    </div>
  );
}
