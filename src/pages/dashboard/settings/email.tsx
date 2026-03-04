import { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Key,
  Send,
  Settings,
  Info
} from "lucide-react";
import { emailService } from "@/services/emailService";

export default function EmailSettingsPage() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    setIsConfigured(emailService.isConfigured());
  }, []);

  const handleTestEmail = async () => {
    if (!testEmail) {
      setTestResult({ success: false, message: "Please enter an email address" });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await emailService.sendEmail({
        to: testEmail,
        subject: "Test Email from Opportunity Finder",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e293b;">Email Configuration Test</h1>
            <p>Congratulations! Your email service is configured correctly.</p>
            <p>You're now ready to send campaigns from Opportunity Finder.</p>
            <hr style="border: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="color: #64748b; font-size: 14px;">
              This is a test email sent from your Opportunity Finder instance.
            </p>
          </div>
        `,
        text: "Email Configuration Test - Congratulations! Your email service is configured correctly."
      });

      if (result.success) {
        setTestResult({
          success: true,
          message: `Test email sent successfully to ${testEmail}! Check your inbox.`
        });
      } else {
        setTestResult({
          success: false,
          message: result.error || "Failed to send test email"
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Email Settings - Opportunity Finder"
        description="Configure email service for campaigns"
      />
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Email Configuration
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Set up SendGrid or AWS SES for email campaigns
            </p>
          </div>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Email Service Status</CardTitle>
                {isConfigured ? (
                  <Badge className="bg-green-100 text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Configured
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Not Configured
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isConfigured ? (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your email service is configured and ready to send campaigns.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Email service is not configured. Add API keys to your environment variables to enable email campaigns.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Configuration Tabs */}
          <Tabs defaultValue="sendgrid" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sendgrid">SendGrid (Recommended)</TabsTrigger>
              <TabsTrigger value="aws-ses">AWS SES</TabsTrigger>
            </TabsList>

            {/* SendGrid Configuration */}
            <TabsContent value="sendgrid" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    SendGrid Configuration
                  </CardTitle>
                  <CardDescription>
                    SendGrid is the easiest way to get started with email campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Step 1:</strong> Create a free account at <a href="https://sendgrid.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">sendgrid.com</a>
                      <br />
                      <strong>Step 2:</strong> Generate an API key in SendGrid dashboard
                      <br />
                      <strong>Step 3:</strong> Add the API key to your environment variables
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="sendgrid-key">SendGrid API Key</Label>
                      <div className="mt-2 space-y-2">
                        <div className="flex gap-2">
                          <Input 
                            id="sendgrid-key"
                            type="password"
                            placeholder="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                            disabled
                            className="font-mono text-sm"
                          />
                          <Button variant="outline" disabled>
                            <Key className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                        <p className="text-sm text-slate-500">
                          Add <code className="bg-slate-100 px-2 py-1 rounded text-xs">NEXT_PUBLIC_SENDGRID_API_KEY</code> to your <code className="bg-slate-100 px-2 py-1 rounded text-xs">.env.local</code> file
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="from-email">From Email Address</Label>
                      <div className="mt-2 space-y-2">
                        <Input 
                          id="from-email"
                          type="email"
                          placeholder="noreply@opportunityfinder.ca"
                          defaultValue={process.env.NEXT_PUBLIC_FROM_EMAIL || "noreply@opportunityfinder.ca"}
                          disabled
                        />
                        <p className="text-sm text-slate-500">
                          Add <code className="bg-slate-100 px-2 py-1 rounded text-xs">NEXT_PUBLIC_FROM_EMAIL</code> to your <code className="bg-slate-100 px-2 py-1 rounded text-xs">.env.local</code> file
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="from-name">From Name</Label>
                      <div className="mt-2 space-y-2">
                        <Input 
                          id="from-name"
                          type="text"
                          placeholder="Opportunity Finder"
                          defaultValue={process.env.NEXT_PUBLIC_FROM_NAME || "Opportunity Finder"}
                          disabled
                        />
                        <p className="text-sm text-slate-500">
                          Add <code className="bg-slate-100 px-2 py-1 rounded text-xs">NEXT_PUBLIC_FROM_NAME</code> to your <code className="bg-slate-100 px-2 py-1 rounded text-xs">.env.local</code> file
                        </p>
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-blue-50 border-blue-200">
                    <Settings className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Environment Variables Required:</strong>
                      <pre className="mt-2 bg-white p-3 rounded border border-blue-200 text-xs overflow-x-auto">
{`NEXT_PUBLIC_SENDGRID_API_KEY=your_api_key_here
NEXT_PUBLIC_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_FROM_NAME=Your Company Name`}
                      </pre>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AWS SES Configuration */}
            <TabsContent value="aws-ses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    AWS SES Configuration
                  </CardTitle>
                  <CardDescription>
                    Use Amazon SES for enterprise-grade email delivery
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      AWS SES integration is currently in development. Please use SendGrid for now.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4 opacity-50">
                    <div>
                      <Label>AWS Access Key ID</Label>
                      <Input 
                        type="password"
                        placeholder="AKIAIOSFODNN7EXAMPLE"
                        disabled
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>AWS Secret Access Key</Label>
                      <Input 
                        type="password"
                        placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                        disabled
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>AWS Region</Label>
                      <Input 
                        type="text"
                        placeholder="us-east-1"
                        disabled
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Test Email Section */}
          {isConfigured && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Test Email Configuration
                </CardTitle>
                <CardDescription>
                  Send a test email to verify your configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleTestEmail();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleTestEmail}
                    disabled={isTesting || !testEmail}
                  >
                    {isTesting ? (
                      <>
                        <Mail className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Test
                      </>
                    )}
                  </Button>
                </div>

                {testResult && (
                  <Alert className={testResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                    {testResult.success ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={testResult.success ? "text-green-800" : "text-red-800"}>
                      {testResult.message}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}