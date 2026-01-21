import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  CheckCircle,
  Download,
  MessageCircle,
  Send,
} from 'lucide-react'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white font-['Public_Sans',sans-serif]">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center px-6 overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/80 to-transparent z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center opacity-60"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAYBIWaMzhm9rOalix72GASRGnkZS2qjt95LTIx4gQdGkqjXz72gyB9io813ehlnskr9MA_GdeNmgtOSY8SXtnNL6WILdFazwB5cYnyuZfkDuahFPY6k3NhFheTpUIQDzc3o3zq2wcKu5RD_ZqZ4kvOtCnKVtnlrpbv723oXlnkkcL7IxsZiJLIjh0Qes88_02cmwfdcnwC8UCZLmd0psPNuqHWrkRd5bk-UhCcqCRv5oxr3qnC1JwjBj3FlgUEB-UlVYSv7Hev5PM')`
            }}
          ></div>
        </div>
        <div className="relative z-20 max-w-[1200px] mx-auto w-full">
          <div className="max-w-[650px] space-y-8">
            {/* Label rojo con animación ping */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ea2a33]/20 border border-[#ea2a33]/30 text-[#ea2a33] text-xs font-bold tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ea2a33] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ea2a33]"></span>
              </span>
              Nuevo Lanzamiento: Clorofila Gold
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              Salud Real.<br />
              <span className="text-[#FFD700]">Riqueza Real.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 max-w-[500px] leading-relaxed">
              Transforma tu vida con suplementos naturales de grado premium y un modelo de negocio
              diseñado para tu libertad financiera absoluta.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/shop"
                className="px-10 py-4 rounded-full bg-[#ea2a33] text-white font-bold text-lg hover:scale-105 transition-transform shadow-2xl shadow-[#ea2a33]/20"
              >
                Ver Productos
              </Link>
              <Link
                href="/auth/signup"
                className="px-10 py-4 rounded-full bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-md border border-white/10"
              >
                Unirse al Equipo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-black tracking-tight mb-4">
              ¿Por qué elegir <span className="text-[#ea2a33]">Rey Shalom</span>?
            </h2>
            <p className="text-white/60 max-w-2xl">
              Nuestra propuesta une la pureza innegociable de la naturaleza con la rentabilidad
              exponencial del networking moderno.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Pureza Natural */}
            <div className="p-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#4CAF50]/50 transition-all group">
              <div className="w-14 h-14 rounded-full bg-[#4CAF50]/10 flex items-center justify-center text-[#4CAF50] mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Pureza Natural</h3>
              <p className="text-white/50 leading-relaxed">
                Productos 100% orgánicos, certificados internacionalmente para garantizar el máximo beneficio biológico.
              </p>
            </div>

            {/* Card 2: Puntos Recompensa */}
            <div className="p-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#FFD700]/50 transition-all group">
              <div className="w-14 h-14 rounded-full bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700] mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Puntos Recompensa</h3>
              <p className="text-white/50 leading-relaxed">
                Sistema PV (Point Value) agresivo, diseñado para que cada compra se convierta en una inversión directa a tu bolsillo.
              </p>
            </div>

            {/* Card 3: Red Global */}
            <div className="p-10 rounded-xl bg-white/5 border border-white/10 hover:border-[#ea2a33]/50 transition-all group">
              <div className="w-14 h-14 rounded-full bg-[#ea2a33]/10 flex items-center justify-center text-[#ea2a33] mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Red Global</h3>
              <p className="text-white/50 leading-relaxed">
                Conecta con una red élite de líderes en toda Latinoamérica con herramientas de marketing digital integradas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black uppercase italic tracking-widest text-[#FFD700] mb-2">
                Esenciales
              </h2>
              <h3 className="text-5xl font-black">Productos Destacados</h3>
            </div>
            <Link
              href="/shop"
              className="text-[#FFD700] font-bold hover:underline mb-2"
            >
              Ver catálogo completo →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Producto 1: Clorofila Premium */}
            <div className="group bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA84jBpbew6i_QZadW3JBSm0TBgafblUa9FZIp_kQjeNs4zBOJ9cHgLms7mHQMBhl7_yRHiQK_PAltka4_5S7VIxDJgUpDILIMXQCQyNjRCc2ph0SAn4gsSD21loRzdJ4uQ6GqNsxqZsP4zunn5xffDfKUDq3Us2TSTRWNMP1zMSOXj7GtNz-CADMtqvPio_o09P9aWyIgo1J68nqNliVAS1ucqdyzktee1Je-g7cysmhakg8aYrIPSC_-OBM6z0LW14o7JENa0Ohk')`
                  }}
                ></div>
                <div className="absolute top-2 right-2 bg-[#FFD700] text-black font-black text-xs px-2 py-1 rounded italic shadow-lg">
                  40 PV
                </div>
              </div>
              <h4 className="text-lg font-bold mb-1">Clorofila Premium</h4>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Vitalidad & Detox</span>
                <span className="text-[#ea2a33] font-black">S/. 85.00</span>
              </div>
            </div>

            {/* Producto 2: Energizante Natural */}
            <div className="group bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCPJ30dFnVq4u1Bm-AqmkUpy_27P0IuNso4-h1Sh0wjybdS8DJHjRWKu4YRYLKt0ap2I9T8ILlDBq8GVy3vGkiDi_-XAhc4eveTF0JuRh4kRESQnwzOol7FWXKy3wakEpzqexijISz1OZC4VnHdP2LyIj0USnrZOeDyJYKnz2_T5ablkHpDxobSYJcAv_xte5qRuV0-0ARXAqNARQhNo8K6NhGv36Okm1hvCr7_VMal6m-TSfO4o71JFu5MOXt2ArfgdxWL3op1YBA')`
                  }}
                ></div>
                <div className="absolute top-2 right-2 bg-[#FFD700] text-black font-black text-xs px-2 py-1 rounded italic shadow-lg">
                  45 PV
                </div>
              </div>
              <h4 className="text-lg font-bold mb-1">Energizante Natural</h4>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Fuerza Pura</span>
                <span className="text-[#ea2a33] font-black">S/. 95.00</span>
              </div>
            </div>

            {/* Producto 3: Multivitamínico Oro */}
            <div className="group bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBPWmGWBR-npnXj-RsFnNPZGqsdLdLdcYCpAhnpdmkTaWNu0TyyAkgAft0hgRzNz7MXklWBabdJPDAPxb9016I4SpPszjtq5P22e1jirTvYgqk_OeO3nQCElJkqcZqiRH3oW7VPUCLxcAyjGKFgMRY2VkpQVvnukFQKPXj9qqEqS0_PUHuP_HLfOVSPogcjXXLHpVqwWxhSr0JANBrgsG2LYspa2bgA2qmLGlDMcJuimsC7UGRU30VmBxF6f6GD3t8KtQdlQTpHwqs')`
                  }}
                ></div>
                <div className="absolute top-2 right-2 bg-[#FFD700] text-black font-black text-xs px-2 py-1 rounded italic shadow-lg">
                  60 PV
                </div>
              </div>
              <h4 className="text-lg font-bold mb-1">Multivitamínico Oro</h4>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Sistema Inmune</span>
                <span className="text-[#ea2a33] font-black">S/. 120.00</span>
              </div>
            </div>

            {/* Producto 4: Colágeno Hidrolizado */}
            <div className="group bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCqBzNMbYKx4tqh1GKKONZhZtBSMDWg3lTazShnMGLV3s6_59Nm96e0BD2FF-8D7OUXjqVxIJmhH6ytuQV2lW3GUsJB3dYXUAnx7aCS0ofIyrrRzugOgwr-mFLvpflB1_o527yhfxOUa4zZAz7Zrst7Q8q5Fyr7OVhm3f68YJ55v-sL_a-2dkJHWRmGCL1eamp-J0UnptTyaHSN1wnO3K6Nah98yEeS4d5-dzhiLVWyL0ErZKxCcWHXmYtREbul5ixe_ZDrMOupmG0')`
                  }}
                ></div>
                <div className="absolute top-2 right-2 bg-[#FFD700] text-black font-black text-xs px-2 py-1 rounded italic shadow-lg">
                  55 PV
                </div>
              </div>
              <h4 className="text-lg font-bold mb-1">Colágeno Hidrolizado</h4>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Piel & Articulaciones</span>
                <span className="text-[#ea2a33] font-black">S/. 110.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Section */}
      <section id="negocio" className="py-24 px-6 overflow-hidden">
        <div className="max-w-[1200px] mx-auto bg-gradient-to-br from-[#4CAF50]/20 via-[#121212] to-[#121212] rounded-3xl border border-[#4CAF50]/30 p-12 md:p-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-[#FFD700] font-bold uppercase tracking-widest mb-4">
                Oportunidad de Negocio
              </h2>
              <h3 className="text-5xl font-black mb-6 leading-tight">
                Gana por cada recomendación
              </h3>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Nuestro modelo de negocio híbrido te permite generar ingresos residuales mientras construyes
                una comunidad saludable. Recibe bonos por inicio rápido, regalías mensuales y premios de estilo de vida.
              </p>
              
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-[#FFD700]" />
                  <span>Hasta 40% de ganancia directa</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-[#FFD700]" />
                  <span>Bonos por metas mensuales</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-[#FFD700]" />
                  <span>Capacitación en marketing digital</span>
                </div>
              </div>
              
              <Link
                href="/dashboard/compensation"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#FFD700] text-black font-black text-lg hover:scale-105 transition-transform"
              >
                <Download className="h-5 w-5" />
                Descargar Plan de Compensación
              </Link>
            </div>
            
            {/* Dashboard Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#4CAF50]/20 blur-[100px] rounded-full"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 transform md:rotate-3 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-sm font-bold opacity-50 uppercase tracking-widest">
                    Dashboard de Afiliado
                  </span>
                  <svg className="w-6 h-6 text-[#4CAF50]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h9zM12 16h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                  </svg>
                </div>
                <div className="space-y-6">
                  <div className="h-2 w-24 bg-[#FFD700] rounded-full"></div>
                  <div className="text-4xl font-black">$4,520.00</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 bg-white/10 rounded-lg"></div>
                    <div className="h-12 bg-[#FFD700]/50 rounded-lg"></div>
                    <div className="h-12 bg-white/10 rounded-lg"></div>
                  </div>
                  <div className="text-xs text-white/40">
                    Ingresos proyectados para el próximo cierre mensual
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section id="packs" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">Planes de Membresía</h2>
            <p className="text-white/50">Elige el nivel que mejor se adapte a tu visión empresarial.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Bronce */}
            <div className="bg-white/5 border border-white/10 p-10 rounded-2xl text-center flex flex-col items-center">
              <span className="text-sm font-bold text-white/40 uppercase mb-4 tracking-tighter">
                Iniciación
              </span>
              <h3 className="text-3xl font-black mb-2">Bronce</h3>
              <div className="text-4xl font-black text-white mb-6">S/. 250</div>
              <ul className="text-white/60 space-y-4 mb-8 text-sm">
                <li>Descuento del 20%</li>
                <li>Kit de inicio básico</li>
                <li>Acceso a la plataforma</li>
                <li>100 PV acumulables</li>
              </ul>
              <Link
                href="/auth/signup?pack=bronce"
                className="w-full py-3 rounded-full border border-white/20 hover:bg-white/10 font-bold transition-all text-center block"
              >
                Seleccionar
              </Link>
            </div>

            {/* Oro - Destacado */}
            <div className="bg-gradient-to-b from-[#FFD700]/20 to-transparent border-2 border-[#FFD700] p-12 rounded-3xl text-center flex flex-col items-center gold-glow relative scale-105 z-10">
              <div className="absolute -top-5 bg-[#FFD700] text-black px-6 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                Recomendado
              </div>
              <span className="text-sm font-black text-[#FFD700] uppercase mb-4 tracking-tighter">
                Liderazgo Élite
              </span>
              <h3 className="text-4xl font-black mb-2">Oro</h3>
              <div className="text-5xl font-black text-white mb-6">S/. 1,200</div>
              <ul className="text-white/90 space-y-4 mb-10 text-base font-medium">
                <li>Descuento Máximo (40%)</li>
                <li>Kit Premium de Productos</li>
                <li>Bono de Mentoría Directa</li>
                <li>800 PV de Activación</li>
                <li>Página Web Personalizada</li>
              </ul>
              <Link
                href="/auth/signup?pack=oro"
                className="w-full py-4 rounded-full bg-[#FFD700] text-black font-black text-lg hover:bg-yellow-400 shadow-xl shadow-[#FFD700]/20 transition-all text-center block"
              >
                Empezar Ahora
              </Link>
            </div>

            {/* Plata */}
            <div className="bg-white/5 border border-white/10 p-10 rounded-2xl text-center flex flex-col items-center">
              <span className="text-sm font-bold text-white/40 uppercase mb-4 tracking-tighter">
                Crecimiento
              </span>
              <h3 className="text-3xl font-black mb-2">Plata</h3>
              <div className="text-4xl font-black text-white mb-6">S/. 650</div>
              <ul className="text-white/60 space-y-4 mb-8 text-sm">
                <li>Descuento del 30%</li>
                <li>Kit intermedio de productos</li>
                <li>Acceso a capacitaciones</li>
                <li>350 PV acumulables</li>
              </ul>
              <Link
                href="/auth/signup?pack=plata"
                className="w-full py-3 rounded-full border border-white/20 hover:bg-white/10 font-bold transition-all text-center block"
              >
                Seleccionar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating CTA - Chat Button */}
      <Link
        href="https://wa.me/yournumber"
        className="fixed bottom-8 right-8 z-[60] bg-[#ea2a33] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
      >
        <MessageCircle className="h-8 w-8" />
      </Link>
    </div>
  )
}
