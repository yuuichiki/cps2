
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUploader } from '@/components/FileUploader';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, FileUp, PanelLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Welcome, {user?.name || 'User'}</h1>
        <p className="text-muted-foreground mt-1">
          Your Excel file processing dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upload New Excel File</CardTitle>
            <CardDescription>
              Upload an Excel file to view and analyze data from multiple sheets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader onFileUploaded={(data, name) => {
              navigate('/');
            }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
            <CardDescription>
              View your recently processed files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-center text-muted-foreground py-6">
                No recent files found
              </p>
              <Button variant="outline" className="w-full">
                <PanelLeft className="mr-2 h-4 w-4" />
                View All Files
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>
              Shortcut to common operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-between" onClick={() => navigate('/')}>
                Process New File
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                View Templates
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                Generate Reports
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>
              Your account activity and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Username</span>
                <span className="font-medium">{user?.username }</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Account Status</span>
                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-1 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Files Processed</span>
                <span className="font-medium">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
