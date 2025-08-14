import { VehicleData } from '../types/vehicle';

// Generate realistic mock data based on Indian vehicle registration patterns
export const generateMockData = (): VehicleData[] => {
  const data: VehicleData[] = [];
  const manufacturers = {
    '2W': ['Hero MotoCorp', 'Honda', 'TVS', 'Bajaj', 'Yamaha', 'Royal Enfield'],
    '3W': ['Bajaj Auto', 'Mahindra', 'TVS', 'Piaggio', 'Force Motors'],
    '4W': ['Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Mahindra', 'Honda Cars', 'Toyota', 'Kia']
  };
  
  const states = ['Maharashtra', 'Tamil Nadu', 'Karnataka', 'Gujarat', 'Uttar Pradesh', 'Delhi', 'West Bengal'];
  const vehicleClasses = {
    '2W': ['MOTORCYCLE', 'SCOOTER', 'MOPED'],
    '3W': ['AUTO RICKSHAW', '3W GOODS VEHICLE', 'E-RICKSHAW'],
    '4W': ['MOTOR CAR', 'SUV', 'COMMERCIAL VEHICLE', 'BUS']
  };

  // Generate data for last 3 years with seasonal patterns
  for (let year = 2022; year <= 2024; year++) {
    for (let month = 1; month <= 12; month++) {
      for (let category of ['2W', '3W', '4W'] as const) {
        for (let manufacturer of manufacturers[category]) {
          for (let state of states) {
            // Seasonal multiplier - higher sales in Q3 and Q4 (festival season)
            const seasonalMultiplier = month >= 7 && month <= 12 ? 1.3 : 0.9;
            
            // Base registrations with realistic proportions
            const baseRegistrations = {
              '2W': Math.floor(Math.random() * 15000 + 5000),
              '3W': Math.floor(Math.random() * 2000 + 500),
              '4W': Math.floor(Math.random() * 8000 + 2000)
            };

            // Market share adjustments
            const marketShareMultiplier = manufacturer.includes('Hero') || manufacturer.includes('Maruti') ? 1.4 : 
                                        manufacturer.includes('Honda') || manufacturer.includes('Hyundai') ? 1.2 : 1.0;

            const registrations = Math.floor(
              baseRegistrations[category] * seasonalMultiplier * marketShareMultiplier * 
              (year === 2024 ? 1.15 : year === 2023 ? 1.08 : 1.0) // YoY growth
            );

            const quarter = `Q${Math.ceil(month / 3)}`;
            const date = `${year}-${month.toString().padStart(2, '0')}-01`;

            data.push({
              id: `${date}-${category}-${manufacturer}-${state}`,
              date,
              vehicleCategory: category,
              vehicleClass: vehicleClasses[category][Math.floor(Math.random() * vehicleClasses[category].length)],
              manufacturer,
              state,
              rto: `${state.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 99 + 1).toString().padStart(2, '0')}`,
              registrations,
              quarter: `${year}-${quarter}`,
              year
            });
          }
        }
      }
    }
  }

  return data;
};

export const mockData = generateMockData();