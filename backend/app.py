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


app = Flask(__name__)
app.config['MONGODB_SETTINGS'] = {
    'db': 'your_database',
    'host': 'localhost',
    'port': 27017
}
CORS(app)
import pymongo
bin_file='faiss_normal_ViT.bin'

MyFaiss = Myfaiss(bin_file,'cpu', Translation(), "ViT-B/32")

with open('image_path.json') as json_file:
    json_dict = json.load(json_file)


@app.route('/home/main/textsearch')
def getTextSearch():
    print('text_search')
    pagefile = []
    text_query = request.args.get('textquery')

    idx_image_list = MyFaiss.text_search(text_query, k=50)

    data = get_images_by_ids(idx_image_list.tolist())
    return data
    

@app.route('/home/main/imgsearch')
def image_search():
    print("image search")
    pagefile = []
    id_query = int(request.args.get('imgid'))
    idx_image_list = MyFaiss.image_search(id_query, k=50)

    # imgperindex = 100 

    # for imgpath, id in zip(list_image_paths, list_ids):
    #     pagefile.append({'imgpath': imgpath, 'id': int(id)})

    # data = {'num_page': int(LenDictPath/imgperindex)+1, 'pagefile': pagefile}

    data = get_images_by_ids(idx_image_list.tolist())

    return data


app.route('/get_img')
def get_img():
    # print("get_img")
    fpath = request.args.get('fpath')
    # fpath = fpath
    list_image_name = fpath.split("/")
    image_name = "/".join(list_image_name[-2:])

    if os.path.exists(fpath):
        img = cv2.imread(fpath)
    else:
        print("load 404.jph")
        img = cv2.imread("./static/images/404.jpg")

    img = cv2.resize(img, (1280,720))

    # print(img.shape)
    img = cv2.putText(img, image_name, (30, 80), cv2.FONT_HERSHEY_SIMPLEX, 
                   3, (255, 0, 0), 4, cv2.LINE_AA)

    ret, jpeg = cv2.imencode('.jpg', img)
    return  Response((b'--frame\r\n'
                     b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n'),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


def get_database():
 
   # Provide the mongodb atlas url to connect python to mongodb using pymongo
   CONNECTION_STRING = "mongodb://localhost:27017"
 
   # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
   client = MongoClient(CONNECTION_STRING)
 
   # Create the database for our example (we will use the same database throughout the tutorial
   return client['ai_challenge']


def push_images_do_db():
    collections = get_database()
    fs = gridfs.GridFS(collections)


    iamges_folder = "images";
    index = 0
    for filename in os.listdir(iamges_folder):
        file_path = os.path.join(iamges_folder, filename)
        
        for key, value in json_dict.items():
            if value == file_path:
                index = key 
                break
        print(index)
        if fs.find_one({"filename": filename}) is None:
            with open(file_path, 'rb') as f:
                contents = f.read()
                fs.put(contents, filename=filename, _id=int(index))

    return "success"



@app.route('/get_all_images')
def get_all_images():
    db = get_database()
    fs = gridfs.GridFS(db)

    images_files = fs.find().sort("_id", pymongo.ASCENDING)
    images = []

    for file in images_files:
        image_content = file.read()
        encoded_image = base64.b64encode(image_content).decode("utf-8")
        data = {'filename': file.filename, 'data': encoded_image, '_id': file._id}
        images.append(data)
    data = {'result': images } 

    return data

def get_images_by_ids(index_list):
    db = get_database()
    fs = gridfs.GridFS(db)
    images = []
    images_files = fs.find({"_id": {"$in": index_list}})
    sorted_images = sorted(images_files, key=lambda img: index_list.index(img._id))
    # print('this is sorted files', sorted_images)
    for file in sorted_images:
        image_content = file.read()
        encoded_image = base64.b64encode(image_content).decode("utf-8")
        data = {'filename': file.filename, 'data': encoded_image, '_id': file._id}
        images.append(data)
    data = {'result': images }

    return data


@app.route('/get_image')
def get_images_by_id():
    db = get_database()
    fs = gridfs.GridFS(db)

    id = request.args.get('id')
   
    try:
        print('index: ', id)
        file_data = fs.find_one({'_id': int(id)})
        image_content = file_data.read()
        encoded_image = base64.b64encode(image_content).decode("utf-8")
        print(encoded_image)
        data = {'filename': file_data.filename, 'data': encoded_image}
        return data
    except Exception as e:
        return f"Error: {str(e)}", 500
    
    

@app.route('/api/get_image/<image_id>')
def get_image_by_id(image_id):
    db = get_database()
    fs = gridfs.GridFS(db)

    try:
        print('index: ', image_id)
        file_data = fs.find_one({'_id': int(image_id)})
        image_content = file_data.read()
        encoded_image = base64.b64encode(image_content).decode("utf-8")
        print(encoded_image)
        data = {'data': encoded_image}
        return data
    except Exception as e:
        return f"Error: {str(e)}", 500
    

if __name__ == "__main__":
    # temporary setup
    push_images_do_db()
    app.run(debug=True)
    