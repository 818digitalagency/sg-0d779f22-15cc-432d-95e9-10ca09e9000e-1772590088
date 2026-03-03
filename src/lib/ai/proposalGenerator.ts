/**
 * AI Proposal Generator
 * Generates personalized business proposals using AI-driven templates
 */

import type { Lead } from "@/types/lead";

export type ProposalTemplate = 
  | "modern_web_design"
  | "digital_marketing"
  | "it_consulting"
  | "ecommerce_platform"
  | "business_automation"
  | "branding_package";

export interface ProposalOptions {
  template: ProposalTemplate;
  tone: "professional" | "friendly" | "consultative";
  includeTestimonials?: boolean;
  includePricing?: boolean;
  includeTimeline?: boolean;
  customRequirements?: string;
}

export interface GeneratedProposal {
  content: string;
  suggestedSubject: string;
  estimatedReadTime: number;
  personalizationScore: number;
}

export interface TemplateInfo {
  id: ProposalTemplate;
  name: string;
  description: string;
  bestFor: string[];
}

export interface ProposalParams {
  businessName: string;
  contactName?: string;
  industry: string;
  city: string;
  businessAge?: number;
  websiteQuality?: number;
  painPoints?: string[];
  serviceOffering: string;
  tone?: "professional" | "friendly" | "casual" | "formal";
  length?: "short" | "medium" | "long";
}

/**
 * AI-powered proposal generation engine
 */
export class AIProposalGenerator {
  private templates: TemplateInfo[] = [
    {
      id: "modern_web_design",
      name: "Modern Web Design",
      description: "Complete website redesign with modern UI/UX",
      bestFor: ["Outdated websites", "No mobile optimization", "Poor user experience"]
    },
    {
      id: "digital_marketing",
      name: "Digital Marketing Package",
      description: "Comprehensive digital marketing strategy",
      bestFor: ["Low online visibility", "Poor SEO", "Limited social presence"]
    },
    {
      id: "it_consulting",
      name: "IT Consulting Services",
      description: "Technology assessment and optimization",
      bestFor: ["Tech modernization", "Cloud migration", "System integration"]
    },
    {
      id: "ecommerce_platform",
      name: "E-Commerce Platform",
      description: "Online store development and optimization",
      bestFor: ["Retail businesses", "Product sales", "Online expansion"]
    },
    {
      id: "business_automation",
      name: "Business Automation",
      description: "Process automation and workflow optimization",
      bestFor: ["Manual processes", "Inefficiency", "Scaling challenges"]
    },
    {
      id: "branding_package",
      name: "Brand Identity Package",
      description: "Complete brand development and positioning",
      bestFor: ["New businesses", "Rebranding", "Market positioning"]
    }
  ];

  private industryInsights: Record<string, string[]> = {
    "Real Estate": [
      "digital property showcases",
      "virtual tour integration",
      "lead generation optimization",
      "market analytics dashboards"
    ],
    "Manufacturing": [
      "supply chain optimization",
      "production tracking systems",
      "quality control automation",
      "inventory management"
    ],
    "IT Services": [
      "cloud infrastructure migration",
      "cybersecurity enhancement",
      "workflow automation",
      "system integration"
    ],
    "Accounting": [
      "automated bookkeeping",
      "client portal systems",
      "tax preparation automation",
      "financial reporting dashboards"
    ],
    "Law Firm": [
      "case management systems",
      "client intake automation",
      "document management",
      "billing optimization"
    ],
    "Retail": [
      "e-commerce platform enhancement",
      "inventory synchronization",
      "customer loyalty programs",
      "point-of-sale integration"
    ],
    "Healthcare": [
      "patient scheduling systems",
      "telehealth integration",
      "electronic health records",
      "appointment reminder automation"
    ],
    "Construction": [
      "project management tools",
      "bid proposal automation",
      "resource tracking",
      "client communication portals"
    ]
  };

  private painPointSolutions: Record<string, string> = {
    "outdated_website": "modern, responsive website design that converts visitors into customers",
    "no_online_presence": "comprehensive digital presence strategy including website, SEO, and local listings",
    "poor_mobile_experience": "mobile-first design that ensures seamless experience across all devices",
    "low_search_ranking": "SEO optimization and local search enhancement to increase visibility",
    "manual_processes": "automation solutions that save time and reduce operational costs",
    "poor_lead_conversion": "conversion-optimized landing pages and lead nurturing workflows",
    "outdated_technology": "modern technology stack migration with minimal disruption",
    "inefficient_communication": "centralized communication platform for team and client collaboration"
  };

