import type { Metadata } from "next";
import { ProductGrid, type ProductItem } from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our product catalog",
};

const sampleProducts: ProductItem[] = [
  { id: "1", title: "Studio Desk", price: "$429" },
  { id: "2", title: "Wireless Keyboard", price: "$89" },
  { id: "3", title: "Noise-Cancel Headphones", price: "$249" },
  { id: "4", title: "USB-C Hub", price: "$59" },
  { id: "5", title: "Ergonomic Chair", price: "$599" },
  { id: "6", title: "4K Monitor", price: "$399" },
];

const ProductsPage = () => {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Products
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
        Placeholder catalog — add items to the cart to try local state.
      </p>
      <div className="mt-10">
        <ProductGrid products={sampleProducts} />
      </div>
    </main>
  );
};

export default ProductsPage;
