import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { AuthBanner } from "@/components/auth-banner";
import { ThemeProvider } from "@/components/theme-provider";

// Optimized system font stack to avoid build-time Google Font connection issues
const fontSans = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata();

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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "DSA Tracker",
              "description": "Companion tool for Love Babbar's 450 DSA Sheet. track progress on 450+ data structures and algorithms questions.",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "author": {
                "@type": "Person",
                "name": "Rachit Dhaka"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
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
