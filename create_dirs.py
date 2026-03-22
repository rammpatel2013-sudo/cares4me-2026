import os
import sys

app_dir = r'C:\Users\drmit\Desktop\cares4me-clean\src\app'
folders = ['about', 'faq', 'dashboard', 'blog', 'transparency', 'contact']

for folder in folders:
    folder_path = os.path.join(app_dir, folder)
    try:
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            print(f"✓ Created: {folder}")
        else:
            print(f"✓ Already exists: {folder}")
    except Exception as e:
        print(f"✗ Error creating {folder}: {e}")

print("\nDirectories in app folder:")
try:
    items = sorted(os.listdir(app_dir))
    dirs = [item for item in items if os.path.isdir(os.path.join(app_dir, item))]
    for d in dirs:
        print(f"  - {d}")
except Exception as e:
    print(f"Error listing directories: {e}")
