import { useState } from "react";
import { Search } from "lucide-react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";

const aiFilters = [
  "Species",
  "Tissue", 
  "Mission",
  "Omics Type",
  "Duration",
  "Radiation",
  "Pathway",
  "Outcome",
  "Year",
  "Data Type"
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const toggleFilter = (filter: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    setActiveFilters(newFilters);
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-glow">GenSpace</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            AI-Powered Space Biology Knowledge Engine
          </p>

          {/* Search Bar */}
          <div className="relative max-w-4xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground w-6 h-6" />
              <Input
                type="text"
                placeholder="Search space biology research, experiments, and data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="cosmic-card pl-16 pr-6 py-6 text-lg bg-card/80 backdrop-blur-sm border-card-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* AI Filters */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-6 text-accent-glow">Power-10 AI Filters</h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
              {aiFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className={`filter-pill ${
                    activeFilters.has(filter)
                      ? "filter-pill-active"
                      : "filter-pill-inactive"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilters.size > 0 && (
            <div className="max-w-4xl mx-auto">
              <p className="text-sm text-muted-foreground mb-3">
                Active filters ({activeFilters.size}):
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {Array.from(activeFilters).map((filter) => (
                  <span
                    key={filter}
                    className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm"
                  >
                    {filter}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Search Results Preview */}
          {(searchQuery || activeFilters.size > 0) && (
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="cosmic-card bg-card/60 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">Search Results</h4>
                  <span className="text-sm text-muted-foreground">
                    {Math.floor(Math.random() * 150) + 50} studies found
                  </span>
                </div>
                <p className="text-muted-foreground text-left">
                  {searchQuery 
                    ? `Searching for "${searchQuery}"` 
                    : "Filtering by selected criteria"
                  }
                  {activeFilters.size > 0 && ` with ${activeFilters.size} active filters`}
                </p>
                <div className="mt-4 pt-4 border-t border-border">
                  <button className="btn-cosmic w-full md:w-auto">
                    View Detailed Results in Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="cosmic-card text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-cosmic rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Intelligent Search</h3>
            <p className="text-muted-foreground">
              Advanced AI-powered search across space biology research data
            </p>
          </div>

          <div className="cosmic-card text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-cosmic rounded-full flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-white"></div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Knowledge Graphs</h3>
            <p className="text-muted-foreground">
              Interactive visualization of research connections and relationships
            </p>
          </div>

          <div className="cosmic-card text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-cosmic rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-sm"></div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Reports</h3>
            <p className="text-muted-foreground">
              Generate comprehensive reports with AI-powered insights
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;