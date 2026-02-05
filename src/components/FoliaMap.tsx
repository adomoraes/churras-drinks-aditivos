"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet-defaulticon-compatibility"
import L from "leaflet"

// Ícone customizado para blocos "AO VIVO"
const liveIcon = new L.Icon({
	iconUrl:
		"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41],
})

export default function FoliaMap({ blocks }: { blocks: any[] }) {
	const center = { lat: -23.5505, lng: -46.6333 } // Centro de SP (conforme sua massa de dados)

	return (
		<div className='h-[400px] w-full rounded-3xl overflow-hidden shadow-inner border-4 border-white'>
			<MapContainer
				center={center}
				zoom={13}
				scrollWheelZoom={false}
				className='h-full w-full'>
				<TileLayer
					attribution='&copy; OpenStreetMap contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>

				{blocks.map((block) => {
					const isLive =
						new Date() >= new Date(block.start_time) &&
						new Date() <= new Date(block.end_time)

					return (
						<Marker
							key={block.id}
							position={[block.latitude, block.longitude]}
							icon={isLive ? liveIcon : new L.Icon.Default()}>
							<Popup>
								<div className='flex flex-col gap-2'>
									<strong className='text-orange-600'>{block.name}</strong>
									<span className='text-[10px] text-gray-500'>
										{block.location_name}
									</span>
									<button
										onClick={() =>
											(window.location.href = `/block/${block.id}`)
										}
										className='bg-orange-500 text-white text-[10px] py-1 rounded-lg font-bold'>
										VER DETALHES
									</button>
								</div>
							</Popup>
						</Marker>
					)
				})}
			</MapContainer>
		</div>
	)
}
