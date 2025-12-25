// Popular destinations database with common misspellings and variations
// This acts as a local knowledge base for destination matching
export const destinationsDB = [
  {
    name: "Paris",
    country: "France",
    variations: ["paris", "pariis", "pariz", "parris", "pariss", "parise", "paries"]
  },
  {
    name: "Tokyo",
    country: "Japan",
    variations: ["tokyo", "tokio", "tokoyo", "tokiyo", "tokyio", "toquio", "tokyo"]
  },
  {
    name: "London",
    country: "United Kingdom",
    variations: ["london", "londan", "londin", "londun", "londn", "londen", "lundun"]
  },
  {
    name: "New York",
    country: "United States",
    variations: ["new york", "newyork", "ny", "nyc", "new yourk", "newyourk", "nu york"]
  },
  {
    name: "Dubai",
    country: "United Arab Emirates",
    variations: ["dubai", "dubay", "dubia", "dubi", "dubaii", "dubae", "doobai"]
  },
  {
    name: "Sydney",
    country: "Australia",
    variations: ["sydney", "sidny", "sidnay", "sydny", "cidney", "sydnee", "sydnie"]
  },
  {
    name: "Barcelona",
    country: "Spain",
    variations: ["barcelona", "barcellona", "barselona", "barcalona", "barcelon", "barselona"]
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    variations: ["amsterdam", "amstardam", "amstardm", "amsterdm", "amstredam", "amsterdamm"]
  },
  {
    name: "Rome",
    country: "Italy",
    variations: ["rome", "roma", "roome", "rom", "roam", "roem"]
  },
  {
    name: "Berlin",
    country: "Germany",
    variations: ["berlin", "berln", "berlin", "berline", "belin", "birlin"]
  },
  {
    name: "Prague",
    country: "Czech Republic",
    variations: ["prague", "prag", "praga", "praag", "pragua", "praque", "prauge"]
  },
  {
    name: "Vienna",
    country: "Austria",
    variations: ["vienna", "viena", "wein", "vien", "veinna", "vianna", "vieena"]
  },
  {
    name: "Bangkok",
    country: "Thailand",
    variations: ["bangkok", "bangcock", "bangkock", "bangok", "bankok", "bangkol"]
  },
  {
    name: "Istanbul",
    country: "Turkey",
    variations: ["istanbul", "istambul", "istanbol", "istanbull", "istambol", "constantinople"]
  },
  {
    name: "Cairo",
    country: "Egypt",
    variations: ["cairo", "cayro", "caeiro", "kairo", "cyro", "cario"]
  },
  {
    name: "Mumbai",
    country: "India",
    variations: ["mumbai", "bombay", "mumbay", "mumbae", "mumbaii", "mumby"]
  },
  {
    name: "Singapore",
    country: "Singapore",
    variations: ["singapore", "singapur", "singapoor", "singapoore", "singapre", "singpore"]
  },
  {
    name: "Los Angeles",
    country: "United States",
    variations: ["los angeles", "losangeles", "la", "los angelos", "los angelis", "l.a."]
  },
  {
    name: "Hong Kong",
    country: "China",
    variations: ["hong kong", "hongkong", "hk", "hong cong", "hong konk", "hongkong"]
  },
  {
    name: "Seoul",
    country: "South Korea",
    variations: ["seoul", "seul", "soeul", "seoul", "seole", "suel"]
  }
];

// Calculate Levenshtein distance between two strings
// This measures the minimum number of single-character edits (insertions, deletions or substitutions)
// required to change one word into the other
function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i += 1) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j += 1) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator, // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Calculate similarity score (0-1, where 1 is identical)
// Normalizes the Levenshtein distance based on the string length
function calculateSimilarity(str1, str2) {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - (distance / maxLength);
}

// Find the best matching destination
// Returns the best match, confidence score, and other suggestions
export function findBestMatch(query, threshold = 0.6) {
  const queryLower = query.toLowerCase().trim();
  let bestMatch = null;
  let bestScore = 0;
  const suggestions = [];

  for (const destination of destinationsDB) {
    // Check exact matches first
    if (destination.variations.includes(queryLower)) {
      return {
        destination: destination.name,
        confidence: 1.0,
        isExact: true,
        suggestions: []
      };
    }

    // Check fuzzy matches
    for (const variation of destination.variations) {
      const similarity = calculateSimilarity(queryLower, variation);
      
      if (similarity > bestScore) {
        bestScore = similarity;
        bestMatch = destination.name;
      }
      
      // Collect good suggestions
      if (similarity >= threshold && similarity < 1.0) {
        suggestions.push({
          name: destination.name,
          country: destination.country,
          similarity: similarity,
          matchedVariation: variation
        });
      }
    }
  }

  // Sort suggestions by similarity
  suggestions.sort((a, b) => b.similarity - a.similarity);
  
  // Remove duplicates
  const uniqueSuggestions = suggestions.filter((item, index, self) =>
    index === self.findIndex(t => t.name === item.name)
  ).slice(0, 3); // Limit to top 3 suggestions

  return {
    destination: bestMatch,
    confidence: bestScore,
    isExact: false,
    suggestions: uniqueSuggestions,
    hasGoodMatch: bestScore >= threshold
  };
}

// Get destination suggestions based on partial input
// Used for autocomplete functionality
export function getDestinationSuggestions(query, limit = 5) {
  const queryLower = query.toLowerCase().trim();
  
  if (queryLower.length < 2) return [];

  const suggestions = [];
  
  for (const destination of destinationsDB) {
    for (const variation of destination.variations) {
      if (variation.startsWith(queryLower) || variation.includes(queryLower)) {
        const similarity = calculateSimilarity(queryLower, variation);
        suggestions.push({
          name: destination.name,
          country: destination.country,
          similarity: similarity
        });
        break; // Only add each destination once
      }
    }
  }

  // Sort by similarity and remove duplicates
  const uniqueSuggestions = suggestions
    .filter((item, index, self) => index === self.findIndex(t => t.name === item.name))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return uniqueSuggestions;
}