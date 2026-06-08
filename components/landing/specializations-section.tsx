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
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-16 text-center max-w-3xl mx-auto slide-up-fade">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">Layanan Spesialis</span>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Temukan Dokter <span className="text-gradient">Spesialis</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Pilih spesialisasi sesuai kebutuhan kesehatan Anda dan temukan dokter terbaik yang siap melayani dengan sepenuh hati.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6 slide-up-fade stagger-1">
          {specializations.map((spec, index) => (
            <Link
              key={spec.slug}
              href={`/doctors?specialization=${spec.slug}`}
              className="group flex flex-col items-center gap-5 glass-card rounded-3xl p-8 text-center cursor-pointer relative overflow-hidden"
            >
              {/* Hover background glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent ${spec.bgColor.replace('10', '5')}`} />
              
              <div
                className={`relative flex h-20 w-20 items-center justify-center rounded-2xl ${spec.bgColor} transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 shadow-sm`}
              >
                <spec.icon className={`h-10 w-10 ${spec.color} transition-transform duration-500 group-hover:rotate-12`} />
              </div>
              
              <span className="font-semibold text-lg text-foreground transition-colors duration-300 group-hover:text-primary relative z-10">
                {spec.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center slide-up-fade stagger-2">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
          >
            Lihat semua spesialisasi
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">&#8594;</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
