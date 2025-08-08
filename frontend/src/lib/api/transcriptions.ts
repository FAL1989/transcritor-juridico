export type Transcription = {
  id: number;
  title: string;
  original_filename: string;
  file_path: string;
  file_size?: number;
  duration?: number;
  status: string;
  language: string;
  created_at: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

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

export const transcriptionsApi = {
  async list(accessToken: string): Promise<Transcription[]> {
    const res = await fetch(`${BASE_URL}/transcriptions`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });
    return handleResponse<Transcription[]>(res);
  },

  async upload(accessToken: string, input: { title: string; file: File }): Promise<Transcription> {
    const form = new FormData();
    form.append('title', input.title);
    form.append('file', input.file);

    const res = await fetch(`${BASE_URL}/transcriptions/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    });
    return handleResponse<Transcription>(res);
  },
};
