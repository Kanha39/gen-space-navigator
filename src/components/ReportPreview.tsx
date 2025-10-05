import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, BarChart3, TrendingUp, Users, Zap, Sparkles } from "lucide-react";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import { exportReport } from "@/utils/reportExport";
import { useToast } from "@/hooks/use-toast";
import { generateReportHTML } from "@/utils/generateReportContent";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface ReportPreviewProps {
  selectedStudyIds: string[];
  selectedStudies?: any[];
  onReportSaved?: (title: string, content: string, format: string) => Promise<boolean>;
}

// Sample data for charts and detailed analysis
const speciesDistribution = [
  { name: 'Mice', value: 35, count: 87 },
  { name: 'Plants', value: 28, count: 69 },
  { name: 'Bacteria', value: 22, count: 54 },
  { name: 'Cells', value: 15, count: 37 }
];

const missionTrends = [
  { year: '2019', studies: 23, success: 91 },
  { year: '2020', studies: 31, success: 87 },
  { year: '2021', studies: 45, success: 93 },
  { year: '2022', studies: 52, success: 89 },
  { year: '2023', studies: 67, success: 94 }
];

const tissueAnalysis = [
  { tissue: 'Muscle', affected: 85, studies: 23 },
  { tissue: 'Bone', affected: 92, studies: 19 },
  { tissue: 'Liver', affected: 73, studies: 15 },
  { tissue: 'Brain', affected: 68, studies: 12 },
  { tissue: 'Heart', affected: 71, studies: 8 }
];

const COLORS = ['#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444', '#10B981'];

const sampleReportData = {
  title: "Space Biology Research Analysis Report",
  generatedDate: new Date().toLocaleDateString(),
  studyCount: 0,
  keyFindings: [
    "Microgravity significantly affects cellular metabolism across multiple species",
    "Plant species show remarkable adaptation mechanisms to space radiation",
    "Bone density changes follow predictable patterns during extended missions",
    "Bacterial biofilm formation exhibits enhanced antibiotic resistance in space"
  ],
  recommendations: [
    "Implement standardized protocols for metabolic studies in microgravity",
    "Develop targeted countermeasures for bone density preservation", 
    "Investigate cross-species adaptation mechanisms for future applications",
    "Establish monitoring systems for bacterial behavior in space habitats"
  ],
  methodology: {
    dataSources: [
      "NASA Life Sciences Data Archive (NLSDA)",
      "European Space Agency Biological Database",
      "International Space Station Research Integration Office",
      "Commercial Space Research Programs"
    ],
    analysisTechniques: [
      "AI-powered pattern recognition algorithms",
      "Statistical correlation analysis (p < 0.05)", 
      "Cross-species comparative genomics",
      "Temporal trend analysis with machine learning"
    ],
    qualityMetrics: {
      confidence: 94,
      coverage: 87,
      reproducibility: 91
    }
  }
};

