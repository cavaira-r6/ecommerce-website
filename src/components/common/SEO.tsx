import React from 'react';
import { Helmet } from 'react-helmet-async';
import { metaConfig } from '../../config/meta';

interface SEOProps {
  page: keyof typeof metaConfig;
  customTitle?: string;
  customDescription?: string;
  customKeywords?: string;
  noindex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  page,
  customTitle,
  customDescription,
  customKeywords,
  noindex = false,
}) => {
  const meta = metaConfig[page];

  return (
    <Helmet>
      <title>{customTitle || meta.title}</title>
      <meta name="description" content={customDescription || meta.description} />
      <meta name="keywords" content={customKeywords || meta.keywords} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* OpenGraph meta tags */}
      <meta property="og:title" content={customTitle || meta.title} />
      <meta property="og:description" content={customDescription || meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="MiniU" />
      
      {/* Twitter meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={customTitle || meta.title} />
      <meta name="twitter:description" content={customDescription || meta.description} />
      
      {/* Structured data for products */}
      {page === 'shop' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'MiniU',
            url: 'https://www.miniu.com',
            logo: 'https://www.miniu.com/logo.png',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+216-XX-XXX-XXX',
              contactType: 'customer service'
            }
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
