import { products as staticProducts } from '@/data/products';
import ProductDetailView from './ProductDetailView';

export const dynamicParams = true;

export function generateStaticParams() {
  return staticProducts.map((product) => ({
    id: product.id,
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailView id={id} />;
}
