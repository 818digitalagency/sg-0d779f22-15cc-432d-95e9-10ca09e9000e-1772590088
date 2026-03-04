import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Mail, 
  Send, 
  TrendingUp, 
  Users, 
  MousePointerClick,
  MessageSquare,
  Calendar,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  Pause,
  Play
} from "lucide-react";
import Link from "next/link";
import type { Campaign } from "@/types/lead";
import { useRealtimeCampaigns } from "@/hooks/useRealtimeCampaigns";
import { campaignService } from "@/services/campaignService";
import { emailService } from "@/services/emailService";
import { useToast } from "@/hooks/use-toast";

export default function CampaignsPage() {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  
  // Data state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingCampaign, setSendingCampaign] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch campaigns with retry logic
  const fetchCampaigns = async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);
      
      const { data, error: fetchError } = await campaignService.getCampaigns();
      
      if (fetchError) {
        throw new Error(fetchError.message || "Failed to fetch campaigns");
      }
      
      if (data && data.length > 0) {
        setCampaigns(data);
        toast({
          title: "Campaigns loaded",
          description: `Successfully loaded ${data.length} campaigns`,
          duration: 3000,
        });
      } else {
        // Use empty array if no campaigns
        setCampaigns([]);
        toast({
          title: "No campaigns",
          description: "Create your first campaign to get started",
          duration: 3000,
        });
      }
      setRetryCount(0);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError(err instanceof Error ? err.message : "Failed to load campaigns");
      
      // Auto-retry logic (max 3 attempts)
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchCampaigns(true);
        }, 2000 * (retryCount + 1)); // Exponential backoff
        
        toast({
          title: "Connection issue",
          description: `Retrying... (Attempt ${retryCount + 1}/3)`,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: "Failed to load campaigns",
          description: "Please check your connection and try again.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Real-time subscription
  useRealtimeCampaigns({
    enabled: !loading && !error,
    onInsert: (newCampaign) => {
      setCampaigns(prev => [newCampaign, ...prev]);
      toast({
        title: "New campaign created",
        description: newCampaign.name,
        duration: 3000,
      });
    },
    onUpdate: (updatedCampaign) => {
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === updatedCampaign.id ? updatedCampaign : campaign
      ));
    },
    onDelete: (deletedId) => {
      setCampaigns(prev => prev.filter(campaign => campaign.id !== deletedId));
      toast({
        title: "Campaign deleted",
        description: "A campaign was removed",
        duration: 3000,
      });
    }
  });

  const handleSendCampaign = async (campaignId: string) => {
    if (!emailService.isConfigured()) {
      alert("Email service not configured. Please add NEXT_PUBLIC_SENDGRID_API_KEY or NEXT_PUBLIC_AWS_SES_ACCESS_KEY to your environment variables.");
      return;
    }

    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    if (!confirm(`Send campaign "${campaign.name}" to ${campaign.recipients} recipients?`)) {
      return;
    }

    setSendingCampaign(campaignId);

    try {
      // In a real implementation, this would:
      // 1. Fetch leads associated with this campaign
      // 2. Call emailService.sendCampaignEmails()
      // 3. Update campaign status and metrics
      
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update campaign status to 'active'
      await campaignService.updateCampaign(campaignId, {
        status: "active",
        sentAt: new Date().toISOString()
      });

      alert(`Campaign "${campaign.name}" sent successfully!`);
    } catch (error) {
      console.error("Error sending campaign:", error);
      alert("Failed to send campaign. Please try again.");
    } finally {
      setSendingCampaign(null);
    }
  };

  const getStatusColor = (status: Campaign["status"]) => {
    const colors = {
      "draft": "bg-slate-100 text-slate-700",
      "scheduled": "bg-blue-100 text-blue-700",
      "active": "bg-green-100 text-green-700",
      "paused": "bg-amber-100 text-amber-700",
      "completed": "bg-purple-100 text-purple-700",
      "cancelled": "bg-red-100 text-red-700"
    };
    return colors[status] || colors["draft"];
  };

  const getStatusIcon = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return <PlayCircle className="w-4 h-4" />;
      case "paused":
        return <PauseCircle className="w-4 h-4" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-6 w-[80px]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Calculate total metrics
  const totalMetrics = campaigns.reduce((acc, campaign) => ({
    recipients: acc.recipients + (campaign.recipients || 0),
    sent: acc.sent + (campaign.sent || 0),
    opened: acc.opened + (campaign.opened || 0),
    clicked: acc.clicked + (campaign.clicked || 0),
    replied: acc.replied + (campaign.replied || 0)
  }), { recipients: 0, sent: 0, opened: 0, clicked: 0, replied: 0 });

  const overallOpenRate = totalMetrics.sent > 0 
    ? ((totalMetrics.opened / totalMetrics.sent) * 100).toFixed(1)
    : "0.0";

  const overallClickRate = totalMetrics.sent > 0 
    ? ((totalMetrics.clicked / totalMetrics.sent) * 100).toFixed(1)
    : "0.0";

  return (
    <>
      <SEO 
        title="Email Campaigns - Opportunity Finder"
        description="Manage and track your email outreach campaigns"
      />
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header with connection status */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Email Campaigns
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Track and manage your outreach efforts
              </p>
            </div>
            <div className="flex items-center gap-3">
              {error && (
                <Badge variant="destructive" className="flex items-center gap-2">
                  <XCircle className="h-3 w-3" />
                  Connection Error
                </Badge>
              )}
              {!error && !loading && (
                <Badge variant="outline" className="flex items-center gap-2 bg-green-50 text-green-700 border-green-200">
                  <CheckCircle2 className="h-3 w-3" />
                  Live Data
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchCampaigns(true)}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/dashboard/campaigns/new">
                <Button className="gap-2">
                  <Send className="h-4 w-4" />
                  New Campaign
                </Button>
              </Link>
            </div>
          </div>

          {/* Error banner */}
          {error && retryCount >= 3 && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 dark:text-red-100">
                      Connection Issue
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {error}. Please check your internet connection or try again later.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setRetryCount(0);
                        fetchCampaigns(true);
                      }}
                      className="mt-3"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Total Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {loading ? <Skeleton className="h-8 w-16" /> : campaigns.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Emails Sent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {loading ? <Skeleton className="h-8 w-16" /> : totalMetrics.sent.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Open Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {loading ? <Skeleton className="h-8 w-16" /> : `${overallOpenRate}%`}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Click Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {loading ? <Skeleton className="h-8 w-16" /> : `${overallClickRate}%`}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns List */}
          {loading ? (
            <LoadingSkeleton />
          ) : campaigns.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="text-center">
                  <Mail className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    No campaigns yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Create your first email campaign to start reaching out to leads
                  </p>
                  <Link href="/dashboard/campaigns/new">
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(campaign.status)}`}>
                          {getStatusIcon(campaign.status)}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{campaign.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {campaign.description || campaign.subject}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-5 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Users className="h-4 w-4" />
                          Recipients
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {campaign.recipients?.toLocaleString() || 0}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Send className="h-4 w-4" />
                          Sent
                        </div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {campaign.sent?.toLocaleString() || 0}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Mail className="h-4 w-4" />
                          Opens
                        </div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {campaign.opened?.toLocaleString() || 0}
                        </div>
                        <div className="text-xs text-slate-500">
                          {campaign.sent && campaign.sent > 0 
                            ? `${((campaign.opened || 0) / campaign.sent * 100).toFixed(1)}%`
                            : "0%"}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <MousePointerClick className="h-4 w-4" />
                          Clicks
                        </div>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {campaign.clicked?.toLocaleString() || 0}
                        </div>
                        <div className="text-xs text-slate-500">
                          {campaign.sent && campaign.sent > 0 
                            ? `${((campaign.clicked || 0) / campaign.sent * 100).toFixed(1)}%`
                            : "0%"}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <MessageSquare className="h-4 w-4" />
                          Replies
                        </div>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {campaign.replied?.toLocaleString() || 0}
                        </div>
                        <div className="text-xs text-slate-500">
                          {campaign.sent && campaign.sent > 0 
                            ? `${((campaign.replied || 0) / campaign.sent * 100).toFixed(1)}%`
                            : "0%"}
                        </div>
                      </div>
                    </div>

                    {campaign.conversionRate !== undefined && campaign.conversionRate > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Conversion Rate
                          </span>
                          <div className="flex items-center gap-2">
                            <Progress value={campaign.conversionRate} className="w-32" />
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {campaign.conversionRate.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500">
                        {campaign.scheduledAt && (
                          <span>Scheduled: {new Date(campaign.scheduledAt).toLocaleDateString()}</span>
                        )}
                        {campaign.sentAt && (
                          <span>Sent: {new Date(campaign.sentAt).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {campaign.status === "draft" && (
                          <Button 
                            size="sm" 
                            onClick={() => handleSendCampaign(campaign.id)}
                            disabled={sendingCampaign === campaign.id}
                          >
                            {sendingCampaign === campaign.id ? (
                              <>
                                <Mail className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Campaign
                              </>
                            )}
                          </Button>
                        )}
                        {campaign.status === "active" && (
                          <Button size="sm" variant="outline">
                            <Pause className="mr-2 h-4 w-4" />
                            Pause
                          </Button>
                        )}
                        {campaign.status === "paused" && (
                          <Button size="sm">
                            <Play className="mr-2 h-4 w-4" />
                            Resume
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}