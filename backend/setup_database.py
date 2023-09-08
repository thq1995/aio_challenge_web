from PIL import Image
import os
from pymongo import MongoClient
import gridfs
from bson.binary import Binary
from tqdm import tqdm
from time import sleep
from bson import json_util


client = MongoClient('mongodb://localhost:27017/')
db = client['image_db']
images_collection = db['images']

def compress_image(input_path, output_path, quality=100):
    try:
        img = Image.open(input_path)
        img.save(output_path, "JPEG", optimize=True, quality=quality)
        return True
    except Exception as e:
        print(f"An error occurred: {e}")
        return False



def upload_images_to_db():
    images_folder = "images" + os.sep + "keyframes";
    index = 0
    # create a function to read meta and convert to dict for title and data

    with tqdm(total=len(os.listdir(images_folder)), unit='folder') as pbar:
        for sub_folders in sorted(os.listdir(images_folder)):
            sub_folders = os.path.join(images_folder, sub_folders)
            
            print(sub_folders)
            for file_names in sorted(os.listdir(sub_folders)):
                file_path = os.path.join(sub_folders, file_names)
                
                if images_collection.find_one({'filename': file_path}):
                    return "Images already exixts", 400
                
                with open(file_path, 'rb') as image_file:
                    image_data = Binary(image_file.read())

                metadata = {
                    '_id': index,
                    'filename': file_path,
                    'image_data': Binary(image_data)  # Store image data as Binary
                }
            
                
                # file_path = images_folder.replace('keyframes', '')  + file_path
                
                images_collection.insert_one(metadata)
                index+=1
            pbar.update(1)
       
    
    return "success"


if __name__ == "__main__":
    upload_images_to_db()

