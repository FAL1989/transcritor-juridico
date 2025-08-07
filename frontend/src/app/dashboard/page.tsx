"use client";

import { useEffect, useState } from 'react';
import { api, type UserResponse } from '@/lib/api/client';
import Link from 'next/link';
import { TranscriptionsClient } from './transcriptions/TranscriptionsClient';

export default function DashboardPage() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/auth/login';
      return;
    }
    api
      .me(token)
      .then(setUser)
      .catch((err) => setError(err.message ?? 'Falha ao carregar usuário'));
  }, []);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="rounded bg-red-50 text-red-700 p-3 mb-4">{error}</div>
          <Link className="text-indigo-600 hover:underline" href="/auth/login">Ir para login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          {user && <span className="text-gray-700">{user.full_name}</span>}
        </div>
        <TranscriptionsClient />
      </div>
    </main>
  );
}
