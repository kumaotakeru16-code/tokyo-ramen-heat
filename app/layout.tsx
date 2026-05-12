import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tokyo Ramen Heat — 今、東京で熱いラーメン店',
  description: 'Googleレビューの増加と評価変化から、急上昇中の店を可視化。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#050507" />
      </head>
      <body>{children}</body>
    </html>
  )
}
