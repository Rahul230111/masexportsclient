"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminHeader } from "@/components/admin/admin-header";
import { 
  Package, 
  DollarSign, 
  Scale, 
  Image, 
  FileText, 
  Star, 
  ArrowLeft,
  Building,
  Tag
} from "lucide-react";

export default function AddProductPage() {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    unitType: "unit",
    industry: "massexports",
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [descriptions, setDescriptions] = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Animal & Dairy Products",
    "Agricultural Products",
    "Coir & Fiber Products",
  ];

  const industries = [
    { value: "massexports", label: "Mass Exports" },
    { value: "dhanalakshmi", label: "Dhanalakshmi" },
  ];

  const unitTypes = [
    { value: "unit", label: "Unit", icon: Package },
    { value: "weight", label: "Weight", icon: Scale },
  ];

  // Input change handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Array change handler
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

  // Add new array field
  const addNewField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, ""]);
  };

  // Remove array field
  const removeField = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  // File input component
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
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleClick}
          className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
        >
          <Image className="w-4 h-4" />
          {label}
        </Button>
        <span className="text-sm text-gray-600 transition-opacity duration-200">
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

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("category", product.category);
    formData.append("unitType", product.unitType);
    formData.append("industry", product.industry);

    if (mainImage) formData.append("mainImage", mainImage);
    formData.append("descriptions", JSON.stringify(descriptions.filter(desc => desc.trim() !== "")));
    formData.append("features", JSON.stringify(features.filter(feat => feat.trim() !== "")));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Product added successfully!");
        setProduct({ 
          name: "", 
          price: "", 
          quantity: "", 
          category: "", 
          unitType: "unit",
          industry: "massexports" 
        });
        setMainImage(null);
        setDescriptions([""]);
        setFeatures([""]);
      } else {
        toast.error("❌ Failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong while adding product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <AdminHeader title="Add New Product" />
        <div className="max-w-4xl mx-auto py-10">
          <div className="flex justify-end max-w-4xl mx-auto mt-4 mb-10">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/admin/products")}
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Button>
          </div>
          <Card className="border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
            <CardContent className="space-y-8 p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg transition-transform duration-200 hover:scale-110">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Add New Product
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Basic Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Product Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter product name"
                        value={product.name}
                        onChange={handleInputChange}
                        required
                        className="transition-all duration-200 focus:scale-105"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price" className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Price
                      </Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="Enter price"
                        value={product.price}
                        onChange={handleInputChange}
                        required
                        className="transition-all duration-200 focus:scale-105"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="flex items-center gap-2">
                        {product.unitType === "unit" ? <Package className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
                        {product.unitType === "unit" ? "Quantity" : "Weight"}
                      </Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        placeholder={
                          product.unitType === "unit"
                            ? "Enter quantity"
                            : "Enter weight in grams/kg"
                        }
                        value={product.quantity}
                        onChange={handleInputChange}
                        required
                        className="transition-all duration-200 focus:scale-105"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Category
                      </Label>
                      <select
                        id="category"
                        name="category"
                        value={product.category}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md p-2 text-sm transition-all duration-200 focus:scale-105"
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
                </div>

                {/* Industry Selection */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Industry
                  </h2>
                  <RadioGroup 
                    value={product.industry} 
                    onValueChange={(value) => setProduct(prev => ({ ...prev, industry: value }))}
                    className="flex gap-4"
                  >
                    {industries.map((industry) => (
                      <div key={industry.value} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={industry.value} 
                          id={industry.value}
                          className="transition-transform duration-200 hover:scale-110"
                        />
                        <Label 
                          htmlFor={industry.value}
                          className="cursor-pointer transition-all duration-200 hover:text-gray-700"
                        >
                          {industry.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Unit Type Selection */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    Unit Type
                  </h2>
                  <RadioGroup 
                    value={product.unitType} 
                    onValueChange={(value) => setProduct(prev => ({ ...prev, unitType: value }))}
                    className="grid grid-cols-2 gap-4 max-w-md"
                  >
                    {unitTypes.map((unit) => {
                      const IconComponent = unit.icon;
                      return (
                        <div key={unit.value}>
                          <RadioGroupItem
                            value={unit.value}
                            id={unit.value}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={unit.value}
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all duration-200 hover:scale-105"
                          >
                            <IconComponent className="w-6 h-6 mb-2" />
                            {unit.label}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Product Image
                  </h2>
                  <FileButton
                    label="Choose Product Image"
                    file={mainImage}
                    onChange={(file) => setMainImage(file)}
                  />
                </div>

                {/* Descriptions */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Descriptions
                  </h2>
                  {descriptions.map((desc, i) => (
                    <div key={i} className="flex gap-2 items-start transition-all duration-200">
                      <Textarea
                        placeholder={`Description ${i + 1}`}
                        value={desc}
                        onChange={(e) =>
                          handleArrayChange(i, e.target.value, setDescriptions)
                        }
                        className="flex-1 transition-all duration-200 focus:scale-105"
                      />
                      {descriptions.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeField(i, setDescriptions)}
                          className="mt-1 transition-all duration-200 hover:scale-110"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => addNewField(setDescriptions)}
                    className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
                  >
                    + Add More Description
                  </Button>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Features
                  </h2>
                  {features.map((feat, i) => (
                    <div key={i} className="flex gap-2 items-start transition-all duration-200">
                      <Textarea
                        placeholder={`Feature ${i + 1}`}
                        value={feat}
                        onChange={(e) =>
                          handleArrayChange(i, e.target.value, setFeatures)
                        }
                        className="flex-1 transition-all duration-200 focus:scale-105"
                      />
                      {features.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeField(i, setFeatures)}
                          className="mt-1 transition-all duration-200 hover:scale-110"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => addNewField(setFeatures)}
                    className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
                  >
                    + Add More Feature
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Product...
                    </div>
                  ) : (
                    "Save Product"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}