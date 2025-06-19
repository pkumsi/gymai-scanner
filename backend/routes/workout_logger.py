from flask import Blueprint, request, jsonify
from database import get_db_connection
import datetime

logger_bp = Blueprint('workout_logger', __name__)

@logger_bp.route('/log', methods=['POST'])
def log():
    body = request.get_json() or {}
    exercise = body.get('exercise')
    reps     = body.get('reps')
    weight   = body.get('weight')
    if not exercise or reps is None or weight is None:
        return jsonify({'error':'Missing fields'}), 400

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO workouts (user_id, date, exercise, reps, weight) VALUES (?,?,?,?,?)",
        ('1', datetime.datetime.now().isoformat(), exercise, reps, weight)
    )
    conn.commit()
    conn.close()
    return jsonify({'status':'logged'})
