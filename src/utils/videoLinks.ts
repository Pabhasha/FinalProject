
// Map of match IDs to working YouTube highlight links
export const highlightLinks: Record<string, string> = {
  'm1': 'https://www.youtube.com/watch?v=1dd2OMmIQ1U', // El Clasico 2023
  'm2': 'https://www.youtube.com/watch?v=3DnYIKJz-s8', // World Cup 2022 Final
  'm3': 'https://www.youtube.com/watch?v=c3FESkcHGOA', // Liverpool vs Man City
  'm4': 'https://www.youtube.com/watch?v=KafEXvporW4', // Arsenal vs Man Utd
  'm5': 'https://www.youtube.com/watch?v=wZ_hQuQCQ1k', // PSG vs Bayern
  'm6': 'https://www.youtube.com/watch?v=kdiAGGBEJFU', // Juventus vs Barcelona
  'm7': 'https://www.youtube.com/watch?v=gWGYin2tSJ8', // El Clasico 2011
  'm8': 'https://www.youtube.com/watch?v=2ealvrV5z9A', // Man Utd vs Liverpool
  'm9': 'https://www.youtube.com/watch?v=BbnZTlCgD3o', // World Cup 2018 Final
  'm10': 'https://www.youtube.com/watch?v=pC9qbm8CX3s', // Chelsea vs Man City
  // Add more matches as needed
};

// Function to get a working highlight link for a match
export const getWorkingHighlightLink = (matchId: string): string => {
  return highlightLinks[matchId] || '';
};

// Function to get a YouTube thumbnail from YouTube URL
export const getYouTubeThumbnail = (url: string): string => {
  if (!url) return '';
  
  // Extract video ID
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    // Use maxresdefault for highest quality, or 0 for a smaller thumbnail
    return `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`;
  }
  
  return '';
};
