
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads an image to Supabase Storage
 * 
 * @param base64Image - Base64 encoded image data
 * @param bucketName - Name of the storage bucket
 * @returns The path to the uploaded image or null if upload failed
 */
export async function uploadImageToSupabase(base64Image: string, bucketName: string = 'plant-images'): Promise<string | null> {
  try {
    // Extract the base64 data from the data URL
    const [, base64Data] = base64Image.split(',');
    
    // Convert base64 to Blob
    const blob = base64ToBlob(base64Data);
    
    // Generate a unique file name
    const fileName = `${uuidv4()}.jpg`;
    const filePath = `${fileName}`;
    
    // Upload the file to Supabase
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImageToSupabase:', error);
    return null;
  }
}

/**
 * Converts base64 string to Blob
 */
function base64ToBlob(base64: string): Blob {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: 'image/jpeg' });
}
