
import { Match, mockMatches } from './mockData';

// Define category types
export interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
  bannerImage?: string;
  matches: Match[];
}

// Filter matches by competition
const getMatchesByCompetition = (competition: string): Match[] => {
  return mockMatches.filter(match => 
    match.competition.name.toLowerCase().includes(competition.toLowerCase())
  );
};

// Filter matches by teams
const getMatchesByTeams = (team1: string, team2: string): Match[] => {
  return mockMatches.filter(match => 
    (match.homeTeam.name.toLowerCase().includes(team1.toLowerCase()) && 
     match.awayTeam.name.toLowerCase().includes(team2.toLowerCase())) ||
    (match.homeTeam.name.toLowerCase().includes(team2.toLowerCase()) && 
     match.awayTeam.name.toLowerCase().includes(team1.toLowerCase()))
  );
};

// Create categories with unique entries (removing duplicates and Serie A)
export const categories: Category[] = [
  {
    id: "champions-league",
    title: "Champions League",
    slug: "champions-league",
    description: "Historic UEFA Champions League finals and iconic matches from Europe's premier club competition.",
    bannerImage: "https://editorial.uefa.com/resources/0269-125fde34ba54-30a4c9df51af-1000/ucl_horizontal_tm_eng_co_football_tm_rgb.png",
    matches: getMatchesByCompetition('Champions League')
  },
  {
    id: "world-cup",
    title: "World Cup",
    slug: "world-cup",
    description: "The most memorable finals and matches from FIFA World Cup history.",
    bannerImage: "https://digitalhub.fifa.com/transform/3a170e69-b0b5-4d0c-bca0-85880a60ea1a/World-Cup-logo",
    matches: getMatchesByCompetition('World Cup')
  },
  {
    id: "el-clasico",
    title: "El Clásico",
    slug: "el-clasico",
    description: "The fierce rivalry between FC Barcelona and Real Madrid C.F.",
    bannerImage: "https://assets.laliga.com/assets/2019/09/27/xlarge/9c723d7c3c66950132ca5115c42d5720.jpeg",
    matches: getMatchesByTeams('Barcelona', 'Real Madrid')
  }
];

// Function to get category by slug
export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};
