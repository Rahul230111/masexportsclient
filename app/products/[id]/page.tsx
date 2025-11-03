import ProductDetails from "./ProductDetails";

interface Params {
  id: string;
}

export default async function ProductPage({ params }: { params: Params }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${params.id}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch product");

    const product = await res.json();

    if (!product) {
      return (
        <div className="flex justify-center items-center h-screen text-gray-500 text-xl">
          Product not found
        </div>
      );
    }

    return <ProductDetails product={product} />;
  } catch (error) {
    console.error(error);
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-xl">
        Something went wrong. Please try again later.
      </div>
    );
  }
}
