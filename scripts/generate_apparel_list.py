import os
import json
from pathlib import Path

def generate_apparel_list():
    # Get the directory of this script
    script_dir = Path(__file__).parent
    # Get the project root directory (two levels up)
    project_root = script_dir.parent
    # Path to the apparel images directory
    apparel_dir = project_root / 'images' / 'apparel'
    
    # Create the directory if it doesn't exist
    apparel_dir.mkdir(parents=True, exist_ok=True)
    
    # Get all image files
    image_files = [f for f in os.listdir(apparel_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif'))]
    
    # Sort files by their numeric names
    image_files.sort(key=lambda x: int(''.join(filter(str.isdigit, x))))
    
    # Create the list.json file
    list_path = apparel_dir / 'list.json'
    with open(list_path, 'w') as f:
        json.dump(image_files, f, indent=2)
    
    print(f"Generated list.json with {len(image_files)} images")
    print("Images:", image_files)

if __name__ == "__main__":
    generate_apparel_list() 