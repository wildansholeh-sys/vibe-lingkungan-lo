exports.handler = async function(event) {
  const { lat, lon, radius, type } = event.queryStringParameters;
  const key = process.env.GOOGLE_PLACES_KEY;

  if (!key) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'API key tidak ditemukan di environment variable' })
    };
  }

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

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'places.displayName,places.location'
    },
    body: JSON.stringify(body)
  });

  const text = await res.text();

  if (!res.ok) {
    return {
      statusCode: res.status,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: text })
    };
  }

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: text
  };
};
