import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import StudyCard from "@/components/StudyCard";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import { Button } from "@/components/ui/button";
import { useStudyContext } from "@/context/StudyContext";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    studies,
    searchQuery,
    activeFilters,
    setSearchQuery,
    setActiveFilters
  } = useStudyContext();
  const [selectedStudies, setSelectedStudies] = useState<Set<string>>(new Set());
  const [displayStudies, setDisplayStudies] = useState(studies);

  // Handle filtered results from Home page
  useEffect(() => {
    if (location.state?.filteredResults) {
      setDisplayStudies(location.state.filteredResults);
      if (location.state.searchQuery) {
        setSearchQuery(location.state.searchQuery);
      }
      if (location.state.activeFilters) {
        setActiveFilters(new Set(location.state.activeFilters));
      }
    } else {
      setDisplayStudies(studies);
    }
  }, [location.state, studies, setSearchQuery, setActiveFilters]);
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
    navigate("/reports", {
      state: {
        selectedStudyIds: Array.from(selectedStudies),
        selectedStudies: displayStudies.filter(study => selectedStudies.has(study.id))
      }
    });
  };
  const clearFilters = () => {
    setSearchQuery('');
    setActiveFilters(new Set());
    setDisplayStudies(studies);
  };

  const handleCallBiospecimens = async () => {
    try {
      toast.loading('Calling biospecimens API...');
      
      const { data, error } = await supabase.functions.invoke('biospecimens', {
        body: { 
          action: 'fetch_biospecimens',
          timestamp: new Date().toISOString() 
        }
      });

      if (error) throw error;

      toast.success('Biospecimens API called successfully!');
      console.log('Response:', data);
    } catch (error) {
      console.error('Error calling biospecimens API:', error);
      toast.error('Failed to call biospecimens API');
    }
  };
  return <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Research Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Explore and analyze space biology research studies
          </p>
          
          {/* Active Filters Display */}
          {(searchQuery || activeFilters.size > 0) && <div className="mt-6 p-4 bg-card/60 backdrop-blur-sm rounded-lg border border-border animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Active Filters</span>
                  <Badge variant="outline" className="text-xs">
                    {displayStudies.length} results
                  </Badge>
                </div>
                <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground flex items-center space-x-1 transition-colors">
                  <X className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {searchQuery && <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Search: "{searchQuery}"
                  </Badge>}
                {Array.from(activeFilters).map(filter => <Badge key={filter} variant="secondary" className="bg-accent/10 text-accent">
                    {filter}
                  </Badge>)}
              </div>
            </div>}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Studies List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Available Studies</h2>
              <span className="text-muted-foreground">
                {displayStudies.length} studies {displayStudies.length !== studies.length ? 'filtered' : 'available'}
              </span>
            </div>
            
            <div className="space-y-6 animate-fade-in">
              {displayStudies.map((study, index) => <div key={study.id} className="animate-fade-in" style={{
              animationDelay: `${index * 100}ms`
            }}>
                  <StudyCard study={study} isSelected={selectedStudies.has(study.id)} onToggleSelection={() => toggleStudySelection(study.id)} />
                </div>)}
              
              {displayStudies.length === 0 && <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No studies match your current filters</p>
                  <button onClick={clearFilters} className="mt-4 btn-cosmic hover-scale">
                    Clear Filters
                  </button>
                </div>}
            </div>
          </div>

          {/* Right Section - Knowledge Graph */}
          <div className="cosmic-card h-fit px-px">
            <h2 className="text-xl font-semibold mb-6">Knowledge Graph</h2>
            <KnowledgeGraph selectedStudyIds={selectedStudies} />
            
            {/* Generate Report Button */}
            <div className="mt-6 pt-4 border-t border-border space-y-3">
              <Button onClick={handleGenerateReport} disabled={selectedStudies.size === 0} className="w-full btn-cosmic hover-scale transition-all duration-200">
                Generate Report ({selectedStudies.size} studies)
              </Button>
              
              <Button onClick={handleCallBiospecimens} variant="outline" className="w-full">
                Call External API
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>;
};
export default Dashboard;