import { DashboardLayout } from "@/components/analytics-dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AnalyticsSettingsPage() {
  return (
    <DashboardLayout title="Analytics Settings" description="Configure your analytics preferences and tracking options">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic analytics settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                    <SelectItem value="cet">CET (Central European Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="mdy">
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-refresh">Auto-refresh Dashboard</Label>
                  <div className="text-sm text-muted-foreground">
                    Automatically refresh dashboard data every 5 minutes
                  </div>
                </div>
                <Switch id="auto-refresh" defaultChecked />
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tracking Configuration</CardTitle>
              <CardDescription>Configure what events and actions to track</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Page Views</Label>
                    <div className="text-sm text-muted-foreground">Track when users view pages</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Click Events</Label>
                    <div className="text-sm text-muted-foreground">Track when users click on elements</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Form Submissions</Label>
                    <div className="text-sm text-muted-foreground">Track when users submit forms</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Recording</Label>
                    <div className="text-sm text-muted-foreground">Record user sessions for playback</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Heatmaps</Label>
                    <div className="text-sm text-muted-foreground">Generate heatmaps of user interactions</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excluded-paths">Excluded Paths</Label>
                <Textarea id="excluded-paths" placeholder="/admin/*, /account/settings" className="min-h-[100px]" />
                <p className="text-sm text-muted-foreground">
                  Enter paths to exclude from tracking, one per line. Wildcards (*) are supported.
                </p>
              </div>

              <Button>Save Tracking Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect with other analytics and marketing tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Google Analytics</Label>
                    <div className="text-sm text-muted-foreground">Send data to Google Analytics</div>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ga-id">Google Analytics ID</Label>
                  <Input id="ga-id" placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Segment</Label>
                    <div className="text-sm text-muted-foreground">Send data to Segment</div>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="segment-key">Segment Write Key</Label>
                  <Input id="segment-key" placeholder="write_key" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mixpanel</Label>
                    <div className="text-sm text-muted-foreground">Send data to Mixpanel</div>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mixpanel-token">Mixpanel Token</Label>
                  <Input id="mixpanel-token" placeholder="token" />
                </div>
              </div>

              <Button>Save Integration Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Configure data privacy and retention settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP Anonymization</Label>
                    <div className="text-sm text-muted-foreground">Anonymize IP addresses in analytics data</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cookie Consent</Label>
                    <div className="text-sm text-muted-foreground">Require cookie consent before tracking</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention Period</Label>
                  <Select defaultValue="12">
                    <SelectTrigger id="data-retention">
                      <SelectValue placeholder="Select retention period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 months</SelectItem>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Data older than this will be automatically deleted</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privacy-policy">Privacy Policy URL</Label>
                  <Input id="privacy-policy" placeholder="https://example.com/privacy" />
                </div>
              </div>

              <Button>Save Privacy Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
