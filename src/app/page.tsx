'use client';

import { Providers } from './Providers';
import Setup from '../app/setup';
import { ThemeProviderWithAttribute } from './contexts/ThemeContext'; // Import ThemeProviderWithAttribute
export default function Home() {


  return (
    <>
      <Providers>
        {/* Use ThemeProviderWithAttribute to wrap your components */}
        <ThemeProviderWithAttribute>
          <Setup />

        </ThemeProviderWithAttribute>
      </Providers>
    </>
  );
}
