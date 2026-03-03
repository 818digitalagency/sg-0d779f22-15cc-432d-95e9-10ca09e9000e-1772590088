import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Copy, 
  Download, 
  Send, 
  RefreshCw,
  Wand2,
  FileText,
  Mail
} from "lucide-react";
import type { Lead } from "@/types/lead";
import { aiProposalGenerator } from "@/lib/ai/proposalGenerator";
import type { ProposalTemplate, ProposalOptions } from "@/lib/ai/proposalGenerator";

interface ProposalGeneratorProps {
  lead: Lead;
  onSend?: (proposal: string) => void;
}

export function ProposalGenerator({ lead, onSend }: ProposalGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ProposalTemplate>("modern_web_design");
  const [tone, setTone] = useState<"professional" | "friendly" | "consultative">("professional");
  const [customRequirements, setCustomRequirements] = useState("");
  const [generatedProposal, setGeneratedProposal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");

  const templates = aiProposalGenerator.getAvailableTemplates();

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const options: ProposalOptions = {
      template: selectedTemplate,
      tone,
      includeTestimonials: true,
      includePricing: true,
      includeTimeline: true,
      customRequirements: customRequirements || undefined
    };

    const proposal = aiProposalGenerator.generateProposal(lead, options);
    setGeneratedProposal(proposal.content);
    setEmailSubject(proposal.suggestedSubject);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedProposal);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedProposal], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `proposal-${lead.businessName.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSend = () => {
    if (onSend) {
      onSend(generatedProposal);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <CardTitle>AI Proposal Generator</CardTitle>
            <Badge variant="outline" className="ml-auto bg-blue-100 text-blue-700 border-blue-300">
              Powered by AI
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Business</Label>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="font-medium text-slate-900">{lead.businessName}</div>
                <div className="text-sm text-slate-600">{lead.category}</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Proposal Template</Label>
              <Select value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as ProposalTemplate)}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {template.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(value) => setTone(value as typeof tone)}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="consultative">Consultative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Lead Score</Label>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  lead.leadScore >= 85 ? "bg-green-100 text-green-700" :
                  lead.leadScore >= 70 ? "bg-amber-100 text-amber-700" :
                  "bg-slate-100 text-slate-700"
                }`}>
                  {lead.leadScore}/100
                </div>
                <span className="text-sm text-slate-600">High Priority Lead</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Custom Requirements (Optional)</Label>
            <Textarea
              placeholder="Add any specific details or requirements for this proposal..."
              value={customRequirements}
              onChange={(e) => setCustomRequirements(e.target.value)}
              className="min-h-[80px] bg-white"
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating AI Proposal...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Proposal
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedProposal && (
        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Proposal</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button size="sm" onClick={handleSend} className="bg-green-600 hover:bg-green-700">
                  <Send className="w-4 h-4 mr-1" />
                  Send Email
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="email">Email Format</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="space-y-4">
                <div className="prose max-w-none bg-slate-50 p-6 rounded-lg border border-slate-200">
                  <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                    {generatedProposal}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="email" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-slate-600">Subject Line</Label>
                    <Input 
                      value={emailSubject} 
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="mt-1 font-medium"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600">To</Label>
                    <Input 
                      value={lead.email || ""}
                      disabled
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-600">Email Body</Label>
                    <Textarea 
                      value={generatedProposal}
                      onChange={(e) => setGeneratedProposal(e.target.value)}
                      className="mt-1 min-h-[400px] font-mono text-sm"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}