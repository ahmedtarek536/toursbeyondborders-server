const express = require('express');
const router = express.Router();

// Generate XML sitemap
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://toursgo.beyond';
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Static pages
    const staticUrls = [
      { loc: `${baseUrl}/`, lastmod: currentDate, changefreq: 'daily', priority: '1.0' },
      { loc: `${baseUrl}/egypt`, lastmod: currentDate, changefreq: 'weekly', priority: '0.9' },
      { loc: `${baseUrl}/packages`, lastmod: currentDate, changefreq: 'daily', priority: '0.9' },
      { loc: `${baseUrl}/services`, lastmod: currentDate, changefreq: 'weekly', priority: '0.8' },
      { loc: `${baseUrl}/blogs`, lastmod: currentDate, changefreq: 'daily', priority: '0.8' },
      { loc: `${baseUrl}/contact`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
      { loc: `${baseUrl}/customize`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' }
    ];

    // Dynamic package URLs (you can fetch from database)
    const packageUrls = [];
    try {
      const packagesService = require('../services/packages.service');
      const packages = await packagesService.getAllPackages();
      packages.forEach(pkg => {
        packageUrls.push({
          loc: `${baseUrl}/package/${pkg.id}`,
          lastmod: pkg.updatedAt ? pkg.updatedAt.split('T')[0] : currentDate,
          changefreq: 'weekly',
          priority: '0.8'
        });
      });
    } catch (error) {
      console.log('Could not fetch packages for sitemap:', error.message);
    }

    // Dynamic service URLs
    const serviceUrls = [];
    try {
      const servicesService = require('../services/services.service');
      const services = await servicesService.getAllServices();
      services.forEach(service => {
        serviceUrls.push({
          loc: `${baseUrl}/services/${service.id}`,
          lastmod: service.updatedAt ? service.updatedAt.split('T')[0] : currentDate,
          changefreq: 'weekly',
          priority: '0.7'
        });
      });
    } catch (error) {
      console.log('Could not fetch services for sitemap:', error.message);
    }

    // Dynamic blog URLs
    const blogUrls = [];
    try {
      const blogsService = require('../services/blogs.service');
      const blogs = await blogsService.getAllBlogs();
      blogs.forEach(blog => {
        blogUrls.push({
          loc: `${baseUrl}/blogs/${blog.id}`,
          lastmod: blog.updatedAt ? blog.updatedAt.split('T')[0] : currentDate,
          changefreq: 'monthly',
          priority: '0.6'
        });
      });
    } catch (error) {
      console.log('Could not fetch blogs for sitemap:', error.message);
    }

    // Combine all URLs
    const allUrls = [...staticUrls, ...packageUrls, ...serviceUrls, ...blogUrls];

    // Generate XML
    const urlEntries = allUrls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Generate robots.txt
router.get('/robots.txt', (req, res) => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /auth
Disallow: /api/

# Sitemap
Sitemap: https://toursgo.beyond/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Allow specific bots
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /`;

  res.set('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

module.exports = router;
