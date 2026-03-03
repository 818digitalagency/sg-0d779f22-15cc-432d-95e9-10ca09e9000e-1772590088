import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  Mail, 
  Target,
  Building2,
  MapPin,
  Eye,
  MousePointerClick
} from "lucide-react";

export default function AnalyticsPage() {
  const industryData = [
    { name: "IT & Technology", count: 2847, percentage: 22.8 },
    { name: "Real Estate", count: 2134, percentage: 17.1 },
    { name: "Healthcare", count: 1923, percentage: 15.4 },
    { name: "Professional Services", count: 1567, percentage: 12.6 },
    { name: "Manufacturing", count: 1289, percentage: 10.3 },
    { name: "Other", count: 2723, percentage: 21.8 }
  ];

  const monthlyGrowth = [
    { month: "Sep", leads: 8234 },
    { month: "Oct", leads: 9156 },
    { month: "Nov", leads: 10234 },
    { month: "Dec", leads: 11089 },
    { month: "Jan", leads: 11834 },
    { month: "Feb", leads: 12483 }
  ];

  const conversionFunnel = [
    { stage: "Total Leads", count: 12483, percentage: 100 },
    { stage: "Contacted", count: 6241, percentage: 50 },
    { stage: "Opened Email", count: 4265, percentage: 68.3 },
    { stage: "Clicked Link", count: 1510, percentage: 35.4 },
    { stage: "Replied", count: 418, percentage: 27.7 },
    { stage: "Converted", count: 156, percentage: 37.3 }
  ];

  return (
    <>
      <SEO title="Analytics - Opportunity Finder" />
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="text-slate-600 mt-1">Comprehensive performance insights and metrics</p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Leads</CardTitle>
                <Building2 className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">12,483</div>
                <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Avg. Lead Score</CardTitle>
                <Target className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">76.4</div>
                <p className="text-xs text-green-600 mt-1">+2.8 from last month</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Email Open Rate</CardTitle>
                <Eye className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">68.3%</div>
                <p className="text-xs text-green-600 mt-1">+5.2% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Conversion Rate</CardTitle>
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">24.8%</div>
                <p className="text-xs text-green-600 mt-1">+3.1% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Lead Growth Chart */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Lead Growth Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyGrowth.map((data, index) => {
                    const maxLeads = Math.max(...monthlyGrowth.map(d => d.leads));
                    const percentage = (data.leads / maxLeads) * 100;
                    return (
                      <div key={data.month}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-900">{data.month}</span>
                          <span className="text-sm text-slate-600">{data.leads.toLocaleString()} leads</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Industry Distribution */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Leads by Industry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {industryData.map((industry) => (
                    <div key={industry.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900">{industry.name}</span>
                        <span className="text-sm text-slate-600">{industry.count} ({industry.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${industry.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Funnel */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage, index) => {
                  const isFirst = index === 0;
                  const prevCount = index > 0 ? conversionFunnel[index - 1].count : stage.count;
                  const width = (stage.count / conversionFunnel[0].count) * 100;
                  
                  return (
                    <div key={stage.stage} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">{stage.stage}</span>
                          {!isFirst && (
                            <span className="text-xs text-slate-600">
                              ({stage.percentage}% of previous)
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-slate-600">{stage.count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-8 flex items-center overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-8 rounded-full transition-all flex items-center justify-center"
                          style={{ width: `${width}%` }}
                        >
                          <span className="text-xs font-medium text-white px-3">
                            {Math.round(width)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Geographic Heat Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">27.4%</div>
                  <div className="text-sm text-slate-600">Moncton Region</div>
                  <div className="text-xs text-slate-500 mt-1">3,421 leads</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">22.7%</div>
                  <div className="text-sm text-slate-600">Saint John Region</div>
                  <div className="text-xs text-slate-500 mt-1">2,834 leads</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">17.3%</div>
                  <div className="text-sm text-slate-600">Fredericton Region</div>
                  <div className="text-xs text-slate-500 mt-1">2,156 leads</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}