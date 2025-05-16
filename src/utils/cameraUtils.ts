
export function captureImageFromVideo(
  video: HTMLVideoElement | null, 
  canvas: HTMLCanvasElement | null
): string | null {
  if (!video || !canvas) return null;
  
  const context = canvas.getContext("2d");
  
  if (context) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL("image/jpeg");
  }
  
  return null;
}
