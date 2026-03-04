import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  Users, 
  Mail, 
  MousePointerClick,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useRealtimeLeads } from "@/hooks/useRealtimeLeads";
import { useRealtimeCampaigns } from "@/hooks/useRealtimeCampaigns";
import { leadService } from "@/services/leadService";
import { campaignService } from "@/services/campaignService";
import type { Lead, Campaign } from "@/types/lead";

// Mock data for charts (would come from DB in production)
const ACQUISITION_DATA = [
  { name: 'Mon', leads: 4, organic: 2, referral: 2 },
  { name: 'Tue', leads: 7, organic: 3, referral: 4 },
  { name: 'Wed', leads: 5, organic: 2, referral: 3 },
  { name: 'Thu', leads: 9, organic: 5, referral: 4 },
  { name: 'Fri', leads: 12, organic: 7, referral: 5 },
  { name: 'Sat', leads: 8, organic: 5, referral: 3 },
  { name: 'Sun', leads: 6, organic: 4, referral: 2 },
];

const CAMPAIGN_PERFORMANCE = [
  { name: 'Tech Outreach', sent: 150, opened: 85, clicked: 32 },
  { name: 'Local Retail', sent: 200, opened: 110, clicked: 45 },
  { name: 'Q1 Promo', sent: 300, opened: 140, clicked: 28 },
  { name: 'Follow-up', sent: 80, opened: 65, clicked: 40 },
];

const LEAD_STATUS_DATA = [
  { name: 'New', value: 45, color: '#94a3b8' },
  { name: 'Contacted', value: 30, color: '#3b82f6' },
  { name: 'Qualified', value: 15, color: '#f59e0b' },
  { name: 'Converted', value: 10, color: '#22c55e' },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsResponse, campaignsResponse] = await Promise.all([
          leadService.getLeads(),
          campaignService.getCampaigns()
        ]);
        
        if (leadsResponse.data) {
          setLeads(leadsResponse.data);
        }
        
        if (campaignsResponse.data) {
          setCampaigns(campaignsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Real-time subscriptions
  useRealtimeLeads({
    enabled: true,
    onInsert: (lead) => setLeads(prev => [...prev, lead]),
    onUpdate: (lead) => setLeads(prev => prev.map(l => l.id === lead.id ? lead : l)),
    onDelete: (id) => setLeads(prev => prev.filter(l => l.id !== id))
  });

  useRealtimeCampaigns({
    enabled: true,
    onInsert: (campaign) => setCampaigns(prev => [...prev, campaign]),
    onUpdate: (campaign) => setCampaigns(prev => prev.map(c => c.id === campaign.id ? campaign : c)),
    onDelete: (id) => setCampaigns(prev => prev.filter(c => c.id !== id))
  });

  // Calculate real metrics from live data where possible
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === "converted" || l.status === "won").length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0.0";
  
  const totalEmailsSent = campaigns.reduce((acc, curr) => acc + (curr.sent || 0), 0);
  const totalOpens = campaigns.reduce((acc, curr) => acc + (curr.opened || 0), 0);
  const openRate = totalEmailsSent > 0 ? ((totalOpens / totalEmailsSent) * 100).toFixed(1) : "0.0";

  return (
    <>
      <SEO 
        title="Analytics Dashboard | Opportunity Finder"
        description="Real-time performance metrics and insights for your lead generation campaigns."
      />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Analytics Overview
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Track your performance and growth metrics in real-time.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
                <Button 
                  variant={dateRange === "7d" ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={() => setDateRange("7d")}
                  className="text-xs"
                >
                  7 Days
                </Button>
                <Button 
                  variant={dateRange === "30d" ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={() => setDateRange("30d")}
                  className="text-xs"
                >
                  30 Days
                </Button>
                <Button 
                  variant={dateRange === "90d" ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={() => setDateRange("90d")}
                  className="text-xs"
                >
                  90 Days
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Leads</p>
                  <Users className="h-4 w-4 text-slate-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{totalLeads}</div>
                  <div className="flex items-center text-xs text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5%
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Conversion Rate</p>
                  <ArrowUpRight className="h-4 w-4 text-slate-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{conversionRate}%</div>
                  <div className="flex items-center text-xs text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.1%
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Emails Sent</p>
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{totalEmailsSent}</div>
                  <div className="flex items-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full">
                    <span>Last 30 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Open Rate</p>
                  <MousePointerClick className="h-4 w-4 text-slate-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{openRate}%</div>
                  <div className="flex items-center text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    -1.2%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
              <TabsTrigger value="leads">Lead Quality</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                <Card className="col-span-1 lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Lead Acquisition</CardTitle>
                    <CardDescription>New leads added over the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ACQUISITION_DATA}>
                          <defs>
                            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#64748b" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                          />
                          <YAxis 
                            stroke="#64748b" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(value) => `${value}`} 
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              borderRadius: '8px', 
                              border: '1px solid #e2e8f0',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                            }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="leads" 
                            stroke="#3b82f6" 
                            fillOpacity={1} 
                            fill="url(#colorLeads)" 
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-1 lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Lead Status Distribution</CardTitle>
                    <CardDescription>Current pipeline breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={LEAD_STATUS_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {LEAD_STATUS_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Engagement</CardTitle>
                  <CardDescription>Opens and clicks by campaign</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={CAMPAIGN_PERFORMANCE} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                        <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} width={100} />
                        <Tooltip 
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            borderRadius: '8px', 
                            border: '1px solid #e2e8f0' 
                          }} 
                        />
                        <Legend />
                        <Bar dataKey="sent" fill="#94a3b8" name="Sent" radius={[0, 4, 4, 0]} barSize={20} />
                        <Bar dataKey="opened" fill="#3b82f6" name="Opened" radius={[0, 4, 4, 0]} barSize={20} />
                        <Bar dataKey="clicked" fill="#22c55e" name="Clicked" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="leads" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Leads by Industry</CardTitle>
                    <CardDescription>Top industries in your pipeline</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['Technology', 'Real Estate', 'Manufacturing', 'Retail', 'Finance'].map((industry, i) => (
                        <div key={industry} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-sm font-medium">{industry}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${85 - (i * 15)}%` }} 
                              />
                            </div>
                            <span className="text-sm text-slate-500">{85 - (i * 15)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Quality Distribution</CardTitle>
                    <CardDescription>Based on AI scoring model</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] flex items-end justify-between gap-2 px-4">
                      {[10, 25, 45, 60, 40, 20, 15, 10, 5, 2].map((height, i) => (
                        <div key={i} className="w-full flex flex-col items-center gap-2">
                          <div 
                            className={`w-full rounded-t-sm ${i > 6 ? 'bg-green-500' : i > 3 ? 'bg-blue-500' : 'bg-slate-300'}`}
                            style={{ height: `${height * 2}px` }}
                          />
                          <span className="text-xs text-slate-500">{(i + 1) * 10}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 px-2">
                      <span className="text-xs font-medium text-slate-500">Low Score</span>
                      <span className="text-xs font-medium text-slate-500">High Score</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
}