import { Search, Calendar, MessageSquare, FileCheck } from 'lucide-react'

const steps = [
  {
    step: 1,
    title: 'Cari Dokter',
    description: 'Temukan dokter sesuai spesialisasi dan kebutuhan Anda',
    icon: Search,
  },
  {
    step: 2,
    title: 'Buat Janji',
    description: 'Pilih jadwal konsultasi yang tersedia sesuai waktu Anda',
    icon: Calendar,
  },
  {
    step: 3,
    title: 'Konsultasi',
    description: 'Konsultasi online via chat atau video call dengan dokter',
    icon: MessageSquare,
  },
  {
    step: 4,
    title: 'Dapatkan Resep',
    description: 'Terima resep digital dan pesan obat langsung ke rumah',
    icon: FileCheck,
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Cara Kerja MedCare
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Konsultasi kesehatan jadi lebih mudah dengan 4 langkah sederhana
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-1/2 hidden h-0.5 w-full -translate-y-1/2 bg-border lg:block" />
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <div key={item.step} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-primary shadow-lg">
                  <item.icon className="h-8 w-8 text-primary-foreground" />
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                    {item.step}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
