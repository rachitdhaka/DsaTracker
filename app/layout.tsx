import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { AuthBanner } from "@/components/auth-banner";
import { ThemeProvider } from "@/components/theme-provider";

// Optimized system font stack to avoid build-time Google Font connection issues
const fontSans = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const metadata: Metadata = {
  title: "DSA Tracker",
  description: "Track your progress on data structures and algorithms",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col selection:bg-yellow-100 selection:text-black font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {!user && <AuthBanner />}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
