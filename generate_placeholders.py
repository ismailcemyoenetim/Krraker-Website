import os
import shutil

def generate_placeholders():
    # Source images
    source_images = [
        'images/posters-thumbnail.png',
        'images/letterings-thumbnail.png'
    ]
    
    # Destination names
    dest_names = [
        'images/placeholder1.jpg',
        'images/placeholder2.jpg',
        'images/placeholder3.jpg',
        'images/placeholder4.jpg',
        'images/placeholder5.jpg',
        'images/placeholder6.jpg'
    ]
    
    # Create placeholder images by copying from source images
    for i, dest in enumerate(dest_names):
        # Use the source images in alternating fashion
        source = source_images[i % len(source_images)]
        
        # Create a copy with the new name
        shutil.copyfile(source, dest)
        print(f"Created {dest} from {source}")

if __name__ == "__main__":
    generate_placeholders() 