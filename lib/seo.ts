import { Metadata } from "next";

export const siteConfig = {
  name: "DSA Tracker",
  description: "The ultimate companion for Love Babbar's 450 DSA Sheet. Track your progress, solve problems, and ace your software engineering interviews.",
  url: "https://dsatracker-450babbar.vercel.app", // Fallback URL, ideally replaced by user's custom domain
  ogImage: "https://dsatracker-450babbar.vercel.app/og.png",
  keywords: [
    "Love Babbar DSA Sheet",
    "450 DSA Questions",
    "DSA Tracker",
    "Data Structures and Algorithms",
    "Interview Preparation",
    "Coding Practice",
    "Love Babbar 450",
    "DSA Sheet Progress"
  ]
};

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | Love Babbar 450 DSA Sheet`
    },
    description,
    keywords: siteConfig.keywords,
    alternates: {
      canonical: siteConfig.url,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title,
      description,
      siteName: title,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "DSA Tracker - Love Babbar 450 Sheet"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@rachitdhaka"
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png"
    },
    manifest: `${siteConfig.url}/site.webmanifest`,
    metadataBase: new URL(siteConfig.url),
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: title,
    },
    formatDetection: {
      telephone: false,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  };
}
