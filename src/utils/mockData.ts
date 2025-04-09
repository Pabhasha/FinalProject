export interface Match {
  id: string;
  homeTeam: {
    name: string;
    logo: string;
    country: string;
  };
  awayTeam: {
    name: string;
    logo: string;
    country: string;
  };
  score: {
    homeScore: number;
    awayScore: number;
    extraTime?: boolean;
    penalties?: {
      homeScore: number;
      awayScore: number;
    };
  };
  date: string;
  competition: {
    name: string;
    logo: string;
  };
  stage?: string;
  stadium: {
    name: string;
    city: string;
    country: string;
  };
  poster: string;
  highlights?: string;
}

export interface Review {
  id: string;
  matchId: string;
  userId: string;
  username: string;
  userAvatar?: string;
  rating: number;
  content: string;
  spoiler: boolean;
  likes: number;
  createdAt: string;
}

export interface List {
  id: string;
  userId: string;
  title: string;
  description: string;
  coverImage?: string;
  matches: string[]; // Match IDs
  likes: number;
  createdAt: string;
  lastUpdated: string;
}

export const mockMatches: Match[] = [
  {
    id: "m1",
    homeTeam: {
      name: "Argentina",
      logo: "https://media.api-sports.io/football/teams/26.png",
      country: "Argentina"
    },
    awayTeam: {
      name: "France",
      logo: "https://media.api-sports.io/football/teams/2.png",
      country: "France"
    },
    score: {
      homeScore: 3,
      awayScore: 3,
      extraTime: true,
      penalties: {
        homeScore: 4,
        awayScore: 2
      }
    },
    date: "2022-12-18T15:00:00Z",
    competition: {
      name: "FIFA World Cup",
      logo: "https://media.api-sports.io/football/leagues/1.png"
    },
    stage: "Final",
    stadium: {
      name: "Lusail Stadium",
      city: "Lusail",
      country: "Qatar"
    },
    poster: "https://editorial.uefa.com/resources/0279-15f16d17cf51-8c4dba7b0977-1000/20221218_fbl-wc-2022-match64-arg-fra_80.jpeg",
    highlights: "https://www.youtube.com/watch?v=Vdd4rBlsj2o"
  },
  {
    id: "m2",
    homeTeam: {
      name: "Liverpool",
      logo: "https://media.api-sports.io/football/teams/40.png",
      country: "England"
    },
    awayTeam: {
      name: "Barcelona",
      logo: "https://media.api-sports.io/football/teams/529.png",
      country: "Spain"
    },
    score: {
      homeScore: 4,
      awayScore: 0
    },
    date: "2019-05-07T19:00:00Z",
    competition: {
      name: "UEFA Champions League",
      logo: "https://media.api-sports.io/football/leagues/2.png"
    },
    stage: "Semi-final",
    stadium: {
      name: "Anfield",
      city: "Liverpool",
      country: "England"
    },
    poster: "https://e0.365dm.com/19/05/1600x900/skysports-liverpool-barcelona_4659860.jpg",
    highlights: "https://www.youtube.com/watch?v=7HldRlTZj_g"
  },
  {
    id: "m3",
    homeTeam: {
      name: "Manchester City",
      logo: "https://media.api-sports.io/football/teams/50.png",
      country: "England"
    },
    awayTeam: {
      name: "Real Madrid",
      logo: "https://media.api-sports.io/football/teams/541.png",
      country: "Spain"
    },
    score: {
      homeScore: 4,
      awayScore: 3
    },
    date: "2022-04-26T19:00:00Z",
    competition: {
      name: "UEFA Champions League",
      logo: "https://media.api-sports.io/football/leagues/2.png"
    },
    stage: "Semi-final",
    stadium: {
      name: "Etihad Stadium",
      city: "Manchester",
      country: "England"
    },
    poster: "https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt1c9cb24732b40ca3/62683517ae58b870ce6ba53a/GettyImages-1240444148.jpg",
    highlights: "https://www.youtube.com/watch?v=brJftQTGvJs"
  },
  {
    id: "m4",
    homeTeam: {
      name: "Bayern Munich",
      logo: "https://media.api-sports.io/football/teams/157.png",
      country: "Germany"
    },
    awayTeam: {
      name: "Barcelona",
      logo: "https://media.api-sports.io/football/teams/529.png",
      country: "Spain"
    },
    score: {
      homeScore: 8,
      awayScore: 2
    },
    date: "2020-08-14T19:00:00Z",
    competition: {
      name: "UEFA Champions League",
      logo: "https://media.api-sports.io/football/leagues/2.png"
    },
    stage: "Quarter-final",
    stadium: {
      name: "Estádio da Luz",
      city: "Lisbon",
      country: "Portugal"
    },
    poster: "https://www.fcbarcelona.com/fcbarcelona/photo/2020/08/15/7a078a05-6e48-4ef3-b71b-ac9bd743fb4a/2020-08-14-FCBAYERNvsFCB-31.JPG",
    highlights: "https://www.youtube.com/watch?v=_xckGIy_Tco"
  },
  {
    id: "m5",
    homeTeam: {
      name: "Barcelona",
      logo: "https://media.api-sports.io/football/teams/529.png",
      country: "Spain"
    },
    awayTeam: {
      name: "Paris Saint-Germain",
      logo: "https://media.api-sports.io/football/teams/85.png",
      country: "France"
    },
    score: {
      homeScore: 6,
      awayScore: 1
    },
    date: "2017-03-08T19:45:00Z",
    competition: {
      name: "UEFA Champions League",
      logo: "https://media.api-sports.io/football/leagues/2.png"
    },
    stage: "Round of 16",
    stadium: {
      name: "Camp Nou",
      city: "Barcelona",
      country: "Spain"
    },
    poster: "https://i2-prod.mirror.co.uk/incoming/article9999037.ece/ALTERNATES/s1200c/Barcelona-v-Paris-Saint-Germain-UEFA-Champions-League-Round-of-16-Second-Leg.jpg",
    highlights: "https://www.youtube.com/watch?v=SnFjkUQnQF8"
  },
  {
    id: "m6",
    homeTeam: {
      name: "Manchester United",
      logo: "https://media.api-sports.io/football/teams/33.png",
      country: "England"
    },
    awayTeam: {
      name: "Bayern Munich",
      logo: "https://media.api-sports.io/football/teams/157.png",
      country: "Germany"
    },
    score: {
      homeScore: 2,
      awayScore: 1
    },
    date: "1999-05-26T19:00:00Z",
    competition: {
      name: "UEFA Champions League",
      logo: "https://media.api-sports.io/football/leagues/2.png"
    },
    stage: "Final",
    stadium: {
      name: "Camp Nou",
      city: "Barcelona",
      country: "Spain"
    },
    poster: "https://www.manutd.com/AssetPicker/images/0/0/10/126/687725/Legends-Profile_Teddy-Sheringham1523463036428.jpg",
    highlights: "https://www.youtube.com/watch?v=0-ZDuHXfLro"
  },
  {
    id: "m7",
    homeTeam: {
      name: "Barcelona",
      logo: "https://media.api-sports.io/football/teams/529.png",
      country: "Spain"
    },
    awayTeam: {
      name: "Real Madrid",
      logo: "https://media.api-sports.io/football/teams/541.png",
      country: "Spain"
    },
    score: {
      homeScore: 6,
      awayScore: 2
    },
    date: "2009-05-02T19:00:00Z",
    competition: {
      name: "La Liga",
      logo: "https://media.api-sports.io/football/leagues/140.png"
    },
    stage: "Matchday 34",
    stadium: {
      name: "Santiago Bernabéu",
      city: "Madrid",
      country: "Spain"
    },
    poster: "https://fcbarcelona.darkroom.tech/1200/675/65ad44e78bb951d37d1e0fadb853f8d0:3d5af1f362cb7b8bad31ddc221ab674d/11-barcelona-6-real-madrid-2-enorme-espectacle-al-santiago-bernabeu.jpg",
    highlights: "https://www.youtube.com/watch?v=VPRAB0wFXpw"
  }
];

