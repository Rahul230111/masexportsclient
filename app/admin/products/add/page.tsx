"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface ImageData {
  text: string;
  image: File | null;
}

export default function AddProductPage() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [descriptions, setDescriptions] = useState<ImageData[]>([
    { text: "", image: null },
    { text: "", image: null },
    { text: "", image: null },
  ]);
  const [features, setFeatures] = useState<ImageData[]>([
    { text: "", image: null },
    { text: "", image: null },
    { text: "", image: null },
  ]);

  const categories = ["Devine", "Cosmetics", "Accessories"];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    index: number,
    field: "text" | "image",
    value: string | File,
    setter: React.Dispatch<React.SetStateAction<ImageData[]>>
  ) => {
    setter((prev) => {
      const updated = [...prev];
      if (field === "text") updated[index].text = value as string;
      else updated[index].image = value as File;
      return updated;
    });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("price", product.price);
  formData.append("quantity", product.quantity);
  formData.append("category", product.category);

  // 🖼️ Main Image
  if (mainImage) formData.append("mainImage", mainImage);

  // 📝 Descriptions (text + images)
  descriptions.forEach((desc, i) => {
    formData.append(`descriptions[${i}][text]`, desc.text);
    if (desc.image) formData.append("descImages", desc.image);
  });

  // ⭐ Features (text + images)
  features.forEach((feat, i) => {
    formData.append(`features[${i}][text]`, feat.text);
    if (feat.image) formData.append("featureImages", feat.image);
  });

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Product added successfully!");
      console.log("Response:", data);
    } else {
      alert("❌ Failed to add product: " + data.message);
      console.log("Error:", data);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Something went wrong while adding product.");
  }
};

  // 🟢 File picker button component
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

    const handleClick = () => {
      inputRef.current?.click();
    };

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

  return (
    <div className="max-w-4xl mx-auto py-10">
      <Card>
        <CardContent className="space-y-8">
          <h1 className="text-2xl font-semibold mb-4">Add New Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 🧩 Basic Info */}
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

            {/* 🧩 Main Image */}
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

            {/* 🧩 Descriptions */}
            <div>
              <h2 className="font-semibold mb-2">Descriptions</h2>
              {descriptions.map((desc, i) => (
                <div
                  key={i}
                  className="space-y-2 mb-4 border p-3 rounded-md bg-gray-50"
                >
                  <Textarea
                    placeholder={`Description ${i + 1}`}
                    value={desc.text}
                    onChange={(e) =>
                      handleArrayChange(i, "text", e.target.value, setDescriptions)
                    }
                  />
                  <FileButton
                    label="Choose Description Image"
                    file={desc.image}
                    onChange={(file) =>
                      handleArrayChange(i, "image", file, setDescriptions)
                    }
                  />
                </div>
              ))}
            </div>

            {/* 🧩 Features */}
            <div>
              <h2 className="font-semibold mb-2">Features</h2>
              {features.map((feat, i) => (
                <div
                  key={i}
                  className="space-y-2 mb-4 border p-3 rounded-md bg-gray-50"
                >
                  <Textarea
                    placeholder={`Feature ${i + 1}`}
                    value={feat.text}
                    onChange={(e) =>
                      handleArrayChange(i, "text", e.target.value, setFeatures)
                    }
                  />
                  <FileButton
                    label="Choose Feature Image"
                    file={feat.image}
                    onChange={(file) =>
                      handleArrayChange(i, "image", file, setFeatures)
                    }
                  />
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full">
              Save Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
