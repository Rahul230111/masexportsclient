"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import JoditEditorComponent from "@/components/JoditEditorComponent";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminHeader } from "@/components/admin/admin-header";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    unitType: "unit", // default unit
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImageUrl, setMainImageUrl] = useState<string>("");

  const [descriptions, setDescriptions] = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);

  const categories = [
    "Animal & Dairy Products",
    "Agricultural Products",
    "Coir & Fiber Products",
  ];

  const categoryDescriptions: Record<string, string[]> = {
    "Animal & Dairy Products": ["Milk Products", "Egg Products", "Meat Items"],
    "Agricultural Products": ["Fruits", "Vegetables", "Grains"],
    "Coir & Fiber Products": ["Coir Rope", "Coir Mat", "Coconut Fiber"],
  };

  // 🟢 Fetch existing product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch product");

        setProduct({
          name: data.name || "",
          price: data.price?.toString() || "",
          quantity: data.quantity?.toString() || "",
          category: data.category || "",
          unitType: data.unitType || "unit",
        });

        setMainImageUrl(data.mainImage || "");
        setDescriptions(data.descriptions?.length ? data.descriptions : [""]);
        setFeatures(data.features?.length ? data.features : [""]);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));

    if (name === "category" && value) {
      setDescriptions(categoryDescriptions[value] || [""]);
      setFeatures([""]);
    }
  };

  const handleArrayChange = (
    index: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addNewField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, ""]);
  };

  const FileButton = ({
    label,
    file,
    onChange,
  }: {
    label: string;
    file: File | null;
    onChange: (file: File) => void;
  }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const handleClick = () => inputRef.current?.click();

    return (
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" onClick={handleClick}>
          {label}
        </Button>
        <span className="text-sm text-gray-600">
          {file ? file.name : "No file chosen"}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) onChange(selected);
          }}
        />
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("category", product.category);
    formData.append("unitType", product.unitType); // ✅ include unitType
    formData.append("descriptions", JSON.stringify(descriptions));
    formData.append("features", JSON.stringify(features));
    if (mainImage) formData.append("mainImage", mainImage);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Product updated successfully!");
        setTimeout(() => router.push("/admin/products"), 1000);
      } else {
        toast.error(`❌ Failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong.");
    }
  };

  if (loading) return <p className="text-center py-10">Loading product...</p>;

  return (
    <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <AdminHeader title="Edit Product" />
    <div className="max-w-4xl mx-auto py-10">
      <Card>
        <CardContent className="space-y-8">
          

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                name="name"
                placeholder="Product Name"
                value={product.name}
                onChange={handleInputChange}
                required
              />
              <Input
                name="price"
                type="number"
                placeholder="Price"
                value={product.price}
                onChange={handleInputChange}
                required
              />
              <Input
                name="quantity"
                type="number"
                placeholder="Quantity"
                value={product.quantity}
                onChange={handleInputChange}
                required
              />
              <div>
                <label className="block text-sm font-medium mb-1">Unit Type</label>
                <select
                  name="unitType"
                  value={product.unitType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  required
                >
                  <option value="unit">Unit</option>
                  <option value="weight">Grams / Kg</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium mb-1">Main Image</label>
              {mainImageUrl && !mainImage && (
                <img
                  src={mainImageUrl}
                  alt="Current"
                  className="w-32 h-32 object-cover rounded mb-2 border"
                />
              )}
              <FileButton
                label="Choose New Main Image"
                file={mainImage}
                onChange={(file) => setMainImage(file)}
              />
            </div>

            {/* Descriptions */}
            <div>
              <h2 className="font-semibold mb-2">
                {product.category ? `${product.category} Details` : "Details"}
              </h2>
              {descriptions.map((desc, i) => (
                <JoditEditorComponent
    value={descriptions[0] || ""}
    onChange={(newContent: string) => setDescriptions([newContent])}
  />
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => addNewField(setDescriptions)}
              >
                + Add More Description
              </Button>
            </div>

            {/* Features */}
            <div>
              <h2 className="font-semibold mb-2">Features</h2>
              {features.map((feat, i) => (
                <Textarea
                  key={i}
                  placeholder={`Feature ${i + 1}`}
                  value={feat}
                  onChange={(e) =>
                    handleArrayChange(i, e.target.value, setFeatures)
                  }
                  className="mb-2"
                />
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => addNewField(setFeatures)}
              >
                + Add More Feature
              </Button>
            </div>

            <Button type="submit" className="w-full">
              Update Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </AdminLayout>
    </ProtectedRoute>
    
  );
}
