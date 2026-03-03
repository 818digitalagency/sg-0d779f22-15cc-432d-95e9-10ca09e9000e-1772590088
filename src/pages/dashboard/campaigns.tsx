import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Plus, 
  Eye, 
  Clock, 
  Send, 
  Pause,
  Play,
  BarChart3,
  Users,
  MousePointerClick
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: "Draft" | "Scheduled" | "Active" | "Paused" | "Completed";
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  scheduledDate?: string;
  createdAt: string;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    name: "Q1 Tech Outreach",
    subject: "Transform Your Business with Modern Technology",
    status: "Active",
    recipients: 245,
    sent: 245,
    opened: 167,
    clicked: 89,
    replied: 23,
    createdAt: "2026-02-15T10:00:00Z"
  },
  {
    id: "2",
    name: "Legal Services Campaign",
    subject: "Upgrade Your Legal Practice Website",
    status: "Completed",
    recipients: 128,
    sent: 128,
    opened: 94,
    clicked: 52,
    replied: 18,
    createdAt: "2026-01-20T14:00:00Z"
  },
  {
    id: "3",
    name: "Healthcare Provider Outreach",
    subject: "Modern Patient Engagement Solutions",
    status: "Scheduled",
    recipients: 186,
    sent: 0,
    opened: 0,
    clicked: 0,
    replied: 0,
    scheduledDate: "2026-03-10T09:00:00Z",
    createdAt: "2026-03-01T11:30:00Z"
  },
  {
    id: "4",
    name: "Real Estate Follow-up",
    subject: "Enhance Your Property Listings Online",
    status: "Paused",
    recipients: 92,
    sent: 45,
    opened: 31,
    clicked: 14,
    replied: 5,
    createdAt: "2026-02-25T08:00:00Z"
  }
];

export default function CampaignsPage() {
  const [campaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);

  const getStatusColor = (status: Campaign["status"]) => {
    const colors = {
      "Draft": "bg-slate-100 text-slate-700",
      "Scheduled": "bg-blue-100 text-blue-700",
      "Active": "bg-green-100 text-green-700",
      "Paused": "bg-amber-100 text-amber-700",
      "Completed": "bg-purple-100 text-purple-700"
    };
    return colors[status];
  };

  const calculateOpenRate = (opened: number, sent: number) => {
    if (sent === 0) return 0;
    return Math.round((opened / sent) * 100);
  };

  const calculateClickRate = (clicked: number, sent: number) => {
    if (sent === 0) return 0;
    return Math.round((clicked / sent) * 100);
  };

  return (
    <>
      <SEO title="Email Campaigns - Opportunity Finder" />
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Email Campaigns</h1>
              <p className="text-slate-600 mt-1">Manage your outreach campaigns and track performance</p>
            </div>
            <Link href="/dashboard/campaigns/new">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700">
                <Plus className="w-4 h-4" />
                New Campaign
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Sent</CardTitle>
                <Mail className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">418</div>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Avg. Open Rate</CardTitle>
                <Eye className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">68.3%</div>
                <p className="text-xs text-green-600 mt-1">+5.2% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Avg. Click Rate</CardTitle>
                <MousePointerClick className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">35.4%</div>
                <p className="text-xs text-green-600 mt-1">+3.8% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Replies</CardTitle>
                <Send className="w-4 h-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">46</div>
                <p className="text-xs text-green-600 mt-1">+8 from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns List */}
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{campaign.name}</h3>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">
                        <span className="font-medium">Subject:</span> {campaign.subject}
                      </p>
                      {campaign.scheduledDate && (
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Clock className="w-3 h-3" />
                          Scheduled for {new Date(campaign.scheduledDate).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {campaign.status === "Active" && (
                        <Button variant="outline" size="sm">
                          <Pause className="w-3 h-3 mr-1" />
                          Pause
                        </Button>
                      )}
                      {campaign.status === "Paused" && (
                        <Button variant="outline" size="sm">
                          <Play className="w-3 h-3 mr-1" />
                          Resume
                        </Button>
                      )}
                      <Link href={`/dashboard/campaigns/${campaign.id}`}>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Recipients</div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-900">{campaign.recipients}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Sent</div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-blue-400" />
                        <span className="text-sm font-semibold text-slate-900">{campaign.sent}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Opened</div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-green-400" />
                        <span className="text-sm font-semibold text-slate-900">
                          {campaign.opened} ({calculateOpenRate(campaign.opened, campaign.sent)}%)
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Clicked</div>
                      <div className="flex items-center gap-1">
                        <MousePointerClick className="w-3 h-3 text-purple-400" />
                        <span className="text-sm font-semibold text-slate-900">
                          {campaign.clicked} ({calculateClickRate(campaign.clicked, campaign.sent)}%)
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 mb-1">Replied</div>
                      <div className="flex items-center gap-1">
                        <Send className="w-3 h-3 text-amber-400" />
                        <span className="text-sm font-semibold text-slate-900">{campaign.replied}</span>
                      </div>
                    </div>
                  </div>

                  {campaign.sent > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${calculateOpenRate(campaign.opened, campaign.sent)}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-600 w-16 text-right">
                          {calculateOpenRate(campaign.opened, campaign.sent)}% open
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}