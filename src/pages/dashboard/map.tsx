import { useState, useEffect, useRef } from "react";
import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  Star,
  Loader2,
  AlertCircle
} from "lucide-react";
import { googleMapsService, NB_COORDINATES } from "@/lib/maps/googleMaps";
import { leadService } from "@/services/leadService";
import { useRealtimeLeads } from "@/hooks/useRealtimeLeads";
import type { Lead } from "@/types/lead";
import { CATEGORIES, NB_CITIES } from "@/types/lead";

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Fetch initial leads
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await leadService.getLeads();
        if (response.data) {
          setLeads(response.data);
        }
        if (response.error) {
          setError(response.error.message);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load leads");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // Real-time subscription
  useRealtimeLeads({
    enabled: true,
    onInsert: (lead) => setLeads(prev => [...prev, lead]),
    onUpdate: (lead) => setLeads(prev => prev.map(l => l.id === lead.id ? lead : l)),
    onDelete: (id) => setLeads(prev => prev.filter(l => l.id !== id))
  });

  // Initialize Google Maps
  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        setMapLoading(true);
        setMapError(null);

        // Check if API key is configured
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey || apiKey === "your_google_maps_api_key_here") {
          setMapError("Google Maps API key not configured. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.");
          setMapLoading(false);
          return;
        }

        await googleMapsService.loadGoogleMapsApi();
        await googleMapsService.initMap(mapRef.current);
        setMapLoading(false);
      } catch (err) {
        console.error("Error initializing map:", err);
        setMapError(err instanceof Error ? err.message : "Failed to load Google Maps");
        setMapLoading(false);
      }
    };

    initMap();

    return () => {
      googleMapsService.destroy();
    };
  }, []);

  // Update markers when leads or filters change
  useEffect(() => {
    if (mapLoading || !leads.length) return;

    const filteredLeads = leads.filter(lead => {
      if (selectedCategory !== "all" && lead.industry !== selectedCategory) return false;
      if (selectedCity !== "all" && lead.city !== selectedCity) return false;
      if (selectedStatus !== "all") {
        if (selectedStatus === "high-score" && lead.leadScore < 70) return false;
        if (selectedStatus === "contacted" && lead.engagementStatus !== "contacted") return false;
        if (selectedStatus === "qualified" && lead.engagementStatus !== "qualified") return false;
      }
      return true;
    });

    googleMapsService.addMarkers(filteredLeads, (lead) => {
      setSelectedLead(lead);
    });

    if (filteredLeads.length > 0) {
      googleMapsService.fitBoundsToMarkers();
    }
  }, [leads, selectedCategory, selectedCity, selectedStatus, mapLoading]);

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      new: "bg-gray-100 text-gray-700",
      contacted: "bg-blue-100 text-blue-700",
      qualified: "bg-green-100 text-green-700",
      proposal_sent: "bg-yellow-100 text-yellow-700",
      negotiation: "bg-orange-100 text-orange-700",
      won: "bg-green-100 text-green-700",
      lost: "bg-red-100 text-red-700"
    };
    return colors[status] || colors.new;
  };

  return (
    <>
      <SEO 
        title="Geographic View | Opportunity Finder"
        description="Visualize leads across New Brunswick on an interactive map."
      />
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Geographic Lead Map
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Visualize and explore leads across New Brunswick.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                <MapPin className="mr-1 h-3 w-3" />
                {leads.length} Leads
              </Badge>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Industry
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    City
                  </label>
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
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Status
                  </label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="high-score">High Score (70+)</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <Card className="lg:col-span-2 h-[600px] overflow-hidden">
              <CardContent className="p-0 h-full relative">
                {mapError ? (
                  <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <div className="text-center space-y-4 p-6">
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                          Google Maps Not Configured
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-md">
                          {mapError}
                        </p>
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-left">
                          <p className="text-xs font-mono text-slate-700 dark:text-slate-300 mb-2">
                            Add to .env.local:
                          </p>
                          <code className="text-xs bg-white dark:bg-slate-900 px-2 py-1 rounded">
                            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : mapLoading ? (
                  <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                    <div className="text-center space-y-4">
                      <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Loading Google Maps...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div ref={mapRef} className="w-full h-full" />
                )}
              </CardContent>
            </Card>

            {/* Lead Details Panel */}
            <Card className="h-[600px] overflow-y-auto">
              <CardHeader className="sticky top-0 bg-white dark:bg-slate-800 z-10 border-b">
                <CardTitle className="text-lg">
                  {selectedLead ? "Lead Details" : "Select a Lead"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {selectedLead ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">
                        {selectedLead.businessName}
                      </h3>
                      <Badge className={getStatusBadge(selectedLead.engagementStatus)}>
                        {selectedLead.engagementStatus.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Industry</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {selectedLead.industry}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Location</p>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {selectedLead.city}, {selectedLead.province}
                          </p>
                          {selectedLead.address && (
                            <p className="text-xs text-slate-500">{selectedLead.address}</p>
                          )}
                        </div>
                      </div>

                      {selectedLead.contactName && (
                        <div className="flex items-start gap-2">
                          <Mail className="h-4 w-4 text-slate-500 mt-0.5" />
                          <div>
                            <p className="text-slate-600 dark:text-slate-400">Contact</p>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {selectedLead.contactName}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedLead.email && (
                        <div className="flex items-start gap-2">
                          <Mail className="h-4 w-4 text-slate-500 mt-0.5" />
                          <div>
                            <p className="text-slate-600 dark:text-slate-400">Email</p>
                            <a 
                              href={`mailto:${selectedLead.email}`}
                              className="font-medium text-blue-600 hover:underline"
                            >
                              {selectedLead.email}
                            </a>
                          </div>
                        </div>
                      )}

                      {selectedLead.phone && (
                        <div className="flex items-start gap-2">
                          <Phone className="h-4 w-4 text-slate-500 mt-0.5" />
                          <div>
                            <p className="text-slate-600 dark:text-slate-400">Phone</p>
                            <a 
                              href={`tel:${selectedLead.phone}`}
                              className="font-medium text-blue-600 hover:underline"
                            >
                              {selectedLead.phone}
                            </a>
                          </div>
                        </div>
                      )}

                      {selectedLead.website && (
                        <div className="flex items-start gap-2">
                          <Globe className="h-4 w-4 text-slate-500 mt-0.5" />
                          <div>
                            <p className="text-slate-600 dark:text-slate-400">Website</p>
                            <a 
                              href={selectedLead.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-blue-600 hover:underline"
                            >
                              Visit Website →
                            </a>
                          </div>
                        </div>
                      )}

                      {selectedLead.rating && (
                        <div className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <div>
                            <p className="text-slate-600 dark:text-slate-400">Rating</p>
                            <p className="font-medium text-slate-900 dark:text-white">
                              ⭐ {selectedLead.rating} ({selectedLead.reviewCount} reviews)
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Lead Score
                          </span>
                          <span className={`text-lg font-bold ${
                            selectedLead.leadScore >= 80 ? "text-green-600" :
                            selectedLead.leadScore >= 60 ? "text-blue-600" :
                            selectedLead.leadScore >= 40 ? "text-yellow-600" :
                            "text-red-600"
                          }`}>
                            {selectedLead.leadScore}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              selectedLead.leadScore >= 80 ? "bg-green-500" :
                              selectedLead.leadScore >= 60 ? "bg-blue-500" :
                              selectedLead.leadScore >= 40 ? "bg-yellow-500" :
                              "bg-red-500"
                            }`}
                            style={{ width: `${selectedLead.leadScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <Button className="w-full" size="sm">
                        Send Proposal
                      </Button>
                      <Button className="w-full" variant="outline" size="sm">
                        View Full Profile
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">
                      Click on a map marker to view lead details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}