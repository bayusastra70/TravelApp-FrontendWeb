"use client"

import { useState } from "react"

const API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY

export default function LocationAutocomplete({
placeholder,
value,
onChange,
onSelect
}:any){

const [results,setResults] = useState<any[]>([])

const searchLocation = async(q:string)=>{

onChange(q)

if(q.length < 3){
setResults([])
return
}

const res = await fetch(
`https://us1.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${encodeURIComponent(q)}&limit=5&dedupe=1&countrycodes=id&viewbox=114.4,-8.9,115.8,-8.1&bounded=1`
)

const data = await res.json()

setResults(data)

}

return(

<div className="relative">

<input
value={value}
onChange={(e)=>searchLocation(e.target.value)}
placeholder={placeholder}
className="w-full border rounded-lg p-3"
/>

{results.length > 0 &&(

<div className="absolute bg-white border w-full mt-1 rounded-lg shadow z-50 max-h-60 overflow-y-auto">

{results.map((place:any,i)=>(
<div
key={i}
className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
onClick={()=>{

onSelect({
name:place.display_name,
lat:parseFloat(place.lat),
lng:parseFloat(place.lon)
})

setResults([])

}}
>
📍 {place.display_name}
</div>
))}

</div>

)}

</div>

)

}