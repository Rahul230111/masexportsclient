"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, Plus } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // 🟢 Fetch products from API
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🟠 Delete product
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  // 🟣 Update quantity
  const handleQuantityChange = async (id: string, value: number) => {
    setUpdating(id);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, { quantity: value });
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, quantity: value } : p))
      );
      toast.success("Quantity updated");
    } catch (err) {
      toast.error("Failed to update quantity");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <AdminHeader title="Products" description="Manage your product catalog" />
            <Link href="/admin/products/add">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          </div>

          <Card className="overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No products found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Quantity</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <span className="text-sm font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
                        <td className="px-6 py-4 text-sm font-semibold">₹{product.price}</td>
                        <td className="px-6 py-4">
                          <Input
                            type="number"
                            min={0}
                            className="w-24"
                            value={product.quantity}
                            disabled={updating === product._id}
                            onChange={(e) =>
                              handleQuantityChange(product._id, Number(e.target.value))
                            }
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/products/${product._id}/edit`}>
                              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product._id)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
