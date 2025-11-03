"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminHeader } from "@/components/admin/admin-header";

export default function AddProductPage() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [descriptions, setDescriptions] = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);

  const categories = [
    "Animal & Dairy Products",
    "Agricultural Products",
    "Coir & Fiber Products",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
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

    if (mainImage) formData.append("mainImage", mainImage);
    formData.append("descriptions", JSON.stringify(descriptions));
    formData.append("features", JSON.stringify(features));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Product added successfully!");
        setProduct({ name: "", price: "", quantity: "", category: "" });
        setMainImage(null);
        setDescriptions([""]);
        setFeatures([""]);
      } else {
        toast.error("❌ Failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong while adding product.");
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <AdminHeader title="Add New Product" 
        />
        <div className="max-w-4xl mx-auto py-10">
          <div className="flex justify-end max-w-4xl mx-auto mt-4 mb-10">
  <Button
    variant="outline"
    onClick={() => (window.location.href = "/admin/products")}
  >
    ← Back to Products
  </Button>
</div>
          <Card>
            <CardContent className="space-y-8">
              <h1 className="text-2xl font-semibold mb-4">Add New Product</h1>

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
                    <label className="block text-sm font-medium mb-1">
                      Category
                    </label>
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

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Main Product Image
                  </label>
                  <FileButton
                    label="Choose Product Image"
                    file={mainImage}
                    onChange={(file) => setMainImage(file)}
                  />
                </div>

                {/* Descriptions */}
                <div>
                  <h2 className="font-semibold mb-2">Descriptions</h2>
                  {descriptions.map((desc, i) => (
                    <Textarea
                      key={i}
                      placeholder={`Description ${i + 1}`}
                      value={desc}
                      onChange={(e) =>
                        handleArrayChange(i, e.target.value, setDescriptions)
                      }
                      className="mb-2"
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
                  Save Product
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
