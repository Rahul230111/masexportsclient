"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Edit2,
  Trash2,
  Plus,
  Building,
  Package,
  DollarSign,
  Scale,
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export interface ProductMedia {
  type: "image" | "video";
  url: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  media: ProductMedia[]; 
  category: string;
  industry: string;
  image: string;
  mainImage?: string;
  video?:string;
  unitType: "unit" | "weight";
  
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 🟢 Fetch products from API
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product`);
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search and industry
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (industryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.industry === industryFilter
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, industryFilter, products]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // 🟠 Delete product
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${deleteId}`
      );
      setProducts((prev) => prev.filter((p) => p._id !== deleteId));
      toast.success("✅ Product deleted successfully");
      setDeleteId(null);
    } catch (err: any) {
      console.error("Delete failed:", err.response?.data || err.message);
      toast.error("❌ Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  // Industry tag component
  const IndustryTag = ({ industry }: { industry: string }) => {
    const getIndustryStyles = () => {
      switch (industry) {
        case "massexports":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "dhanalakshmi":
          return "bg-green-100 text-green-800 border-green-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    const getIndustryLabel = () => {
      switch (industry) {
        case "massexports":
          return "Mass Exports";
        case "dhanalakshmi":
          return "Dhanalakshmi";
        default:
          return industry;
      }
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 ${getIndustryStyles()}`}
      >
        <Building className="w-3 h-3" />
        {getIndustryLabel()}
      </span>
    );
  };

  // Category badge component
  const CategoryBadge = ({ category }: { category: string }) => (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 transition-all duration-200 hover:scale-105">
      <Package className="w-3 h-3 mr-1" />
      {category}
    </span>
  );

  // Pagination component
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md p-1 text-sm transition-all duration-200 focus:scale-105"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-muted-foreground">per page</span>
          </div>
          <span className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* First Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="transition-all duration-200 hover:scale-105"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>

          {/* Previous Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="transition-all duration-200 hover:scale-105"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Page Numbers */}
          {pageNumbers.map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={`transition-all duration-200 hover:scale-105 ${
                currentPage === page ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              {page}
            </Button>
          ))}

          {/* Next Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="transition-all duration-200 hover:scale-105"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Last Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="transition-all duration-200 hover:scale-105"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg transition-transform duration-200 hover:scale-110">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Products
                </h1>
              </div>
              <p className="text-muted-foreground">
                Manage your product catalog
              </p>
            </div>
            <Link href="/admin/products/add">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 transition-all duration-200 hover:scale-105">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </Link>
          </div>

          {/* Search and Filter Section */}
          <Card className="border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full md:max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search products by name or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 transition-all duration-200 focus:scale-105"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 text-sm transition-all duration-200 focus:scale-105"
                  >
                    <option value="all">All Industries</option>
                    <option value="massexports">Mass Exports</option>
                    <option value="dhanalakshmi">Dhanalakshmi</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card className="border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
            {loading ? (
              <div className="p-12 text-center">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-muted-foreground">
                    Loading products...
                  </span>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || industryFilter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by adding your first product."}
                </p>
                {!searchTerm && industryFilter === "all" && (
                  <Link href="/admin/products/add">
                    <Button className="gap-2 transition-all duration-200 hover:scale-105">
                      <Plus className="w-4 h-4" />
                      Add Your First Product
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                          PRODUCT
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                          CATEGORY
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                          INDUSTRY
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                          PRICE
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                          QUANTITY
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {currentProducts.map((product) => (
                        <tr
                          key={product._id}
                          className="hover:bg-muted/30 transition-all duration-200 group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                               {/* Product Media (Image or Video) */}
<div className="relative w-16 h-16 rounded-lg overflow-hidden">
  {(() => {
    const videoItem = product.media?.find((m) => m.type === "video");
    const imageItem = product.media?.find((m) => m.type === "image");

    const videoUrl = videoItem
      ? videoItem.url.startsWith("http")
        ? videoItem.url
        : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${videoItem.url}`
      : null;

    const imageUrl = imageItem
      ? imageItem.url.startsWith("http")
        ? imageItem.url
        : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${imageItem.url}`
      : "/placeholder.svg";

    return videoUrl ? (
      <div className="relative w-full h-full">
        <video
          src={videoUrl}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={(e) => {
            console.warn("Video failed → showing fallback image");
            e.currentTarget.classList.add("hidden");
            const img = e.currentTarget.parentElement?.querySelector("img");
            if (img) img.classList.remove("hidden");
          }}
        />

        {/* Fallback image (hidden until video fails) */}
        <img
          src={imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover hidden"
        />
      </div>
    ) : (
      <img
        src={imageUrl}
        alt={product.name}
        className="w-full h-full object-cover"
        onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
      />
    );
  })()}

  {/* Hover overlay */}
  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
</div>


                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-200" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm group-hover:text-primary transition-colors duration-200">
                                  {product.name}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    ₹{product.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <CategoryBadge category={product.category} />
                          </td>
                          <td className="px-6 py-4">
                            <IndustryTag industry={product.industry} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 font-semibold">
                              ₹{product.price}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 font-semibold">
                              {product.unitType === "weight" ? (
                                <Scale className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Package className="w-4 h-4 text-orange-600" />
                              )}
                              {product.quantity}{" "}
                              {product.unitType === "weight" ? "kg" : "nos"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/products/${product._id}/edit`}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-primary hover:bg-primary/10 transition-all duration-200 hover:scale-110"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteId(product._id)}
                                className="text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-110"
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

                {/* Pagination */}
                <Pagination />
              </>
            )}
          </Card>

          {/* Stats Summary */}
          {!loading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Products
                    </p>
                    <p className="text-xl font-bold">
                      {filteredProducts.length}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Mass Exports
                    </p>
                    <p className="text-xl font-bold">
                      {
                        filteredProducts.filter(
                          (p) => p.industry === "massexports"
                        ).length
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Building className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Dhanalakshmi
                    </p>
                    <p className="text-xl font-bold">
                      {
                        filteredProducts.filter(
                          (p) => p.industry === "dhanalakshmi"
                        ).length
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Price</p>
                    <p className="text-xl font-bold">
                      ₹
                      {Math.round(
                        filteredProducts.reduce((acc, p) => acc + p.price, 0) /
                          filteredProducts.length
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 scale-95 hover:scale-100">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-6 h-6 text-destructive" />
                </div>
                <h2 className="text-lg font-semibold mb-2">Delete Product?</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Are you sure you want to delete this product? This action
                  cannot be undone.
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteId(null)}
                    disabled={deleting}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
