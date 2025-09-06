import { useState } from "react";
import Layout from "@/components/Layout";
import StudyCard from "@/components/StudyCard";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const sampleStudies = [
  {
    id: "1",
    title: "Microgravity Effects on Cellular Metabolism in Mouse Liver",
    year: "2023",
    mission: "SpaceX CRS-27",
    summary: "This study examined how microgravity conditions affect cellular metabolism in mouse liver tissue during a 30-day spaceflight mission. Results showed significant changes in glucose processing pathways.",
    tags: ["Mouse", "Liver", "Metabolism"],
    references: ["https://doi.org/10.1038/s41526-023-00287-z", "NASA Life Sciences Data Archive"]
  },
  {
    id: "2", 
    title: "Plant Growth Responses to Cosmic Radiation Exposure",
    year: "2022",
    mission: "ISS Expedition 68",
    summary: "Investigation of Arabidopsis thaliana growth patterns under various cosmic radiation levels. Study reveals adaptive mechanisms in plant cellular repair systems.",
    tags: ["Arabidopsis", "Roots", "Radiation Response"],
    references: ["https://doi.org/10.1016/j.lssr.2022.07.003", "European Space Agency Database"]
  },
  {
    id: "3",
    title: "Bone Density Changes in Astronaut Populations",
    year: "2023",
    mission: "Artemis Analog",
    summary: "Longitudinal study tracking bone mineral density changes in astronauts during extended space missions. Focus on calcium metabolism and countermeasure effectiveness.",
    tags: ["Human", "Bone", "Mineral Loss"],
    references: ["https://doi.org/10.1007/s00774-023-01442-1", "NASA Human Research Program"]
  },
  {
    id: "4",
    title: "Bacterial Biofilm Formation in Microgravity",
    year: "2022",
    mission: "Blue Origin NS-23",
    summary: "Analysis of E. coli biofilm formation patterns under microgravity conditions. Discovered enhanced antibiotic resistance and novel structural formations.",
    tags: ["E. coli", "Biofilm", "Antibiotic Resistance"],
    references: ["https://doi.org/10.1038/s41526-022-00198-z", "Commercial Space Research"]
  },
  {
    id: "5",
    title: "Neural Development in Zebrafish Embryos",
    year: "2023",
    mission: "SpaceX CRS-28",
    summary: "Comprehensive study of zebrafish embryonic neural development in space. Investigated critical developmental windows and gravitational influence on brain formation.",
    tags: ["Zebrafish", "Neural", "Development"],
    references: ["https://doi.org/10.1242/dev.201564", "International Space Station Research"]
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedStudies, setSelectedStudies] = useState<Set<string>>(new Set());

  const toggleStudySelection = (studyId: string) => {
    const newSelection = new Set(selectedStudies);
    if (newSelection.has(studyId)) {
      newSelection.delete(studyId);
    } else {
      newSelection.add(studyId);
    }
    setSelectedStudies(newSelection);
  };

  const handleGenerateReport = () => {
    navigate("/reports", { state: { selectedStudies: Array.from(selectedStudies) } });
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-glow">Research Dashboard</h1>
          <p className="text-muted-foreground">
            Explore space biology studies and generate comprehensive reports
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Section - Study Cards */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Studies</h2>
              <span className="text-sm text-muted-foreground">
                {selectedStudies.size} selected
              </span>
            </div>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {sampleStudies.map((study) => (
                <StudyCard
                  key={study.id}
                  study={study}
                  isSelected={selectedStudies.has(study.id)}
                  onToggleSelection={() => toggleStudySelection(study.id)}
                />
              ))}
            </div>

            {/* Generate Report Button */}
            <div className="sticky bottom-0 pt-4 bg-background border-t border-border">
              <Button
                onClick={handleGenerateReport}
                disabled={selectedStudies.size === 0}
                className="btn-cosmic w-full"
              >
                Generate Report ({selectedStudies.size} studies)
              </Button>
            </div>
          </div>

          {/* Right Section - Knowledge Graph */}
          <div className="cosmic-card h-fit">
            <h2 className="text-xl font-semibold mb-6">Knowledge Graph</h2>
            <KnowledgeGraph selectedStudyIds={selectedStudies} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;