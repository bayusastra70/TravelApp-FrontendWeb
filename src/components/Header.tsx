"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { useState, useEffect } from "react"
import { getNotifications, getUnreadCount, markNotificationRead } from "../lib/api"

export default function Header(){

const [notifications,setNotifications] = useState<any[]>([])
const [count,setCount] = useState(0)
const [open,setOpen] = useState(false)

useEffect(()=>{
load()
},[])

async function load(){

const data = await getNotifications()
setNotifications(data)

const c = await getUnreadCount()
setCount(Number(c))

}

useEffect(()=>{

load()

const interval = setInterval(load,20000)

return ()=>clearInterval(interval)

},[])

useEffect(()=>{

function close(){
setOpen(false)
}

window.addEventListener("click",close)

return ()=>window.removeEventListener("click",close)

},[])

return(

<header className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white shadow sticky top-0 z-50">

<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

<Link
href="/"
className="text-xl font-bold"
>
PutuMertaSari Transport
</Link>

<nav className="flex items-center gap-6 text-sm">

<Link href="/" className="hover:opacity-80">
Home
</Link>

<Link href="/booking" className="hover:opacity-80">
Book Transport
</Link>

<Link href="#" className="hover:opacity-80">
Contact
</Link>

{/* Bell Notification */}

<div className="relative">

<button
onClick={(e)=>{
e.stopPropagation()
setOpen(!open)
}}
className="relative hover:opacity-80"
>
<Bell size={20}/>

{count>0 &&(

<span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
{count}
</span>

)}

</button>

{/* Dropdown */}

{open && (

<div
onClick={(e)=>e.stopPropagation()}

className="absolute right-0 mt-3 w-80 bg-white text-black rounded shadow-lg"
>
{notifications.length === 0 && (
<div className="p-4 text-sm text-gray-500">
No notifications
</div>
)}

{notifications.map((n)=>(
<div
key={n.id}
onClick={async()=>{

await markNotificationRead(n.id)

setNotifications(prev => {

const updated = prev.filter(x => x.id !== n.id)

if(updated.length === 0){
setOpen(false)
}

return updated

})

setCount(c => Math.max(c-1,0))

}}
className="p-3 border-b text-sm hover:bg-gray-100 cursor-pointer"
>

<p className="font-semibold">
{n.title}
</p>

<p className="text-gray-600 text-xs">
{n.message}
</p>

<p className="text-gray-400 text-[11px] mt-1">
{new Date(n.createdAt).toLocaleString()}
</p>

</div>
))}

</div>

)}

</div>

</nav>

</div>

</header>

)

}