import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { useTranslations, bilingual, type Lang } from '../../i18n/utils';

export function getStaticPaths() {
  return [{ params: { lang: 'fr' } }, { params: { lang: 'en' } }];
}

export async function GET(context: any) {
  const lang = context.params.lang as Lang;
  const t = useTranslations(lang);

  const news = (await getCollection('news', ({ data }: any) => !data.draft)).sort(
    (a: any, b: any) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: `${t('site.name')} — ${t('news.title')}`,
    description: t('news.lead'),
    site: context.site,
    trailingSlash: true,
    items: news.map((item: any) => ({
      title: bilingual(item.data, 'title', lang),
      description: bilingual(item.data, 'summary', lang),
      pubDate: item.data.date,
      link: `/${lang}/news/${item.id}/`,
    })),
    customData: `<language>${lang}</language>`,
  });
}
