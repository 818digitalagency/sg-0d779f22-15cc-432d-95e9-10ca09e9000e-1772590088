import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, TrendingUp, Users, MapPin, Target, Send, Eye } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "Total Leads", value: "12,483", change: "+12.5%", icon: Building2, color: "blue" },
    { label: "Active Campaigns", value: "8", change: "+2", icon: Mail, color: "purple" },
    { label: "Email Opens", value: "68.3%", change: "+5.2%", icon: Eye, color: "green" },
    { label: "Conversion Rate", value: "24.8%", change: "+3.1%", icon: TrendingUp, color: "amber" },
  ];

  const recentLeads = [
    { name: "Maritime Tech Solutions", city: "Fredericton", score: 92, status: "Hot" },
    { name: "Atlantic Legal Group", city: "Moncton", score: 88, status: "Warm" },
    { name: "Bay View Realty", city: "Saint John", score: 85, status: "Warm" },
    { name: "Northern Manufacturing Inc", city: "Bathurst", score: 79, status: "Cold" },
  ];

  const topCities = [
    { name: "Moncton", count: 3421, percentage: 27.4 },
    { name: "Saint John", count: 2834, percentage: 22.7 },
    { name: "Fredericton", count: 2156, percentage: 17.3 },
    { name: "Bathurst", count: 1289, percentage: 10.3 },
    { name: "Other", count: 2783, percentage: 22.3 },
  ];

  return (
    <>
      <SEO title="Dashboard - Opportunity Finder" />
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">Welcome back! Here's your lead intelligence overview</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">{stat.label}</CardTitle>
                  <div className={`w-8 h-8 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 text-${stat.color}-600`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent High-Score Leads */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  High-Priority Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLeads.map((lead) => (
                    <div key={lead.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                      <div>
                        <div className="font-medium text-slate-900">{lead.name}</div>
                        <div className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {lead.city}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-blue-600">{lead.score}/100</div>
                        <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                          lead.status === "Hot" ? "bg-red-100 text-red-700" :
                          lead.status === "Warm" ? "bg-amber-100 text-amber-700" :
                          "bg-slate-200 text-slate-700"
                        }`}>
                          {lead.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Cities */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Leads by Municipality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCities.map((city) => (
                    <div key={city.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900">{city.name}</span>
                        <span className="text-sm text-slate-600">{city.count} leads</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${city.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{city.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                  <Users className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="font-medium text-slate-900">Browse Leads</div>
                  <div className="text-sm text-slate-600 mt-1">Explore database</div>
                </button>
                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
                  <Send className="w-6 h-6 text-purple-600 mb-2" />
                  <div className="font-medium text-slate-900">New Campaign</div>
                  <div className="text-sm text-slate-600 mt-1">Create outreach</div>
                </button>
                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
                  <MapPin className="w-6 h-6 text-green-600 mb-2" />
                  <div className="font-medium text-slate-900">Map View</div>
                  <div className="text-sm text-slate-600 mt-1">Geographic analysis</div>
                </button>
                <button className="p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors text-left">
                  <TrendingUp className="w-6 h-6 text-amber-600 mb-2" />
                  <div className="font-medium text-slate-900">Analytics</div>
                  <div className="text-sm text-slate-600 mt-1">View reports</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
}