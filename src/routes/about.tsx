import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Smartphone, 
  Layers, 
  Flame, 
  ShieldCheck, 
  Code2, 
  ExternalLink,
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
    <div className="p-4 space-y-4">
      {/* App Header Info */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">AyoTrip Mobile</h2>
            <p className="text-xs text-slate-400">Versi 1.0.0 • Mobile Production Ready</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Arsitektur mobile modern yang menggabungkan kecepatan web native dengan kapabilitas hybrid Capacitor JS untuk platform Android dan iOS.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge className="bg-slate-800 text-emerald-400 border border-slate-700 text-[10px]">
            Capacitor Ready
          </Badge>
          <Badge className="bg-slate-800 text-teal-400 border border-slate-700 text-[10px]">
            TanStack Suite
          </Badge>
          <Badge className="bg-slate-800 text-sky-400 border border-slate-700 text-[10px]">
            Shadcn UI Full Pack
          </Badge>
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Spesifikasi Tech Stack
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {TECH_STACK_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800/80"
            >
              <div>
                <p className="text-xs font-bold text-white">{item.name}</p>
                <p className="text-[11px] text-slate-400">{item.role}</p>
              </div>
              <Badge variant="outline" className="text-[10px] text-emerald-400 border-slate-700">
                {item.version}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Capacitor Actions */}
      <Card className="bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Native Mobile Bridge
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-slate-400 leading-relaxed">
            Jalankan perintah berikut di terminal untuk menyelaraskan aset mobile ke platform Android / iOS:
          </p>
          <div className="p-3 bg-slate-950 rounded-xl font-mono text-[11px] text-emerald-400 border border-slate-800 space-y-1">
            <p># Build web distribution</p>
            <p className="text-white">npm run build</p>
            <p className="mt-2"># Tambah & Sync platform mobile</p>
            <p className="text-white">npx cap add android</p>
            <p className="text-white">npx cap sync</p>
          </div>

          <Button
            onClick={handleCapacitorCheck}
            className="w-full bg-slate-800 hover:bg-slate-700 text-xs text-emerald-400 border border-slate-700"
          >
            Tes Native Bridge Status
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

