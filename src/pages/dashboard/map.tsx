import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin, 
  Star, 
  Mail, 
  Phone, 
  Globe, 
  ExternalLink,
  Search,
  X,
  Building2
} from "lucide-react";
import { useState } from "react";
import type { Lead } from "@/types/lead";
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
    description: "Leading IT consulting firm specializing in cloud solutions, cybersecurity, and digital transformation",
    category: "IT & Technology",
    industry: "IT & Technology",
    businessAge: 8,
    estimatedAge: 8,
    googleRating: 4.8,
    rating: 4.8,
    reviewCount: 42,
    dataSource: "Google Business",
    leadScore: 92,
    websiteQuality: 88,
    status: "Not Contacted",
    engagementStatus: "Not Contacted",
    tags: ["High Priority", "Tech"],
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
    description: "Full-service law firm with expertise in corporate law, real estate, and family law",
    category: "Law Firm",
    industry: "Law Firm",
    businessAge: 15,
    estimatedAge: 15,
    googleRating: 4.9,
    rating: 4.9,
    reviewCount: 87,
    dataSource: "NB Corporate Registry",
    leadScore: 88,
    websiteQuality: 92,
    status: "Proposal Sent",
    engagementStatus: "Proposal Sent",
    tags: ["Professional Services"],
    lastContactDate: "2026-02-28T09:00:00Z",
    createdAt: "2026-01-20T14:00:00Z",
    updatedAt: "2026-02-28T09:00:00Z"
  }
];

export default function MapViewPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const filteredLeads = MOCK_LEADS.filter(lead => {
    const matchesSearch = searchQuery === "" || 
      lead.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || lead.category === selectedCategory;
    const matchesCity = selectedCity === "all" || lead.city === selectedCity;
    return matchesSearch && matchesCategory && matchesCity;
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 70) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-slate-600 bg-slate-50 border-slate-200";
  };

  return (
    <>
      <SEO title="Map View - Opportunity Finder" />
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Geographic Lead Map</h1>
            <p className="text-slate-600 mt-1">Visualize business opportunities across New Brunswick</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-slate-200">
              <CardContent className="p-0">
                <div className="bg-slate-100 rounded-lg h-[600px] flex items-center justify-center relative">
                  <div className="text-center p-8">
                    <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Interactive Map</h3>
                    <p className="text-slate-600 max-w-md">
                      This would integrate with Google Maps API or Mapbox to display lead locations with clustering markers. 
                      Click markers to view lead details in the side panel.
                    </p>
                  </div>
                  
                  <div className="absolute top-4 left-4 right-4 flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search on map..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-white"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48 bg-white">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="w-48 bg-white">
                        <SelectValue placeholder="City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {NB_CITIES.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Visible Leads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredLeads.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedLead?.id === lead.id
                          ? "bg-blue-50 border-2 border-blue-200"
                          : "bg-slate-50 hover:bg-slate-100 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900 truncate">{lead.businessName}</div>
                          <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            {lead.city}
                          </div>
                        </div>
                        <Badge className={`ml-2 ${getScoreColor(lead.leadScore)}`}>
                          {lead.leadScore}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {lead.category}
                      </Badge>
                    </button>
                  ))}
                  {filteredLeads.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      No leads match your filters
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {selectedLead && (
            <Card className="border-slate-200 border-2 border-blue-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedLead.businessName}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {selectedLead.category}
                      </Badge>
                      <Badge className={getScoreColor(selectedLead.leadScore)}>
                        Score: {selectedLead.leadScore}/100
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedLead(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedLead.description && (
                  <p className="text-slate-600">{selectedLead.description}</p>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      {selectedLead.email && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${selectedLead.email}`} className="hover:text-blue-600">
                            {selectedLead.email}
                          </a>
                        </div>
                      )}
                      {selectedLead.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${selectedLead.phone}`} className="hover:text-blue-600">
                            {selectedLead.phone}
                          </a>
                        </div>
                      )}
                      {selectedLead.website && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Globe className="w-4 h-4" />
                          <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                            Visit Website
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Building2 className="w-4 h-4" />
                        {selectedLead.address}, {selectedLead.city}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Business Metrics</h4>
                    <div className="space-y-2">
                      {selectedLead.googleRating && (
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{selectedLead.googleRating}</span>
                          <span className="text-slate-600">({selectedLead.reviewCount} reviews)</span>
                        </div>
                      )}
                      {selectedLead.estimatedAge && (
                        <div className="text-sm text-slate-600">
                          Est. Age: {selectedLead.estimatedAge} years
                        </div>
                      )}
                      {selectedLead.websiteQuality && (
                        <div className="text-sm text-slate-600">
                          Website Quality: {selectedLead.websiteQuality}/100
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="text-slate-600">Status: </span>
                        <Badge className="bg-slate-100 text-slate-700">
                          {selectedLead.engagementStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  <Button className="flex-1 gap-2">
                    <Mail className="w-4 h-4" />
                    Send Proposal
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}