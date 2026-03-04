import { useState, useMemo, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, Filter, Download, Mail, MapPin, Phone, Globe, 
  Star, Calendar, TrendingUp, ChevronLeft, ChevronRight,
  RefreshCw, AlertCircle, CheckCircle2, XCircle
} from "lucide-react";
import { NB_CITIES, BUSINESS_CATEGORIES } from "@/types/lead";
import type { Lead, EngagementStatus } from "@/types/lead";
import { ProposalGenerator } from "@/components/ai/ProposalGenerator";
import { LeadScoreCard } from "@/components/ai/LeadScoreCard";
import { exportService, type ExportFormat, type ExportOptions } from "@/lib/utils/exportData";
import { aiProposalGenerator } from "@/lib/ai/proposalGenerator";
import { aiLeadScorer } from "@/lib/ai/leadScoring";
import { useRealtimeLeads } from "@/hooks/useRealtimeLeads";
import { leadService } from "@/services/leadService";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    businessName: "Maritime Tech Solutions",
    contactName: "Sarah Johnson",
    email: "sarah@maritimetech.ca",
    phone: "(506) 555-0123",
    address: "123 Main Street",
    city: "Moncton",
    province: "New Brunswick",
    postalCode: "E1C 1A1",
    website: "https://maritimetech.ca",
    businessDescription: "IT consulting and software development for maritime businesses",
    category: "Information Technology",
    businessAge: 5,
    rating: 4.8,
    reviewCount: 124,
    socialMedia: {
      linkedin: "https://linkedin.com/company/maritime-tech"
    },
    dataSource: "Google Business",
    industry: "Technology",
    leadScore: 92,
    websiteQualityScore: 88,
    engagementStatus: "Not Contacted",
    status: "active",
    tags: ["high-priority", "tech"],
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-03-01T10:00:00Z"
  }
];

