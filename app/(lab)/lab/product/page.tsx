import type { Metadata } from "next";
import ProductLanding from "@/components/lab/product/ProductLanding";

export const metadata: Metadata = {
  title: "Product starter — Lab",
  description: "Compose lab patterns into your own landing skeleton.",
};

export default function ProductPage() {
  return <ProductLanding />;
}
