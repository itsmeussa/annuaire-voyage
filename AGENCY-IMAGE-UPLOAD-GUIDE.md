# Agency Image Upload - Setup Guide

## Features Added

✅ **Upload agency images**  
✅ **Replace existing images**  
✅ **Delete images**  
✅ **Image preview**  
✅ **Automatic storage management**  
✅ **Access for owners and admins**

---

## Setup Steps

### Step 1: Run Database Migration

**File:** `supabase-agency-images.sql`

Run this in Supabase SQL Editor to:
- Add `image_url` column to agencies table
- Set up storage policies

### Step 2: Create Storage Bucket

**In Supabase Dashboard:**

1. Go to **Storage**
2. Click **"New bucket"**
3. Name: `agency-images`
4. Set to **Public**
5. Click **Create**

**OR run the SQL** (already included in the migration):
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('agency-images', 'agency-images', true)
ON CONFLICT (id) DO NOTHING;
```

### Step 3: Test Upload

1. Visit any agency you own
2. Scroll down to **"Agency Image"** section
3. Click **"Upload Image"**
4. Select an image (max 5MB)
5. Image uploads and displays immediately!

---

## How It Works

### For Agency Owners:
1. Navigate to your agency page
2. See the "Agency Image" upload section
3. Upload/Replace/Delete images
4. Changes are instant

### For Admins:
- Same functionality as owners
- Can upload images for any agency
- Full control via admin panel

### Storage Structure:
```
agency-images/
  └── {user_id}/
      └── {agency_id}-{timestamp}.jpg
```

---

## File Specifications

- **Formats:** JPG, PNG, WebP, GIF
- **Max Size:** 5MB
- **Recommended:** 1200x600px (2:1 ratio)
- **Storage:** Supabase Storage (public bucket)

---

## Security

- ✅ Only authenticated users can upload
- ✅ Owners can only upload to their agencies
- ✅ Admins can upload to any agency
- ✅ Old images are automatically deleted when replaced
- ✅ RLS policies enforce access control

---

## Usage in UI

Images are displayed:
- Agency page header (if available)
- Admin panel agency list
- Search results (future)

---

## Troubleshooting

### Upload fails with "bucket does not exist"
**Solution:** Create the storage bucket in Supabase Dashboard

### "Permission denied" error
**Solution:** Run `supabase-agency-images.sql` to set up storage policies

### Image doesn't show after upload
**Solution:** Refresh the page - the URL should update automatically

### Old images not deleted
**Solution:** This is automatic - check storage bucket to verify
