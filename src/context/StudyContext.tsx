import { createContext, useContext, useState, ReactNode } from 'react';

export interface Study {
  id: string;
  title: string;
  year: string;
  mission: string;
  summary: string;
  tags: string[];
  references: string[];
  species?: string;
  tissue?: string;
  omicsType?: string;
  duration?: string;
  radiation?: string;
  pathway?: string;
  outcome?: string;
  dataType?: string;
}

interface StudyContextType {
  studies: Study[];
  filteredStudies: Study[];
  searchQuery: string;
  activeFilters: Set<string>;
  setSearchQuery: (query: string) => void;
  setActiveFilters: (filters: Set<string>) => void;
  searchStudies: (query: string, filters: Set<string>) => Study[];
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

// Extended sample data with filter properties
const sampleStudies: Study[] = [
  {
    id: 'a1b2c3d4-e5f6-47a8-b9c0-d1e2f3a4b5c6',
    title: 'Microgravity Effects on Arabidopsis Root Development',
    year: '2023',
    mission: 'ISS Expedition 68',
    summary: 'Comprehensive analysis of plant root architecture changes in microgravity conditions, showing significant alterations in gravitropic response.',
    tags: ['Plants', 'Root Development', 'Microgravity'],
    references: ['Plant Biology in Space Journal 2023', 'NASA Technical Report'],
    species: 'Arabidopsis',
    tissue: 'Root',
    omicsType: 'Transcriptomics',
    duration: '30 days',
    radiation: 'Low',
    pathway: 'Gravitropic Response',
    outcome: 'Altered Growth',
    dataType: 'RNA-seq'
  },
  {
    id: 'b2c3d4e5-f6a7-48b9-c0d1-e2f3a4b5c6d7',
    title: 'Protein Folding in Simulated Martian Environment',
    year: '2022',
    mission: 'Mars Simulation Chamber',
    summary: 'Investigation of protein stability and folding mechanisms under Martian atmospheric conditions and temperature variations.',
    tags: ['Protein Folding', 'Mars Environment', 'Biochemistry'],
    references: ['Astrobiology Research 2022', 'Space Biochemistry Annual'],
    species: 'E. coli',
    tissue: 'Cell Culture',
    omicsType: 'Proteomics',
    duration: '14 days',
    radiation: 'High',
    pathway: 'Protein Synthesis',
    outcome: 'Structural Changes',
    dataType: 'Mass Spectrometry'
  },
  {
    id: 'c3d4e5f6-a7b8-49c0-d1e2-f3a4b5c6d7e8',
    title: 'Bone Density Changes in Long-Duration Spaceflight',
    year: '2023',
    mission: 'ISS Year-Long Mission',
    summary: 'Longitudinal study of bone mineral density changes in astronauts during extended missions, with countermeasure effectiveness analysis.',
    tags: ['Bone Health', 'Human Physiology', 'Countermeasures'],
    references: ['Space Medicine Journal', 'NASA Human Research Program'],
    species: 'Human',
    tissue: 'Bone',
    omicsType: 'Metabolomics',
    duration: '365 days',
    radiation: 'Medium',
    pathway: 'Calcium Metabolism',
    outcome: 'Bone Loss',
    dataType: 'DEXA Scan'
  },
  {
    id: 'd4e5f6a7-b8c9-40d1-e2f3-a4b5c6d7e8f9',
    title: 'Bacterial Biofilm Formation in Microgravity',
    year: '2022',
    mission: 'SpaceX CRS-24',
    summary: 'Study of bacterial biofilm architecture and antibiotic resistance patterns in microgravity conditions.',
    tags: ['Bacteria', 'Biofilms', 'Antibiotic Resistance'],
    references: ['Microbiology in Space 2022', 'Applied Microbiology Journal'],
    species: 'Pseudomonas aeruginosa',
    tissue: 'Biofilm',
    omicsType: 'Genomics',
    duration: '21 days',
    radiation: 'Low',
    pathway: 'Quorum Sensing',
    outcome: 'Enhanced Resistance',
    dataType: 'Whole Genome Sequencing'
  },
  {
    id: 'e5f6a7b8-c9d0-41e2-f3a4-b5c6d7e8f9a0',
    title: 'Muscle Atrophy Mechanisms in Simulated Weightlessness',
    year: '2023',
    mission: 'Bed Rest Study',
    summary: 'Molecular mechanisms underlying muscle mass loss during prolonged bed rest as a model for spaceflight-induced muscle atrophy.',
    tags: ['Muscle Atrophy', 'Human Physiology', 'Exercise Countermeasures'],
    references: ['Journal of Applied Physiology', 'Space Medicine Research'],
    species: 'Human',
    tissue: 'Skeletal Muscle',
    omicsType: 'Transcriptomics',
    duration: '60 days',
    radiation: 'None',
    pathway: 'Protein Degradation',
    outcome: 'Muscle Loss',
    dataType: 'RNA-seq'
  },
  {
    id: 'f6a7b8c9-d0e1-42f3-a4b5-c6d7e8f9a0b1',
    title: 'Radiation Effects on DNA Repair in Mammalian Cells',
    year: '2022',
    mission: 'Ground-Based Simulation',
    summary: 'Analysis of DNA damage and repair mechanisms in mammalian cell cultures exposed to space-relevant radiation.',
    tags: ['DNA Repair', 'Radiation Biology', 'Cell Culture'],
    references: ['Radiation Research Journal', 'DNA Repair Mechanisms 2022'],
    species: 'Mouse',
    tissue: 'Fibroblasts',
    omicsType: 'Genomics',
    duration: '7 days',
    radiation: 'High',
    pathway: 'DNA Repair',
    outcome: 'Increased Mutations',
    dataType: 'Whole Genome Sequencing'
  }
];

export const StudyProvider = ({ children }: { children: ReactNode }) => {
  const [studies] = useState<Study[]>(sampleStudies);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [filteredStudies, setFilteredStudies] = useState<Study[]>(studies);

  // Keyword mappings for intelligent search
  const keywordMappings: Record<string, string[]> = {
    'plant': ['arabidopsis', 'root', 'photosynthesis', 'gravitropic'],
    'bone': ['skeletal', 'calcium', 'dexa', 'mineral', 'density'],
    'muscle': ['atrophy', 'protein', 'exercise', 'skeletal muscle', 'degradation'],
    'dna': ['genetic', 'genomics', 'repair', 'mutations', 'genome'],
    'bacteria': ['biofilm', 'antibiotic', 'microbiology', 'pseudomonas', 'e. coli'],
    'radiation': ['cosmic', 'space', 'damage', 'repair', 'mutations'],
    'microgravity': ['weightlessness', 'zero gravity', 'space', 'gravity'],
    'space': ['iss', 'mars', 'spaceflight', 'expedition', 'mission'],
    'health': ['physiology', 'medical', 'countermeasures', 'medicine'],
    'protein': ['folding', 'synthesis', 'biochemistry', 'proteomics'],
    'cell': ['culture', 'cellular', 'fibroblasts', 'mammalian'],
    'human': ['astronaut', 'physiology', 'medical', 'bed rest']
  };

  const searchStudies = (query: string, filters: Set<string>): Study[] => {
    let results = studies;

    // Apply intelligent text search
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
      
      results = results.map(study => {
        let score = 0;
        let matchesFound = 0;

        // Get all searchable text from the study
        const searchableFields = [
          study.title,
          study.summary,
          study.mission,
          study.species || '',
          study.tissue || '',
          study.omicsType || '',
          study.duration || '',
          study.radiation || '',
          study.pathway || '',
          study.outcome || '',
          study.dataType || '',
          ...study.tags
        ].map(field => field.toLowerCase());

        const allSearchableText = searchableFields.join(' ');

        // Search each term
        searchTerms.forEach(term => {
          let termMatched = false;

          // Direct exact matches (highest priority)
          if (study.title.toLowerCase().includes(term)) {
            score += 100;
            termMatched = true;
          } else if (allSearchableText.includes(term)) {
            score += 50;
            termMatched = true;
          }

          // Keyword mapping matches (medium priority)
          if (!termMatched) {
            for (const [keyword, synonyms] of Object.entries(keywordMappings)) {
              if (term.includes(keyword) || keyword.includes(term)) {
                // Check if any synonyms match
                const synonymMatch = synonyms.some(synonym => 
                  allSearchableText.includes(synonym)
                );
                if (synonymMatch) {
                  score += 30;
                  termMatched = true;
                  break;
                }
              }
            }
          }

          // Partial word matches (lower priority)
          if (!termMatched) {
            const partialMatches = searchableFields.some(field => 
              field.split(/\s+/).some(word => 
                word.startsWith(term) || term.startsWith(word.substring(0, 3))
              )
            );
            if (partialMatches) {
              score += 10;
              termMatched = true;
            }
          }

          if (termMatched) {
            matchesFound++;
          }
        });

        // Only include studies that match at least one search term
        return matchesFound > 0 ? { ...study, _searchScore: score } : null;
      })
      .filter((study): study is Study & { _searchScore: number } => study !== null)
      .sort((a, b) => b._searchScore - a._searchScore)
      .map(({ _searchScore, ...study }) => study);
    }

    // Apply filters
    if (filters.size > 0) {
      results = results.filter(study => {
        return Array.from(filters).some(filter => {
          switch (filter) {
            case 'Species':
              return study.species?.toLowerCase().includes('human') || study.species?.toLowerCase().includes('mouse') || study.species?.toLowerCase().includes('arabidopsis') || study.species?.toLowerCase().includes('e. coli') || study.species?.toLowerCase().includes('pseudomonas');
            case 'Tissue':
              return study.tissue && (study.tissue.toLowerCase().includes('root') || study.tissue.toLowerCase().includes('bone') || study.tissue.toLowerCase().includes('muscle') || study.tissue.toLowerCase().includes('cell') || study.tissue.toLowerCase().includes('biofilm') || study.tissue.toLowerCase().includes('fibroblasts'));
            case 'Mission':
              return study.mission.toLowerCase().includes('iss') || study.mission.toLowerCase().includes('mars') || study.mission.toLowerCase().includes('spacex');
            case 'Omics Type':
              return study.omicsType && (study.omicsType.toLowerCase().includes('transcriptomics') || study.omicsType.toLowerCase().includes('proteomics') || study.omicsType.toLowerCase().includes('genomics') || study.omicsType.toLowerCase().includes('metabolomics'));
            case 'Duration':
              return study.duration && (study.duration.includes('days') || study.duration.includes('day'));
            case 'Radiation':
              return study.radiation && (study.radiation.toLowerCase().includes('high') || study.radiation.toLowerCase().includes('medium') || study.radiation.toLowerCase().includes('low') || study.radiation.toLowerCase().includes('none'));
            case 'Pathway':
              return study.pathway && study.pathway.toLowerCase().includes(filter.toLowerCase().substring(0, 4));
            case 'Outcome':
              return study.outcome && study.outcome.toLowerCase().includes('changes') || study.outcome?.toLowerCase().includes('loss') || study.outcome?.toLowerCase().includes('resistance') || study.outcome?.toLowerCase().includes('mutations');
            case 'Year':
              return study.year === '2023' || study.year === '2022';
            case 'Data Type':
              return study.dataType && (study.dataType.toLowerCase().includes('rna') || study.dataType.toLowerCase().includes('mass') || study.dataType.toLowerCase().includes('dexa') || study.dataType.toLowerCase().includes('genome'));
            default:
              return false;
          }
        });
      });
    }

    return results;
  };

  const value: StudyContextType = {
    studies,
    filteredStudies,
    searchQuery,
    activeFilters,
    setSearchQuery,
    setActiveFilters,
    searchStudies
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudyContext = () => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudyContext must be used within a StudyProvider');
  }
  return context;
};