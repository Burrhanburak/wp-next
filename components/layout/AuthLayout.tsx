import { ReactNode } from 'react';
import Head from 'next/head';
import { Toaster } from "@/components/ui/sonner"

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title = 'WhatsApp Bulk Messaging' }: AuthLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="WhatsApp Bulk Messaging Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-background">
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
          <div className="lg:p-8">
            <Toaster />
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
