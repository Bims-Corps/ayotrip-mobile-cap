import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tripApi } from '@/services/tripService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { PlusCircle, Sparkles, Send, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/create')({
  component: CreateTripPage,
})

function CreateTripPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  // TanStack Query Mutation
  const createMutation = useMutation({
    mutationFn: tripApi.createTrip,
    onSuccess: (newTrip) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      toast.success('Rencana trip berhasil diterbitkan!', {
        description: `${newTrip.title} kini tampil di daftar eksplorasi.`,
      })
      router.navigate({ to: '/' })
    },
    onError: (err) => {
      toast.error('Gagal menambahkan trip', {
        description: (err as Error)?.message || 'Silakan periksa kembali input Anda.',
      })
    },
  })

  // TanStack Form setup
  const form = useForm({
    defaultValues: {
      title: '',
      destination: '',
      province: '',
      category: 'Adventure' as 'Beach' | 'Mountain' | 'Culture' | 'Adventure',
      price: 1500000,
      duration: '3D2N',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      highlights: 'Snorkeling, Trekking Puncak, Sunset View',
    },
    onSubmit: async ({ value }) => {
      const highlightsArray = value.highlights
        .split(',')
        .map((h) => h.trim())
        .filter(Boolean)

      await createMutation.mutateAsync({
        title: value.title,
        destination: value.destination,
        province: value.province,
        category: value.category,
        price: Number(value.price),
        duration: value.duration,
        description: value.description,
        imageUrl: value.imageUrl,
        highlights: highlightsArray.length > 0 ? highlightsArray : ['Aktivitas Menarik'],
      })
    },
  })

  return (
    <div className="p-4 space-y-4">
      <Card className="bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="pb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            TanStack Form + Query
          </div>
          <CardTitle className="text-lg font-bold text-white">Buat Rencana Trip Baru</CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Daftarkan destinasi liburan baru untuk wisatawan AyoTrip Mobile.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            {/* Title Field */}
            <form.Field
              name="title"
              validators={{
                onChange: ({ value }) =>
                  !value || value.length < 5
                    ? 'Judul trip minimal 5 karakter'
                    : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-xs text-slate-300">
                    Nama / Judul Trip <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id={field.name}
                    placeholder="Contoh: Eksplorasi Hidden Beach Belitung"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-slate-800/80 border-slate-700 text-xs rounded-xl focus-visible:ring-emerald-500"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[11px] text-rose-400">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Destination & Province Grid */}
            <div className="grid grid-cols-2 gap-3">
              <form.Field
                name="destination"
                validators={{
                  onChange: ({ value }) => (!value ? 'Destinasi wajib diisi' : undefined),
                }}
              >
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name} className="text-xs text-slate-300">
                      Destinasi <span className="text-rose-400">*</span>
                    </Label>
                    <Input
                      id={field.name}
                      placeholder="Pulau Lengkuas"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-slate-800/80 border-slate-700 text-xs rounded-xl"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-[11px] text-rose-400">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="province"
                validators={{
                  onChange: ({ value }) => (!value ? 'Provinsi wajib diisi' : undefined),
                }}
              >
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name} className="text-xs text-slate-300">
                      Provinsi <span className="text-rose-400">*</span>
                    </Label>
                    <Input
                      id={field.name}
                      placeholder="Bangka Belitung"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-slate-800/80 border-slate-700 text-xs rounded-xl"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-[11px] text-rose-400">
                        {field.state.meta.errors.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Category & Duration Grid */}
            <div className="grid grid-cols-2 gap-3">
              <form.Field name="category">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name} className="text-xs text-slate-300">
                      Kategori
                    </Label>
                    <select
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value as any)}
                      className="w-full h-9 bg-slate-800/80 border border-slate-700 text-xs rounded-xl px-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Beach">Beach</option>
                      <option value="Mountain">Mountain</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Culture">Culture</option>
                    </select>
                  </div>
                )}
              </form.Field>

              <form.Field name="duration">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name} className="text-xs text-slate-300">
                      Durasi
                    </Label>
                    <Input
                      id={field.name}
                      placeholder="3D2N"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="bg-slate-800/80 border-slate-700 text-xs rounded-xl"
                    />
                  </div>
                )}
              </form.Field>
            </div>

            {/* Price Field */}
            <form.Field
              name="price"
              validators={{
                onChange: ({ value }) => (Number(value) <= 0 ? 'Harga harus lebih dari 0' : undefined),
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-xs text-slate-300">
                    Perkiraan Biaya (IDR) <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id={field.name}
                    type="number"
                    placeholder="1500000"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    className="bg-slate-800/80 border-slate-700 text-xs rounded-xl"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[11px] text-rose-400">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Highlights */}
            <form.Field name="highlights">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-xs text-slate-300">
                    Aktivitas Utama (pisahkan dengan koma)
                  </Label>
                  <Input
                    id={field.name}
                    placeholder="Snorkeling, Berlayar, Sunset View"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-slate-800/80 border-slate-700 text-xs rounded-xl"
                  />
                </div>
              )}
            </form.Field>

            {/* Description Textarea */}
            <form.Field
              name="description"
              validators={{
                onChange: ({ value }) =>
                  !value || value.length < 15
                    ? 'Deskripsi minimal 15 karakter'
                    : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name} className="text-xs text-slate-300">
                    Deskripsi Ringkas <span className="text-rose-400">*</span>
                  </Label>
                  <Textarea
                    id={field.name}
                    rows={3}
                    placeholder="Jelaskan daya tarik destinasi ini secara menarik..."
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="bg-slate-800/80 border-slate-700 text-xs rounded-xl resize-none"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[11px] text-rose-400">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Submit Button */}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || createMutation.isPending}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs h-10 rounded-xl gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menerbitkan Trip...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Terbitkan Trip Sekarang
                    </>
                  )}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

