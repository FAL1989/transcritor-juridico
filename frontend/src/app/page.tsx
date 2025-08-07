import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Transcritor Jurídico
          </h1>
          <p className="text-xl text-gray-600">
            Sistema profissional de transcrição para o setor jurídico
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/auth/login" className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700">
              Entrar
            </Link>
            <Link href="/auth/register" className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50">
              Cadastrar
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}