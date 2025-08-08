export type NormalizeResponse = { content: string };
export type ExtractResponse = { content: string };
export type CompareResponse = { additions: { line: number; text: string }[]; removals: { line: number; text: string }[] };

// Use Next.js rewrite entrypoint to avoid mixed content/CORS
const BASE_URL = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = 'Erro inesperado';
    try {
      const data = await res.json();
      message = data.detail ?? message;
    } catch {}
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const textsApi = {
  async normalize(accessToken: string, input: { content: string; template?: string; anonymize?: boolean; tribunal?: string; comarca?: string; processo?: string; local_data?: string }): Promise<NormalizeResponse> {
    const form = new FormData();
    form.append('content', input.content);
    if (input.template) form.append('template', input.template);
    if (input.anonymize) form.append('anonymize', String(!!input.anonymize));
    if (input.tribunal) form.append('tribunal', input.tribunal);
    if (input.comarca) form.append('comarca', input.comarca);
    if (input.processo) form.append('processo', input.processo);
    if (input.local_data) form.append('local_data', input.local_data);
    const res = await fetch(`${BASE_URL}/texts/normalize`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` }, body: form });
    return handleResponse<NormalizeResponse>(res);
  },

  async extract(accessToken: string, file: File, anonymize?: boolean): Promise<ExtractResponse> {
    const form = new FormData();
    form.append('file', file);
    if (anonymize) form.append('anonymize', String(!!anonymize));
    const res = await fetch(`${BASE_URL}/texts/extract`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` }, body: form });
    return handleResponse<ExtractResponse>(res);
  },

  async compare(accessToken: string, input: { left: string; right: string }): Promise<CompareResponse> {
    const form = new FormData();
    form.append('left', input.left);
    form.append('right', input.right);
    const res = await fetch(`${BASE_URL}/texts/compare`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` }, body: form });
    return handleResponse<CompareResponse>(res);
  },
};


