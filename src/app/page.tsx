'use client';

import { Providers } from './Providers';
import Setup from '../app/setup';
import { ThemeProviderWithAttribute } from './contexts/ThemeContext'; // Import ThemeProviderWithAttribute
import { AuthContextProvider } from './contexts/AuthContext';
export default function Home() {


  return (
    <>
      <AuthContextProvider>
        <Providers>
          {/* Use ThemeProviderWithAttribute to wrap your components */}
          <ThemeProviderWithAttribute>
            <Setup />
          </ThemeProviderWithAttribute>
        </Providers>
      </AuthContextProvider>
    </>
  );
}
