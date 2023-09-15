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
app = Flask(__name__)
client = MongoClient('mongodb://localhost:27017/')
db = client['image_db']
images_collection = db['images']


CORS(app)
bin_file='index.bin'

MyFaiss = Myfaiss(bin_file,'cpu', Translation(), "ViT-L/14@336px")

with open('kf_path.json') as json_file:
    json_dict = json.load(json_file)


@app.route('/home/main/textsearch')
def getTextSearch():
    print('text_search')
    pagefile = []
    text_query = request.args.get('textquery')
   

    idx_image_list = MyFaiss.text_search(text_query, k=100)

    data = get_images_by_ids(idx_image_list.tolist())
    print('testing_data')
   
    return data

@app.route('/home/main/imgsearch')
def image_search():
    print("image search")
    pagefile = []
    id_query = int(request.args.get('imgid'))
    idx_image_list = MyFaiss.image_search(id_query, k=100)

    # imgperindex = 100 

    # for imgpath, id in zip(list_image_paths, list_ids):
    #     pagefile.append({'imgpath': imgpath, 'id': int(id)})

    # data = {'num_page': int(LenDictPath/imgperindex)+1, 'pagefile': pagefile}

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
    

    
    # Convert the MongoDB documents to a list of dictionaries
    image_list = [image for image in images]
    
    for image in image_list:
        image_binary = image['image_data']
        image_base64 = base64.b64encode(image['image_data']).decode('utf-8')
        image['image_data'] = image_base64
        
  
    # print((type(images_list[0]['image_data'])))
    image_json = {}
    image_json ['images_length'] = images_length
    image_json['result'] = image_list

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
    images = []
    images_list = images_collection.find({"_id": {"$in": index_list}})

    sorted_images = sorted(images_list, key=lambda img: index_list.index(img["_id"]))
    sorted_id = [image["_id"] for image in sorted_images]
    print('this is sorted ids', sorted_id)

    image_list = [image for image in sorted_images]

    images_length = len(sorted_images)
    for image in image_list:
        image_binary = image['image_data']
        image_base64 = base64.b64encode(image['image_data']).decode('utf-8')
        image['image_data'] = image_base64

    image_json = {}
    image_json['result'] = image_list
    image_json ['images_length'] = images_length
    print('images_length', image_json ['images_length'] )
    return json.dumps(image_json)


if __name__ == "__main__":
    app.run(debug=True)
    