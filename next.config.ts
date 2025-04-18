import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/shared/i18n/request.ts');

const nextConfig = {};

export default withNextIntl(nextConfig);
