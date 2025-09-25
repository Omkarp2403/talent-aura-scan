import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Plus, 
  Search, 
  Eye, 
  FileText, 
  Download,
  ArrowLeft,
  Loader2,
  Users,
  Star,
  Building
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

interface RequirementSummary {
  requirement_id: string;
  job_title: string;
  total_candidates: number;
  average_score: number;
  top_candidate: string;
  status: string;
}

const JobSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requirements, setRequirements] = useState<RequirementSummary[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewReqId, setPreviewReqId] = useState("");

  useEffect(() => {
    loadRequirements();
  }, []);

  const loadRequirements = async () => {
    try {
      setLoading(true);
      const result = await api.cv.getRequirementSummary();
      
      if (result.success) {
        setRequirements(result.data || []);
      } else {
        setError(result.message || "Failed to load requirements");
      }
    } catch (err) {
      setError("Failed to load requirements");
    } finally {
      setLoading(false);
    }
  };

  const handleNewJob = () => {
    navigate("/new-job");
  };

  const handleExistingJob = (requirementId: string) => {
    navigate(`/job-details/${requirementId}`);
  };

  const handlePreviewDetails = () => {
    if (!previewReqId.trim()) {
      setError("Please enter a requirement ID");
      return;
    }
    navigate(`/preview/${previewReqId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500 hover:bg-green-600";
      case "processing":
        return "bg-orange-500 hover:bg-orange-600";
      case "complete":
        return "bg-blue-500 hover:bg-blue-600";
      case "draft":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 glass sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-poppins">Job Selection</h1>
                  <p className="text-xs text-muted-foreground">Choose or create a job</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowPreview(!showPreview)}
                variant="outline" 
                className="glass border-primary/20"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Details
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* New Job Card */}
          <Card className="glass-card hover-glow hover-scale animate-fade-in-up cursor-pointer" onClick={handleNewJob}>
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center pulse-glow">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold font-poppins">
                Create New Job
              </CardTitle>
              <CardDescription className="text-base">
                Start a new resume screening process with job description and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white h-12">
                Create New Job
              </Button>
            </CardContent>
          </Card>

          {/* Existing Jobs Card */}
          <Card className="glass-card hover-glow hover-scale animate-fade-in-up fade-in-delay">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center pulse-glow">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold font-poppins">
                Existing Jobs
              </CardTitle>
              <CardDescription className="text-base">
                Continue working on previously created job requirements
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Preview Details Section */}
        {showPreview && (
          <Card className="glass-card hover-glow animate-fade-in-up mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Preview Job Details</span>
              </CardTitle>
              <CardDescription>
                Enter a requirement ID to preview candidate details and job information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="preview-req-id">Requirement ID</Label>
                  <Input
                    id="preview-req-id"
                    placeholder="Enter requirement ID (e.g., REQ-2024-001)"
                    value={previewReqId}
                    onChange={(e) => setPreviewReqId(e.target.value)}
                    className="glass border-primary/20 focus:border-primary/40"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handlePreviewDetails}
                    disabled={loading || !previewReqId.trim()}
                    className="bg-gradient-to-r from-primary to-secondary text-white"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Eye className="w-4 h-4 mr-2" />
                    )}
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6 animate-fade-in">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Existing Jobs List */}
        {requirements.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Your Job Requirements</span>
              </CardTitle>
              <CardDescription>
                Click on any job to view detailed candidate analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {requirements.map((req, index) => (
                  <Card 
                    key={req.requirement_id}
                    className={`glass border-primary/20 hover-glow hover-scale cursor-pointer animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleExistingJob(req.requirement_id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold font-poppins">
                              {req.job_title || req.requirement_id}
                            </h3>
                            <p className="text-muted-foreground">ID: {req.requirement_id}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="flex items-center space-x-1 mb-1">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="text-2xl font-bold">{req.total_candidates || 0}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Candidates</p>
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center space-x-1 mb-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-2xl font-bold">{req.average_score || 0}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Avg Score</p>
                          </div>
                          
                          <Badge 
                            className={`${getStatusColor(req.status)} text-white`}
                          >
                            {req.status || 'Unknown'}
                          </Badge>
                        </div>
                      </div>
                      
                      {req.top_candidate && (
                        <div className="mt-4 pt-4 border-t border-border/20">
                          <p className="text-sm text-muted-foreground mb-1">Top Candidate</p>
                          <p className="font-medium">{req.top_candidate}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && requirements.length === 0 && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading job requirements...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && requirements.length === 0 && !error && (
          <Card className="glass-card text-center py-12">
            <CardContent>
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Jobs Found</h3>
              <p className="text-muted-foreground mb-6">
                You haven't created any job requirements yet. Start by creating a new job.
              </p>
              <Button 
                onClick={handleNewJob}
                className="bg-gradient-to-r from-primary to-secondary text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Job
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobSelection;
