/**
 * AI Lead Scoring Engine
 * Multi-factor lead scoring algorithm with ML-ready architecture
 */

import type { Lead } from "@/types/lead";

export interface ScoringFactors {
  websiteQuality: number;
  digitalPresence: number;
  businessMaturity: number;
  engagement: number;
  marketPotential: number;
  competition: number;
}

export interface ScoringResult {
  totalScore: number;
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";
  factors: ScoringFactors;
  recommendations: string[];
  priority: "high" | "medium" | "low";
  estimatedConversionRate: number;
  confidenceLevel: number;
  insights: LeadInsight[];
}

export interface LeadInsight {
  category: string;
  insight: string;
  impact: "positive" | "negative" | "neutral";
  weight: number;
}

/**
 * Advanced AI Lead Scoring Engine
 */
export class AILeadScorer {
  private weights = {
    websiteQuality: 0.25,
    digitalPresence: 0.20,
    businessMaturity: 0.15,
    engagement: 0.20,
    marketPotential: 0.15,
    competition: 0.05
  };

  /**
   * Score a single lead
   */
  scoreLead(lead: Lead): ScoringResult {
    const factors = this.calculateFactors(lead);
    const totalScore = this.calculateTotalScore(factors);
    const grade = this.calculateGrade(totalScore);
    const recommendations = this.generateRecommendations(lead, factors);
    const priority = this.calculatePriority(totalScore, factors);
    const estimatedConversionRate = this.estimateConversionRate(totalScore, factors);
    const confidenceLevel = this.calculateConfidenceLevel(lead);
    const insights = this.generateInsights(lead, factors);

    return {
      totalScore,
      grade,
      factors,
      recommendations,
      priority,
      estimatedConversionRate,
      confidenceLevel,
      insights
    };
  }

  /**
   * Batch score multiple leads
   */
  scoreLeads(leads: Lead[]): Map<string, ScoringResult> {
    const results = new Map<string, ScoringResult>();
    
    leads.forEach(lead => {
      results.set(lead.id, this.scoreLead(lead));
    });

    return results;
  }

  /**
   * Calculate individual scoring factors
   */
  private calculateFactors(lead: Lead): ScoringFactors {
    return {
      websiteQuality: this.scoreWebsiteQuality(lead),
      digitalPresence: this.scoreDigitalPresence(lead),
      businessMaturity: this.scoreBusinessMaturity(lead),
      engagement: this.scoreEngagement(lead),
      marketPotential: this.scoreMarketPotential(lead),
      competition: this.scoreCompetition(lead)
    };
  }

  /**
   * Score website quality
   */
  private scoreWebsiteQuality(lead: Lead): number {
    let score = 0;

    // Base score from website quality metric
    if (lead.websiteQuality !== undefined) {
      score = lead.websiteQuality;
    } else if (lead.website) {
      score = 50; // Has website but quality not assessed
    } else {
      score = 0; // No website
    }

    // Bonus for HTTPS
    if (lead.website?.startsWith("https://")) {
      score += 10;
    }

    // Bonus for modern domain
    if (lead.website && !lead.website.includes("wix") && !lead.website.includes("weebly")) {
      score += 5;
    }

    return Math.min(score, 100);
  }

  /**
   * Score digital presence
   */
  private scoreDigitalPresence(lead: Lead): number {
    let score = 0;

    // Website presence
    if (lead.website) score += 25;

    // Google Business Profile
    if (lead.googleRating && lead.googleRating > 0) score += 25;

    // Reviews count
    if (lead.reviewCount) {
      if (lead.reviewCount > 50) score += 25;
      else if (lead.reviewCount > 20) score += 15;
      else if (lead.reviewCount > 5) score += 10;
      else score += 5;
    }

    // Social media presence
    if (lead.socialMedia) {
      const platforms = Object.values(lead.socialMedia).filter(url => url).length;
      score += Math.min(platforms * 7, 25);
    }

    return Math.min(score, 100);
  }

  /**
   * Score business maturity
   */
  private scoreBusinessMaturity(lead: Lead): number {
    let score = 50; // Base score

    if (lead.businessAge !== undefined) {
      if (lead.businessAge >= 10) {
        score = 90; // Well-established
      } else if (lead.businessAge >= 5) {
        score = 75; // Mature
      } else if (lead.businessAge >= 2) {
        score = 60; // Growing
      } else if (lead.businessAge >= 1) {
        score = 45; // New but established
      } else {
        score = 30; // Very new
      }
    }

    // Adjust based on reviews (indicator of customer base)
    if (lead.reviewCount) {
      if (lead.reviewCount > 100) score += 10;
      else if (lead.reviewCount > 50) score += 5;
    }

    return Math.min(score, 100);
  }

