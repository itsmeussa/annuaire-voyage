# Integration Guide: Agency Management Components

## Overview
The agency management system is complete with components for editing agencies and adding experiences with image uploads.

## Database Setup

### 1. Run SQL Migration
Execute `supabase-experiences.sql` in Supabase Dashboard > SQL Editor.

### 2. Create Storage Bucket
In Supabase Dashboard > Storage:
1. Create a new **public** bucket named `agency-images`
2. Storage is configured to allow:
   - Authenticated users to upload
   - Everyone to view
   
## Frontend Integration

### Add to Agency Detail Page

In `src/app/agencies/[slug]/page.tsx`, add the ManageAgency component:

```tsx
// At the top with other imports
import ManageAgency from "@/components/agency/ManageAgency";

// In the JSX, add this section (e.g., after the main agency info):
<ManageAgency agencyId={agency.id} agencySlug={agency.slug} />
```

### Example Placement
Add it after the agency details section and before similar agencies:

```tsx
{/* Main agency content */}
<div className="...">
  {/* Agency info, contact, map, etc */}
</div>

{/* NEW: Agency Management */}
<ManageAgency agencyId={agency.id} agencySlug={agency.slug} />

{/* Similar agencies section */}
```

## Features

### For Agency Owners
- **Edit Agency Button**: Update all agency details
- **Add Experience Button**: Create experiences with photos
- **Delete Experiences**: Remove unwanted experiences

### For All Users
- **View Experiences**: See all experiences with images
- **Image Gallery**: Up to 3 images per experience

## Components Created

1. **ManageAgency.tsx**: Main component (checks ownership)
2. **EditAgencyModal.tsx**: Edit agency form
3. **AddExperienceModal.tsx**: Add experience with image upload
4. **ExperiencesSection.tsx**: Display experiences

All components are located in `src/components/agency/`
