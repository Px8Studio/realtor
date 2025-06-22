export const geocodeAddress = async (address) => {
  try {
    const apiKey = process.env.REACT_APP_GEOCODE_API_KEY;
    
    // Optimize for Netherlands searches
    const region = 'NL'; // Netherlands country code
    const bounds = '50.7503,3.3792|53.5556,7.2275'; // Netherlands bounding box
    
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&region=${region}&bounds=${bounds}&key=${apiKey}`;
    
    console.log('🇳🇱 Geocoding for Netherlands:', address);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      
      // Validate result is in Netherlands
      const isInNetherlands = result.address_components.some(
        component => component.types.includes('country') && 
        component.short_name === 'NL'
      );
      
      if (!isInNetherlands) {
        console.warn('⚠️ Address not in Netherlands:', address);
      }
      
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formattedAddress: result.formatted_address,
        country: isInNetherlands ? 'NL' : 'unknown'
      };
    }
    
    throw new Error(`Geocoding failed: ${data.status}`);
    
  } catch (error) {
    console.error('❌ Netherlands geocoding error:', error);
    throw error;
  }
};
