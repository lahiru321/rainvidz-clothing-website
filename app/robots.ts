import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/payment/'],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
        ],
        sitemap: 'https://rainvidz.com/sitemap.xml',
    }
}
