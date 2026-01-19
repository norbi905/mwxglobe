export async function searchPlace(query) {
  if (!query) return null

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`

  const res = await fetch(url, {
    headers: {
      "User-Agent": "globe-maplibre-demo"
    }
  })

  const data = await res.json()
  if (!data.length) return null

  return [
    parseFloat(data[0].lon),
    parseFloat(data[0].lat)
  ]
}
