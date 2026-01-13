'use client';

import { useEffect } from 'react';
import BaseLayout from '@/components/BaseLayout';
import { redirect } from 'next/navigation'; // Use redirect for server-side redirect

// Redirect to home page since chat is now accessible via floating button
export default function ChatPage() {
  redirect('/');

  // Fallback JSX in case redirect doesn't happen immediately
  return (
    <BaseLayout>
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Redirecting to home page...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    </BaseLayout>
  );
}