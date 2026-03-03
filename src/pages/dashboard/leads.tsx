import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  Download, 
  Mail, 
  MapPin, 
  Star,
  ExternalLink,
  Phone,
  Globe,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  FileSpreadsheet,
  FileText,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import type { Lead, EngagementStatus } from "@/types/lead";
import { CATEGORIES, NB_CITIES } from "@/types/lead";
import { ProposalGenerator } from "@/components/ai/ProposalGenerator";
import { LeadScoreCard } from "@/components/ai/LeadScoreCard";
import { dataExporter, type ExportOptions } from "@/lib/utils/exportData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    businessName: "Maritime Tech Solutions",
    contactName: "John Smith",
    email: "john@maritimetech.ca",
    phone: "(506) 555-0123",
    address: "123 Main St",
    city: "Moncton",
    postalCode: "E1C 1A1",
    category: "IT & Technology",
    industry: "IT Services",
    businessAge: 8,
    rating: 4.5,
    reviewCount: 42,
    website: "https://maritimetech.ca",
    businessDescription: "Full-service IT consulting and managed services",
    dataSource: "Google Business",
    leadScore: 85,
    websiteQualityScore: 72,
    status: "Not Contacted",
    engagementStatus: "Not Contacted",
    tags: ["tech", "priority"],
    lastContactDate: "2026-02-20T14:00:00Z",
    createdAt: "2026-02-18T10:00:00Z",
    updatedAt: "2026-02-25T14:00:00Z"
  },
  {
    id: "2",
    businessName: "Atlantic Accounting Services",
    contactName: "Sarah Johnson",
    email: "sarah@atlanticaccounting.ca",
    phone: "(506) 555-0124",
    address: "456 King St",
    city: "Saint John",
    postalCode: "E2L 2B2",
    category: "Accounting",
    industry: "Professional Services",
    businessAge: 15,
    rating: 4.8,
    reviewCount: 67,
    website: "https://atlanticaccounting.ca",
    businessDescription: "Comprehensive accounting and tax services",
    dataSource: "LinkedIn",
    leadScore: 92,
    websiteQualityScore: 45,
    status: "Not Contacted",
    engagementStatus: "Not Contacted",
    tags: ["accounting", "established"],
    lastContactDate: "2026-02-22T10:00:00Z",
    createdAt: "2026-02-19T11:00:00Z",
    updatedAt: "2026-02-26T10:00:00Z"
  },
  {
    id: "3",
    businessName: "Coastal Real Estate Group",
    contactName: "Michael Brown",
    email: "michael@coastalrealestate.ca",
    phone: "(506) 555-0125",
    address: "789 Queen St",
    city: "Fredericton",
    postalCode: "E3B 3C3",
    category: "Real Estate",
    industry: "Real Estate",
    businessAge: 5,
    rating: 4.3,
    reviewCount: 28,
    website: "https://coastalrealestate.ca",
    businessDescription: "Residential and commercial real estate",
    dataSource: "Google Business",
    leadScore: 78,
    websiteQualityScore: 88,
    status: "Not Contacted",
    engagementStatus: "Not Contacted",
    tags: ["real-estate", "growing"],
    lastContactDate: "2026-02-24T16:00:00Z",
    createdAt: "2026-02-20T09:00:00Z",
    updatedAt: "2026-02-27T16:00:00Z"
  },
  {
    id: "4",
    businessName: "NB Legal Partners",
    email: "contact@nblegal.ca",
    phone: "(506) 555-0126",
    address: "321 Brunswick St",
    city: "Moncton",
    postalCode: "E1C 4D4",
    category: "Law Firm",
    industry: "Legal Services",
    businessAge: 12,
    rating: 4.6,
    reviewCount: 51,
    website: "https://nblegal.ca",
    businessDescription: "Full-service law firm specializing in business law",
    dataSource: "Manual Entry",
    leadScore: 88,
    websiteQualityScore: 65,
    status: "Not Contacted",
    engagementStatus: "Not Contacted",
    tags: ["legal", "b2b"],
    lastContactDate: "2026-02-23T12:00:00Z",
    createdAt: "2026-02-21T13:00:00Z",
    updatedAt: "2026-02-28T12:00:00Z"
  },
  {
    id: "5",
    businessName: "Harbor Manufacturing Ltd",
    contactName: "David Wilson",
    email: "david@harbormanufacturing.ca",
    phone: "(506) 555-0127",
    address: "555 Industrial Pkwy",
    city: "Saint John",
    postalCode: "E2M 5E5",
    category: "Manufacturing",
    industry: "Manufacturing",
    businessAge: 22,
    rating: 4.1,
    reviewCount: 19,
    dataSource: "Google Business",
    leadScore: 71,
    websiteQualityScore: 38,
    status: "Not Contacted",
    engagementStatus: "Not Contacted",
    tags: ["manufacturing", "legacy"],
    lastContactDate: "2026-02-21T14:00:00Z",
    createdAt: "2026-02-18T10:00:00Z",
    updatedAt: "2026-02-25T14:00:00Z"
  }
];

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [showProposalDialog, setShowProposalDialog] = useState(false);
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("csv");
  const [exportFields, setExportFields] = useState<string[]>([
    "businessName",
    "contactName",
    "email",
    "phone",
    "city",
    "industry",
    "leadScore",
    "status"
  ]);
  const itemsPerPage = 10;

  const filteredLeads = MOCK_LEADS.filter(lead => {
    const matchesSearch = searchQuery === "" || 
      lead.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || lead.category === selectedCategory;
    const matchesCity = selectedCity === "all" || lead.city === selectedCity;
    const matchesStatus = selectedStatus === "all" || lead.engagementStatus === selectedStatus;

    return matchesSearch && matchesCategory && matchesCity && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleLeadSelection = (leadId: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedLeads.size === paginatedLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(paginatedLeads.map(l => l.id)));
    }
  };

  const getStatusColor = (status: EngagementStatus) => {
    const colors: Record<EngagementStatus, string> = {
      "Not Contacted": "bg-slate-100 text-slate-700",
      "Contacted": "bg-blue-100 text-blue-700",
      "Responded": "bg-purple-100 text-purple-700",
      "Qualified": "bg-amber-100 text-amber-700",
      "Converted": "bg-emerald-100 text-emerald-700",
      "Lost": "bg-red-100 text-red-700"
    };
    return colors[status];
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50";
    if (score >= 70) return "text-amber-600 bg-amber-50";
    return "text-slate-600 bg-slate-50";
  };

  const handleGenerateProposal = (lead: Lead) => {
    setSelectedLead(lead);
    setShowProposalDialog(true);
  };

  const handleViewScore = (lead: Lead) => {
    setSelectedLead(lead);
    setShowScoreDialog(true);
  };

  const handleExport = async () => {
    setExportProgress(0);
    setExportComplete(false);
    
    const leadsToExport = selectedLeads.size > 0 
      ? MOCK_LEADS.filter(l => selectedLeads.has(l.id))
      : filteredLeads;

    const options: ExportOptions = {
      format: exportFormat,
      fields: exportFields,
      includeHeaders: true
    };

    const result = await dataExporter.exportWithProgress(
      leadsToExport,
      options,
      (progress) => setExportProgress(progress)
    );

    if (result.success) {
      setExportComplete(true);
      setTimeout(() => {
        setShowExportDialog(false);
        setExportComplete(false);
        setExportProgress(0);
      }, 2000);
    }
  };

  const toggleExportField = (field: string) => {
    setExportFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const availableFields = [
    { value: "businessName", label: "Business Name" },
    { value: "contactName", label: "Contact Name" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "website", label: "Website" },
    { value: "address", label: "Address" },
    { value: "city", label: "City" },
    { value: "postalCode", label: "Postal Code" },
    { value: "industry", label: "Industry" },
    { value: "leadScore", label: "Lead Score" },
    { value: "rating", label: "Rating" },
    { value: "reviewCount", label: "Review Count" },
    { value: "status", label: "Status" },
    { value: "businessAge", label: "Business Age" }
  ];

  const statusColors: Record<EngagementStatus, string> = {
    "Not Contacted": "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    "Contacted": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Responded": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "Qualified": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    "Converted": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "Lost": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
  };

  return (
    <>
      <SEO title="Leads - Opportunity Finder" />
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Leads Database</h1>
              <p className="text-slate-600 mt-1">{filteredLeads.length} business opportunities</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowExportDialog(true)}
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700">
                <Mail className="w-4 h-4" />
                Send Campaign
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Cities" />
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
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Not Contacted">Not Contacted</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Responded">Responded</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Converted">Converted</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedLeads.size > 0 && (
                <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedLeads.size} lead{selectedLeads.size !== 1 ? 's' : ''} selected
                  </span>
                  <Button size="sm" variant="outline" className="ml-auto">
                    <Mail className="w-3 h-3 mr-1" />
                    Send to Selected
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-3 h-3 mr-1" />
                    Export Selected
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="border-slate-200">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedLeads.size === paginatedLeads.length && paginatedLeads.length > 0}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLeads.map((lead) => (
                      <TableRow key={lead.id} className="hover:bg-slate-50">
                        <TableCell>
                          <Checkbox 
                            checked={selectedLeads.has(lead.id)}
                            onCheckedChange={() => toggleLeadSelection(lead.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-slate-900">{lead.businessName}</div>
                            {lead.contactName && (
                              <div className="text-sm text-slate-600">{lead.contactName}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {lead.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <MapPin className="w-3 h-3" />
                            {lead.city}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {lead.email && (
                              <div className="flex items-center gap-1 text-xs text-slate-600">
                                <Mail className="w-3 h-3" />
                                {lead.email}
                              </div>
                            )}
                            {lead.phone && (
                              <div className="flex items-center gap-1 text-xs text-slate-600">
                                <Phone className="w-3 h-3" />
                                {lead.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{lead.rating?.toFixed(1) || "N/A"}</span>
                            <span className="text-sm text-slate-500">
                              ({lead.reviewCount || 0} reviews)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(lead.leadScore)}`}>
                            {lead.leadScore}/100
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(lead.engagementStatus)}>
                            {lead.engagementStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 px-2 gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              onClick={() => handleViewScore(lead)}
                            >
                              <Target className="w-3 h-3" />
                              <span className="text-xs">Score</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 px-2 gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => handleGenerateProposal(lead)}
                            >
                              <Sparkles className="w-3 h-3" />
                              <span className="text-xs">AI</span>
                            </Button>
                            {lead.website && (
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Globe className="w-4 h-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Mail className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-slate-200">
                <div className="text-sm text-slate-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Proposal Generator Dialog */}
        <Dialog open={showProposalDialog} onOpenChange={setShowProposalDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                AI Proposal Generator
              </DialogTitle>
              <DialogDescription>
                Generate a personalized business proposal for {selectedLead?.businessName}
              </DialogDescription>
            </DialogHeader>
            {selectedLead && <ProposalGenerator lead={selectedLead} />}
          </DialogContent>
        </Dialog>

        {/* Lead Score Analysis Dialog */}
        <Dialog open={showScoreDialog} onOpenChange={setShowScoreDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Lead Intelligence Analysis
              </DialogTitle>
              <DialogDescription>
                AI-powered scoring and insights for {selectedLead?.businessName}
              </DialogDescription>
            </DialogHeader>
            {selectedLead && <LeadScoreCard lead={selectedLead} />}
          </DialogContent>
        </Dialog>

        {/* Export Dialog */}
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                Export Leads
              </DialogTitle>
              <DialogDescription>
                Export {selectedLeads.size > 0 ? `${selectedLeads.size} selected` : filteredLeads.length} leads to your preferred format
              </DialogDescription>
            </DialogHeader>

            {exportComplete ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Export Complete!</h3>
                  <p className="text-sm text-slate-600 mt-1">Your file has been downloaded successfully.</p>
                </div>
              </div>
            ) : (
              <Tabs value={exportFormat} onValueChange={(v) => setExportFormat(v as any)} className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="csv" className="gap-2">
                    <FileText className="w-4 h-4" />
                    CSV
                  </TabsTrigger>
                  <TabsTrigger value="excel" className="gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    Excel
                  </TabsTrigger>
                  <TabsTrigger value="pdf" className="gap-2">
                    <FileText className="w-4 h-4" />
                    PDF
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-900 mb-3 block">
                      Select Fields to Export
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {availableFields.map((field) => (
                        <div key={field.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={field.value}
                            checked={exportFields.includes(field.value)}
                            onCheckedChange={() => toggleExportField(field.value)}
                          />
                          <label
                            htmlFor={field.value}
                            className="text-sm text-slate-700 cursor-pointer"
                          >
                            {field.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {exportProgress > 0 && exportProgress < 100 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Preparing export...</span>
                        <span className="font-medium text-blue-600">{Math.round(exportProgress)}%</span>
                      </div>
                      <Progress value={exportProgress} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowExportDialog(false)}
                      disabled={exportProgress > 0 && exportProgress < 100}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 gap-2"
                      onClick={handleExport}
                      disabled={exportFields.length === 0 || (exportProgress > 0 && exportProgress < 100)}
                    >
                      <Download className="w-4 h-4" />
                      Export {exportFormat.toUpperCase()}
                    </Button>
                  </div>
                </div>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </>
  );
}