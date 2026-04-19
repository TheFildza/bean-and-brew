'use client'
import dynamic from 'next/dynamic'
import { useState, useRef } from 'react'
import { Trash2, ToggleLeft, ToggleRight, MapPin, Search } from 'lucide-react'
import { createLocationAction, deleteLocationAction, toggleLocationAction } from './actions'

const Map = dynamic(() => import('@/components/LocationPickerMap'), { ssr: false })

interface Location {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  is_active: boolean
}

interface Props {
  locations: Location[]
}

export function AdminLocationControls({ locations }: Props) {
  const [pending, setPending] = useState(false)
  const [newPin, setNewPin] = useState<{ lat: number; lng: number } | null>(null)
  const [form, setForm] = useState({ name: '', address: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([44.8176, 20.4569])
  const [mapZoom, setMapZoom] = useState(12)
  const searchRef = useRef<HTMLInputElement>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
      )
      const data = await res.json()
      if (data.length > 0) {
        setMapCenter([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        setMapZoom(14)
      }
    } finally {
      setSearching(false)
    }
  }

  function handleMapClick(lat: number, lng: number) {
    setNewPin({ lat, lng })
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newPin || !form.name || !form.address) return
    setPending(true)
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('address', form.address)
    fd.append('lat', String(newPin.lat))
    fd.append('lng', String(newPin.lng))
    await createLocationAction(fd)
    setNewPin(null)
    setForm({ name: '', address: '' })
    setPending(false)
  }

  const mapMarkers = [
    ...locations.map(l => ({ id: l.id, name: l.name, lat: Number(l.lat), lng: Number(l.lng), isActive: l.is_active })),
    ...(newPin ? [{ id: -1, name: '+ New', lat: newPin.lat, lng: newPin.lng }] : []),
  ]

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3C2A21]/40" />
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search address, area or landmark..."
            className="w-full pl-9 pr-4 py-2 border border-[#3C2A21]/30 rounded text-sm text-[#1A120B] bg-white placeholder-[#3C2A21]/40 focus:outline-none focus:border-[#1A120B]"
          />
        </div>
        <button
          type="submit"
          disabled={searching}
          className="px-4 py-2 bg-[#1A120B] text-[#FAF8F6] rounded text-sm font-medium hover:bg-[#3C2A21] transition-colors disabled:opacity-50"
        >
          {searching ? '...' : 'Go'}
        </button>
      </form>

      <div className="rounded-lg overflow-hidden border border-[#3C2A21]/10 w-full" style={{ height: 'calc(100vh - 280px)', minHeight: 400 }}>
        <Map
          center={mapCenter}
          zoom={mapZoom}
          markers={mapMarkers}
          onMapClick={handleMapClick}
        />
      </div>

      <p className="text-xs text-[#3C2A21]/50">Click on the map to place a new location pin.</p>

      {newPin && (
        <form onSubmit={handleCreate} className="bg-white border border-[#B68D40]/40 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-[#1A120B] flex items-center gap-2">
            <MapPin size={14} className="text-[#B68D40]" />
            New location at {newPin.lat.toFixed(4)}, {newPin.lng.toFixed(4)}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Name (e.g. Zemun Market)"
              required
              className="border border-[#3C2A21]/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1A120B]"
            />
            <input
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="Full address"
              required
              className="border border-[#3C2A21]/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#1A120B]"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="flex-1 bg-[#1A120B] text-[#FAF8F6] py-2 rounded text-sm font-medium hover:bg-[#3C2A21] transition-colors disabled:opacity-50">
              {pending ? 'Saving...' : 'Save Location'}
            </button>
            <button type="button" onClick={() => setNewPin(null)} className="px-4 py-2 rounded text-sm border border-[#3C2A21]/20 hover:bg-[#3C2A21]/5 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {locations.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-[#3C2A21]">All Locations ({locations.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {locations.map(loc => (
              <div key={loc.id} className="flex items-center justify-between bg-white border border-[#3C2A21]/10 rounded-lg px-4 py-3">
                <div className="min-w-0 mr-3">
                  <p className="font-medium text-sm text-[#1A120B] truncate">{loc.name}</p>
                  <p className="text-xs text-[#3C2A21]/60 truncate">{loc.address}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <form action={async () => { await toggleLocationAction(loc.id, !loc.is_active) }}>
                    <button type="submit" className="text-[#3C2A21]/40 hover:text-[#1A120B] transition-colors">
                      {loc.is_active ? <ToggleRight size={20} className="text-[#B68D40]" /> : <ToggleLeft size={20} />}
                    </button>
                  </form>
                  <form action={async () => { await deleteLocationAction(loc.id) }}>
                    <button type="submit" className="text-[#3C2A21]/40 hover:text-red-600 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
