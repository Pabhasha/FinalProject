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
  engagement?: {
    views: number;
    ratings: number;
    ratingAverage: number;
    reviews: number;
    lastEngagementDate?: string;
  };
  trendingScore?: number;
  qualityScore?: number;
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

const addEngagementData = (matches: Match[]): Match[] => {
  return matches.map(match => {
    const matchDate = new Date(match.date);
    const daysSinceMatch = Math.max(1, (new Date().getTime() - matchDate.getTime()) / (1000 * 3600 * 24));
    
    const isClassic = match.highlights?.includes('classic') || 
                     match.score.homeScore + match.score.awayScore > 4;
    
    const views = Math.floor(1000 / Math.sqrt(daysSinceMatch)) + (isClassic ? 500 : 0);
    const ratings = Math.floor(views * (0.05 + Math.random() * 0.10));
    const ratingBase = isClassic ? 4.2 : 3.5;
    const ratingAverage = ratingBase + (Math.random() * 0.8 - 0.4);
    const reviews = Math.floor(ratings * (0.15 + Math.random() * 0.10));
    
    return {
      ...match,
      engagement: {
        views,
        ratings,
        ratingAverage,
        reviews,
        lastEngagementDate: new Date(Date.now() - Math.random() * 1000 * 3600 * 24 * 7).toISOString()
      }
    };
  });
};

