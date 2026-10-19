import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://1pooja.com";
  const now = new Date();

  const routes = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/purohits`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/astrologers`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/temples`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/blogs`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${baseUrl}/sign-in`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/sign-up`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  return routes;
}
