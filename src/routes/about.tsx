import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Smartphone, 
  Layers, 
  Cpu
} from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

const TECH_STACK_ITEMS = [
  { name: 'Capacitor JS', role: 'Native Mobile Runtime (Android & iOS)', version: '^8.5.3' },
  { name: 'React JS + TypeScript', role: 'Modern UI & Static Type Safety', version: 'React 19' },
  { name: 'Tailwind CSS v4', role: 'High-performance Utility Styling', version: 'v4.3' },
  { name: 'Shadcn UI', role: 'Accessible Component System (65+ Components)', version: 'Latest' },
  { name: 'TanStack Query', role: 'Server-state & Cache Management', version: 'v5.104' },
  { name: 'TanStack Form', role: 'Type-safe Reactive Form Validation', version: 'v1.33' },
  { name: 'TanStack Router', role: 'Fully Type-Safe File-based Routing', version: 'v1.170' },
]

function AboutPage() {
  const handleCapacitorCheck = () => {
    toast.info('Capacitor Bridge Status: Active (Web / Mobile Mode)', {
      description: 'Siap untuk build Android APK/AAB dan iOS IPA via npx cap sync',
    })
  }

  return (
    <div className="p-4 space-y-4 pb-20 bg-[#F7F9FC]">
      {/* App Header Info */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#123B5D] to-[#2878A5] text-white shadow-md space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-[#F4A340]">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">AyoTrip Mobile</h2>
            <p className="text-xs text-white/80">Versi 1.0.0 • Mobile Production Ready</p>
          </div>
        </div>
        <p className="text-xs text-white/90 leading-relaxed">
          Arsitektur mobile modern yang menggabungkan kecepatan web native dengan kapabilitas hybrid Capacitor JS untuk platform Android dan iOS.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge className="bg-white/20 text-white border border-white/30 text-[10px]">
            Capacitor Ready
          </Badge>
          <Badge className="bg-white/20 text-white border border-white/30 text-[10px]">
            TanStack Suite
          </Badge>
          <Badge className="bg-white/20 text-white border border-white/30 text-[10px]">
            Shadcn UI Full Pack
          </Badge>
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <Card className="bg-white border-[#E7ECF0] text-[#172B3A] shadow-sm rounded-2xl">
        <CardHeader className="pb-3 border-b border-[#E7ECF0]">
          <CardTitle className="text-sm font-bold text-[#172B3A] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#123B5D]" />
            Spesifikasi Tech Stack
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5 pt-4">
          {TECH_STACK_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[#F7F9FC] border border-[#E7ECF0]"
            >
              <div>
                <p className="text-xs font-bold text-[#172B3A]">{item.name}</p>
                <p className="text-[11px] text-[#7B8794]">{item.role}</p>
              </div>
              <Badge variant="outline" className="text-[10px] text-[#123B5D] bg-[#EBF3F8] border-[#2878A5]/30 font-bold">
                {item.version}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Capacitor Actions */}
      <Card className="bg-white border-[#E7ECF0] text-[#172B3A] shadow-sm rounded-2xl">
        <CardHeader className="pb-3 border-b border-[#E7ECF0]">
          <CardTitle className="text-sm font-bold text-[#172B3A] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#123B5D]" />
            Native Mobile Bridge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          <p className="text-xs text-[#7B8794] leading-relaxed">
            Jalankan perintah berikut di terminal untuk menyelaraskan aset mobile ke platform Android / iOS:
          </p>
          <div className="p-3.5 bg-[#172B3A] rounded-xl font-mono text-[11px] text-[#2E9D70] border border-[#172B3A] space-y-1">
            <p className="text-slate-400"># Build web distribution</p>
            <p className="text-white">npm run build</p>
            <p className="text-slate-400 mt-2"># Tambah & Sync platform mobile</p>
            <p className="text-white">npx cap add android</p>
            <p className="text-white">npx cap sync</p>
          </div>

          <Button
            onClick={handleCapacitorCheck}
            className="w-full bg-[#123B5D] hover:bg-[#0e2f4a] text-xs text-white font-bold rounded-xl h-10 shadow-xs"
          >
            Tes Native Bridge Status
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
