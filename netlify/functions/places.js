exports.handler = async function(event) {
  const { lat, lon, radius, type } = event.queryStringParameters;
  const key = process.env.GOOGLE_PLACES_KEY;

  const typeMap = {
    padel: 'sports_complex',
    mosque: 'mosque',
    school: 'school',
    cafe: 'cafe',
    mall: 'shopping_mall',
    hospital: 'hospital',
    restaurant: 'restaurant',
    atm: 'atm'
  };

  const placeType = typeMap[type] || type;
  const url = `https://places.googleapis.com/v1/places:searchNearby`;

  const body = {
    includedTypes: [placeType],
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: { latitude: parseFloat(lat), longitude: parseFloat(lon) },
        radius: parseFloat(radius)
      }
    }
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'places.displayName,places.location'
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };
  } catch(e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
