import type { NextConfig } from 'next'

// Медиа отдаются с того же origin, что и API (см. shared/api/media-url.ts), поэтому
// разрешённый для next/image хост выводим из NEXT_PUBLIC_API_URL, а не хардкодим.
// Переменная инлайнится на этапе сборки, так что стенд на домене и стенд на IP с
// нестандартным портом работают с одним и тем же конфигом.
const apiOrigin = (() => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) return null

  try {
    return new URL(apiUrl)
  } catch {
    console.warn(`next.config: NEXT_PUBLIC_API_URL is not a valid URL: ${apiUrl}`)
    return null
  }
})()

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  images: {
    remotePatterns: [
      ...(apiOrigin
        ? [
            {
              // URL.port — пустая строка для 80/443, и Next трактует её как
              // «порт по умолчанию», так что домен и IP:9090 покрываются одинаково.
              protocol: apiOrigin.protocol === 'https:' ? ('https' as const) : ('http' as const),
              hostname: apiOrigin.hostname,
              port: apiOrigin.port,
            },
          ]
        : []),
      {
        protocol: 'https',
        hostname: 'datavac.rassokha.pro',
      },
      {
        protocol: 'http',
        hostname: 'datavac.rassokha.pro',
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
