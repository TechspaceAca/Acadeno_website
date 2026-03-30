from PIL import Image
import os

def crop_favicon(input_path, output_path):
    img = Image.open(input_path)
    # Convert to RGBA just in case
    img = img.convert("RGBA")
    
    # Get the bounding box of non-zero (non-transparent) alpha channel
    bbox = img.getbbox()
    
    if bbox:
        # Crop the image to the bounding box
        img_cropped = img.crop(bbox)
        
        # We want the favicon to be square to avoid distortion in some browsers
        # Calculate size to make it square
        width, height = img_cropped.size
        new_size = max(width, height)
        
        # Create a new transparent square image
        square_img = Image.new("RGBA", (new_size, new_size), (0, 0, 0, 0))
        
        # Paste the cropped image in the center
        paste_x = (new_size - width) // 2
        paste_y = (new_size - height) // 2
        square_img.paste(img_cropped, (paste_x, paste_y))
        
        # Resize to a standard favicon size (e.g., 512x512) for high res
        square_img = square_img.resize((512, 512), Image.Resampling.LANCZOS)
        
        square_img.save(output_path)
        print(f"Successfully cropped favicon to {output_path}")
    else:
        print("Image is entirely transparent!")

if __name__ == "__main__":
    base_dir = r"c:\Users\ANULAL\Desktop\Maitexa\OldAc - Copy\Acadeno_website\assets"
    favicon_path = os.path.join(base_dir, "favicon.png")
    output_path = os.path.join(base_dir, "favicon_fixed.png")
    crop_favicon(favicon_path, output_path)
