import Link from 'next/link'
import { Send } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Logo y descripción */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-6 text-[#4CAF50]">
                <svg fill="currentColor" viewBox="0 0 48 48">
                  <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
                </svg>
              </div>
              <h2 className="text-lg font-black tracking-tighter uppercase italic text-[#4CAF50]">Rey Shalom</h2>
            </div>
            <p className="text-[#666666] text-sm leading-relaxed">
              Comprometidos con el bienestar integral, uniendo la sabiduría ancestral de la naturaleza
              con la tecnología financiera moderna.
            </p>
          </div>

          {/* Compañía */}
          <div>
            <h4 className="font-bold mb-6 text-[#1A1A1A]">Compañía</h4>
            <ul className="space-y-4 text-[#666666] text-sm">
              <li>
                <Link href="/nosotros" className="hover:text-[#4CAF50] transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/vision-mision" className="hover:text-[#4CAF50] transition-colors">
                  Visión y Misión
                </Link>
              </li>
              <li>
                <Link href="/sostenibilidad" className="hover:text-[#4CAF50] transition-colors">
                  Sostenibilidad
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#4CAF50] transition-colors">
                  Blog de Salud
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="font-bold mb-6 text-[#1A1A1A]">Soporte</h4>
            <ul className="space-y-4 text-[#666666] text-sm">
              <li>
                <Link href="/faq" className="hover:text-[#4CAF50] transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/envios" className="hover:text-[#4CAF50] transition-colors">
                  Políticas de Envío
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="hover:text-[#4CAF50] transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className="hover:text-[#4CAF50] transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-6 text-[#1A1A1A]">Newsletter</h4>
            <p className="text-[#666666] text-xs mb-4">
              Suscríbete para recibir noticias de lanzamientos y bonos especiales.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Tu email"
                className="bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm w-full focus:ring-1 focus:ring-[#4CAF50] outline-none text-[#1A1A1A] placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-[#4CAF50] p-2 rounded-full text-white hover:bg-[#3d8b40] transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Copyright y redes sociales */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">
          <p>© 2024 Rey Shalom S.A.C. Todos los derechos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#4CAF50] transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-[#4CAF50] transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-[#4CAF50] transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
