"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface AgencyImageUploadProps {
    agencyId: string;
    currentImageUrl: string | null;
    onImageUpdated: (newUrl: string) => void;
}

export default function AgencyImageUpload({ agencyId, currentImageUrl, onImageUpdated }: AgencyImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImageUrl);
    const supabase = createClient();

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be less than 5MB");
            return;
        }

        setUploading(true);

        try {
            // Get current user
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert("You must be logged in to upload images");
                return;
            }

            // Create unique filename
            const fileExt = file.name.split(".").pop();
            const fileName = `${agencyId}-${Date.now()}.${fileExt}`;
            const filePath = `${session.user.id}/${fileName}`;

            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("agency-images")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) {
                console.error("Upload error:", uploadError);
                alert(`Upload failed: ${uploadError.message}`);
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from("agency-images")
                .getPublicUrl(filePath);

            // Update agency record with new image URL
            const { error: updateError } = await supabase
                .from("agencies")
                .update({ image_url: publicUrl })
                .eq("id", agencyId);

            if (updateError) {
                console.error("Update error:", updateError);
                alert("Failed to update agency image");
                return;
            }

            // Delete old image if exists
            if (currentImageUrl) {
                const oldPath = currentImageUrl.split("/agency-images/")[1];
                if (oldPath) {
                    await supabase.storage
                        .from("agency-images")
                        .remove([oldPath]);
                }
            }

            setPreview(publicUrl);
            onImageUpdated(publicUrl);
            alert("Image uploaded successfully!");
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = async () => {
        if (!confirm("Remove agency image?")) return;

        setUploading(true);
        try {
            // Update agency to remove image_url
            const { error } = await supabase
                .from("agencies")
                .update({ image_url: null })
                .eq("id", agencyId);

            if (error) {
                alert("Failed to remove image");
                return;
            }

            // Delete from storage
            if (currentImageUrl) {
                const path = currentImageUrl.split("/agency-images/")[1];
                if (path) {
                    await supabase.storage
                        .from("agency-images")
                        .remove([path]);
                }
            }

            setPreview(null);
            onImageUpdated("");
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to remove image");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Agency Image
                </h3>
            </div>

            <div className="space-y-4">
                {/* Preview */}
                {preview ? (
                    <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                            src={preview}
                            alt="Agency"
                            className="w-full h-64 object-cover"
                        />
                        <button
                            onClick={handleRemove}
                            disabled={uploading}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                            title="Remove image"
                        >
                            {uploading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <X className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-center">
                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">No image uploaded</p>
                        </div>
                    </div>
                )}

                {/* Upload Button */}
                <label className="block">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={uploading}
                        className="hidden"
                    />
                    <div className={`flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg cursor-pointer hover:bg-primary/90 transition-all ${uploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}>
                        {uploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                {preview ? "Replace Image" : "Upload Image"}
                            </>
                        )}
                    </div>
                </label>

                <p className="text-sm text-gray-500">
                    Recommended: 1200x600px, max 5MB (JPG, PNG, WebP)
                </p>
            </div>
        </div>
    );
}
