"use client";

import { textsApi, type CompareResponse } from '@/lib/api/texts';
import { useState } from 'react';

export function TextsClient() {
  const [inputText, setInputText] = useState('');
  const [template, setTemplate] = useState<string>('');
  const [anonymize, setAnonymize] = useState(false);
  const [tribunal, setTribunal] = useState('');
  const [comarca, setComarca] = useState('');
  const [processo, setProcesso] = useState('');
  const [localData, setLocalData] = useState('');
  const [normalized, setNormalized] = useState('');

  const [docFile, setDocFile] = useState<File | null>(null);
  const [extracted, setExtracted] = useState('');

  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [diff, setDiff] = useState<CompareResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onNormalize(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Usuário não autenticado');
      const res = await textsApi.normalize(token, { content: inputText, template: template || undefined, anonymize, tribunal, comarca, processo, local_data: localData });
      setNormalized(res.content);
    } catch (err: any) {
      setError(err.message ?? 'Falha ao normalizar');
    } finally {
      setLoading(false);
    }
  }

  async function onExtract(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Usuário não autenticado');
      if (!docFile) throw new Error('Selecione um arquivo PDF ou DOCX');
      const res = await textsApi.extract(token, docFile, anonymize);
      setExtracted(res.content);
    } catch (err: any) {
      setError(err.message ?? 'Falha ao extrair');
    } finally {
      setLoading(false);
    }
  }

  async function onCompare(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Usuário não autenticado');
      const res = await textsApi.compare(token, { left, right });
      setDiff(res);
    } catch (err: any) {
      setError(err.message ?? 'Falha ao comparar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6">
      {error && <div className="rounded bg-red-50 text-red-700 p-3 text-sm">{error}</div>}

      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-gray-900">Transcrição de Texto (normalizar e aplicar modelo)</h2>
        <form onSubmit={onNormalize} className="mt-4 space-y-3">
          <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} rows={6} className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Cole aqui o texto bruto" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Modelo</label>
              <select value={template} onChange={(e) => setTemplate(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                <option value="">Sem modelo</option>
                <option value="termo_audiencia">Termo de Audiência</option>
                <option value="despacho">Despacho</option>
              </select>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <input id="anon" type="checkbox" checked={anonymize} onChange={(e) => setAnonymize(e.target.checked)} />
              <label htmlFor="anon" className="text-sm text-gray-700">Anonimizar (sob demanda)</label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input placeholder="Tribunal" value={tribunal} onChange={(e) => setTribunal(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2" />
            <input placeholder="Comarca" value={comarca} onChange={(e) => setComarca(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2" />
            <input placeholder="Processo" value={processo} onChange={(e) => setProcesso(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2" />
            <input placeholder="Local e data" value={localData} onChange={(e) => setLocalData(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <button type="submit" disabled={loading} className="inline-flex justify-center items-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 disabled:opacity-60">{loading ? 'Processando...' : 'Aplicar'}</button>
        </form>
        {normalized && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">Resultado</h3>
            <pre className="mt-2 whitespace-pre-wrap rounded-md border border-gray-200 p-3 text-sm bg-gray-50">{normalized}</pre>
          </div>
        )}
      </section>

      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-gray-900">Extrair texto de documento (PDF/DOCX)</h2>
        <form onSubmit={onExtract} className="mt-4 space-y-3">
          <input type="file" accept=".pdf,.docx" onChange={(e) => setDocFile(e.target.files?.[0] ?? null)} />
          <div className="flex items-center gap-3">
            <input id="anon2" type="checkbox" checked={anonymize} onChange={(e) => setAnonymize(e.target.checked)} />
            <label htmlFor="anon2" className="text-sm text-gray-700">Anonimizar (sob demanda)</label>
          </div>
          <button type="submit" disabled={loading} className="inline-flex justify-center items-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 disabled:opacity-60">{loading ? 'Extraindo...' : 'Extrair'}</button>
        </form>
        {extracted && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">Texto extraído</h3>
            <pre className="mt-2 whitespace-pre-wrap rounded-md border border-gray-200 p-3 text-sm bg-gray-50">{extracted}</pre>
          </div>
        )}
      </section>

      <section className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-gray-900">Comparar textos (policial vs judicial)</h2>
        <form onSubmit={onCompare} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <textarea value={left} onChange={(e) => setLeft(e.target.value)} rows={8} className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Texto A (por ex., policial)" />
          <textarea value={right} onChange={(e) => setRight(e.target.value)} rows={8} className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Texto B (por ex., judicial)" />
          <div className="md:col-span-2">
            <button type="submit" disabled={loading} className="inline-flex justify-center items-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 disabled:opacity-60">{loading ? 'Comparando...' : 'Comparar'}</button>
          </div>
        </form>
        {diff && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">Diferenças</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <h4 className="font-medium text-green-700">Adições (B)</h4>
                <ul className="mt-2 list-disc pl-5">
                  {diff.additions.map((a, i) => (
                    <li key={`a-${i}`}>Linha {a.line}: {a.text}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-700">Remoções (A)</h4>
                <ul className="mt-2 list-disc pl-5">
                  {diff.removals.map((r, i) => (
                    <li key={`r-${i}`}>Linha {r.line}: {r.text}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}


