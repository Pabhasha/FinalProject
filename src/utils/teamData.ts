
export interface Team {
  id: string;
  name: string;
  logo?: string;
  country: string;
  type: 'club' | 'national';
}

export const teams: Team[] = [
  // Club Teams
  { id: 'barca', name: 'FC Barcelona', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/180px-FC_Barcelona_%28crest%29.svg.png', country: 'Spain', type: 'club' },
  { id: 'real', name: 'Real Madrid', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/180px-Real_Madrid_CF.svg.png', country: 'Spain', type: 'club' },
  { id: 'atleti', name: 'Atlético Madrid', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/Atletico_Madrid_2017_logo.svg/180px-Atletico_Madrid_2017_logo.svg.png', country: 'Spain', type: 'club' },
  { id: 'manutd', name: 'Manchester United', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Manchester_United_FC_crest.svg/180px-Manchester_United_FC_crest.svg.png', country: 'England', type: 'club' },
  { id: 'mancity', name: 'Manchester City', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/180px-Manchester_City_FC_badge.svg.png', country: 'England', type: 'club' },
  { id: 'liverpool', name: 'Liverpool FC', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/180px-Liverpool_FC.svg.png', country: 'England', type: 'club' },
  { id: 'chelsea', name: 'Chelsea FC', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/180px-Chelsea_FC.svg.png', country: 'England', type: 'club' },
  { id: 'arsenal', name: 'Arsenal FC', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/180px-Arsenal_FC.svg.png', country: 'England', type: 'club' },
  { id: 'bayern', name: 'Bayern Munich', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/180px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png', country: 'Germany', type: 'club' },
  { id: 'dortmund', name: 'Borussia Dortmund', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/180px-Borussia_Dortmund_logo.svg.png', country: 'Germany', type: 'club' },
  { id: 'juventus', name: 'Juventus FC', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juventus_FC_2017_icon_%28black%29.svg/180px-Juventus_FC_2017_icon_%28black%29.svg.png', country: 'Italy', type: 'club' },
  { id: 'milan', name: 'AC Milan', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/AC_Milan_logo.svg/180px-AC_Milan_logo.svg.png', country: 'Italy', type: 'club' },
  { id: 'inter', name: 'Inter Milan', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/180px-FC_Internazionale_Milano_2021.svg.png', country: 'Italy', type: 'club' },
  { id: 'psg', name: 'Paris Saint-Germain', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/180px-Paris_Saint-Germain_F.C..svg.png', country: 'France', type: 'club' },
  
  // National Teams - Updated to use consistent flag images
  { id: 'spain', name: 'Spain', logo: 'https://flagcdn.com/w320/es.png', country: 'Spain', type: 'national' },
  { id: 'germany', name: 'Germany', logo: 'https://flagcdn.com/w320/de.png', country: 'Germany', type: 'national' },
  { id: 'france', name: 'France', logo: 'https://flagcdn.com/w320/fr.png', country: 'France', type: 'national' },
  { id: 'england', name: 'England', logo: 'https://flagcdn.com/w320/gb-eng.png', country: 'England', type: 'national' },
  { id: 'brazil', name: 'Brazil', logo: 'https://flagcdn.com/w320/br.png', country: 'Brazil', type: 'national' },
  { id: 'argentina', name: 'Argentina', logo: 'https://flagcdn.com/w320/ar.png', country: 'Argentina', type: 'national' },
  { id: 'italy', name: 'Italy', logo: 'https://flagcdn.com/w320/it.png', country: 'Italy', type: 'national' },
  { id: 'portugal', name: 'Portugal', logo: 'https://flagcdn.com/w320/pt.png', country: 'Portugal', type: 'national' },
  { id: 'netherlands', name: 'Netherlands', logo: 'https://flagcdn.com/w320/nl.png', country: 'Netherlands', type: 'national' },
  { id: 'belgium', name: 'Belgium', logo: 'https://flagcdn.com/w320/be.png', country: 'Belgium', type: 'national' },
  { id: 'croatia', name: 'Croatia', logo: 'https://flagcdn.com/w320/hr.png', country: 'Croatia', type: 'national' },
  { id: 'uruguay', name: 'Uruguay', logo: 'https://flagcdn.com/w320/uy.png', country: 'Uruguay', type: 'national' },
];

// Function to get team by ID
export const getTeamById = (id: string): Team | undefined => {
  return teams.find(team => team.id === id);
};
