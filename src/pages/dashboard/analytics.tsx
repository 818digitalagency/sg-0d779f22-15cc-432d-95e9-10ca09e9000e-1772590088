import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Mail, 
  Target, 
  DollarSign,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from "recharts";

// Mock data for charts
const leadsByMonth = [
  { month: "Jan", leads: 245, converted: 45, revenue: 12500 },
  { month: "Feb", leads: 312, converted: 62, revenue: 18200 },
  { month: "Mar", leads: 389, converted: 89, revenue: 24800 },
  { month: "Apr", leads: 456, converted: 112, revenue: 31200 },
  { month: "May", leads: 523, converted: 145, revenue: 42500 },
  { month: "Jun", leads: 601, converted: 178, revenue: 53800 }
];

const industryDistribution = [
  { name: "Real Estate", value: 342, color: "#3b82f6" },
  { name: "IT & Tech", value: 289, color: "#8b5cf6" },
  { name: "Manufacturing", value: 234, color: "#06b6d4" },
  { name: "Professional Services", value: 198, color: "#10b981" },
  { name: "Retail", value: 156, color: "#f59e0b" },
  { name: "Other", value: 124, color: "#6b7280" }
];

const cityDistribution = [
  { name: "Fredericton", value: 423 },
  { name: "Saint John", value: 389 },
  { name: "Moncton", value: 356 },
  { name: "Dieppe", value: 178 },
  { name: "Miramichi", value: 145 },
  { name: "Other", value: 234 }
];

const emailPerformance = [
  { week: "Week 1", sent: 450, opened: 315, clicked: 142, replied: 45 },
  { week: "Week 2", sent: 520, opened: 374, clicked: 168, replied: 58 },
  { week: "Week 3", sent: 480, opened: 350, clicked: 156, replied: 52 },
  { week: "Week 4", sent: 590, opened: 425, clicked: 195, replied: 71 }
];

const leadScoreDistribution = [
  { score: "0-20", count: 234 },
  { score: "21-40", count: 456 },
  { score: "41-60", count: 678 },
  { score: "61-80", count: 523 },
  { score: "81-100", count: 342 }
];

const campaignPerformance = [
  { subject: "Engagement", score: 85 },
  { subject: "Conversion", score: 72 },
  { subject: "Response Time", score: 90 },
  { subject: "Lead Quality", score: 78 },
  { subject: "Email Open Rate", score: 82 },
  { subject: "Follow-up Rate", score: 65 }
];

const conversionFunnel = [
  { stage: "Total Leads", count: 2234, percentage: 100 },
  { stage: "Contacted", count: 1876, percentage: 84 },
  { stage: "Engaged", count: 1245, percentage: 56 },
  { stage: "Proposal Sent", count: 892, percentage: 40 },
  { stage: "In Negotiation", count: 456, percentage: 20 },
  { stage: "Converted", count: 267, percentage: 12 }
];

export default function AnalyticsPage() {
  const handleExport = (format: string) => {
    console.log(`Exporting analytics data as ${format}`);
    // Export functionality will be implemented
  };

  return (
    <>
      <SEO 
        title="Analytics Dashboard - Opportunity Finder"
        description="Comprehensive analytics and insights for your lead generation campaigns"
      />
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive insights and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select defaultValue="30">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => handleExport("pdf")}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Leads</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">2,234</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5%
                  </Badge>
                  <p className="text-xs text-slate-600 dark:text-slate-400">vs last month</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Conversion Rate</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">12.0%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.3%
                  </Badge>
                  <p className="text-xs text-slate-600 dark:text-slate-400">vs last month</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Email Open Rate</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">72.1%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -1.2%
                  </Badge>
                  <p className="text-xs text-slate-600 dark:text-slate-400">vs last month</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Revenue</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">$183K</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18.7%
                  </Badge>
                  <p className="text-xs text-slate-600 dark:text-slate-400">vs last month</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="performance">
                <LineChartIcon className="h-4 w-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="distribution">
                <PieChartIcon className="h-4 w-4 mr-2" />
                Distribution
              </TabsTrigger>
              <TabsTrigger value="funnel">
                <Activity className="h-4 w-4 mr-2" />
                Funnel
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lead Growth Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Growth Trend</CardTitle>
                    <CardDescription>Monthly lead acquisition and conversion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={leadsByMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="leads" fill="#3b82f6" name="Total Leads" />
                        <Line 
                          type="monotone" 
                          dataKey="converted" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Converted"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Revenue Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Growth</CardTitle>
                    <CardDescription>Monthly revenue from converted leads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={leadsByMonth}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number) => `$${value.toLocaleString()}`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                          name="Revenue"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Lead Score Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Lead Score Distribution</CardTitle>
                  <CardDescription>Distribution of leads by AI-generated score</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={leadScoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="score" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="count" fill="#8b5cf6" name="Number of Leads" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Email Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Email Campaign Performance</CardTitle>
                    <CardDescription>Weekly email engagement metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={emailPerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="week" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="sent" stroke="#64748b" strokeWidth={2} name="Sent" />
                        <Line type="monotone" dataKey="opened" stroke="#3b82f6" strokeWidth={2} name="Opened" />
                        <Line type="monotone" dataKey="clicked" stroke="#8b5cf6" strokeWidth={2} name="Clicked" />
                        <Line type="monotone" dataKey="replied" stroke="#10b981" strokeWidth={2} name="Replied" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Campaign Performance Radar */}
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Health Score</CardTitle>
                    <CardDescription>Overall campaign performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={campaignPerformance}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" stroke="#64748b" />
                        <PolarRadiusAxis stroke="#64748b" />
                        <Radar 
                          name="Performance" 
                          dataKey="score" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Email Deliverability</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Successfully delivered emails</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">98.5%</p>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Excellent
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Average Response Time</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Time to first reply</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">2.3 days</p>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Fast
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Engagement Score</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Overall lead engagement</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">8.7/10</p>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          High
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Distribution Tab */}
            <TabsContent value="distribution" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Industry Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Leads by Industry</CardTitle>
                    <CardDescription>Distribution across different sectors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={industryDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {industryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* City Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Leads by City</CardTitle>
                    <CardDescription>Geographic distribution in New Brunswick</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={cityDistribution} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" stroke="#64748b" />
                        <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="value" fill="#06b6d4" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Industry Breakdown Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Industry Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {industryDistribution.map((industry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-4 w-4 rounded-full" 
                            style={{ backgroundColor: industry.color }}
                          />
                          <span className="font-medium text-slate-900 dark:text-white">{industry.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-slate-600 dark:text-slate-400">{industry.value} leads</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {((industry.value / industryDistribution.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Funnel Tab */}
            <TabsContent value="funnel" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                  <CardDescription>Lead progression through sales stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conversionFunnel.map((stage, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-900 dark:text-white">{stage.stage}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {stage.count.toLocaleString()} leads
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">{stage.percentage}%</span>
                          </div>
                        </div>
                        <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 flex items-center justify-center"
                            style={{ width: `${stage.percentage}%` }}
                          >
                            {stage.percentage > 15 && (
                              <span className="text-white font-semibold text-sm">
                                {stage.count.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {index < conversionFunnel.length - 1 && (
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-slate-400">
                            <ArrowDownRight className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3">
                      <ArrowUpRight className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          Conversion Insights
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          Your conversion rate of 12% is above the industry average of 8-10%. 
                          Focus on improving the "Engaged to Proposal Sent" stage to increase overall conversions.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
}