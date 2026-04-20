import type { Metadata } from "next";

import "./globals.css";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { AuthBanner } from "@/components/auth-banner";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const metadata: Metadata = {
  title: 'DSA Tracker | Love Babbar 450 DSA Sheet Progress & Prep',
  description: 'The ultimate companion tool for Love Babbar\'s 450 DSA Sheet. Master algorithms, track your progress, and ace your software engineering interviews with ease.',
  openGraph: {
    title: 'DSA Tracker | Love Babbar 450 DSA Sheet Progress & Prep',
    description: 'Master data structures and algorithms with the ultimate Love Babbar 450 Sheet tracker. Monitor your solved problems and prepare for top-tier interviews.',
    images: [{
      url: '/og.png',
      width: 1200,
      height: 630,
      alt: 'DSA Tracker - Start Your Interview Preparation Now'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DSA Tracker | Love Babbar 450 DSA Sheet Progress & Prep',
    description: 'Master data structures and algorithms with the ultimate Love Babbar 450 Sheet tracker. Monitor your solved problems and prepare for top-tier interviews.',
    images: ['/og.png'],
  },
}

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
