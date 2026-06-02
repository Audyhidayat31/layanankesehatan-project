'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Pill,
  Package,
  Filter,
} from 'lucide-react'
import { medicineCategories } from '@/lib/mock-data'
import type { Medicine } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function PharmacyProductsPage() {
  const { medicines: products, addMedicine, updateMedicine, deleteMedicine } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Medicine | null>(null)
  const [productToDelete, setProductToDelete] = useState<Medicine | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    unit: '',
    requiresPrescription: false,
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.genericName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const resetForm = () => {
    setFormData({
      name: '',
      genericName: '',
      description: '',
      category: '',
      price: '',
      stock: '',
      unit: '',
      requiresPrescription: false,
    })
    setEditingProduct(null)
  }

  const handleEdit = (product: Medicine) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      genericName: product.genericName,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      unit: product.unit,
      requiresPrescription: product.requiresPrescription,
    })
    setAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteMedicine(id)
    toast.success('Produk berhasil dihapus!')
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Mohon lengkapi data produk yang wajib diisi!')
      return
    }

    if (editingProduct) {
      updateMedicine(editingProduct.id, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      })
      toast.success('Produk berhasil diperbarui!')
    } else {
      const newProduct: Medicine = {
        id: `med-${Date.now()}`,
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        pharmacyId: 'pharm-1',
      }
      addMedicine(newProduct)
      toast.success('Produk baru berhasil ditambahkan!')
    }
    setAddDialogOpen(false)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar role="pharmacy" />
      <DashboardHeader role="pharmacy" />
      
      <main className="lg:pl-64">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Kelola Produk</h1>
              <p className="text-muted-foreground">
                Tambah, edit, dan kelola produk obat Anda
              </p>
            </div>
            <Dialog open={addDialogOpen} onOpenChange={(open) => {
              setAddDialogOpen(open)
              if (!open) resetForm()
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Produk
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingProduct
                      ? 'Edit informasi produk'
                      : 'Masukkan informasi produk baru'}
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto space-y-4 py-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="name">Nama Produk <span className="text-destructive">*</span></FieldLabel>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Contoh: Paracetamol 500mg"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="genericName">Nama Generik</FieldLabel>
                      <Input
                        id="genericName"
                        value={formData.genericName}
                        onChange={(e) =>
                          setFormData({ ...formData, genericName: e.target.value })
                        }
                        placeholder="Contoh: Paracetamol"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        placeholder="Deskripsi produk..."
                        rows={2}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Kategori</FieldLabel>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {medicineCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="price">Harga (Rp) <span className="text-destructive">*</span></FieldLabel>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          placeholder="15000"
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="stock">Stok <span className="text-destructive">*</span></FieldLabel>
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={(e) =>
                            setFormData({ ...formData, stock: e.target.value })
                          }
                          placeholder="100"
                        />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel htmlFor="unit">Satuan</FieldLabel>
                      <Input
                        id="unit"
                        value={formData.unit}
                        onChange={(e) =>
                          setFormData({ ...formData, unit: e.target.value })
                        }
                        placeholder="Contoh: Strip (10 tablet)"
                      />
                    </Field>
                    <div className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium text-foreground">Memerlukan Resep</p>
                        <p className="text-sm text-muted-foreground">
                          Produk hanya bisa dibeli dengan resep dokter
                        </p>
                      </div>
                      <Switch
                        checked={formData.requiresPrescription}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, requiresPrescription: checked })
                        }
                      />
                    </div>
                  </FieldGroup>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAddDialogOpen(false)
                      resetForm()
                    }}
                  >
                    Batal
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="mb-6">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {medicineCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Pill className="h-5 w-5 text-muted-foreground/50" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.genericName}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          product.stock < 20
                            ? 'font-medium text-destructive'
                            : 'text-foreground'
                        }
                      >
                        {product.stock} {product.unit.split(' ')[0]}
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.requiresPrescription ? (
                        <Badge variant="destructive">Resep</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Bebas
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setProductToDelete(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>

      {/* AlertDialog Konfirmasi Hapus */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus produk <strong>{productToDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan dan produk tidak akan lagi terlihat oleh pasien.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (productToDelete) {
                  handleDelete(productToDelete.id)
                  setProductToDelete(null)
                }
              }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
