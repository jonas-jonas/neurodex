from flask import Flask, jsonify, send_from_directory, Blueprint
import os

STATIC_ROOT = os.path.join(os.pardir, 'build')
app = Flask(__name__, static_folder=STATIC_ROOT)

@app.route('/api/test')
def hello_world():
    return jsonify('Hello, World!')

@app.route('/<path:path>')
def build(path):
    return app.send_static_file(path)

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run()