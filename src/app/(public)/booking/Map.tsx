"use client"

import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet"
import { useEffect } from "react"

function FitBounds({pickup,destination}:any){

const map = useMap()

useEffect(()=>{

if(pickup && destination){

map.fitBounds([
[pickup.lat,pickup.lng],
[destination.lat,destination.lng]
])

}

},[pickup,destination,map])

return null

}

export default function Map({pickup,destination,route}:any){

if(!pickup) return null

return(

<div className="h-[420px] rounded-xl overflow-hidden">

<MapContainer
center={[pickup.lat,pickup.lng]}
zoom={13}
className="h-full w-full"
>

<TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
attribution="&copy; OpenStreetMap"
/>

<Marker position={[pickup.lat,pickup.lng]}/>

{destination &&(
<Marker position={[destination.lat,destination.lng]}/>
)}

{route &&(
<Polyline positions={route} color="purple"/>
)}

<FitBounds pickup={pickup} destination={destination}/>

</MapContainer>

</div>

)

}