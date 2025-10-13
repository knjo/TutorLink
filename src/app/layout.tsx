import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import SearchBar from "@/components/search-bar";
import { SearchProvider } from "@/components/search-context";

export const metadata: Metadata = {
  title: "TutorLink",
  description: "Connect. Learn. Excel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SearchProvider>
          <header className="border-b">
            <div className="container py-3 flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <div className="h-8 w-8 rounded-full bg-indigo-600" />
                <div className="leading-tight">
                  <div className="font-semibold">TutorLink</div>
                  <div className="text-xs text-muted-foreground -mt-0.5">Connect. Learn. Excel.</div>
                </div>
              </Link>
              <div className="flex-1 flex justify-center">
                <SearchBar />
              </div>
              <Link href="/profile" className="text-sm">Profile</Link>
            </div>
          </header>
          <main className="container py-6">{children}</main>
        </SearchProvider>
      </body>
    </html>
  );
}
