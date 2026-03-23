const API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY

export const geocode = async (query: string) => {

  try{

    const res = await fetch(
    `https://us1.locationiq.com/v1/search?key=${API_KEY}&q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=id&viewbox=114.4,-8.9,115.8,-8.1&bounded=1`
    )

    const data = await res.json()

    if(!data || data.length === 0) return null

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      name: data[0].display_name
    }

  }catch{
    return null
  }

}