export const mockMatches: Match[] = addEngagementData([
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
  },
  
  // New World Cup matches
  {
    id: "m8",
    homeTeam: {
      name: "Brazil",
      logo: "https://media.api-sports.io/football/teams/6.png",
      country: "Brazil"
    },
    awayTeam: {
      name: "Germany",
      logo: "https://media.api-sports.io/football/teams/25.png",
      country: "Germany"
    },
    score: {
      homeScore: 1,
      awayScore: 7
    },
    date: "2014-07-08T20:00:00Z",
    competition: {
      name: "FIFA World Cup",
      logo: "https://media.api-sports.io/football/leagues/1.png"
    },
    stage: "Semi-final",
    stadium: {
      name: "Estádio Mineirão",
      city: "Belo Horizonte",
      country: "Brazil"
    },
    poster: "https://cdn.britannica.com/83/192683-050-9F23360E/Germany-Brazil-FIFA-World-Cup-2014.jpg",
    highlights: "https://www.youtube.com/watch?v=DUSojCb7CFM"
  },
  {
    id: "m9",
    homeTeam: {
      name: "Spain",
      logo: "https://media.api-sports.io/football/teams/9.png",
      country: "Spain"
    },
    awayTeam: {
      name: "Netherlands",
      logo: "https://media.api-sports.io/football/teams/1118.png",
      country: "Netherlands"
    },
    score: {
      homeScore: 1,
      awayScore: 0,
      extraTime: true
    },
    date: "2010-07-11T19:30:00Z",
    competition: {
      name: "FIFA World Cup",
      logo: "https://media.api-sports.io/football/leagues/1.png"
    },
    stage: "Final",
    stadium: {
      name: "Soccer City Stadium",
      city: "Johannesburg",
      country: "South Africa"
    },
    poster: "https://cdn.cnn.com/cnnnext/dam/assets/100711175249-spain-netherlands-world-cup-horizontal-large.jpg",
    highlights: "https://www.youtube.com/watch?v=825BX1iQqXs"
  },
  
  // New El Clásico matches
  {
    id: "m10",
    homeTeam: {
      name: "Real Madrid",
      logo: "https://media.api-sports.io/football/teams/541.png",
      country: "Spain"
    },
    awayTeam: {
      name: "Barcelona",
      logo: "https://media.api-sports.io/football/teams/529.png",
      country: "Spain"
    },
    score: {
      homeScore: 0,
      awayScore: 4
    },
    date: "2015-11-21T19:15:00Z",
    competition: {
      name: "La Liga",
      logo: "https://media.api-sports.io/football/leagues/140.png"
    },
    stage: "Matchday 12",
    stadium: {
      name: "Santiago Bernabéu",
      city: "Madrid",
      country: "Spain"
    },
    poster: "https://www.fcbarcelona.com/fcbarcelona/photo/2018/03/22/f5d8a7c8-d7c9-4184-8101-16b236b3a0c3/mini_2015-11-21_REALMADRID-BARCELONA_12.JPG",
    highlights: "https://www.youtube.com/watch?v=7OZ8Gtp52jc"
  },
  {
    id: "m11",
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
      homeScore: 5,
      awayScore: 0
    },
    date: "2010-11-29T20:00:00Z",
    competition: {
      name: "La Liga",
      logo: "https://media.api-sports.io/football/leagues/140.png"
    },
    stage: "Matchday 13",
    stadium: {
      name: "Camp Nou",
      city: "Barcelona",
      country: "Spain"
    },
    poster: "https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt42c83090760abe58/60dc62149a4c2d39be77283d/962c29f1278de6acf4d914a0fde7e5843e14c20e.jpg",
    highlights: "https://www.youtube.com/watch?v=rCXksQN0RkQ"
  },
  
  // New Premier League matches
  {
    id: "m12",
    homeTeam: {
      name: "Manchester City",
      logo: "https://media.api-sports.io/football/teams/50.png",
      country: "England"
    },
    awayTeam: {
      name: "Queens Park Rangers",
      logo: "https://media.api-sports.io/football/teams/69.png",
      country: "England"
    },
    score: {
      homeScore: 3,
      awayScore: 2
    },
    date: "2012-05-13T15:00:00Z",
    competition: {
      name: "Premier League",
      logo: "https://media.api-sports.io/football/leagues/39.png"
    },
    stage: "Matchday 38",
    stadium: {
      name: "Etihad Stadium",
      city: "Manchester",
      country: "England"
    },
    poster: "https://www.si.com/.image/t_share/MTc0NDg2MDIzNzQwMDgwMzcz/sergio-agc3bcero-celebration.jpg",
    highlights: "https://www.youtube.com/watch?v=4XSo5Z0hEAs"
  },
  {
    id: "m13",
    homeTeam: {
      name: "Liverpool",
      logo: "https://media.api-sports.io/football/teams/40.png",
      country: "England"
    },
    awayTeam: {
      name: "Newcastle United",
      logo: "https://media.api-sports.io/football/teams/34.png",
      country: "England"
    },
    score: {
      homeScore: 4,
      awayScore: 3
    },
    date: "1996-04-03T19:00:00Z",
    competition: {
      name: "Premier League",
      logo: "https://media.api-sports.io/football/leagues/39.png"
    },
    stage: "Matchday 30",
    stadium: {
      name: "Anfield",
      city: "Liverpool",
      country: "England"
    },
    poster: "https://i2-prod.liverpoolecho.co.uk/incoming/article17056419.ece/ALTERNATES/s1200c/0_GettyImages-677731.jpg",
    highlights: "https://www.youtube.com/watch?v=3mzb5ZlTh2w"
  },
  {
    id: "m14",
    homeTeam: {
      name: "Manchester United",
      logo: "https://media.api-sports.io/football/teams/33.png",
      country: "England"
    },
    awayTeam: {
      name: "Manchester City",
      logo: "https://media.api-sports.io/football/teams/50.png",
      country: "England"
    },
    score: {
      homeScore: 4,
      awayScore: 3
    },
    date: "2009-09-20T15:30:00Z",
    competition: {
      name: "Premier League",
      logo: "https://media.api-sports.io/football/leagues/39.png"
    },
    stage: "Matchday 6",
    stadium: {
      name: "Old Trafford",
      city: "Manchester",
      country: "England"
    },
    poster: "https://i.guim.co.uk/img/static/sys-images/Sport/Pix/pictures/2009/9/20/1253464554169/Michael-Owen-scores-the-w-001.jpg?width=465&dpr=1&s=none",
    highlights: "https://www.youtube.com/watch?v=43FnCO1DKI0"
  },
  
  // New El Clásico humiliations where Barcelona thrashed Real Madrid
  {
    id: "m15",
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
      homeScore: 5,
      awayScore: 1
    },
    date: "2018-10-28T19:15:00Z",
    competition: {
      name: "La Liga",
      logo: "https://media.api-sports.io/football/leagues/140.png"
    },
    stage: "Matchday 10",
    stadium: {
      name: "Camp Nou",
      city: "Barcelona",
      country: "Spain"
    },
    poster: "https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt08d51c69c1d96ac2/60dd7b34f249d30efec860ad/53821191c0545a6924e6872659504f9170becc2b.jpg",
    highlights: "https://www.youtube.com/watch?v=PdHAGGVY74c"
  },
  {
    id: "m16",
    homeTeam: {
      name: "Real Madrid",
      logo: "https://media.api-sports.io/football/teams/541.png",
      country: "Spain"
    },
    awayTeam: {
      name: "Barcelona",
      logo: "https://media.api-sports.io/football/teams/529.png",
      country: "Spain"
    },
    score: {
      homeScore: 0,
      awayScore: 3
    },
    date: "2005-11-19T21:00:00Z",
    competition: {
      name: "La Liga",
      logo: "https://media.api-sports.io/football/leagues/140.png"
    },
    stage: "Matchday 12",
    stadium: {
      name: "Santiago Bernabéu",
      city: "Madrid",
      country: "Spain"
    },
    poster: "https://www.fcbarcelona.com/fcbarcelona/photo/2016/11/19/e6f3ef0c-30f5-49a9-9fe7-81ba504b51b7/33402627.jpg",
    highlights: "https://www.youtube.com/watch?v=eWx08lSDzMk"
  },
  {
    id: "m17",
    homeTeam: {
      name: "Real Madrid",
      logo: "https://media.api-sports.io/football/teams/541.png",
      country: "Spain"
    },
    awayTeam: {
      name: "Barcelona",
      logo: "https://media.api-sports.io/football/teams/529.png",
      country: "Spain"
    },
    score: {
      homeScore: 2,
      awayScore: 6
    },
    date: "2009-05-02T20:00:00Z",
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
    poster: "https://www.fcbarcelona.com/fcbarcelona/photo/2019/05/02/15b2c269-57b9-4ef3-af78-d4d0e07e8e14/mini_XAVIINIESTA.jpg",
    highlights: "https://www.youtube.com/watch?v=VPRAB0wFXpw"
  },
  {
    id: "m18",
    homeTeam: {
      name: "Real Madrid",
      logo: "https://media.api-sports.io/football/teams/541.png",
      country: "Spain"
    },
    awayTeam: {
      name: "Barcelona",
      logo: "https://media.api-sports.io/football/teams/529.png",
      country: "Spain"
    },
    score: {
      homeScore: 0,
      awayScore: 4
    },
    date: "2019-11-21T20:00:00Z",
    competition: {
      name: "La Liga",
      logo: "https://media.api-sports.io/football/leagues/140.png"
    },
    stage: "Matchday 18",
    stadium: {
      name: "Santiago Bernabéu",
      city: "Madrid",
      country: "Spain"
    },
    poster: "https://www.fcbarcelona.com/fcbarcelona/photo/2023/08/30/99d2d508-f927-43a2-9b0d-e4ba1bbc48d0/2019-12-18-REALMADRID-FCB-30.jpg",
    highlights: "https://www.youtube.com/watch?v=ZVJ1tUQQx3A"
  },
  
  // Additional World Cup matches
  {
    id: "m19",
    homeTeam: {
      name: "Italy",
      logo: "https://media.api-sports.io/football/teams/768.png",
      country: "Italy"
    },
    awayTeam: {
      name: "France",
      logo: "https://media.api-sports.io/football/teams/2.png",
      country: "France"
    },
    score: {
      homeScore: 1,
      awayScore: 1,
      extraTime: true,
      penalties: {
        homeScore: 5,
        awayScore: 3
      }
    },
    date: "2006-07-09T19:00:00Z",
    competition: {
      name: "FIFA World Cup",
      logo: "https://media.api-sports.io/football/leagues/1.png"
    },
    stage: "Final",
    stadium: {
      name: "Olympiastadion",
      city: "Berlin",
      country: "Germany"
    },
    poster: "https://editorial.uefa.com/resources/0278-15bacb5e4143-fba23213b6ac-1000/format/article-lead/the_headbutt_that_shook_the_world_at_germany_2006.jpeg",
    highlights: "https://www.youtube.com/watch?v=XilSm6vEK-I"
  },
  {
    id: "m20",
    homeTeam: {
      name: "Croatia",
      logo: "https://media.api-sports.io/football/teams/3.png",
      country: "Croatia"
    },
    awayTeam: {
      name: "England",
      logo: "https://media.api-sports.io/football/teams/10.png",
      country: "England"
    },
    score: {
      homeScore: 2,
      awayScore: 1,
      extraTime: true
    },
    date: "2018-07-11T19:00:00Z",
    competition: {
      name: "FIFA World Cup",
      logo: "https://media.api-sports.io/football/leagues/1.png"
    },
    stage: "Semi-final",
    stadium: {
      name: "Luzhniki Stadium",
      city: "Moscow",
      country: "Russia"
    },
    poster: "https://digitalhub.fifa.com/transform/94f8b2c0-a6e7-45d0-910b-ca1567a05fb1/FIFAWC2018-CRO-ENG-MatchHighlights-CRO-goals",
    highlights: "https://www.youtube.com/watch?v=13MiXOJ9nTY"
  },
  {
    id: "m21",
    homeTeam: {
      name: "Germany",
      logo: "https://media.api-sports.io/football/teams/25.png",
      country: "Germany"
    },
    awayTeam: {
      name: "Argentina",
      logo: "https://media.api-sports.io/football/teams/26.png",
      country: "Argentina"
    },
    score: {
      homeScore: 1,
      awayScore: 0,
      extraTime: true
    },
    date: "2014-07-13T20:00:00Z",
    competition: {
      name: "FIFA World Cup",
      logo: "https://media.api-sports.io/football/leagues/1.png"
    },
    stage: "Final",
    stadium: {
      name: "Maracanã Stadium",
      city: "Rio de Janeiro",
      country: "Brazil"
    },
    poster: "https://digitalhub.fifa.com/transform/8efa8a7c-15e5-4985-a7bd-67389ef8cc08/Argentina-v-Germany-2014-FIFA-World-Cup-Brazil-Final",
    highlights: "https://www.youtube.com/watch?v=GHehA_mJ4rk"
  },
  
  // Additional Premier League classics
  {
    id: "m22",
    homeTeam: {
      name: "Arsenal",
      logo: "https://media.api-sports.io/football/teams/42.png",
      country: "England"
    },
    awayTeam: {
      name: "Liverpool",
      logo: "https://media.api-sports.io/football/teams/40.png",
      country: "England"
    },
    score: {
      homeScore: 4,
      awayScore: 4
    },
    date: "2009-04-21T19:00:00Z",
    competition: {
      name: "Premier League",
      logo: "https://media.api-sports.io/football/leagues/39.png"
    },
    stage: "Matchday 34",
    stadium: {
      name: "Emirates Stadium",
      city: "London",
      country: "England"
    },
    poster: "https://i2-prod.liverpoolecho.co.uk/incoming/article6717562.ece/ALTERNATES/s810/GP72980327.jpg",
    highlights: "https://www.youtube.com/watch?v=CXMIX_Cvwh0"
  },
  {
    id: "m23",
    homeTeam: {
      name: "Manchester United",
      logo: "https://media.api-sports.io/football/teams/33.png",
      country: "England"
    },
    awayTeam: {
      name: "Arsenal",
      logo: "https://media.api-sports.io/football/teams/42.png",
      country: "England"
    },
    score: {
      homeScore: 8,
      awayScore: 2
    },
    date: "2011-08-28T15:00:00Z",
    competition: {
      name: "Premier League",
      logo: "https://media.api-sports.io/football/leagues/39.png"
    },
    stage: "Matchday 3",
    stadium: {
      name: "Old Trafford",
      city: "Manchester",
      country: "England"
    },
    poster: "https://i2-prod.manchestereveningnews.co.uk/incoming/article19276197.ece/ALTERNATES/s810/2_JS208104261.jpg",
    highlights: "https://www.youtube.com/watch?v=B7eNA35r8Hk"
  },
  {
    id: "m24",
    homeTeam: {
      name: "Tottenham Hotspur",
      logo: "https://media.api-sports.io/football/teams/47.png",
      country: "England"
    },
    awayTeam: {
      name: "Manchester United",
      logo: "https://media.api-sports.io/football/teams/33.png",
      country: "England"
    },
    score: {
      homeScore: 3,
      awayScore: 5
    },
    date: "2001-09-29T14:00:00Z",
    competition: {
      name: "Premier League",
      logo: "https://media.api-sports.io/football/leagues/39.png"
    },
    stage: "Matchday 7",
    stadium: {
      name: "White Hart Lane",
      city: "London",
      country: "England"
    },
    poster: "https://www.manutd.com/AssetPicker/images/0/0/16/231/1084066/GettyImages_514897201632870544064_large.jpg",
    highlights: "https://www.youtube.com/watch?v=3kQMjNla0SI"
  }
]);

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
