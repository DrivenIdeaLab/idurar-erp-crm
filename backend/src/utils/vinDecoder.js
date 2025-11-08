const axios = require('axios');

/**
 * Decode VIN using NHTSA API
 * @param {string} vin - Vehicle Identification Number (17 characters)
 * @returns {Promise<Object>} - Decoded vehicle information
 */
async function decodeVIN(vin) {
  try {
    // Validate VIN format
    if (!vin || typeof vin !== 'string') {
      throw new Error('VIN must be a string');
    }

    const cleanVIN = vin.trim().toUpperCase();

    if (cleanVIN.length !== 17) {
      throw new Error('VIN must be exactly 17 characters');
    }

    // VIN cannot contain I, O, or Q
    if (/[IOQ]/.test(cleanVIN)) {
      throw new Error('VIN cannot contain the letters I, O, or Q');
    }

    // Call NHTSA VIN Decoder API
    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${cleanVIN}?format=json`;

    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
    });

    if (!response.data || !response.data.Results) {
      throw new Error('Invalid response from VIN decoder API');
    }

    const results = response.data.Results;

    // Helper function to find value from results
    const findValue = (variableName) => {
      const item = results.find((r) => r.Variable === variableName);
      return item?.Value || null;
    };

    // Extract and structure the data
    const decodedData = {
      // Basic Info
      year: parseInt(findValue('Model Year')) || null,
      make: findValue('Make') || null,
      model: findValue('Model') || null,
      trim: findValue('Trim') || null,

      // Engine & Transmission
      engine: findValue('Engine Model') || null,
      engineCylinders: parseInt(findValue('Engine Number of Cylinders')) || null,
      engineDisplacement: findValue('Displacement (L)') || null,
      transmission: findValue('Transmission Style') || null,
      fuelType: normalizeFuelType(findValue('Fuel Type - Primary')),

      // Manufacturing
      manufacturer: findValue('Manufacturer Name') || null,
      plantCountry: findValue('Plant Country') || null,
      plantCity: findValue('Plant City') || null,

      // Vehicle Specs
      vehicleType: findValue('Vehicle Type') || null,
      bodyClass: findValue('Body Class') || null,
      doors: parseInt(findValue('Doors')) || null,
      driveType: findValue('Drive Type') || null,
      abs: findValue('ABS') || null,
      standardSeating: parseInt(findValue('Seating Rows')) || null,

      // Additional Data
      vinDecodeData: {
        errorCode: findValue('Error Code'),
        errorText: findValue('Error Text'),
        possibleValues: findValue('Possible Values'),
        additionalErrorText: findValue('Additional Error Text'),
      },
    };

    // Check for decode errors
    const errorCode = findValue('Error Code');
    if (errorCode && errorCode !== '0') {
      const errorText = findValue('Error Text') || 'Unknown error';
      const additionalError = findValue('Additional Error Text');
      throw new Error(
        `VIN decode error: ${errorText}${additionalError ? ' - ' + additionalError : ''}`
      );
    }

    return {
      success: true,
      vin: cleanVIN,
      data: decodedData,
    };
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // API returned an error response
      throw new Error(`VIN decoder API error: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('VIN decoder API is not responding. Please try again later.');
    } else if (error.message.includes('VIN')) {
      // Our custom VIN validation errors
      throw error;
    } else {
      // Other errors
      throw new Error(`VIN decode failed: ${error.message}`);
    }
  }
}

/**
 * Normalize fuel type to match our enum
 * @param {string} fuelType - Fuel type from NHTSA
 * @returns {string} - Normalized fuel type
 */
function normalizeFuelType(fuelType) {
  if (!fuelType) return null;

  const lower = fuelType.toLowerCase();

  if (lower.includes('gasoline') || lower.includes('gas')) return 'gasoline';
  if (lower.includes('diesel')) return 'diesel';
  if (lower.includes('electric') || lower.includes('battery')) return 'electric';
  if (lower.includes('hybrid')) return 'hybrid';

  return 'other';
}

/**
 * Validate VIN checksum (9th digit)
 * @param {string} vin - Vehicle Identification Number
 * @returns {boolean} - Whether VIN checksum is valid
 */
function validateVINChecksum(vin) {
  if (!vin || vin.length !== 17) return false;

  const weights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
  const transliteration = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
    S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
  };

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin[i];
    const value = isNaN(char) ? transliteration[char] : parseInt(char);
    sum += value * weights[i];
  }

  const checkDigit = sum % 11;
  const ninthChar = vin[8];

  if (checkDigit === 10) {
    return ninthChar === 'X';
  }

  return checkDigit === parseInt(ninthChar);
}

module.exports = {
  decodeVIN,
  validateVINChecksum,
  normalizeFuelType,
};
