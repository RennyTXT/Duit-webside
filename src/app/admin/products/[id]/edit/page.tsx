import { products as staticProducts } from '@/data/products';
import ProductFormView from '../../ProductFormView';

// Fixed build error for static export in Admin section
export function generateStaticParams() {
  return staticProducts.map((product) => ({
    id: product.id,
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductFormView id={id} />;
}