export const mockReviews: Review[] = [
  {
    id: "r1",
    matchId: "m1",
    userId: "u1",
    username: "football_fan",
    userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    content: "The best World Cup final I've ever seen. Messi vs Mbappé, drama, goals, penalties... This match had it all!",
    spoiler: false,
    likes: 245,
    createdAt: "2022-12-19T08:30:00Z"
  },
  {
    id: "r2",
    matchId: "m2",
    userId: "u2",
    username: "ynwa_forever",
    userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    content: "Corner taken quickly... ORIGI!!! What a night at Anfield. One of the greatest comebacks in football history.",
    spoiler: false,
    likes: 189,
    createdAt: "2019-05-08T10:15:00Z"
  },
  {
    id: "r3",
    matchId: "m3",
    userId: "u3",
    username: "football_tactics",
    userAvatar: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 4.5,
    content: "A tactical masterclass from Guardiola. City dominated but Madrid's resilience is something else.",
    spoiler: false,
    likes: 78,
    createdAt: "2022-04-27T14:20:00Z"
  }
];

export const mockLists: List[] = [
  {
    id: "l1",
    userId: "u1",
    title: "Greatest Champions League Finals",
    description: "A collection of the most memorable UCL finals in history",
    coverImage: "https://img.uefa.com/imgml/uefacom/ucl/social/og-default.jpg",
    matches: ["m1", "m6"],
    likes: 156,
    createdAt: "2023-01-15T11:20:00Z",
    lastUpdated: "2023-02-10T09:45:00Z"
  },
  {
    id: "l2",
    userId: "u2",
    title: "Epic Comebacks",
    description: "Matches where teams defied the odds and made incredible comebacks",
    coverImage: "https://e0.365dm.com/19/05/1600x900/skysports-liverpool-barcelona_4659860.jpg",
    matches: ["m2", "m5"],
    likes: 203,
    createdAt: "2022-11-08T16:30:00Z",
    lastUpdated: "2023-03-22T12:15:00Z"
  }
];

export const getMatchById = (id: string): Match | undefined => {
  return mockMatches.find(match => match.id === id);
};

export const getReviewsForMatch = (matchId: string): Review[] => {
  return mockReviews.filter(review => review.matchId === matchId);
};

export const getListsContainingMatch = (matchId: string): List[] => {
  return mockLists.filter(list => list.matches.includes(matchId));
};
