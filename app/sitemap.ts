import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dsatracker.vercel.app";

  const staticRoutes = [
    "",
    "/login",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Standard topics from Love Babbar's 450 sheet
  const topics = [
    "Arrays",
    "Matrix",
    "Strings",
    "Searching & Sorting",
    "LinkedList",
    "Binary Trees",
    "BST",
    "Greedy",
    "Backtracking",
    "Stacks & Queues",
    "Heap",
    "Graph",
    "Trie",
    "Dynamic Programming",
    "Bit Manipulation"
  ];

  const topicRoutes = topics.map((topic) => ({
    url: `${baseUrl}/topic/${encodeURIComponent(topic.toLowerCase().replace(/\s+/g, '-'))}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...topicRoutes];
}