  /**
   * Get available proposal templates
   */
  getAvailableTemplates(): TemplateInfo[] {
    return this.templates;
  }

  /**
   * Generate personalized proposal (overloaded for backward compatibility)
   */
  generateProposal(lead: Lead, options: ProposalOptions): GeneratedProposal;
  generateProposal(params: ProposalParams): { subject: string; greeting: string; body: string; callToAction: string; signature: string; fullText: string; estimatedReadTime: number; personalizationScore: number };
  generateProposal(leadOrParams: Lead | ProposalParams, options?: ProposalOptions): GeneratedProposal | any {
    // New signature with Lead + ProposalOptions
    if (options && "id" in leadOrParams) {
      const lead = leadOrParams as Lead;
      return this.generateProposalFromLead(lead, options);
    }
    
    // Old signature with ProposalParams
    const params = leadOrParams as ProposalParams;
    return this.generateProposalFromParams(params);
  }

  /**
   * Generate proposal from Lead and options
   */
  private generateProposalFromLead(lead: Lead, options: ProposalOptions): GeneratedProposal {
    const params: ProposalParams = {
      businessName: lead.businessName,
      contactName: lead.contactName,
      industry: lead.category || lead.industry,
      city: lead.city,
      businessAge: lead.businessAge,
      websiteQuality: lead.websiteQualityScore,
      serviceOffering: this.getServiceOfferingForTemplate(options.template),
      tone: options.tone as any,
      length: "medium"
    };

    const result = this.generateProposalFromParams(params);
    
    return {
      content: result.fullText,
      suggestedSubject: result.subject,
      estimatedReadTime: result.estimatedReadTime,
      personalizationScore: result.personalizationScore
    };
  }

  /**
   * Get service offering description for template
   */
  private getServiceOfferingForTemplate(template: ProposalTemplate): string {
    const offerings: Record<ProposalTemplate, string> = {
      modern_web_design: "modern website design and development",
      digital_marketing: "comprehensive digital marketing services",
      it_consulting: "IT consulting and technology optimization",
      ecommerce_platform: "e-commerce platform development",
      business_automation: "business process automation",
      branding_package: "brand identity and positioning"
    };
    return offerings[template];
  }

  /**
   * Generate personalized proposal from params
   */
  private generateProposalFromParams(params: ProposalParams): { subject: string; greeting: string; body: string; callToAction: string; signature: string; fullText: string; estimatedReadTime: number; personalizationScore: number } {
    const {
      businessName,
      contactName,
      industry,
      city,
      businessAge,
      websiteQuality,
      painPoints = [],
      serviceOffering,
      tone = "professional",
      length = "medium"
    } = params;

    // Detect pain points based on business data
    const detectedPainPoints = this.detectPainPoints(websiteQuality, businessAge);
    const allPainPoints = [...new Set([...painPoints, ...detectedPainPoints])];

    // Generate subject line
    const subject = this.generateSubject(businessName, industry, allPainPoints);

    // Generate greeting
    const greeting = this.generateGreeting(contactName, businessName, tone);

    // Generate body sections
    const opening = this.generateOpening(businessName, city, industry, tone);
    const valueProposition = this.generateValueProposition(
      industry,
      allPainPoints,
      serviceOffering,
      tone
    );
    const socialProof = this.generateSocialProof(city, industry);
    const solution = this.generateSolution(industry, allPainPoints, length);
    const benefits = this.generateBenefits(industry, allPainPoints);

    // Generate call to action
    const callToAction = this.generateCallToAction(tone, businessName);

    // Generate signature
    const signature = this.generateSignature();

    // Combine all sections
    const body = this.combineBodySections(
      opening,
      valueProposition,
      socialProof,
      solution,
      benefits,
      length
    );

    const fullText = `${greeting}\n\n${body}\n\n${callToAction}\n\n${signature}`;

    // Calculate metrics
    const estimatedReadTime = Math.ceil(fullText.split(" ").length / 200); // 200 words per minute
    const personalizationScore = this.calculatePersonalizationScore(params, allPainPoints);

    return {
      subject,
      greeting,
      body,
      callToAction,
      signature,
      fullText,
      estimatedReadTime,
      personalizationScore
    };
  }

