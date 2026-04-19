'use client'
import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default marker icons broken by webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface Props {
  center?: [number, number]
  markers?: { id: number; name: string; lat: number; lng: number; isActive?: boolean }[]
  onMapClick?: (lat: number, lng: number) => void
  selectedId?: number
  onSelect?: (id: number) => void
  readOnly?: boolean
}

function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function LocationPickerMap({
  center = [44.8176, 20.4569],
  markers = [],
  onMapClick,
  selectedId,
  onSelect,
  readOnly = false,
}: Props) {
  useEffect(() => {}, []) // ensure client-only

  return (
    <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {!readOnly && onMapClick && <ClickHandler onMapClick={onMapClick} />}
      {markers.map(m => {
        const icon = L.divIcon({
          html: `<div style="
            background:${selectedId === m.id ? '#B68D40' : m.isActive === false ? '#9CA3AF' : '#1A120B'};
            color:#FAF8F6;font-size:11px;font-weight:600;
            padding:4px 8px;border-radius:4px;white-space:nowrap;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
          ">${m.name}</div>`,
          className: '',
          iconAnchor: [0, 0],
        })
        return (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={icon}
            eventHandlers={onSelect ? { click: () => onSelect(m.id) } : undefined}
          />
        )
      })}
    </MapContainer>
  )
}
