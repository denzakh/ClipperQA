"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export interface ProductItem {
  id: string;
  title: string;
  price: string;
}

export interface ProductGridProps {
  products: ProductItem[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div>
      {cartCount > 0 && (
        <p className="mb-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Items in cart: {cartCount}
        </p>
      )}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <li key={product.id}>
            <Card className="flex h-full flex-col overflow-hidden p-0">
              <div
                className="aspect-square bg-gradient-to-br from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900"
                aria-hidden
              />
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h2 className="text-base font-semibold text-foreground">
                  {product.title}
                </h2>
                <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
                  {product.price}
                </p>
                <Button
                  variant="primary"
                  className="mt-auto w-full sm:w-auto"
                  onClick={() => setCartCount((c) => c + 1)}
                >
                  <ShoppingCart className="h-4 w-4" aria-hidden />
                  Add to Cart
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};
