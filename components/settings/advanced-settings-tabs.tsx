"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User } from "@supabase/supabase-js";

/**
 * AdvancedSettingsTabs Component
 * Provides tabbed interface for advanced user settings
 */
interface AdvancedSettingsTabsProps {
  user: User
  profile?: {
    id: string;
    username?: string | null;
    full_name?: string | null;
    avatar_url?: string | null;
    website?: string | null;
    email?: string | null;
    updated_at?: string | null;
    plan?: string | null;
    marketing_emails?: boolean;
    [key: string]: unknown; // For other potential fields
  }
}

export function AdvancedSettingsTabs({ user: _user, profile: _profile }: AdvancedSettingsTabsProps) {
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Manage your general account preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications about account activity.
                </p>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about new features and updates.
                </p>
              </div>
              <Switch id="marketing" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="security">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your account security preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="2fa">Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account.
                </p>
              </div>
              <Switch id="2fa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session">Session Management</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Manage your active sessions across devices.
              </p>
              <Button variant="outline" size="sm">View Active Sessions</Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="api">
        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
            <CardDescription>
              Manage your API keys and usage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>API Keys</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Create and manage API keys for accessing the CreaVibe API.
              </p>
              <Button variant="outline" size="sm">Manage API Keys</Button>
            </div>
            <div className="space-y-2">
              <Label>Usage Limits</Label>
              <p className="text-sm text-muted-foreground mb-2">
                View and manage your API usage limits.
              </p>
              <div className="text-sm">
                <p><strong>Current Plan:</strong> Professional</p>
                <p><strong>Monthly Requests:</strong> 10,000 / 50,000</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
