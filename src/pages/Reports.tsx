import { useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import ReportPreview from "@/components/ReportPreview";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Settings, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const location = useLocation();
  const { toast } = useToast();
  const selectedStudyIds = location.state?.selectedStudyIds || [];
  const selectedStudies = location.state?.selectedStudies || [];
  const [showPreview, setShowPreview] = useState(false);
  const [reportSections, setReportSections] = useState({
    executive: true,
    methodology: true,
    findings: true,
    knowledge: true,
    recommendations: true,
    references: true
  });
  const [outputFormat, setOutputFormat] = useState('pdf');

  const handleSaveConfiguration = () => {
    toast({
      title: "Configuration Saved",
      description: "Your report configuration has been saved successfully",
    });
  };

  const handleExportReport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Your report is being generated as ${format.toUpperCase()}. You'll be notified when it's ready.`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Report Generation</h1>
          <p className="text-muted-foreground text-lg">
            Create comprehensive research reports with AI-powered insights
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Report Configuration */}
          <div className="cosmic-card mb-8 animate-fade-in">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Settings className="w-6 h-6 mr-2 text-primary" />
              Report Configuration
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2 text-accent" />
                  Selected Studies
                </h3>
                <div className="bg-muted/20 rounded-lg p-4">
                  <p className="text-muted-foreground mb-3">
                    {selectedStudyIds.length > 0 
                      ? `${selectedStudyIds.length} studies selected for report generation`
                      : "No studies selected. Please go to Dashboard to select studies."
                    }
                  </p>
                  {selectedStudies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedStudies.map((study: any) => (
                        <Badge key={study.id} variant="outline" className="text-xs">
                          {study.title.substring(0, 40)}...
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Report Sections</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(reportSections).map(([key, checked]) => (
                    <div key={key} className="flex items-center space-x-3">
                      <Checkbox
                        id={key}
                        checked={checked}
                        onCheckedChange={(value) => 
                          setReportSections(prev => ({ ...prev, [key]: !!value }))
                        }
                      />
                      <label htmlFor={key} className="text-sm font-medium capitalize cursor-pointer">
                        {key === 'executive' ? 'Executive Summary' : 
                         key === 'methodology' ? 'Study Methodology' :
                         key === 'findings' ? 'Key Findings' :
                         key === 'knowledge' ? 'Knowledge Graph' :
                         key === 'recommendations' ? 'Recommendations' :
                         'References'}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Output Format</h3>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                    <SelectItem value="word">Word Document</SelectItem>
                    <SelectItem value="presentation">PowerPoint</SelectItem>
                    <SelectItem value="web">Web Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button 
                  className="btn-cosmic hover-scale"
                  disabled={selectedStudyIds.length === 0}
                  onClick={() => {
                    if (selectedStudyIds.length === 0) {
                      toast({
                        title: "No Studies Selected",
                        description: "Please select studies from the Dashboard first",
                        variant: "destructive"
                      });
                    }
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Report Preview</DialogTitle>
                </DialogHeader>
                <ReportPreview 
                  selectedStudyIds={selectedStudyIds}
                  selectedStudies={selectedStudies}
                />
              </DialogContent>
            </Dialog>

            <Button 
              onClick={handleSaveConfiguration}
              variant="outline" 
              className="btn-space hover-scale"
              disabled={selectedStudyIds.length === 0}
            >
              <Settings className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>

            <Button 
              onClick={() => handleExportReport(outputFormat)}
              variant="outline" 
              className="btn-space hover-scale"
              disabled={selectedStudyIds.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export as {outputFormat.toUpperCase()}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="cosmic-card text-center hover-scale">
              <div className="text-3xl font-bold text-primary mb-2">247</div>
              <div className="text-sm text-muted-foreground">Total Reports Generated</div>
            </div>
            <div className="cosmic-card text-center hover-scale">
              <div className="text-3xl font-bold text-accent mb-2">1,543</div>
              <div className="text-sm text-muted-foreground">Studies Analyzed</div>
            </div>
            <div className="cosmic-card text-center hover-scale">
              <div className="text-3xl font-bold text-secondary-glow mb-2">89%</div>
              <div className="text-sm text-muted-foreground">Report Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;