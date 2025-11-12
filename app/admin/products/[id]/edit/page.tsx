"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import JoditEditorComponent from "@/components/JoditEditorComponent";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminHeader } from "@/components/admin/admin-header";
import { Image, Video, Package, DollarSign, Scale, Tag, ArrowLeft } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    unitType: "unit",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImageUrl, setMainImageUrl] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const [descriptions, setDescriptions] = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);

  const categories = [
    "Animal & Dairy Products",
    "Agricultural Products",
    "Coir & Fiber Products",
  ];

  // 🟢 Fetch product
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
        setVideoUrl(data.video || "");
        setDescriptions(data.descriptions?.length ? data.descriptions : [""]);
        setFeatures(data.features?.length ? data.features : [""]);
      } catch (err: any) {
        toast.error(err.message || "Failed to load product");
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

  // ✅ Reusable FileButton
  const FileButton = ({
    label,
    file,
    onChange,
    accept,
    icon: Icon,
  }: {
    label: string;
    file: File | null;
    onChange: (file: File) => void;
    accept: string;
    icon: any;
  }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const handleClick = () => inputRef.current?.click();

    return (
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          className="flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Icon className="w-4 h-4" />
          {label}
        </Button>
        <span className="text-sm text-gray-600">
          {file ? file.name : "No file chosen"}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
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
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("category", product.category);
    formData.append("unitType", product.unitType);
    formData.append("descriptions", JSON.stringify(descriptions));
    formData.append("features", JSON.stringify(features));

    if (mainImage) formData.append("mainImage", mainImage);
    if (videoFile) formData.append("video", videoFile);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/${id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Product updated successfully!");
        router.push("/admin/products");
      } else {
        toast.error(`❌ Failed: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-center py-10">Loading product...</p>;

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <AdminHeader title="Edit Product" />

        <div className="max-w-4xl mx-auto py-10">
          <div className="flex justify-end mb-6">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/products")}
              className="flex items-center gap-2 hover:scale-105 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Button>
          </div>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
            <CardContent className="space-y-8 p-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Product Name</Label>
                  <Input name="name" value={product.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input name="price" type="number" value={product.price} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label>{product.unitType === "unit" ? "Quantity" : "Weight"}</Label>
                  <Input name="quantity" type="number" value={product.quantity} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label>Category</Label>
                  <select
                    name="category"
                    value={product.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Unit Type</Label>
                  <select
                    name="unitType"
                    value={product.unitType}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    required
                  >
                    <option value="unit">Unit</option>
                    <option value="weight">Weight (grams/kg)</option>
                  </select>
                </div>
              </div>

              {/* Media */}
             {/* Media */}
<div className="space-y-4">
  <h2 className="text-lg font-semibold flex items-center gap-2">
    <Image className="w-5 h-5" /> Product Media
  </h2>

  {/* Preview of current media */}
  {(() => {
    const fileUrl = mainImage ? URL.createObjectURL(mainImage) : videoFile ? URL.createObjectURL(videoFile) : mainImageUrl || videoUrl;
    if (!fileUrl) return null;

    if (fileUrl.match(/\.(mp4|webm|ogg)$/i)) {
      return <video src={fileUrl} controls className="w-48 h-32 rounded border" />;
    } else {
      return <img src={fileUrl} alt="Product Media" className="w-32 h-32 object-cover rounded border" />;
    }
  })()}

  {/* Single choose file button */}
  <FileButton
    label="Choose Product Media"
    file={mainImage || videoFile}
    onChange={(file) => {
      // reset both, then decide type
      setMainImage(null);
      setVideoFile(null);

      if (file.type.startsWith("video/")) {
        setVideoFile(file);
      } else if (file.type.startsWith("image/")) {
        setMainImage(file);
      }
    }}
    accept="image/*,video/*"
    icon={Video}
  />
</div>


              {/* Descriptions */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Descriptions</h2>
                {descriptions.map((desc, i) => (
                  <JoditEditorComponent
                    key={i}
                    value={desc}
                    onChange={(newValue) => handleArrayChange(i, newValue, setDescriptions)}
                    placeholder={`Description ${i + 1}`}
                  />
                ))}
                <Button type="button" variant="secondary" onClick={() => addNewField(setDescriptions)}>
                  + Add More Description
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Features</h2>
                {features.map((feat, i) => (
                  <Textarea
                    key={i}
                    placeholder={`Feature ${i + 1}`}
                    value={feat}
                    onChange={(e) => handleArrayChange(i, e.target.value, setFeatures)}
                    className="transition-all duration-200 focus:scale-105"
                  />
                ))}
                <Button type="button" variant="secondary" onClick={() => addNewField(setFeatures)}>
                  + Add More Feature
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 transition-all duration-300 hover:scale-105"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? "Updating Product..." : "Update Product"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
