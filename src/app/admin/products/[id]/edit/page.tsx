import ProductFormView from '../../ProductFormView';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductFormView id={id} />;
}