  /**
   * Detect pain points from business data
   */
  private detectPainPoints(websiteQualityScore?: number, businessAge?: number): string[] {
    const painPoints: string[] = [];

    if (websiteQualityScore !== undefined && websiteQualityScore < 50) {
      painPoints.push("outdated_website");
    }
    if (websiteQualityScore !== undefined && websiteQualityScore < 30) {
      painPoints.push("poor_mobile_experience");
    }
    if (websiteQualityScore === 0) {
      painPoints.push("no_online_presence");
    }
    if (businessAge !== undefined && businessAge > 10 && websiteQualityScore !== undefined && websiteQualityScore < 60) {
      painPoints.push("outdated_technology");
    }

    return painPoints;
  }

  /**
   * Generate email subject line
   */
  private generateSubject(businessName: string, industry: string, painPoints: string[]): string {
    const templates = [
      `Helping ${businessName} grow in ${industry}`,
      `Transform ${businessName}'s digital presence`,
      `Solutions for ${businessName}'s ${industry} success`,
      `Unlock growth opportunities for ${businessName}`,
      `${businessName}: Ready to scale your ${industry} business?`
    ];

    if (painPoints.includes("outdated_website")) {
      return `Modern website solutions for ${businessName}`;
    }
    if (painPoints.includes("no_online_presence")) {
      return `Launch ${businessName}'s digital presence`;
    }

    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Generate personalized greeting
   */
  private generateGreeting(contactName: string | undefined, businessName: string, tone: string): string {
    if (contactName) {
      if (tone === "formal") {
        return `Dear ${contactName},`;
      }
      return `Hi ${contactName},`;
    }
    
    if (tone === "formal") {
      return `Dear ${businessName} Team,`;
    }
    return `Hello ${businessName} Team,`;
  }

  /**
   * Generate opening paragraph
   */
  private generateOpening(businessName: string, city: string, industry: string, tone: string): string {
    const openings = [
      `I hope this message finds you well. I'm reaching out because I noticed ${businessName} in ${city}, and I'm impressed by your presence in the ${industry} industry.`,
      `I came across ${businessName} while researching leading ${industry} businesses in ${city}, and I wanted to connect with you about an opportunity.`,
      `As a ${industry} business in ${city}, ${businessName} is exactly the type of company we love working with.`,
      `I've been following ${industry} businesses in ${city}, and ${businessName} stood out to me as a company with significant growth potential.`
    ];

    return openings[Math.floor(Math.random() * openings.length)];
  }

  /**
   * Generate value proposition
   */
  private generateValueProposition(
    industry: string,
    painPoints: string[],
    serviceOffering: string,
    tone: string
  ): string {
    const insights = this.industryInsights[industry] || this.industryInsights["IT Services"];
    const selectedInsight = insights[Math.floor(Math.random() * insights.length)];

    if (painPoints.length > 0) {
      const painPoint = painPoints[0];
      const solution = this.painPointSolutions[painPoint] || "comprehensive digital solutions";
      
      return `We specialize in helping ${industry} businesses like yours with ${solution}. Our focus on ${selectedInsight} has helped similar companies in New Brunswick increase their revenue by an average of 47% within the first year.`;
    }

    return `We specialize in ${serviceOffering} for ${industry} businesses, with a particular focus on ${selectedInsight}. Our data-driven approach has helped New Brunswick companies achieve measurable growth and operational excellence.`;
  }

  /**
   * Generate social proof
   */
  private generateSocialProof(city: string, industry: string): string {
    const proofTemplates = [
      `We've partnered with over 150 businesses across New Brunswick, including several ${industry} companies in ${city}.`,
      `Our clients in the ${industry} sector have seen an average ROI of 312% within 18 months.`,
      `We're proud to have helped ${industry} businesses in ${city} achieve digital transformation while maintaining their local roots.`
    ];

    return proofTemplates[Math.floor(Math.random() * proofTemplates.length)];
  }

  /**
   * Generate solution description
   */
  private generateSolution(industry: string, painPoints: string[], length: string): string {
    const insights = this.industryInsights[industry] || this.industryInsights["IT Services"];
    
    let solution = `Here's what we can do for you:\n\n`;

    if (length === "short") {
      solution += `• ${insights[0]}\n• ${insights[1]}\n• Ongoing support and optimization`;
    } else if (length === "long") {
      insights.forEach((insight, index) => {
        solution += `${index + 1}. **${insight.charAt(0).toUpperCase() + insight.slice(1)}**: Comprehensive implementation with measurable KPIs\n`;
      });
      solution += `\nAll solutions include dedicated account management, 24/7 support, and quarterly performance reviews.`;
    } else {
      // Medium length
      solution += insights.slice(0, 3).map((insight, index) => 
        `• **${insight.charAt(0).toUpperCase() + insight.slice(1)}**`
      ).join("\n");
    }

    return solution;
  }

  /**
   * Generate benefits section
   */
  private generateBenefits(industry: string, painPoints: string[]): string {
    const benefits = [
      "Increase operational efficiency by up to 60%",
      "Reduce costs through automation and optimization",
      "Improve customer satisfaction and retention",
      "Gain competitive advantage in your market",
      "Scale your business without scaling complexity",
      "Access real-time analytics and insights"
    ];

    return `**Why partner with us?**\n\n${benefits.slice(0, 4).map(b => `✓ ${b}`).join("\n")}`;
  }

  /**
   * Generate call to action
   */
  private generateCallToAction(tone: string, businessName: string): string {
    const ctas = [
      `I'd love to schedule a brief 15-minute call to discuss how we can help ${businessName} achieve its goals. Are you available this week for a quick conversation?`,
      `Would you be open to a no-obligation consultation? I'd be happy to prepare a customized proposal based on ${businessName}'s specific needs.`,
      `Let's explore how we can drive measurable results for ${businessName}. When would be a good time for a brief discovery call?`,
      `I'd appreciate the opportunity to learn more about ${businessName}'s priorities and share how we've helped similar businesses succeed.`
    ];

    return ctas[Math.floor(Math.random() * ctas.length)];
  }

  /**
   * Generate email signature
   */
  private generateSignature(): string {
    return `Best regards,

[Your Name]
[Your Title]
Opportunity Finder
[Your Phone]
[Your Email]

P.S. Book a call directly: [Calendar Link]`;
  }

  /**
   * Combine body sections based on length
   */
  private combineBodySections(
    opening: string,
    valueProposition: string,
    socialProof: string,
    solution: string,
    benefits: string,
    length: string
  ): string {
    if (length === "short") {
      return `${opening}\n\n${valueProposition}\n\n${solution}`;
    } else if (length === "long") {
      return `${opening}\n\n${valueProposition}\n\n${socialProof}\n\n${solution}\n\n${benefits}`;
    } else {
      return `${opening}\n\n${valueProposition}\n\n${solution}\n\n${benefits}`;
    }
  }

  /**
   * Calculate personalization score
   */
  private calculatePersonalizationScore(params: ProposalParams, detectedPainPoints: string[]): number {
    let score = 50; // Base score

    if (params.contactName) score += 15;
    if (params.businessAge !== undefined) score += 10;
    if (params.websiteQuality !== undefined) score += 10;
    if (detectedPainPoints.length > 0) score += 15;

    return Math.min(score, 100);
  }

  /**
   * Generate multiple proposal variations for A/B testing
   */
  generateVariations(params: ProposalParams, count: number = 3): GeneratedProposal[] {
    const variations: GeneratedProposal[] = [];
    const tones: Array<"professional" | "friendly" | "formal"> = ["professional", "friendly", "formal"];
    const lengths: Array<"short" | "medium" | "long"> = ["short", "medium", "long"];

    for (let i = 0; i < count; i++) {
      const tone = tones[i % tones.length];
      const length = lengths[i % lengths.length];
      
      const result = this.generateProposal({
          ...params,
          tone,
          length
        });
        
      variations.push({
        content: result.fullText,
        suggestedSubject: result.subject,
        estimatedReadTime: result.estimatedReadTime,
        personalizationScore: result.personalizationScore
      });
    }

    return variations;
  }
}

// Export singleton instance
export const aiProposalGenerator = new AIProposalGenerator();