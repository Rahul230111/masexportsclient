// EditProductPage.tsx (replace your current file contents)
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

  // NEW: selected new files
  const [mediaFiles, setMediaFiles] = useState<{ file: File; preview: string; id: string }[]>([]);
  const mediaInputRef = useRef<HTMLInputElement | null>(null);

  // existing media loaded from backend
  const [existingMedia, setExistingMedia] = useState<{ url: string; type: "image" | "video"; id: string }[]>([]);
  // track which existing media user removed (send to backend)
  const [removedExisting, setRemovedExisting] = useState<string[]>([]);

  const [descriptions, setDescriptions] = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);

  const categories = [
    "Animal & Dairy Products",
    "Agricultural Products",
    "Coir & Fiber Products",
  ];

  // fetch product
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

        // expecting backend to return media: [{url, type}]
        const mediaFromServer = Array.isArray(data.media) ? data.media : [];
        setExistingMedia(
          mediaFromServer.map((m: any, idx: number) => ({
            url: m.url,
            type: m.type,
            id: `existing_${idx}_${Math.random().toString(36).slice(2, 8)}`,
          }))
        );

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index: number, value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });

  const addNewField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => setter((prev) => [...prev, ""]);

  // add new files
  const onSelectMedia = (files: File[]) => {
    const items = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    }));
    setMediaFiles((prev) => [...prev, ...items]);
  };

  // remove newly added selected file
  const removeSelectedMedia = (id: string) => {
    setMediaFiles((prev) => {
      const toRemove = prev.find((p) => p.id === id);
      if (toRemove) URL.revokeObjectURL(toRemove.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  // mark existing media for deletion
  const toggleRemoveExisting = (id: string) => {
    setRemovedExisting((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  useEffect(() => {
    return () => {
      mediaFiles.forEach((m) => URL.revokeObjectURL(m.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    // include new files
    mediaFiles.forEach((m) => formData.append("media", m.file));

    // include removed existing media ids (backend should handle deletion if supported)
    // we'll send the array of existingMedia.id values that were toggled removed
    const removedUrls = existingMedia.filter((m) => removedExisting.includes(m.id)).map((m) => m.url);
    formData.append("removedMedia", JSON.stringify(removedUrls));

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
            <Button variant="outline" onClick={() => router.push("/admin/products")} className="flex items-center gap-2 hover:scale-105 transition-all">
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
                  <select name="category" value={product.category} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" required>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Unit Type</Label>
                  <select name="unitType" value={product.unitType} onChange={handleInputChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" required>
                    <option value="unit">Unit</option>
                    <option value="weight">Weight (grams/kg)</option>
                  </select>
                </div>
              </div>

              {/* Media */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Image className="w-5 h-5" /> Product Media
                </h2>

                {/* Existing media (from server) */}
                <div className="flex flex-wrap gap-4">
                  {existingMedia.map((m) => (
                    <div key={m.id} className="relative">
                      {m.type === "video" ? (
                        <video src={m.url} controls className="w-48 h-32 rounded border" />
                      ) : (
                        <img src={m.url} alt="existing" className="w-32 h-32 object-cover rounded border" />
                      )}
                      <button
                        type="button"
                        onClick={() => toggleRemoveExisting(m.id)}
                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs ${removedExisting.includes(m.id) ? "bg-yellow-500 text-black" : "bg-red-600 text-white"}`}
                        title={removedExisting.includes(m.id) ? "Undo remove" : "Remove"}
                      >
                        {removedExisting.includes(m.id) ? "↺" : "×"}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Newly selected files preview */}
                <div className="flex flex-wrap gap-4 mt-2">
                  {mediaFiles.map((m) =>
                    m.file.type.startsWith("video/") ? (
                      <div key={m.id} className="relative">
                        <video src={m.preview} controls className="w-48 h-32 rounded border" />
                        <button type="button" onClick={() => removeSelectedMedia(m.id)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs">×</button>
                      </div>
                    ) : (
                      <div key={m.id} className="relative">
                        <img src={m.preview} className="w-32 h-32 object-cover rounded border" alt={m.file.name} />
                        <button type="button" onClick={() => removeSelectedMedia(m.id)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs">×</button>
                      </div>
                    )
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" onClick={() => mediaInputRef.current?.click()} className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Choose Media (Multiple)
                  </Button>

                  <input ref={mediaInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length) onSelectMedia(files);
                    if (mediaInputRef.current) mediaInputRef.current.value = "";
                  }} />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Descriptions</h2>
                {descriptions.map((desc, i) => (
                  <JoditEditorComponent key={i} value={desc} onChange={(newValue) => handleArrayChange(i, newValue, setDescriptions)} placeholder={`Description ${i + 1}`} />
                ))}
                <Button type="button" variant="secondary" onClick={() => addNewField(setDescriptions)}>
                  + Add More Description
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Features</h2>
                {features.map((feat, i) => (
                  <Textarea key={i} placeholder={`Feature ${i + 1}`} value={feat} onChange={(e) => handleArrayChange(i, e.target.value, setFeatures)} className="transition-all duration-200 focus:scale-105" />
                ))}
                <Button type="button" variant="secondary" onClick={() => addNewField(setFeatures)}>
                  + Add More Feature
                </Button>
              </div>

              <Button type="submit" className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700" disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? "Updating Product..." : "Update Product"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
