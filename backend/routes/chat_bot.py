from flask import Blueprint, request, jsonify
from services.openai_service import chatbot_response_clarifai as chatbot_response

chat_bp = Blueprint('chat_bot', __name__)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    body = request.get_json() or {}
    msg  = body.get('message', '')
    if not msg:
        return jsonify({'error': 'No message provided'}), 400
    try:
        reply = chatbot_response(msg)
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