export default function LeadsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv");
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showProposalGenerator, setShowProposalGenerator] = useState(false);
  const [showLeadScore, setShowLeadScore] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "score" | "rating" | "age">("score");
  
  // Data state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch leads with retry logic
  const fetchLeads = async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);
      
      const { data, error: fetchError } = await leadService.getLeads();
      
      if (fetchError) {
        throw new Error(fetchError.message || "Failed to fetch leads");
      }
      
      if (data && data.length > 0) {
        setLeads(data);
        toast({
          title: "Leads loaded",
          description: `Successfully loaded ${data.length} leads`,
          duration: 3000,
        });
      } else {
        // Use mock data if database is empty
        setLeads(MOCK_LEADS);
        toast({
          title: "Using sample data",
          description: "No leads in database. Showing sample data.",
          duration: 3000,
        });
      }
      setRetryCount(0);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError(err instanceof Error ? err.message : "Failed to load leads");
      
      // Fallback to mock data on error
      setLeads(MOCK_LEADS);
      
      // Auto-retry logic (max 3 attempts)
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchLeads(true);
        }, 2000 * (retryCount + 1)); // Exponential backoff
        
        toast({
          title: "Connection issue",
          description: `Retrying... (Attempt ${retryCount + 1}/3)`,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: "Failed to load leads",
          description: "Using cached data. Please check your connection.",
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
    fetchLeads();
  }, []);
  
  // Real-time subscription with error handling
  useRealtimeLeads({
    enabled: !loading && !error,
    onInsert: (newLead) => {
      setLeads(prev => [newLead, ...prev]);
      toast({
        title: "New lead added",
        description: newLead.businessName,
        duration: 3000,
      });
    },
    onUpdate: (updatedLead) => {
      setLeads(prev => prev.map(lead => 
        lead.id === updatedLead.id ? updatedLead : lead
      ));
    },
    onDelete: (deletedId) => {
      setLeads(prev => prev.filter(lead => lead.id !== deletedId));
      toast({
        title: "Lead removed",
        description: "A lead was deleted",
        duration: 3000,
      });
    }
  });

  const itemsPerPage = 10;

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || lead.category === selectedCategory;
    const matchesCity = selectedCity === "all" || lead.city === selectedCity;
    const matchesStatus = selectedStatus === "all" || lead.engagementStatus === selectedStatus;

    return matchesSearch && matchesCategory && matchesCity && matchesStatus;
  });

  const sortedLeads = useMemo(() => {
    return [...filteredLeads].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.businessName.localeCompare(b.businessName);
        case "score":
          return (b.leadScore || 0) - (a.leadScore || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "age":
          return (b.businessAge || 0) - (a.businessAge || 0);
        default:
          return 0;
      }
    });
  }, [filteredLeads, sortBy]);

  const paginatedLeads = sortedLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);

  const handleExport = async () => {
    setExportProgress(0);
    setExportComplete(false);

    const dataToExport = selectedLeads.size > 0 
      ? leads.filter(l => selectedLeads.has(l.id))
      : filteredLeads;

    const options: ExportOptions = {
      format: exportFormat,
      filename: `leads_export_${new Date().toISOString().split('T')[0]}`
    };

    try {
      await exportService.exportLeads(dataToExport, options, (progress) => {
        setExportProgress(progress);
      });

      setExportComplete(true);
      toast({
        title: "Export successful",
        description: `Exported ${dataToExport.length} leads as ${exportFormat.toUpperCase()}`,
        duration: 5000,
      });

      setTimeout(() => {
        setExportDialogOpen(false);
        setExportProgress(0);
        setExportComplete(false);
      }, 2000);
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export failed",
        description: "Please try again",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const toggleLeadSelection = (leadId: string) => {
    const newSelection = new Set(selectedLeads);
    if (newSelection.has(leadId)) {
      newSelection.delete(leadId);
    } else {
      newSelection.add(leadId);
    }
    setSelectedLeads(newSelection);
  };

  const toggleAllLeads = () => {
    if (selectedLeads.size === paginatedLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(paginatedLeads.map(l => l.id)));
    }
  };

  const statusColors: Record<EngagementStatus, string> = {
    "Not Contacted": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    "Contacted": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Responded": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "Qualified": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "Converted": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    "Lost": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
  };

  const getStatusColor = (status: EngagementStatus) => {
    const colors: Record<EngagementStatus, string> = {
      "Not Contacted": "bg-gray-100 text-gray-700",
      "Contacted": "bg-blue-100 text-blue-700",
      "Responded": "bg-purple-100 text-purple-700",
      "Qualified": "bg-emerald-100 text-emerald-700",
      "Converted": "bg-green-100 text-green-700",
      "Lost": "bg-red-100 text-red-700"
    };
    return colors[status];
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <SEO 
        title="Lead Management - Opportunity Finder"
        description="Discover and manage high-quality business leads in New Brunswick"
      />
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header with connection status */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Lead Management
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Discover and manage business opportunities
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
                onClick={() => fetchLeads(true)}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
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
                      {error}. Showing cached data. Check your internet connection or try again later.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setRetryCount(0);
                        fetchLeads(true);
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
                  Total Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {loading ? <Skeleton className="h-8 w-16" /> : leads.length.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  High Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {loading ? <Skeleton className="h-8 w-16" /> : leads.filter(l => (l.leadScore || 0) >= 80).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Not Contacted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {loading ? <Skeleton className="h-8 w-16" /> : leads.filter(l => l.engagementStatus === "Not Contacted").length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Avg Lead Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    Math.round(leads.reduce((sum, l) => sum + (l.leadScore || 0), 0) / leads.length || 0)
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search leads..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {BUSINESS_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {NB_CITIES.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Not Contacted">Not Contacted</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Responded">Responded</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedLeads.size > 0 ? (
                      <span className="font-medium">{selectedLeads.size} selected</span>
                    ) : (
                      <span>{sortedLeads.length} leads found</span>
                    )}
                  </div>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="score">Sort by Score</SelectItem>
                      <SelectItem value="name">Sort by Name</SelectItem>
                      <SelectItem value="rating">Sort by Rating</SelectItem>
                      <SelectItem value="age">Sort by Age</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setExportDialogOpen(true)} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Leads Table */}
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <LoadingSkeleton />
              ) : sortedLeads.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    No leads found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Try adjusting your filters or search query
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="text-left p-4">
                            <Checkbox 
                              checked={selectedLeads.size === paginatedLeads.length && paginatedLeads.length > 0}
                              onCheckedChange={toggleAllLeads}
                            />
                          </th>
                          <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Business</th>
                          <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Contact</th>
                          <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Location</th>
                          <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Score</th>
                          <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                          <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedLeads.map((lead) => (
                          <tr key={lead.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="p-4">
                              <Checkbox 
                                checked={selectedLeads.has(lead.id)}
                                onCheckedChange={() => toggleLeadSelection(lead.id)}
                              />
                            </td>
                            <td className="p-4">
                              <div>
                                <div className="font-medium text-slate-900 dark:text-slate-100">
                                  {lead.businessName}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                  {lead.category}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                                  <Mail className="h-3 w-3" />
                                  {lead.email}
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mt-1">
                                  <Phone className="h-3 w-3" />
                                  {lead.phone}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <MapPin className="h-3 w-3" />
                                {lead.city}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                                    style={{ width: `${lead.leadScore}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                  {lead.leadScore}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={getStatusColor(lead.engagementStatus)}>
                                {lead.engagementStatus}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setShowProposalGenerator(true);
                                  }}
                                >
                                  <Mail className="h-3 w-3 mr-1" />
                                  Contact
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setShowLeadScore(true);
                                  }}
                                >
                                  <TrendingUp className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Export Dialog */}
        <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Leads</DialogTitle>
              <DialogDescription>
                Choose your export format and options
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Format</label>
                <Select value={exportFormat} onValueChange={(value: ExportFormat) => setExportFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel (XLSX)</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {exportProgress > 0 && (
                <div className="space-y-2">
                  <Progress value={exportProgress} />
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                    {exportComplete ? "Export complete!" : `Exporting... ${exportProgress}%`}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setExportDialogOpen(false)}
                  className="flex-1"
                  disabled={exportProgress > 0 && !exportComplete}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExport}
                  className="flex-1"
                  disabled={exportProgress > 0 && !exportComplete}
                >
                  {exportProgress > 0 && !exportComplete ? "Exporting..." : "Export"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Proposal Generator Dialog */}
        {selectedLead && (
          <ProposalGenerator
            lead={selectedLead}
            open={showProposalGenerator}
            onOpenChange={setShowProposalGenerator}
          />
        )}

        {/* Lead Score Dialog */}
        {selectedLead && (
          <LeadScoreCard
            lead={selectedLead}
            open={showLeadScore}
            onOpenChange={setShowLeadScore}
          />
        )}
      </DashboardLayout>
    </>
  );
}