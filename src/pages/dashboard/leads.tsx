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
  ChevronRight
} from "lucide-react";
import { useState } from "react";
import type { Lead, EngagementStatus } from "@/types/lead";
import { CATEGORIES, NB_CITIES } from "@/types/lead";

const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    businessName: "Maritime Tech Solutions",
    contactName: "Sarah Johnson",
    email: "sarah@maritimetech.ca",
    phone: "(506) 555-0123",
    address: "123 Main St",
    city: "Fredericton",
    postalCode: "E3B 1A1",
    website: "https://maritimetech.ca",
    description: "Leading IT consulting firm",
    category: "IT & Technology",
    estimatedAge: 8,
    googleRating: 4.8,
    reviewCount: 42,
    dataSource: "Google Business",
    leadScore: 92,
    websiteQuality: 88,
    engagementStatus: "Not Contacted",
    tags: ["High Priority", "Tech"],
    lastContactDate: undefined,
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-03-01T15:30:00Z"
  },
  {
    id: "2",
    businessName: "Atlantic Legal Group",
    contactName: "Michael Chen",
    email: "contact@atlanticlegal.ca",
    phone: "(506) 555-0456",
    address: "456 King St",
    city: "Moncton",
    postalCode: "E1C 2B2",
    website: "https://atlanticlegal.ca",
    description: "Full-service law firm",
    category: "Law Firm",
    estimatedAge: 15,
    googleRating: 4.9,
    reviewCount: 87,
    dataSource: "NB Corporate Registry",
    leadScore: 88,
    websiteQuality: 92,
    engagementStatus: "Proposal Sent",
    tags: ["Professional Services"],
    lastContactDate: "2026-02-28T09:00:00Z",
    createdAt: "2026-01-20T14:00:00Z",
    updatedAt: "2026-02-28T09:00:00Z"
  },
  {
    id: "3",
    businessName: "Bay View Realty",
    contactName: "Jennifer Smith",
    email: "info@bayviewrealty.ca",
    phone: "(506) 555-0789",
    address: "789 Water St",
    city: "Saint John",
    postalCode: "E2L 3C3",
    website: "https://bayviewrealty.ca",
    description: "Premier real estate agency",
    category: "Real Estate",
    estimatedAge: 12,
    googleRating: 4.6,
    reviewCount: 134,
    dataSource: "Chamber of Commerce",
    leadScore: 85,
    websiteQuality: 75,
    engagementStatus: "Opened",
    tags: ["Real Estate", "Warm Lead"],
    lastContactDate: "2026-03-01T11:30:00Z",
    createdAt: "2026-02-10T08:00:00Z",
    updatedAt: "2026-03-01T11:30:00Z"
  },
  {
    id: "4",
    businessName: "Northern Manufacturing Inc",
    email: "sales@northernmfg.ca",
    phone: "(506) 555-0321",
    address: "321 Industrial Blvd",
    city: "Bathurst",
    postalCode: "E2A 4D4",
    website: "https://northernmfg.ca",
    description: "Industrial manufacturing",
    category: "Manufacturing",
    estimatedAge: 22,
    googleRating: 4.3,
    reviewCount: 28,
    dataSource: "Business Directory",
    leadScore: 79,
    websiteQuality: 68,
    engagementStatus: "Not Contacted",
    tags: ["Manufacturing"],
    createdAt: "2026-02-05T12:00:00Z",
    updatedAt: "2026-02-20T16:00:00Z"
  },
  {
    id: "5",
    businessName: "Acadian Healthcare Clinic",
    contactName: "Dr. Marie Leblanc",
    email: "info@acadianhealthcare.ca",
    phone: "(506) 555-0654",
    address: "654 University Ave",
    city: "Moncton",
    postalCode: "E1A 5E5",
    website: "https://acadianhealthcare.ca",
    description: "Family medicine clinic",
    category: "Healthcare",
    estimatedAge: 5,
    googleRating: 4.7,
    reviewCount: 96,
    dataSource: "Google Business",
    leadScore: 81,
    websiteQuality: 82,
    engagementStatus: "Follow-up Scheduled",
    tags: ["Healthcare", "High Priority"],
    lastContactDate: "2026-02-25T14:00:00Z",
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
      "Proposal Sent": "bg-blue-100 text-blue-700",
      "Opened": "bg-purple-100 text-purple-700",
      "Replied": "bg-green-100 text-green-700",
      "Follow-up Scheduled": "bg-amber-100 text-amber-700",
      "Converted": "bg-emerald-100 text-emerald-700",
      "Not Interested": "bg-red-100 text-red-700"
    };
    return colors[status];
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50";
    if (score >= 70) return "text-amber-600 bg-amber-50";
    return "text-slate-600 bg-slate-50";
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
              <Button variant="outline" className="gap-2">
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
                    <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                    <SelectItem value="Opened">Opened</SelectItem>
                    <SelectItem value="Replied">Replied</SelectItem>
                    <SelectItem value="Follow-up Scheduled">Follow-up Scheduled</SelectItem>
                    <SelectItem value="Converted">Converted</SelectItem>
                    <SelectItem value="Not Interested">Not Interested</SelectItem>
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
                          {lead.googleRating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="text-sm font-medium">{lead.googleRating}</span>
                              <span className="text-xs text-slate-500">({lead.reviewCount})</span>
                            </div>
                          )}
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
                            {lead.website && (
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Globe className="w-4 h-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <ExternalLink className="w-4 h-4" />
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
      </DashboardLayout>
    </>
  );
}