  /**
   * Score engagement potential
   */
  private scoreEngagement(lead: Lead): number {
    let score = 50; // Base score

    // Email availability
    if (lead.email) score += 20;

    // Phone availability
    if (lead.phone) score += 15;

    // Contact name (personalization)
    if (lead.contactName) score += 15;

    return Math.min(score, 100);
  }

  /**
   * Score market potential
   */
  private scoreMarketPotential(lead: Lead): number {
    let score = 50; // Base score

    // Industry-based potential
    const highPotentialIndustries = ["Real Estate", "Manufacturing", "IT Services", "Healthcare"];
    const mediumPotentialIndustries = ["Retail", "Construction", "Accounting"];
    
    if (highPotentialIndustries.includes(lead.category)) {
      score = 80;
    } else if (mediumPotentialIndustries.includes(lead.category)) {
      score = 65;
    }

    // Location-based adjustment (major cities = higher potential)
    const majorCities = ["Moncton", "Saint John", "Fredericton"];
    if (majorCities.includes(lead.city)) {
      score += 10;
    }

    // Rating indicates customer satisfaction and growth potential
    if (lead.googleRating) {
      if (lead.googleRating >= 4.5) score += 10;
      else if (lead.googleRating >= 4.0) score += 5;
      else if (lead.googleRating < 3.0) score -= 10;
    }

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Score competition level (inverse - lower competition = higher score)
   */
  private scoreCompetition(lead: Lead): number {
    // This would integrate with market data
    // For now, use industry as proxy
    const lowCompetitionIndustries = ["Manufacturing", "Healthcare", "Construction"];
    const highCompetitionIndustries = ["Retail", "Food & Beverage"];

    if (lowCompetitionIndustries.includes(lead.category)) {
      return 80;
    } else if (highCompetitionIndustries.includes(lead.category)) {
      return 40;
    }

    return 60;
  }

  /**
   * Calculate weighted total score
   */
  private calculateTotalScore(factors: ScoringFactors): number {
    const score = 
      factors.websiteQuality * this.weights.websiteQuality +
      factors.digitalPresence * this.weights.digitalPresence +
      factors.businessMaturity * this.weights.businessMaturity +
      factors.engagement * this.weights.engagement +
      factors.marketPotential * this.weights.marketPotential +
      factors.competition * this.weights.competition;

    return Math.round(score);
  }

  /**
   * Calculate letter grade
   */
  private calculateGrade(score: number): "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F" {
    if (score >= 95) return "A+";
    if (score >= 90) return "A";
    if (score >= 85) return "B+";
    if (score >= 80) return "B";
    if (score >= 75) return "C+";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(lead: Lead, factors: ScoringFactors): string[] {
    const recommendations: string[] = [];

    // Website recommendations
    if (factors.websiteQuality < 50) {
      recommendations.push("Lead has poor or no website - high opportunity for web development services");
    } else if (factors.websiteQuality < 70) {
      recommendations.push("Website needs modernization - propose redesign or optimization");
    }

    // Digital presence recommendations
    if (factors.digitalPresence < 50) {
      recommendations.push("Limited digital presence - offer comprehensive digital marketing package");
    }

    // Engagement recommendations
    if (factors.engagement < 60) {
      if (!lead.email) recommendations.push("Missing email - research company website for contact info");
      if (!lead.contactName) recommendations.push("Find decision maker name for personalized outreach");
    }

    // Business maturity recommendations
    if (factors.businessMaturity > 80) {
      recommendations.push("Established business - emphasize ROI and efficiency gains");
    } else if (factors.businessMaturity < 40) {
      recommendations.push("New business - focus on growth acceleration and market positioning");
    }

    // Market potential recommendations
    if (factors.marketPotential > 75) {
      recommendations.push("High market potential - prioritize this lead for immediate outreach");
    }

    // Engagement strategy
    if (lead.status === "Not Contacted") {
      recommendations.push("Lead not yet contacted - initiate outreach within 24-48 hours");
    }

    return recommendations;
  }

  /**
   * Calculate priority level
   */
  private calculatePriority(score: number, factors: ScoringFactors): "high" | "medium" | "low" {
    if (score >= 80 && factors.engagement >= 60) return "high";
    if (score >= 65) return "medium";
    return "low";
  }

  /**
   * Estimate conversion rate
   */
  private estimateConversionRate(score: number, factors: ScoringFactors): number {
    let baseRate = score / 100;

    // Adjust based on engagement potential
    if (factors.engagement > 80) baseRate *= 1.3;
    else if (factors.engagement < 40) baseRate *= 0.7;

    // Adjust based on digital presence gaps (opportunity indicator)
    if (factors.digitalPresence < 50 && factors.websiteQuality < 50) {
      baseRate *= 1.2; // Higher conversion when they clearly need help
    }

    return Math.round(Math.min(baseRate * 100, 85)); // Cap at 85%
  }

  /**
   * Calculate confidence level in the score
   */
  private calculateConfidenceLevel(lead: Lead): number {
    let confidence = 50; // Base confidence

    if (lead.email) confidence += 10;
    if (lead.phone) confidence += 10;
    if (lead.website) confidence += 15;
    if (lead.googleRating !== undefined) confidence += 10;
    if (lead.businessAge !== undefined) confidence += 10;
    if (lead.websiteQuality !== undefined) confidence += 15;

    return Math.min(confidence, 100);
  }

  /**
   * Generate detailed insights
   */
  private generateInsights(lead: Lead, factors: ScoringFactors): LeadInsight[] {
    const insights: LeadInsight[] = [];

    // Website insights
    if (factors.websiteQuality < 30) {
      insights.push({
        category: "Website",
        insight: "No modern website detected - critical opportunity for web development",
        impact: "positive",
        weight: 0.9
      });
    } else if (factors.websiteQuality > 80) {
      insights.push({
        category: "Website",
        insight: "High-quality website - may need advanced services or maintenance",
        impact: "neutral",
        weight: 0.4
      });
    }

    // Digital presence insights
    if (lead.googleRating && lead.googleRating >= 4.5 && lead.reviewCount && lead.reviewCount > 50) {
      insights.push({
        category: "Reputation",
        insight: "Strong online reputation - excellent partner for case studies",
        impact: "positive",
        weight: 0.7
      });
    }

    // Business age insights
    if (lead.businessAge && lead.businessAge > 15 && factors.websiteQuality < 60) {
      insights.push({
        category: "Technology Gap",
        insight: "Established business with outdated digital infrastructure - high modernization potential",
        impact: "positive",
        weight: 0.85
      });
    }

    // Market insights
    if (factors.marketPotential > 80) {
      insights.push({
        category: "Market",
        insight: "Operating in high-growth industry with strong market demand",
        impact: "positive",
        weight: 0.75
      });
    }

    // Engagement insights
    if (!lead.contactName) {
      insights.push({
        category: "Outreach",
        insight: "Decision maker not identified - research needed before personalized contact",
        impact: "negative",
        weight: 0.6
      });
    }

    return insights.sort((a, b) => b.weight - a.weight);
  }

  /**
   * Get leads by priority
   */
  getTopLeads(leads: Lead[], count: number = 10): Array<{ lead: Lead; score: ScoringResult }> {
    const scored = leads.map(lead => ({
      lead,
      score: this.scoreLead(lead)
    }));

    return scored
      .sort((a, b) => b.score.totalScore - a.score.totalScore)
      .slice(0, count);
  }

  /**
   * Identify leads needing immediate attention
   */
  getUrgentLeads(leads: Lead[]): Array<{ lead: Lead; score: ScoringResult; reason: string }> {
    const urgent: Array<{ lead: Lead; score: ScoringResult; reason: string }> = [];

    leads.forEach(lead => {
      const score = this.scoreLead(lead);
      
      if (score.priority === "high" && lead.status === "Not Contacted") {
        urgent.push({
          lead,
          score,
          reason: "High-value lead not yet contacted"
        });
      }
      
      if (score.totalScore > 85 && lead.status === "Proposal Sent") {
        const daysSinceSent = 3; // Would calculate from actual date
        if (daysSinceSent > 5) {
          urgent.push({
            lead,
            score,
            reason: "High-score lead - proposal sent but no response"
          });
        }
      }
    });

    return urgent;
  }
}

// Export singleton instance
export const aiLeadScorer = new AILeadScorer();