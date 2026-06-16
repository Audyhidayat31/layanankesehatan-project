'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, ShoppingCart, Filter, Pill, AlertCircle, CheckCircle } from 'lucide-react'
import { medicineCategories } from '@/lib/mock-data'
import { useCartStore, useAuthStore, useAppStore } from '@/lib/store'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

function PharmacyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuthStore()
  const { addItem, items } = useCartStore()
  const { medicines, getAppointmentsByPatient } = useAppStore()
  
  const patientId = user?.id === 'user-1' ? 'pat-1' : `pat-${user?.id}`
  const patientAppointments = user ? getAppointmentsByPatient(patientId) : []
  const hasPrescription = patientAppointments.some(apt => apt.status === 'completed' && apt.notes)
  
  const defaultSearch = searchParams.get('search') || ''
  const [searchQuery, setSearchQuery] = useState(defaultSearch)
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori')
  const [sortBy, setSortBy] = useState('name')

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredMedicines = useMemo(() => {
    let currentMedicines = [...medicines]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      currentMedicines = currentMedicines.filter(
        (med) =>
          med.name.toLowerCase().includes(query) ||
          med.genericName.toLowerCase().includes(query) ||
          med.category.toLowerCase().includes(query)
      )
    }

    if (selectedCategory !== 'Semua Kategori') {
      currentMedicines = currentMedicines.filter((med) => med.category === selectedCategory)
    }

    switch (sortBy) {
      case 'name':
        currentMedicines.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'price-low':
        currentMedicines.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        currentMedicines.sort((a, b) => b.price - a.price)
        break
    }

    return currentMedicines
  }, [searchQuery, selectedCategory, sortBy, medicines])

  const handleAddToCart = (medicine: typeof medicines[0]) => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    addItem(medicine)
  }

  const isInCart = (medicineId: string) => {
    return items.some((item) => item.medicine.id === medicineId)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">Apotek Online</h1>
            <p className="text-muted-foreground">
              Beli obat dan produk kesehatan dengan mudah dan aman
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari obat atau produk kesehatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {medicineCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nama A-Z</SelectItem>
                  <SelectItem value="price-low">Harga Terendah</SelectItem>
                  <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4 text-sm text-muted-foreground">
            Menampilkan {filteredMedicines.length} produk
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredMedicines.map((medicine) => (
              <Card key={medicine.id} className="group overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-primary/30">
                <div className="relative aspect-square bg-muted/50 overflow-hidden">
                  <div className="flex h-full items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    {medicine.image ? (
                      <img src={medicine.image} alt={medicine.name} className="h-full w-full object-cover" />
                    ) : (
                      <Pill className="h-16 w-16 text-muted-foreground/30 transition-colors duration-300 group-hover:text-primary/40" />
                    )}
                  </div>
                  {medicine.requiresPrescription && (
                    <Badge
                      variant="destructive"
                      className="absolute right-2 top-2 text-xs"
                    >
                      Resep
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="secondary" className="mb-2 text-xs transition-colors duration-300 group-hover:bg-secondary/80">
                      {medicine.category}
                    </Badge>
                    <h3 className="font-semibold text-foreground line-clamp-2 transition-colors duration-300 group-hover:text-primary">
                      {medicine.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{medicine.genericName}</p>
                  </div>

                  <p className="mb-3 text-xs text-muted-foreground line-clamp-2">
                    {medicine.description}
                  </p>

                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{medicine.unit}</span>
                    <span className={`text-xs ${medicine.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                      Stok: {medicine.stock}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(medicine.price)}
                    </span>
                  </div>

                  {medicine.requiresPrescription && !hasPrescription ? (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-destructive/10 p-2 text-xs text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      Memerlukan resep dokter
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {medicine.requiresPrescription && hasPrescription && (
                        <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-2 text-xs text-green-600">
                          <CheckCircle className="h-4 w-4 shrink-0" />
                          Resep otomatis terverifikasi
                        </div>
                      )}
                      <Button
                        className="w-full transition-all duration-300 hover:shadow-md group-hover:bg-primary/90"
                        variant={isInCart(medicine.id) ? 'secondary' : 'default'}
                        onClick={() => handleAddToCart(medicine)}
                        disabled={medicine.stock === 0}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {isInCart(medicine.id) ? 'Tambah Lagi' : 'Tambah ke Keranjang'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMedicines.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Pill className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium text-foreground">Produk tidak ditemukan</h3>
              <p className="text-muted-foreground">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function PharmacyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="text-center">
          <p className="text-muted-foreground">Memuat Apotek...</p>
        </div>
      </div>
    }>
      <PharmacyContent />
    </Suspense>
  )
}
