"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { ProtectedRoute } from "@/components/protected-route"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminHeader } from "@/components/admin/admin-header"

interface HeroSlide {
  _id?: string;
  type: "image" | "video";
  media: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/hero`);
      setSlides(Array.isArray(data) ? data : [data]);
    } catch (err: any) {
      console.error("Failed to fetch slides:", err.response?.data || err.message);
      toast.error("Failed to load slides");
    }
  };

  const buildSrc = (raw: string | undefined) => {
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    return `${API_URL.replace("/api", "")}/${raw}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      const localPreview = URL.createObjectURL(selected);
      setPreview(localPreview);
    } else {
      setPreview("");
    }
  };

  const handleSave = async () => {
    if (!editing) return;

    try {
      const formData = new FormData();
      formData.append("title", editing.title || "");
      formData.append("subtitle", editing.subtitle || "");
      formData.append("description", editing.description || "");
      formData.append("type", editing.type);
      if (file) {
        const isVideo = file.type.startsWith("video/");
        formData.append("media", file);
        formData.append("type", isVideo ? "video" : "image");
      }

      const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.token;

      let res;
      if (editing._id) {
        res = await axios.put(`${API_URL}/hero/${editing._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        res = await axios.post(`${API_URL}/hero`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success(editing._id ? "Slide updated" : "Slide added");
      setEditing(null);
      setFile(null);
      setPreview("");
      fetchSlides();
    } catch (err: any) {
      console.error("Failed to save slide:", err.response?.data || err.message);
      toast.error("Failed to save slide");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token") ||
        JSON.parse(localStorage.getItem("user") || "{}")?.token;

      await axios.delete(`${API_URL}/hero/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Slide deleted successfully");
      setConfirmDeleteId(null);
      fetchSlides();
    } catch (err: any) {
      console.error("Failed to delete slide:", err.response?.data || err.message);
      toast.error("Failed to delete slide");
    }
  };

  return (
     <ProtectedRoute requiredRole="admin">
          <AdminLayout>
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">🎞️ Hero Banner Management</h1>

      <Button onClick={() => setEditing({ type: "image", media: "" })}>
        Add New Slide
      </Button>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 mt-4">
        {slides.length === 0 && (
          <p className="text-gray-500 text-sm">No slides found.</p>
        )}

        {slides.map((slide) => (
          <Card key={slide._id} className="p-4 relative">
            {slide.type === "image" ? (
              <img
                src={buildSrc(slide.media)}
                className="w-full h-40 rounded-md object-cover"
                alt={slide.title || "hero image"}
              />
            ) : (
              <video controls className="w-full h-40 rounded-md">
                <source src={buildSrc(slide.media)} />
              </video>
            )}

            <div className="mt-2">
              <h3 className="font-semibold">{slide.title}</h3>
              <p className="text-sm text-gray-600">{slide.subtitle}</p>
              <p className="text-xs text-gray-500">{slide.description}</p>
            </div>

            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={() => setEditing(slide)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setConfirmDeleteId(slide._id!)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* 🗑️ Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-3">Confirm Deletion</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this slide? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="destructive"
                onClick={() => handleDelete(confirmDeleteId)}
              >
                Yes, Delete
              </Button>
              <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ✏️ Add/Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md">
            <h2 className="text-lg mb-3 font-semibold">
              {editing._id ? "Edit Slide" : "Add Slide"}
            </h2>

            {(preview || editing.media) &&
              (editing.type === "image" ? (
                <img
                  src={preview || buildSrc(editing.media)}
                  className="w-full h-40 rounded-md mb-3 object-cover"
                  alt="preview"
                />
              ) : (
                <video
                  src={preview || buildSrc(editing.media)}
                  controls
                  className="w-full h-40 rounded-md mb-3"
                />
              ))}

            <Input
              type="text"
              placeholder="Title"
              value={editing.title || ""}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className="mb-2"
            />
            <Input
              type="text"
              placeholder="Subtitle"
              value={editing.subtitle || ""}
              onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })}
              className="mb-2"
            />
            <Input
              type="text"
              placeholder="Description"
              value={editing.description || ""}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
              className="mb-2"
            />

            <Input type="file" accept="image/*,video/*" onChange={handleFileChange} />
            <p className="text-xs text-gray-500 mt-1">
              📸 Max image size: 10MB &nbsp; | &nbsp; 🎥 Max video size: 100MB
            </p>
            <div className="flex justify-between mt-3">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
    </AdminLayout>
    </ProtectedRoute>
  );
}
