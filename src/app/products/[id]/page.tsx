import { products as staticProducts } from '@/data/products';
import ProductDetailView from './ProductDetailView';

// Fixed build error for static export: Separation of Concern
export function generateStaticParams() {
  return staticProducts.map((product) => ({
    id: product.id,
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailView id={id} />;
}
