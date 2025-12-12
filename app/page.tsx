import Link from 'next/link'
import { ShoppingBag, TrendingUp, Users, Award, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Bienvenido a</span>
              <span className="block text-blue-600">Rey Shalom</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Tu plataforma integral de E-commerce, MLM y Gestión de Inventario.
              Construye tu negocio, gana comisiones y alcanza tus metas.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 gap-4">
              <Link
                href="/shop"
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
              >
                Explorar Tienda
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/auth/signup"
                className="mt-3 flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 sm:mt-0 sm:ml-3 transition-colors"
              >
                Unirse Ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              ¿Por qué elegir Rey Shalom?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Una plataforma completa diseñada para hacer crecer tu negocio
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-500 text-white mx-auto">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                E-commerce Completo
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Catálogo de productos, carrito de compras y checkout integrado
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-green-500 text-white mx-auto">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                Sistema MLM
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Gana comisiones por múltiples niveles y construye tu red
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-purple-500 text-white mx-auto">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                Gestión de Equipo
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Visualiza y gestiona tu red de afiliados en tiempo real
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-yellow-500 text-white mx-auto">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900">
                Sistema de Rangos
              </h3>
              <p className="mt-2 text-base text-gray-500">
                Sube de nivel y desbloquea beneficios exclusivos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">¿Listo para comenzar?</span>
            <span className="block">Únete a nuestra comunidad hoy</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Regístrate gratis y comienza a construir tu negocio. Sin costos
            iniciales, sin complicaciones.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10 transition-colors"
          >
            Crear Cuenta Gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
