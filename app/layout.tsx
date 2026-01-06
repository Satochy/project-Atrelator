import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="pt-br">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

export const metadata = {
  title: "Atrelator",
  description: "Gerencie seus projetos com Atrelator",
  icons: {
    icon: "/logo.svg",
  },
};