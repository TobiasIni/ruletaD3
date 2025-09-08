import { RouletteConfig, WheelConfiguration, Prize, ApiPrize, SpinResponse } from '@/types';

const API_BASE_URL = 'https://api-cmsd3.emanzano.com';

export async function fetchRouletteConfig(ruletaId: number = 5): Promise<RouletteConfig> {
  try {
    const response = await fetch(`${API_BASE_URL}/ruletas/${ruletaId}/config`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: RouletteConfig = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching roulette configuration:', error);
    throw error;
  }
}

export function transformApiDataToWheelConfig(apiData: RouletteConfig): WheelConfiguration {
  // Transform API prizes to local Prize format
  const apiPrizes: Prize[] = apiData.premios
    .filter(prize => prize.activo) // Only active prizes
    .sort((a, b) => a.id - b.id) // Sort by ID to ensure consistent order
    .map((apiPrize: ApiPrize, index: number) => ({
      id: apiPrize.id.toString(),
      text: apiPrize.nombre,
      color: '', // Will be assigned from company colors
      probability: apiPrize.probabilidad,
      positive: apiPrize.positive,
    }));

  console.log('📊 API prizes after sorting:', apiPrizes.map(p => ({ id: p.id, text: p.text })));

  // Ensure we always have exactly 8 prizes by repeating them
  const targetPrizeCount = 8;
  const finalPrizes: Prize[] = [];
  
  if (apiPrizes.length === 0) {
    // If no prizes from API, create default ones
    for (let i = 0; i < targetPrizeCount; i++) {
      finalPrizes.push({
        id: `default-${i}`,
        text: 'Premio',
        color: '',
        probability: 100 / targetPrizeCount,
      });
    }
  } else {
    // Repeat prizes until we have exactly 8
    for (let i = 0; i < targetPrizeCount; i++) {
      const sourcePrize = apiPrizes[i % apiPrizes.length];
      finalPrizes.push({
        ...sourcePrize,
        id: `${sourcePrize.id}-${i}`, // Make sure each has a unique ID
      });
    }
  }

  // Create color array from company colors
  const colors = [
    apiData.company.color_primario,
    apiData.company.color_secundario,
    apiData.company.color_terciario,
  ];

  // Assign colors to prizes in a cycling pattern
  finalPrizes.forEach((prize, index) => {
    prize.color = colors[index % colors.length];
  });

  console.log('🎮 Final wheel configuration:', {
    totalPrizes: finalPrizes.length,
    prizeOrder: finalPrizes.map((p, i) => ({ index: i, id: p.id, text: p.text })),
    colors: colors
  });

  return {
    colors,
    logo: apiData.company.logo,
    prizes: finalPrizes,
  };
}

export async function getWheelConfiguration(ruletaId: number = 1): Promise<WheelConfiguration> {
  const apiData = await fetchRouletteConfig(ruletaId);
  return transformApiDataToWheelConfig(apiData);
}

export async function spinRoulette(ruletaId: number = 1): Promise<SpinResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/ruletas/${ruletaId}/spin`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
      },
      body: '',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SpinResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error spinning roulette:', error);
    throw error;
  }
}

export function findPrizeIndexById(prizes: Prize[], apiPrizeId: number): number {
  console.log('🎯 Finding prize index for API ID:', apiPrizeId);
  console.log('🎲 Available prizes:', prizes.map(p => ({ id: p.id, text: p.text })));
  
  // Find all matching indices (since we duplicate prizes to always have 8)
  const matchingIndices: number[] = [];
  
  prizes.forEach((prize, index) => {
    // Extract the original ID from the duplicated prize ID format "originalId-index"
    const originalId = prize.id.split('-')[0];
    const parsedId = parseInt(originalId);
    
    if (parsedId === apiPrizeId) {
      matchingIndices.push(index);
    }
  });
  
  console.log('🎯 Matching indices found:', matchingIndices);
  
  if (matchingIndices.length === 0) {
    console.error('❌ No matching prize found for ID:', apiPrizeId);
    return 0; // Default to first prize if not found
  }
  
  // For better visual distribution, we can choose a random matching index
  // or always use the first one for consistency
  const selectedIndex = matchingIndices[0]; // Use first match for consistency
  
  console.log('✅ Selected prize index:', selectedIndex, 'Prize:', prizes[selectedIndex]);
  return selectedIndex;
}

export function findPrizeByApiResponse(prizes: Prize[], apiPrize: ApiPrize): { index: number; prize: Prize } {
  console.log('🔍 Finding exact prize match for:', { id: apiPrize.id, name: apiPrize.nombre });
  
  const index = findPrizeIndexById(prizes, apiPrize.id);
  const prize = prizes[index];
  
  // Verify the match is correct
  const originalId = parseInt(prize.id.split('-')[0]);
  if (originalId !== apiPrize.id) {
    console.error('❌ Prize mismatch! Expected ID:', apiPrize.id, 'Got ID:', originalId);
  } else {
    console.log('✅ Perfect match found!', { 
      visualIndex: index, 
      prizeText: prize.text, 
      apiText: apiPrize.nombre 
    });
  }
  
  return { index, prize };
}
