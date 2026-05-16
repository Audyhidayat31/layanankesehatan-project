import Link from 'next/link'
import {
  Stethoscope,
  Heart,
  Baby,
  Eye,
  Brain,
  Bone,
  Smile,
  Ear,
  LucideIcon,
} from 'lucide-react'

interface Specialization {
  name: string
  icon: LucideIcon
  color: string
  bgColor: string
  slug: string
}

const specializations: Specialization[] = [
  {
    name: 'Dokter Umum',
    icon: Stethoscope,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    slug: 'dokter-umum',
  },
  {
    name: 'Spesialis Jantung',
    icon: Heart,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    slug: 'spesialis-jantung',
  },
  {
    name: 'Spesialis Anak',
    icon: Baby,
    color: 'text-chart-3',
    bgColor: 'bg-chart-3/10',
    slug: 'spesialis-anak',
  },
  {
    name: 'Spesialis Mata',
    icon: Eye,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    slug: 'spesialis-mata',
  },
  {
    name: 'Spesialis Saraf',
    icon: Brain,
    color: 'text-chart-4',
    bgColor: 'bg-chart-4/10',
    slug: 'spesialis-saraf',
  },
  {
    name: 'Spesialis Bedah',
    icon: Bone,
    color: 'text-chart-5',
    bgColor: 'bg-chart-5/10',
    slug: 'spesialis-bedah',
  },
  {
    name: 'Dokter Gigi',
    icon: Smile,
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
    slug: 'dokter-gigi',
  },
  {
    name: 'Spesialis THT',
    icon: Ear,
    color: 'text-chart-1',
    bgColor: 'bg-chart-1/10',
    slug: 'spesialis-tht',
  },
]

export function SpecializationsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Temukan Dokter Spesialis
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Pilih spesialisasi sesuai kebutuhan kesehatan Anda dan temukan dokter terbaik
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {specializations.map((spec) => (
            <Link
              key={spec.slug}
              href={`/doctors?specialization=${spec.slug}`}
              className="group flex flex-col items-center gap-4 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-lg hover:bg-card cursor-pointer"
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${spec.bgColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
              >
                <spec.icon className={`h-8 w-8 ${spec.color}`} />
              </div>
              <span className="font-medium text-foreground transition-colors duration-300 group-hover:text-primary">{spec.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Lihat semua spesialisasi
            <span aria-hidden="true">&#8594;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
