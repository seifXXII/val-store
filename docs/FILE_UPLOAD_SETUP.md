# File Upload Setup (UploadThing)

## Installation

```bash
npm install uploadthing @uploadthing/react
```

## Environment Variables

Add to `.env.local`:

```env
UPLOADTHING_TOKEN=your_uploadthing_token_here
```

## Get Your Token

1. Go to [uploadthing.com](https://uploadthing.com)
2. Create account / Sign in
3. Create a new app
4. Copy the token from dashboard
5. Paste into `.env.local`

## Files Created

- `src/lib/uploadthing.ts` - Core file router configuration
- `src/app/api/uploadthing/route.ts` - API route handler
- `src/components/ui/upload.tsx` - React upload components

## Usage Example

```tsx
import { UploadButton, UploadDropzone } from "@/components/ui/upload";

// Simple button
<UploadButton
  endpoint="productImage"
  onClientUploadComplete={(res) => {
    console.log("Files: ", res);
    // res[0].url contains the uploaded file URL
  }}
  onUploadError={(error) => {
    console.error("Error: ", error.message);
  }}
/>

// Drag & drop zone
<UploadDropzone
  endpoint="productImage"
  onClientUploadComplete={(res) => {
    console.log("Files: ", res);
  }}
/>
```

## Available Endpoints

| Endpoint        | Max Size | Max Files | Use Case          |
| --------------- | -------- | --------- | ----------------- |
| `productImage`  | 4MB      | 10        | Product photos    |
| `categoryImage` | 2MB      | 1         | Category banners  |
| `userAvatar`    | 1MB      | 1         | User profile pics |
