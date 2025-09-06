import { useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import ReportPreview from "@/components/ReportPreview";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Reports = () => {
  const location = useLocation();
  const selectedStudyIds = location.state?.selectedStudies || [];
  const [showPreview, setShowPreview] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-glow">Report Generation</h1>
          <p className="text-muted-foreground">
            Create comprehensive research reports with AI-powered insights
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Report Configuration */}
          <div className="cosmic-card mb-8">
            <h2 className="text-xl font-semibold mb-6">Report Configuration</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Selected Studies</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedStudyIds.length > 0 
                    ? `${selectedStudyIds.length} studies selected for report generation`
                    : "No studies selected. Please go to Dashboard to select studies."
                  }
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-3">Report Sections</h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Executive Summary</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Study Overviews</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Knowledge Graph</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Key Findings</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Methodology Analysis</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>References</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Output Format</h3>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="format" defaultChecked />
                    <span>Comprehensive Report</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="format" />
                    <span>Executive Briefing</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="format" />
                    <span>Technical Summary</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button 
                  className="btn-cosmic"
                  disabled={selectedStudyIds.length === 0}
                >
                  Generate Report Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Report Preview</DialogTitle>
                </DialogHeader>
                <ReportPreview selectedStudyIds={selectedStudyIds} />
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              className="btn-space"
              disabled={selectedStudyIds.length === 0}
            >
              Save Configuration
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="cosmic-card text-center">
              <div className="text-2xl font-bold text-primary mb-2">247</div>
              <div className="text-sm text-muted-foreground">Total Reports Generated</div>
            </div>
            <div className="cosmic-card text-center">
              <div className="text-2xl font-bold text-accent mb-2">1,543</div>
              <div className="text-sm text-muted-foreground">Studies Analyzed</div>
            </div>
            <div className="cosmic-card text-center">
              <div className="text-2xl font-bold text-secondary mb-2">89%</div>
              <div className="text-sm text-muted-foreground">Report Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;