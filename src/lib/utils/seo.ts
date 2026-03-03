/**
 * SEO Utilities
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export const defaultSEO: SEOConfig = {
  title: "Opportunity Finder - Discover. Engage. Convert.",
  description: "AI-powered lead intelligence and outreach automation platform for New Brunswick businesses. Find qualified leads, send personalized proposals, and track engagement.",
  keywords: [
    "lead generation",
    "business intelligence",
    "email automation",
    "CRM",
    "New Brunswick",
    "sales automation",
    "lead scoring",
    "proposal generation",
  ],
  image: "/og-image.png",
  type: "website",
};

export function generateSEO(config: Partial<SEOConfig>): SEOConfig {
  return {
    ...defaultSEO,
    ...config,
    title: config.title 
      ? `${config.title} | Opportunity Finder`
      : defaultSEO.title,
  };
}

export function generateStructuredData(type: "Organization" | "WebSite" | "Article", data: any) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://opportunityfinder.ca";

  const schemas: Record<string, any> = {
    Organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Opportunity Finder",
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description: defaultSEO.description,
      address: {
        "@type": "PostalAddress",
        addressCountry: "CA",
        addressRegion: "NB",
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Service",
        email: "support@opportunityfinder.ca",
      },
    },
    WebSite: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Opportunity Finder",
      url: baseUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    Article: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.description,
      image: data.image,
      datePublished: data.publishedTime,
      dateModified: data.modifiedTime,
      author: {
        "@type": "Person",
        name: data.author || "Opportunity Finder Team",
      },
    },
  };

  return schemas[type] || schemas.Organization;
}