import CategoryView from './CategoryView';

export function generateStaticParams() {
  return [
    { category: 'eat-drink' },
    { category: 'furniture' },
    { category: 'play-rest' },
    { category: 'hygiene' },
    { category: 'daily' },
    { category: 'bath' },
    { category: 'travel' }
  ];
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return <CategoryView category={category} />;
}
