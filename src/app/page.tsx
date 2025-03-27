import { Suspense } from 'react';
import ClientForm from '@/src/components/ui/ClientForm';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    client_mac?: string;
    gateway?: string;
    auth_token?: string;
    redir?: string;
  }>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<div>Laster inn...</div>}>
      <ClientForm
        clientMac={params.client_mac || ''}
        gateway={params.gateway || ''}
        authToken={params.auth_token || ''}
        redir={params.redir || ''}
      />
    </Suspense>
  );
}
