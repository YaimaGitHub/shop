import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Favicon principal */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Manifest */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* Meta tags adicionales */}
        <meta name="theme-color" content="#4299e1" />
        <meta name="msapplication-TileColor" content="#4299e1" />

        {/* Preload para mejor rendimiento */}
        <link rel="preload" href="/favicon.ico" as="image" type="image/x-icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
