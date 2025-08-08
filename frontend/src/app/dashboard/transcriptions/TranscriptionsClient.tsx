"use client";

import { useEffect, useState } from 'react';
import { transcriptionsApi, type Transcription } from '@/lib/api/transcriptions';

export function TranscriptionsClient() {
  const [items, setItems] = useState<Transcription[]>([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      const data = await transcriptionsApi.list(token);
      setItems(data);
    } catch (err: any) {
      setError(err.message ?? 'Falha ao carregar transcrições');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError('Selecione um arquivo');
      return;
    }
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Usuário não autenticado');
      return;
    }
    setLoading(true);
    try {
      await transcriptionsApi.upload(token, { title, file });
      setTitle('');
      setFile(null);
      await load();
    } catch (err: any) {
      setError(err.message ?? 'Falha no upload');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-gray-900">Novo upload</h2>
        {error && <div className="mt-2 rounded bg-red-50 text-red-700 p-3 text-sm">{error}</div>}
        <form onSubmit={onUpload} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Arquivo de áudio/vídeo</label>
            <input
              type="file"
              accept=".mp3,.wav,.m4a,.ogg,.flac,.mp4,.avi,.mov"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
              className="mt-1 block w-full"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center items-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-gray-900">Minhas transcrições</h2>
        <ul className="mt-4 divide-y divide-gray-200">
          {items.map((t) => (
            <li key={t.id} className="py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{t.title}</p>
                  <p className="text-sm text-gray-600">{t.original_filename} • {t.status}</p>
                </div>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="py-6 text-gray-500 text-sm">Nenhuma transcrição ainda</li>
          )}
        </ul>
      </section>
    </div>
  );
}
