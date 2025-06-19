# from flask import Blueprint, request, jsonify
# from services.openai_service import scan_gym_image_clarifai

# gym_scanner_bp = Blueprint('gym_scanner', __name__)

# @gym_scanner_bp.route('/scan', methods=['POST'])
# def scan():
#     img_bytes = request.files['image'].read()
#     result   = scan_gym_image_clarifai(img_bytes)
#     return jsonify({'result': result})


from flask import Blueprint, request, jsonify
from services.openai_service import scan_gym_image_clarifai
from werkzeug.utils import secure_filename
import os, tempfile, cv2

gym_scanner_bp = Blueprint('gym_scanner', __name__)

VIDEO_EXTENSIONS = {'mp4', 'mov', 'avi'}
IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}

def extract_first_frame(video_path):
    cap = cv2.VideoCapture(video_path)
    success, frame = cap.read()
    cap.release()
    if not success:
        return None
    _, buffer = cv2.imencode('.jpg', frame)
    return buffer.tobytes()

@gym_scanner_bp.route('/scan', methods=['POST'])
def scan():
    print("📂 Files in request:", request.files)  # debug

    upload = request.files.get('file')           # ← look for 'file'
    if not upload:
        return jsonify({'error': 'No file uploaded'}), 400

    filename = secure_filename(upload.filename)
    ext = filename.rsplit('.', 1)[-1].lower()

    if ext in VIDEO_EXTENSIONS:
        print(f"🎞️ Detected video: {filename}")
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
            upload.save(tmp.name)
            frame = extract_first_frame(tmp.name)
        os.unlink(tmp.name)

    elif ext in IMAGE_EXTENSIONS:
        print(f"🖼️ Detected image: {filename}")
        frame = upload.read()

    else:
        return jsonify({'error': 'Unsupported file type'}), 400

    if not frame:
        return jsonify({'error': 'Could not read frame'}), 500

    result = scan_gym_image_clarifai(frame)
    return jsonify({'result': result})
