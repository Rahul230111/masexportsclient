"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminHeader } from "@/components/admin/admin-header"
import { ProductForm } from "@/components/admin/product-form"

export default function EditProductPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <div className="space-y-6">
          <AdminHeader title="Edit Product" description="Update product details and images" />
          <ProductForm isEditing />
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
