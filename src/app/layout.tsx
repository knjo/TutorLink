// src/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import SearchBar from "@/components/search-bar";
import { SearchProvider } from "@/components/search-context";
import { UserNav } from "@/components/user-nav"; // [!code ++] 引入新元件

export const metadata: Metadata = {
  title: "TutorLink",
  description: "Connect. Learn. Excel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SearchProvider>
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container py-3 flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  TL
                </div>
                <div className="leading-tight hidden sm:block">
                  <div className="font-semibold">TutorLink</div>
                  <div className="text-[10px] text-muted-foreground -mt-0.5">Connect. Learn. Excel.</div>
                </div>
              </Link>
              
              <div className="flex-1 flex justify-center max-w-md mx-auto">
                <SearchBar />
              </div>

              {/* [!code --] 刪除原本的文字連結 */}
              {/* <Link href="/profile" className="text-sm">Profile</Link> */} 

              {/* [!code ++] 新增 UserNav 下拉選單 */}
              <div className="flex items-center gap-2">
                <UserNav />
              </div>
            </div>
          </header>
          <main className="container py-6">{children}</main>
        </SearchProvider>
      </body>
    </html>
  );
}