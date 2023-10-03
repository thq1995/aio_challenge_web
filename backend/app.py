from flask import Flask, jsonify, send_file, request, Response
from flask_cors import CORS
from pymongo import MongoClient
import cv2
import os
import json
import io
from utils.query_processing import Translation
from utils.faiss import Myfaiss
import gridfs
import base64
import pymongo
from bson.json_util import dumps
from bson import decode_all, json_util
from PIL import Image, ImageDraw


app = Flask(__name__)
client = MongoClient('mongodb://localhost:27017/')
db = client['image_db']
images_collection = db['images']


CORS(app)
bin_file='index.bin'
sketch_bin='sketch_index.bin'

clip_model = Myfaiss(bin_file,'cpu', Translation(), "ViT-L/14@336px")
sketch_model = Myfaiss(sketch_bin, 'cpu',Translation(), "ViT-B-16", isSketch=True)


with open('kf_path.json') as json_file:
    json_dict = json.load(json_file)


@app.route('/home/main/textsearch')
def getTextSearch():
    print('text_search')
    pagefile = []
    text_query = request.args.get('textquery')
   

    idx_image_list = clip_model.text_search(text_query, k=200)

    data = get_images_by_ids(idx_image_list.tolist())
    print('testing_data')
   
    return data

@app.route('/home/main/imgsearch')
def image_search():
    print("image search")
    id_query = int(request.args.get('imgid'))
    idx_image_list = clip_model.image_search(id_query, k=200)
    data = get_images_by_ids(idx_image_list.tolist())

    return data
    

@app.route('/get_all_images/pages')
def get_all_images():
    page = int(request.args.get("page", 1))
    page_size = int(request.args.get("page_size", 20))

    # Calculate the skip value to retrieve the desired page of results
    skip = (page - 1) * page_size
    
    print('page', page)
    print('page_size', page_size)
    # Query MongoDB for the paginated data
    images = images_collection.find().skip(skip).limit(page_size)
    images_length = images_collection.estimated_document_count()
    print('images', images)
    # Convert the MongoDB documents to a list of dictionaries
    image_list = [image for image in images]
    
    for image in image_list:
        image_binary = image['image_data']
        image_base64 = base64.b64encode(image['image_data']).decode('utf-8')
        image['image_data'] = image_base64
        
  
    # print((type(images_list[0]['image_data'])))
    image_json = {}
    image_json['result'] = image_list
    image_json['images_length'] = images_length
    return json.dumps(image_json)
    
@app.get('/subimgsearch')
def get_subsequent_images():
    image_id = int(request.args.get("imageId"))


    print('sub_img_id', image_id)
    index_list = []
    if (image_id >= 10):
        index_list = [image_id  for image_id in range(image_id-20, image_id + 20)]
    else: 
        index_list = [image_id  for image_id in range(image_id, image_id + 20)]

    data = get_images_by_ids(index_list)
    return data
    
def get_images_by_ids(index_list):
    images_list = images_collection.find({"_id": {"$in": index_list}})
    sorted_images = sorted(images_list, key=lambda img: index_list.index(img["_id"]))
    sorted_id = [image["_id"] for image in sorted_images]

    image_list = [image for image in sorted_images]

    images_length = len(sorted_images)
    for image in image_list:
        image_binary = image['image_data']
        image_base64 = base64.b64encode(image['image_data']).decode('utf-8')
        image['image_data'] = image_base64

    image_json = {}
    image_json['result'] = image_list
    image_json ['images_length'] = images_length
    return json.dumps(image_json)


@app.route('/process_sketch', methods=['POST'])
def process_sketch():
    data = request.get_json()
    sketch_data = data.get('sketchData')
    query = data.get('query')
    sketch_data = sketch_data.replace("data:image/png;base64,", "")
    with open("temp.jpg", "wb") as imgFile:
        imgFile.write(base64.b64decode(sketch_data))

    sketch_data = Image.open('temp.jpg')

    idx_image_list = sketch_model.sketch_search(sketch_data, query , k=200)
    data = get_images_by_ids(idx_image_list)
    return data


def create_image_from_sketch(sketch_data):
    image = Image.new('RGB', (800, 600), color='white')
    draw = ImageDraw.Draw(image)

    # Process and draw the sketch data on the image (modify as per your data format)
    for stroke in sketch_data:
        for i in range(len(stroke) - 1):
            x1, y1 = stroke[i]
            x2, y2 = stroke[i + 1]
            draw.line([(x1, y1), (x2, y2)], fill='black', width=3)

    return image


@app.route('/object_detect_search', methods=['POST'])
def receive_data():
    try:
        data = request.json  # Get JSON data from the request
        checkboxes = data.get('checkboxes', {})
        textfields = data.get('textfields', {})
        
        print("Received Checkbox Data:", checkboxes)
        print("Received Text Field Data:", textfields)
        
        return jsonify({'message': 'Data received successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
    