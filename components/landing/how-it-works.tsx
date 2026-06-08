"use client"

import { useState } from 'react'
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
  const [activeStep, setActiveStep] = useState<number>(1)

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-20 text-center max-w-3xl mx-auto slide-up-fade">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">Alur Layanan</span>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Cara Kerja <span className="text-gradient">HealthServices</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Konsultasi kesehatan kini dalam genggaman. Hanya dengan 4 langkah sederhana, kesehatan Anda akan tertangani dengan baik.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connective Progress Line (Desktop) */}
          <div className="absolute left-[12.5%] right-[12.5%] md:top-[60px] h-1 bg-border/40 rounded-full hidden md:block overflow-hidden">
            <div 
              className="absolute h-full left-0 bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]"
              style={{ width: `${((activeStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid gap-12 md:gap-6 md:grid-cols-4 relative slide-up-fade stagger-2">
            {steps.map((item, index) => {
              const isActive = item.step <= activeStep

              return (
                <div 
                  key={item.step} 
                  className="group relative flex flex-col items-center text-center cursor-pointer"
                  onMouseEnter={() => setActiveStep(item.step)}
                  onClick={() => setActiveStep(item.step)}
                >
                  {/* Mobile line connection */}
                  {index !== steps.length - 1 && (
                    <div className="absolute top-[80px] bottom-[-48px] left-[50%] w-0.5 bg-border/40 -translate-x-1/2 md:hidden">
                      <div 
                        className={`absolute inset-0 bg-primary transition-all duration-500 origin-top ${
                          activeStep > item.step ? 'scale-y-100' : 'scale-y-0'
                        }`}
                      />
                    </div>
                  )}
                  
                  {/* Step Icon Wrapper */}
                  <div className={`relative z-10 mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-background border-4 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 ${
                    isActive 
                      ? 'border-primary/20 shadow-2xl shadow-primary/15 group-hover:shadow-primary/30' 
                      : 'border-background shadow-md shadow-muted-foreground/5'
                  }`}>
                    <div className={`absolute inset-0 rounded-3xl transition-colors ${
                      isActive ? 'bg-primary/10 group-hover:bg-primary/15' : 'bg-muted/50 group-hover:bg-muted'
                    }`} />
                    <item.icon className={`h-10 w-10 transition-transform duration-500 group-hover:scale-110 ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    
                    {/* Step Number Badge */}
                    <span className={`absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ring-4 ring-background transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${
                      isActive 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/40' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {item.step}
                    </span>
                  </div>
                  
                  {/* Step Content Card */}
                  <div className={`bg-card/50 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1 w-full max-w-[240px] ${
                    isActive ? 'border-primary/20 shadow-md' : 'border-border/40 shadow-sm'
                  }`}>
                    <h3 className={`mb-3 text-xl font-bold transition-colors duration-300 ${
                      isActive ? 'text-primary' : 'text-foreground'
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                      isActive ? 'text-muted-foreground' : 'text-muted-foreground/70'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

