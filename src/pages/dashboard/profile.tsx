import { useState } from "react";
import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  Bell,
  Shield,
  CreditCard,
  Activity,
  Settings,
  Upload,
  Download,
  Trash2,
  Check,
  X,
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  Zap
} from "lucide-react";
import type { User as UserType, UserSettings, ActivityLog } from "@/types/user";

// Mock current user data
const CURRENT_USER: UserType = {
  id: "user-001",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "admin",
  avatar: "",
  phone: "+1 (506) 555-0123",
  company: "Maritime Growth Solutions",
  timezone: "America/Moncton",
  language: "en",
  emailNotifications: true,
  browserNotifications: true,
  weeklyReports: true,
  createdAt: "2025-11-15T10:00:00Z",
  lastLogin: "2026-03-03T22:45:00Z",
  subscription: {
    plan: "pro",
    status: "active",
    billingCycle: "annual",
    nextBillingDate: "2027-03-03T00:00:00Z"
  },
  stats: {
    totalLeads: 2234,
    emailsSent: 8945,
    conversions: 267,
    revenue: 183400
  },
  preferences: {
    defaultView: "table",
    itemsPerPage: 25,
    darkMode: false,
    compactMode: false
  }
};

const MOCK_ACTIVITY: ActivityLog[] = [
  {
    id: "1",
    userId: "user-001",
    action: "lead_created",
    description: "Created new lead: Maritime Tech Solutions",
    timestamp: "2026-03-03T22:30:00Z"
  },
  {
    id: "2",
    userId: "user-001",
    action: "email_sent",
    description: "Sent campaign email to 45 leads",
    timestamp: "2026-03-03T21:15:00Z"
  },
  {
    id: "3",
    userId: "user-001",
    action: "proposal_generated",
    description: "Generated AI proposal for Atlantic Construction Inc",
    timestamp: "2026-03-03T20:45:00Z"
  },
  {
    id: "4",
    userId: "user-001",
    action: "export_data",
    description: "Exported 150 leads to CSV",
    timestamp: "2026-03-03T18:30:00Z"
  },
  {
    id: "5",
    userId: "user-001",
    action: "settings_updated",
    description: "Updated notification preferences",
    timestamp: "2026-03-03T16:20:00Z"
  }
];

export default function ProfilePage() {
  const [user, setUser] = useState<UserType>(CURRENT_USER);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUser(CURRENT_USER);
    setIsEditing(false);
  };

  return (
    <>
      <SEO 
        title="Profile Settings - Opportunity Finder"
        description="Manage your account settings and preferences"
      />
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Manage your account information and preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Check className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Profile Overview Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-3xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Full Name</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Email</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Role</p>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        {user.role.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Member Since</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">
                        {new Date(user.createdAt).toLocaleDateString("en-CA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {user.stats.totalLeads.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Total Leads</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {user.stats.emailsSent.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Emails Sent</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {user.stats.conversions}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Conversions</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        ${(user.stats.revenue / 1000).toFixed(0)}K
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Revenue</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="account">
                <User className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="subscription">
                <CreditCard className="h-4 w-4 mr-2" />
                Subscription
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Account Tab */}
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={user.firstName}
                        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={user.lastName}
                        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={user.company}
                        onChange={(e) => setUser({ ...user, company: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={user.timezone}
                        onValueChange={(value) => setUser({ ...user, timezone: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="timezone">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Moncton">Atlantic Time (Moncton)</SelectItem>
                          <SelectItem value="America/Halifax">Atlantic Time (Halifax)</SelectItem>
                          <SelectItem value="America/Toronto">Eastern Time</SelectItem>
                          <SelectItem value="America/Vancouver">Pacific Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="defaultView">Default View</Label>
                        <Select
                          value={user.preferences.defaultView}
                          onValueChange={(value: "table" | "cards" | "map") => 
                            setUser({ ...user, preferences: { ...user.preferences, defaultView: value }})
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger id="defaultView">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="table">Table View</SelectItem>
                            <SelectItem value="cards">Cards View</SelectItem>
                            <SelectItem value="map">Map View</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="itemsPerPage">Items Per Page</Label>
                        <Select
                          value={user.preferences.itemsPerPage.toString()}
                          onValueChange={(value) => 
                            setUser({ ...user, preferences: { ...user.preferences, itemsPerPage: parseInt(value) }})
                          }
                          disabled={!isEditing}
                        >
                          <SelectTrigger id="itemsPerPage">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">Compact Mode</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Show more content in less space
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={user.preferences.compactMode}
                        onCheckedChange={(checked) => 
                          setUser({ ...user, preferences: { ...user.preferences, compactMode: checked }})
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications and updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Receive notifications via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={user.emailNotifications}
                      onCheckedChange={(checked) => setUser({ ...user, emailNotifications: checked })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Browser Notifications</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Get real-time browser notifications
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={user.browserNotifications}
                      onCheckedChange={(checked) => setUser({ ...user, browserNotifications: checked })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Weekly Reports</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Receive weekly performance summaries
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={user.weeklyReports}
                      onCheckedChange={(checked) => setUser({ ...user, weeklyReports: checked })}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Manage your subscription and billing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                    <div>
                      <Badge className="bg-white text-blue-600 mb-2">
                        {user.subscription.plan.toUpperCase()}
                      </Badge>
                      <h3 className="text-2xl font-bold mb-1">
                        ${user.subscription.plan === "pro" ? "49" : user.subscription.plan === "enterprise" ? "199" : "0"}/month
                      </h3>
                      <p className="text-blue-100">
                        Billed {user.subscription.billingCycle === "annual" ? "annually" : "monthly"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-100 mb-1">Next billing date</p>
                      <p className="text-lg font-semibold">
                        {user.subscription.nextBillingDate 
                          ? new Date(user.subscription.nextBillingDate).toLocaleDateString("en-CA", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })
                          : "N/A"
                        }
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Free</h4>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mb-4">$0</p>
                      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li>✓ 100 leads/month</li>
                        <li>✓ Basic analytics</li>
                        <li>✓ Email support</li>
                      </ul>
                    </div>

                    <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-900 dark:text-white">Pro</h4>
                        <Badge className="bg-blue-500">Current</Badge>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mb-4">$49</p>
                      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li>✓ Unlimited leads</li>
                        <li>✓ AI features</li>
                        <li>✓ Advanced analytics</li>
                        <li>✓ Priority support</li>
                      </ul>
                    </div>

                    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Enterprise</h4>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white mb-4">$199</p>
                      <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li>✓ Everything in Pro</li>
                        <li>✓ Custom integrations</li>
                        <li>✓ Dedicated support</li>
                        <li>✓ SLA guarantee</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                    <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                      Cancel Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and privacy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" disabled={!isEditing} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" disabled={!isEditing} />
                      </div>
                      {isEditing && (
                        <Button variant="outline">
                          Update Password
                        </Button>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">2FA Enabled</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Additional security for your account
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Danger Zone</h3>
                    <div className="p-4 border border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/10">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-red-900 dark:text-red-400 mb-1">Delete Account</h4>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                        </div>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent actions and system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MOCK_ACTIVITY.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">{activity.description}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {new Date(activity.timestamp).toLocaleString("en-CA", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                        <Badge variant="secondary" className="flex-shrink-0">
                          {activity.action.replace("_", " ")}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Button variant="outline" className="w-full">
                      View All Activity
                    </Button>
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