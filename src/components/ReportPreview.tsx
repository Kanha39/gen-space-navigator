import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";

interface ReportPreviewProps {
  selectedStudyIds: string[];
  selectedStudies?: any[];
}

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
  ]
};

const ReportPreview = ({ selectedStudyIds, selectedStudies = [] }: ReportPreviewProps) => {
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

  const handleExport = (format: 'pdf' | 'word') => {
    // Placeholder for export functionality
    console.log(`Exporting report as ${format.toUpperCase()}`);
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

      {/* Knowledge Graph Section */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Knowledge Graph Analysis</h2>
        <div className="bg-muted/20 rounded-lg p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-cosmic rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-white rounded-full"></div>
              ))}
            </div>
          </div>
          <p className="text-muted-foreground">
            Interactive knowledge graph showing relationships between {reportData.studyCount} studies
          </p>
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

      {/* Export Buttons */}
      <div className="flex justify-center space-x-4 pt-6 border-t border-border">
        <Button
          onClick={() => handleExport('pdf')}
          className="btn-cosmic"
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
      </div>
    </div>
  );
};

export default ReportPreview;