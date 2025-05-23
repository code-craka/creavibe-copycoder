import { NextResponse } from "next/server"
import { createServerComponentClient } from "@/utils/supabase/clients"

export async function GET() {
  try {
    const supabase = createServerComponentClient()
    
    // Check if the bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      console.error("Error listing buckets:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    
    // Check if avatars bucket exists
    const avatarBucketExists = buckets.some(bucket => bucket.name === "avatars")
    
    if (!avatarBucketExists) {
      // Create the bucket
      const { error: createError } = await supabase.storage.createBucket("avatars", {
        public: true,
        fileSizeLimit: 2 * 1024 * 1024, // 2MB
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"]
      })
      
      if (createError) {
        console.error("Error creating avatars bucket:", createError)
        return NextResponse.json({ success: false, error: createError.message }, { status: 500 })
      }
      
      return NextResponse.json({ success: true, message: "Avatars bucket created" })
    }
    
    return NextResponse.json({ success: true, message: "Avatars bucket already exists" })
  } catch (error: any) {
    console.error("Unexpected error ensuring avatar bucket exists:", error)
    return NextResponse.json({ success: false, error: error.message || "An unexpected error occurred" }, { status: 500 })
  }
}
