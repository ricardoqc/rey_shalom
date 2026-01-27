import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle,
  Download,
  MessageCircle,
} from 'lucide-react'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-['Public_Sans',sans-serif]">
      {/* Hero Section - fondo #f9fafb, overlay blanco */}
      <section className="relative min-h-[85vh] flex items-center px-6 overflow-hidden bg-[#f9fafb] pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent z-10"></div>
          <div
            className="w-full h-full bg-cover bg-center opacity-40 mix-blend-multiply"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAYBIWaMzhm9rOalix72GASRGnkZS2qjt95LTIx4gQdGkqjXz72gyB9io813ehlnskr9MA_GdeNmgtOSY8SXtnNL6WILdFazwB5cYnyuZfkDuahFPY6k3NhFheTpUIQDzc3o3zq2wcKu5RD_ZqZ4kvOtCnKVtnlrpbv723oXlnkkcL7IxsZiJLIjh0Qes88_02cmwfdcnwC8UCZLmd0psPNuqHWrkRd5bk-UhCcqCRv5oxr3qnC1JwjBj3FlgUEB-UlVYSv7Hev5PM')`
            }}
          ></div>
        </div>
        <div className="relative z-20 max-w-[1200px] mx-auto w-full">
          <div className="max-w-[700px] space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#4CAF50] text-xs font-bold tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CAF50] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4CAF50]"></span>
              </span>
              Nuevo Lanzamiento: Clorofila Gold
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-[#1A1A1A]">
              Salud Real.<br />
              <span className="text-[#4CAF50]">Riqueza Real.</span>
            </h1>

            <p className="text-lg md:text-xl text-[#666666] max-w-[550px] leading-relaxed">
              Transforma tu vida con suplementos naturales de grado premium y un modelo de negocio
              diseñado para tu libertad financiera absoluta.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/shop"
                className="px-10 py-4 rounded-full bg-[#4CAF50] text-white font-bold text-lg hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                Ver Productos
              </Link>
              <Link
                href="/auth/signup"
                className="px-10 py-4 rounded-full bg-white text-[#1A1A1A] border border-gray-200 font-bold text-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                Unirse al Equipo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits - fondo blanco, cards blancas */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-black tracking-tight mb-4">
              ¿Por qué elegir <span className="text-[#4CAF50]">Rey Shalom</span>?
            </h2>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-[#666666] max-w-2xl mx-auto">
              Nuestra propuesta une la pureza innegociable de la naturaleza con la rentabilidad
              exponencial del networking moderno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#4CAF50]/20 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-[#4CAF50]/10 flex items-center justify-center text-[#4CAF50] mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1A1A1A]">Pureza Natural</h3>
              <p className="text-[#666666] leading-relaxed">
                Productos 100% orgánicos, certificados internacionalmente para garantizar el máximo beneficio biológico.
              </p>
            </div>

            <div className="p-10 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/20 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1A1A1A]">Puntos Recompensa</h3>
              <p className="text-[#666666] leading-relaxed">
                Sistema PV (Point Value) agresivo, diseñado para que cada compra se convierta en una inversión directa a tu bolsillo.
              </p>
            </div>

            <div className="p-10 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#2196F3]/20 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-[#2196F3]/10 flex items-center justify-center text-[#2196F3] mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1A1A1A]">Red Global</h3>
              <p className="text-[#666666] leading-relaxed">
                Conecta con una red élite de líderes en toda Latinoamérica con herramientas de marketing digital integradas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider max-w-5xl mx-auto" />

      {/* Productos - fondo #fcfcfc, título gold */}
      <section className="py-24 px-6 bg-[#fcfcfc]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-[#D4AF37] mb-2">
                Salud de Vanguardia
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-[#1A1A1A]">Productos Destacados</h3>
            </div>
            <Link
              href="/shop"
              className="text-[#4CAF50] font-bold hover:underline inline-flex items-center gap-2"
            >
              Ver catálogo completo <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Clorofila Premium', cat: 'Vitalidad & Detox', price: 'S/. 85.00', pv: '40 PV', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA84jBpbew6i_QZadW3JBSm0TBgafblUa9FZIp_kQjeNs4zBOJ9cHgLms7mHQMBhl7_yRHiQK_PAltka4_5S7VIxDJgUpDILIMXQCQyNjRCc2ph0SAn4gsSD21loRzdJ4uQ6GqNsxqZsP4zunn5xffDfKUDq3Us2TSTRWNMP1zMSOXj7GtNz-CADMtqvPio_o09P9aWyIgo1J68nqNliVAS1ucqdyzktee1Je-g7cysmhakg8aYrIPSC_-OBM6z0LW14o7JENa0Ohk' },
              { name: 'Energizante Natural', cat: 'Fuerza Pura', price: 'S/. 95.00', pv: '45 PV', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPJ30dFnVq4u1Bm-AqmkUpy_27P0IuNso4-h1Sh0wjybdS8DJHjRWKu4YRYLKt0ap2I9T8ILlDBq8GVy3vGkiDi_-XAhc4eveTF0JuRh4kRESQnwzOol7FWXKy3wakEpzqexijISz1OZC4VnHdP2LyIj0USnrZOeDyJYKnz2_T5ablkHpDxobSYJcAv_xte5qRuV0-0ARXAqNARQhNo8K6NhGv36Okm1hvCr7_VMal6m-TSfO4o71JFu5MOXt2ArfgdxWL3op1YBA' },
              { name: 'Multivitamínico Oro', cat: 'Sistema Inmune', price: 'S/. 120.00', pv: '60 PV', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPWmGWBR-npnXj-RsFnNPZGqsdLdLdcYCpAhnpdmkTaWNu0TyyAkgAft0hgRzNz7MXklWBabdJPDAPxb9016I4SpPszjtq5P22e1jirTvYgqk_OeO3nQCElJkqcZqiRH3oW7VPUCLxcAyjGKFgMRY2VkpQVvnukFQKPXj9qqEqS0_PUHuP_HLfOVSPogcjXXLHpVqwWxhSr0JANBrgsG2LYspa2bgA2qmLGlDMcJuimsC7UGRU30VmBxF6f6GD3t8KtQdlQTpHwqs' },
              { name: 'Colágeno Hidrolizado', cat: 'Piel & Articulaciones', price: 'S/. 110.00', pv: '55 PV', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqBzNMbYKx4tqh1GKKONZhZtBSMDWg3lTazShnMGLV3s6_59Nm96e0BD2FF-8D7OUXjqVxIJmhH6ytuQV2lW3GUsJB3dYXUAnx7aCS0ofIyrrRzugOgwr-mFLvpflB1_o527yhfxOUa4zZAz7Zrst7Q8q5Fyr7OVhm3f68YJ55v-sL_a-2dkJHWRmGCL1eamp-J0UnptTyaHSN1wnO3K6Nah98yEeS4d5-dzhiLVWyL0ErZKxCcWHXmYtREbul5ixe_ZDrMOupmG0' },
            ].map((p) => (
              <Link key={p.name} href="/shop" className="group bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all block">
                <div className="relative aspect-square overflow-hidden rounded-xl mb-4 bg-gray-50">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url('${p.img}')` }}
                  />
                  <div className="absolute top-3 right-3 bg-[#D4AF37] text-white font-black text-xs px-3 py-1 rounded-full shadow-lg">
                    {p.pv}
                  </div>
                </div>
                <h4 className="text-lg font-bold mb-1 group-hover:text-[#4CAF50] transition-colors text-[#1A1A1A]">{p.name}</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#666666] text-sm">{p.cat}</span>
                  <span className="text-[#4CAF50] font-black text-lg">{p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Negocio - fondo blanco, barra lateral royal-blue, checks primary, botón gold */}
      <section className="py-24 px-6 overflow-hidden bg-white">
        <div className="max-w-[1200px] mx-auto bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 shadow-sm p-12 md:p-20 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#2196F3]/20"></div>
          <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h2 className="text-[#D4AF37] font-bold uppercase tracking-widest mb-4">
                Oportunidad de Negocio
              </h2>
              <h3 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-[#1A1A1A]">
                Gana por cada recomendación
              </h3>
              <p className="text-[#666666] text-lg mb-8 leading-relaxed">
                Nuestro modelo de negocio híbrido te permite generar ingresos residuales mientras construyes
                una comunidad saludable. Recibe bonos por inicio rápido y regalías mensuales.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-[#4CAF50]" />
                  <span className="font-medium">Hasta 40% de ganancia directa</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-[#4CAF50]" />
                  <span className="font-medium">Bonos por metas mensuales</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-[#4CAF50]" />
                  <span className="font-medium">Capacitación en marketing digital</span>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#D4AF37] text-white font-black text-lg hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <Download className="h-5 w-5" />
                Descargar Plan de Compensación
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-[#4CAF50]/5 blur-[80px] rounded-full"></div>
              <div className="relative bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl transform md:rotate-2">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Panel de Distribuidor</span>
                  <svg className="w-6 h-6 text-[#4CAF50]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zM12 16h10V8H12v8z" />
                  </svg>
                </div>
                <div className="space-y-6">
                  <div className="text-sm font-medium text-[#666666]">Ingresos acumulados</div>
                  <div className="text-5xl font-black text-[#1A1A1A]">S/. 4,520.00</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 bg-gray-50 rounded-xl border border-gray-100"></div>
                    <div className="h-16 bg-[#4CAF50]/10 rounded-xl border border-[#4CAF50]/20 flex items-center justify-center">
                      <span className="text-[#4CAF50] font-black">+15%</span>
                    </div>
                    <div className="h-16 bg-gray-50 rounded-xl border border-gray-100"></div>
                  </div>
                  <div className="text-xs text-[#666666] italic">Cálculo proyectado para el cierre del ciclo actual.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planes - fondo #f8fafc, cards blancas, Bronce/Oro/Plata */}
      <section className="py-24 px-6 bg-[#f8fafc]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4 text-[#1A1A1A]">Planes de Membresía</h2>
            <div className="w-24 h-1.5 bg-[#4CAF50] mx-auto mb-6"></div>
            <p className="text-[#666666]">Elige el nivel que mejor se adapte a tu visión empresarial.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="bg-white border border-gray-200 p-10 rounded-2xl text-center flex flex-col items-center shadow-sm hover:shadow-md transition-all">
              <span className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Iniciación</span>
              <h3 className="text-3xl font-black mb-2 text-[#CD7F32]">Bronce</h3>
              <div className="text-4xl font-black text-[#1A1A1A] mb-6">S/. 250</div>
              <div className="w-full border-t border-gray-100 mb-8"></div>
              <ul className="text-[#666666] space-y-4 mb-8 text-sm w-full">
                <li>Descuento del 20%</li>
                <li>Kit de inicio básico</li>
                <li>Acceso a la plataforma</li>
                <li>100 PV acumulables</li>
              </ul>
              <Link href="/auth/signup?pack=bronce" className="w-full py-3 rounded-full border border-gray-200 hover:bg-gray-50 text-[#1A1A1A] font-bold transition-all text-center block">
                Seleccionar
              </Link>
            </div>

            <div className="bg-white border-2 border-[#D4AF37] p-12 rounded-[2.5rem] text-center flex flex-col items-center gold-glow-light relative scale-105 z-10">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-white px-8 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                Recomendado
              </div>
              <span className="text-xs font-black text-[#D4AF37] uppercase mb-4 tracking-widest">Liderazgo Élite</span>
              <h3 className="text-4xl font-black mb-2 text-[#D4AF37]">Pack Oro</h3>
              <div className="text-5xl font-black text-[#1A1A1A] mb-6">S/. 1,200</div>
              <div className="w-full border-t border-[#D4AF37]/20 mb-8"></div>
              <ul className="text-[#1A1A1A] space-y-5 mb-10 text-base font-semibold w-full">
                <li className="flex items-center justify-center gap-2">★ Descuento Máximo (40%)</li>
                <li className="flex items-center justify-center gap-2">★ Kit Premium de Productos</li>
                <li className="flex items-center justify-center gap-2">★ Bono de Mentoría Directa</li>
                <li className="flex items-center justify-center gap-2">★ 800 PV de Activación</li>
                <li className="flex items-center justify-center gap-2">★ Página Web Personalizada</li>
              </ul>
              <Link href="/auth/signup?pack=oro" className="w-full py-4 rounded-full bg-[#D4AF37] text-white font-black text-lg hover:shadow-2xl hover:bg-[#c29d2f] transition-all text-center block">
                Empezar Ahora
              </Link>
            </div>

            <div className="bg-white border border-gray-200 p-10 rounded-2xl text-center flex flex-col items-center shadow-sm hover:shadow-md transition-all">
              <span className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Crecimiento</span>
              <h3 className="text-3xl font-black mb-2 text-gray-400">Plata</h3>
              <div className="text-4xl font-black text-[#1A1A1A] mb-6">S/. 650</div>
              <div className="w-full border-t border-gray-100 mb-8"></div>
              <ul className="text-[#666666] space-y-4 mb-8 text-sm w-full">
                <li>Descuento del 30%</li>
                <li>Kit intermedio de productos</li>
                <li>Acceso a capacitaciones</li>
                <li>350 PV acumulables</li>
              </ul>
              <Link href="/auth/signup?pack=plata" className="w-full py-3 rounded-full border border-gray-200 hover:bg-gray-50 text-[#1A1A1A] font-bold transition-all text-center block">
                Seleccionar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating CTA - primary, borde blanco */}
      <Link
        href="https://wa.me/yournumber"
        className="fixed bottom-8 right-8 z-[60] bg-[#4CAF50] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center border-4 border-white"
      >
        <MessageCircle className="h-8 w-8" />
      </Link>
    </div>
  )
}