const ReportPreview = ({ selectedStudyIds, selectedStudies = [], onReportSaved }: ReportPreviewProps) => {
  const { toast } = useToast();
  const [isEditingWithAI, setIsEditingWithAI] = useState(false);
  const [editedReport, setEditedReport] = useState<string | null>(null);
  
  // Generate dynamic insights based on selected studies
  const generateDynamicFindings = () => {
    if (selectedStudies.length === 0) return sampleReportData.keyFindings;
    
    const findings = [];
    const species = selectedStudies.map(s => s.species).filter(Boolean);
    const tissues = selectedStudies.map(s => s.tissue).filter(Boolean);
    const missions = selectedStudies.map(s => s.mission).filter(Boolean);
    
    if (species.length > 0) {
      findings.push(`Study encompasses ${species.length} different species: ${[...new Set(species)].join(', ')}`);
    }
    if (tissues.length > 0) {
      findings.push(`Analysis covers ${tissues.length} tissue types with focus on ${[...new Set(tissues)].slice(0, 3).join(', ')}`);
    }
    if (missions.length > 0) {
      findings.push(`Data collected from ${[...new Set(missions)].length} different missions including ${[...new Set(missions)].slice(0, 2).join(' and ')}`);
    }
    
    // Add some standard findings
    findings.push(...sampleReportData.keyFindings.slice(findings.length));
    
    return findings.slice(0, 4);
  };

  const reportData = {
    ...sampleReportData,
    studyCount: selectedStudyIds.length,
    keyFindings: generateDynamicFindings()
  };

  const handleExport = async (format: 'pdf' | 'word' | 'presentation' | 'web') => {
    try {
      console.log("=== REPORT PREVIEW EXPORT ===");
      console.log("Format:", format);
      
      toast({
        title: "Export Started",
        description: `Generating ${format.toUpperCase()} report...`
      });
      
      // Generate full HTML content
      const fullContent = generateReportHTML({
        title: reportData.title,
        studyCount: reportData.studyCount,
        keyFindings: reportData.keyFindings,
        recommendations: reportData.recommendations,
        selectedStudies
      });
      
      console.log("Generated content length:", fullContent.length);
      
      await exportReport({
        format: format as any,
        title: reportData.title,
        content: fullContent,
        selectedStudies
      });
      
      // Save to history if callback provided
      let saved = false;
      if (onReportSaved) {
        console.log("Calling onReportSaved callback...");
        saved = await onReportSaved(
          reportData.title,
          fullContent,
          format
        );
        console.log("Save result:", saved);
      }
      
      toast({
        title: "Export Complete",
        description: saved 
          ? `Report exported as ${format.toUpperCase()} and saved to history`
          : `Report exported as ${format.toUpperCase()}`
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed", 
        description: "There was an error exporting the report",
        variant: "destructive"
      });
    }
  };

  const handleAIEdit = async () => {
    try {
      setIsEditingWithAI(true);
      
      toast({
        title: "AI Editor Started",
        description: "Enhancing your report with AI..."
      });

      // Generate the current report text
      const reportText = generateReportHTML({
        title: reportData.title,
        studyCount: reportData.studyCount,
        keyFindings: reportData.keyFindings,
        recommendations: reportData.recommendations,
        selectedStudies
      });

      const { data, error } = await supabase.functions.invoke('edit-report', {
        body: { reportText }
      });

      if (error) throw error;

      if (data?.editedText) {
        setEditedReport(data.editedText);
        toast({
          title: "✅ Report Enhanced!",
          description: "Your report has been professionally edited by AI",
        });
      }
    } catch (error) {
      console.error("AI edit error:", error);
      toast({
        title: "AI Edit Failed",
        description: "There was an error editing the report with AI",
        variant: "destructive"
      });
    } finally {
      setIsEditingWithAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold mb-2">{reportData.title}</h1>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Generated on {reportData.generatedDate}</span>
          <Badge variant="outline">{reportData.studyCount} studies analyzed</Badge>
        </div>
      </div>

      {/* Executive Summary */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Executive Summary</h2>
        <p className="text-muted-foreground leading-relaxed">
          This comprehensive analysis examines {reportData.studyCount} space biology studies, 
          revealing critical insights into how various organisms respond to space environments. 
          The findings provide valuable data for future mission planning and biological research protocols.
        </p>
      </section>

      {/* Key Findings */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Key Findings</h2>
        <ul className="space-y-2">
          {reportData.keyFindings.map((finding, index) => (
            <li key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-muted-foreground">{finding}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Statistical Analysis */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Statistical Analysis</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Species Distribution Chart */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-primary" />
              Species Distribution
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={speciesDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {speciesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Mission Success Trends */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-primary" />
              Mission Success Rate
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={missionTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="success" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{sampleReportData.methodology.qualityMetrics.confidence}%</div>
            <div className="text-sm text-blue-600">Confidence Level</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{sampleReportData.methodology.qualityMetrics.coverage}%</div>
            <div className="text-sm text-green-600">Data Coverage</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{sampleReportData.methodology.qualityMetrics.reproducibility}%</div>
            <div className="text-sm text-purple-600">Reproducibility</div>
          </div>
        </div>
      </section>

      {/* Knowledge Graph Section */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Knowledge Graph Analysis</h2>
        <div className="mb-4">
          <p className="text-muted-foreground mb-4">
            Interactive knowledge graph showing relationships between organisms, tissues, conditions, and outcomes across {reportData.studyCount} studies.
          </p>
          <KnowledgeGraph selectedStudyIds={new Set(selectedStudyIds)} />
        </div>
      </section>

      {/* Tissue Impact Analysis */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Tissue Impact Analysis</h2>
        <div className="bg-card border border-border rounded-lg p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tissueAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tissue" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="affected" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Methodology */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Methodology</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-medium mb-2">Data Sources</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• NASA Life Sciences Data Archive</li>
              <li>• European Space Agency Database</li>
              <li>• International Space Station Research</li>
              <li>• Commercial Space Research Data</li>
            </ul>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-medium mb-2">Analysis Methods</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• AI-powered pattern recognition</li>
              <li>• Statistical correlation analysis</li>
              <li>• Cross-species comparison</li>
              <li>• Temporal trend analysis</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Recommendations</h2>
        <div className="space-y-3">
          {reportData.recommendations.map((recommendation, index) => (
            <div key={index} className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-accent-foreground">
                    {index + 1}
                  </span>
                </div>
                <p className="text-muted-foreground">{recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* References */}
      <section>
        <h2 className="text-xl font-semibold mb-3">References</h2>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">
            Complete bibliography with {reportData.studyCount * 2} citations from peer-reviewed sources
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• Journal publications: {Math.floor(reportData.studyCount * 1.5)}</div>
            <div>• Database entries: {reportData.studyCount}</div>
            <div>• Conference proceedings: {Math.floor(reportData.studyCount * 0.5)}</div>
          </div>
        </div>
      </section>

      {/* AI Edited Report Preview */}
      {editedReport && (
        <section className="bg-accent/10 border-2 border-accent rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-accent" />
              AI-Enhanced Report
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditedReport(null)}
            >
              Show Original
            </Button>
          </div>
          <div 
            className="prose prose-sm max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: editedReport }}
          />
        </section>
      )}

      {/* Export Buttons */}
      <div className="flex justify-center flex-wrap gap-4 pt-6 border-t border-border">
        <Button
          onClick={handleAIEdit}
          disabled={isEditingWithAI}
          className="btn-cosmic"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isEditingWithAI ? "Editing..." : "AI Edit Report"}
        </Button>
        <Button
          onClick={() => handleExport('pdf')}
          variant="outline"
          className="btn-space"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </Button>
        <Button
          onClick={() => handleExport('word')}
          variant="outline"
          className="btn-space"
        >
          <Download className="w-4 h-4 mr-2" />
          Export as Word
        </Button>
        <Button
          onClick={() => handleExport('presentation')}
          variant="outline"
          className="btn-space"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export as PowerPoint
        </Button>
        <Button
          onClick={() => handleExport('web')}
          variant="outline"
          className="btn-space"
        >
          <Download className="w-4 h-4 mr-2" />
          Export as Web Report
        </Button>
      </div>
    </div>
  );
};

export default ReportPreview;