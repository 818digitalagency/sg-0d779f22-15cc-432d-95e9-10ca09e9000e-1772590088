import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Globe, 
  Star, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import type { Lead } from "@/types/lead";
import { aiLeadScorer } from "@/lib/ai/leadScoring";

interface LeadScoreCardProps {
  lead: Lead;
  showDetails?: boolean;
}

export function LeadScoreCard({ lead, showDetails = true }: LeadScoreCardProps) {
  const scoreBreakdown = aiLeadScorer.getScoreBreakdown(lead);
  const insights = aiLeadScorer.getLeadInsights(lead);
  const recommendations = aiLeadScorer.getRecommendations(lead);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 70) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-slate-600 bg-slate-50 border-slate-200";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 85) return "from-green-500 to-emerald-600";
    if (score >= 70) return "from-amber-500 to-orange-600";
    return "from-slate-500 to-slate-600";
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-700 border-red-300",
      medium: "bg-amber-100 text-amber-700 border-amber-300",
      low: "bg-blue-100 text-blue-700 border-blue-300"
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  return (
    <div className="space-y-4">
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI Lead Score
            </CardTitle>
            <Badge variant="outline" className={getPriorityBadge(insights.priority)}>
              {insights.priority.toUpperCase()} PRIORITY
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getScoreGradient(scoreBreakdown.total)} flex items-center justify-center shadow-lg`}>
                <div className="text-3xl font-bold text-white">
                  {scoreBreakdown.total}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-900 mb-2">Overall Score</div>
              <Progress value={scoreBreakdown.total} className="h-2" />
              <div className="text-xs text-slate-600 mt-1">
                Based on {insights.factors.length} key factors
              </div>
            </div>
          </div>

          {showDetails && (
            <>
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="text-sm font-semibold text-slate-900">Score Breakdown</div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="text-slate-700">Digital Presence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={scoreBreakdown.digitalPresence} className="w-20 h-1.5" />
                      <span className="text-sm font-medium text-slate-900 w-8">{scoreBreakdown.digitalPresence}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-slate-700">Reputation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={scoreBreakdown.reputation} className="w-20 h-1.5" />
                      <span className="text-sm font-medium text-slate-900 w-8">{scoreBreakdown.reputation}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="text-slate-700">Business Maturity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={scoreBreakdown.businessMaturity} className="w-20 h-1.5" />
                      <span className="text-sm font-medium text-slate-900 w-8">{scoreBreakdown.businessMaturity}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <span className="text-slate-700">Engagement Potential</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={scoreBreakdown.engagementPotential} className="w-20 h-1.5" />
                      <span className="text-sm font-medium text-slate-900 w-8">{scoreBreakdown.engagementPotential}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="text-sm font-semibold text-slate-900">Key Insights</div>
                <div className="space-y-2">
                  {insights.factors.map((factor, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {recommendations.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="text-sm font-semibold text-slate-900">Recommendations</div>
                  <div className="space-y-2">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Last Updated: {new Date(lead.updatedAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI-Powered Analysis
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}