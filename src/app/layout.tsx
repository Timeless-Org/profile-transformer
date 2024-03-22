import type { Metadata } from 'next'
import { Mochiy_Pop_One } from 'next/font/google'
import './globals.css'

const mochiyPopOne = Mochiy_Pop_One({ weight: "400", style: "normal", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Profile Transformer",
  description: "Profile Transformer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={mochiyPopOne.className}>{children}</body>
    </html>
  );
}
