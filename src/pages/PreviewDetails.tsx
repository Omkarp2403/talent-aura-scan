import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Brain, 
  ArrowLeft,
  Loader2,
  Eye,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
  Mail,
  Calendar,
  MapPin,
  Briefcase
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

interface CVDetail {
  id: number;
  requirement_id: string;
  candidate_name: string;
  email_id: string;
  years_of_experience: string;
  resume_score: number;
  job_description: string;
  required_locations: string;
  required_experience: string;
  evaluation_summary: string;
}

interface Pagination {
  count: number;
  next: string | null;
  previous: string | null;
  totalPages: number;
}

const PreviewDetails = () => {
  const { requirementId: urlReqId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requirementId, setRequirementId] = useState(urlReqId || "");
  const [cvDetails, setCvDetails] = useState<CVDetail[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSummary, setSelectedSummary] = useState("");
  const [selectedJobDescription, setSelectedJobDescription] = useState("");
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [showJobDescDialog, setShowJobDescDialog] = useState(false);
  
  const pageSize = 10;

  useEffect(() => {
    if (urlReqId) {
      fetchCVDetails(urlReqId, 1);
    }
  }, [urlReqId]);

  const fetchCVDetails = async (reqId: string, page: number = 1) => {
    if (!reqId.trim()) {
      setError("Please enter a requirement ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const result = await api.cv.getCVDetails(reqId, page, pageSize);
      
      if (result.success) {
        setCvDetails(result.data || []);
        setPagination(result.pagination || null);
        setCurrentPage(page);
        
        if (!result.data || result.data.length === 0) {
          setError("No CV details found for the given requirement ID");
        }
      } else {
        setError(result.message || "Failed to fetch CV details");
        setCvDetails([]);
        setPagination(null);
      }
    } catch (err) {
      setError("Failed to fetch CV details");
      setCvDetails([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCVDetails(requirementId, 1);
  };

  const handlePageChange = (newPage: number) => {
    fetchCVDetails(requirementId, newPage);
  };

  const handleViewResume = async (candidateName: string) => {
    try {
      setLoading(true);
      const blob = await api.cv.downloadResume(candidateName);
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
      
      setTimeout(() => {
        URL.revokeObjectURL(fileURL);
      }, 1000);
      
      toast({
        title: "Resume opened",
        description: `Opened resume for ${candidateName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download resume",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowSummary = (summary: string) => {
    setSelectedSummary(summary);
    setShowSummaryDialog(true);
  };

  const handleShowJobDescription = (jobDesc: string) => {
    setSelectedJobDescription(jobDesc);
    setShowJobDescDialog(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    if (score >= 60) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
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
                onClick={() => navigate("/job-selection")}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-poppins">Preview CV Details</h1>
                  <p className="text-xs text-muted-foreground">
                    {requirementId && `Requirement ID: ${requirementId}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Search Section */}
        <Card className="glass-card hover-glow mb-8 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search CV Details</span>
            </CardTitle>
            <CardDescription>
              Enter a requirement ID to view candidate details and analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="requirement-id">Requirement ID</Label>
                <Input
                  id="requirement-id"
                  placeholder="Enter requirement ID (e.g., REQ-2024-001)"
                  value={requirementId}
                  onChange={(e) => setRequirementId(e.target.value)}
                  className="glass border-primary/20 focus:border-primary/40"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch}
                  disabled={loading || !requirementId.trim()}
                  className="bg-gradient-to-r from-primary to-secondary text-white"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6 animate-fade-in">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results Table */}
        {cvDetails.length > 0 && (
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>CV Analysis Results</span>
                </div>
                {pagination && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {pagination.count} total candidates
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/20 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold">Candidate</TableHead>
                      <TableHead className="font-semibold">Contact</TableHead>
                      <TableHead className="font-semibold">Experience</TableHead>
                      <TableHead className="font-semibold">Score</TableHead>
                      <TableHead className="font-semibold">Job Description</TableHead>
                      <TableHead className="font-semibold">Requirements</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cvDetails.map((cv, index) => (
                      <TableRow key={cv.id || index} className="hover:bg-muted/20">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium text-sm">
                              {cv.candidate_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{cv.candidate_name}</p>
                              <p className="text-sm text-muted-foreground">ID: {cv.requirement_id}</p>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{cv.email_id}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>{cv.years_of_experience}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge className={`${getScoreColor(cv.resume_score)} border-0`}>
                            <Star className="w-3 h-3 mr-1" />
                            {cv.resume_score}%
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShowJobDescription(cv.job_description)}
                            className="glass border-primary/20"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View JD
                          </Button>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="truncate max-w-32">{cv.required_locations}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Briefcase className="w-3 h-3 text-muted-foreground" />
                              <span>{cv.required_experience}</span>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewResume(cv.candidate_name)}
                              className="glass border-primary/20"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Resume
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShowSummary(cv.evaluation_summary)}
                              className="glass border-primary/20"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Summary
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination && pagination.count > pageSize && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing page {currentPage} of {pagination.totalPages} 
                    ({pagination.count} total candidates)
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.previous || loading}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="glass border-primary/20"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.next || loading}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="glass border-primary/20"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading CV details...</p>
          </div>
        )}
      </div>

      {/* Evaluation Summary Dialog */}
      <Dialog open={showSummaryDialog} onOpenChange={setShowSummaryDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto glass-card">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Evaluation Summary</span>
            </DialogTitle>
            <DialogDescription>
              AI-powered analysis of candidate qualifications and fit
            </DialogDescription>
          </DialogHeader>
          <div 
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: selectedSummary }}
          />
        </DialogContent>
      </Dialog>

      {/* Job Description Dialog */}
      <Dialog open={showJobDescDialog} onOpenChange={setShowJobDescDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto glass-card">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Job Description</span>
            </DialogTitle>
            <DialogDescription>
              Complete job requirements and description
            </DialogDescription>
          </DialogHeader>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {selectedJobDescription}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreviewDetails;