// components/ReactQueryProvider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export default ReactQueryProvider;
