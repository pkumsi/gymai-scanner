from flask import Blueprint, request, jsonify
from services.openai_service import plan_workout_clarifai
from database import get_db_connection
import datetime, json, logging

planner_bp = Blueprint('planner', __name__)
logger = logging.getLogger(__name__)

@planner_bp.route('/plan', methods=['POST'])
def plan():
    body = request.get_json() or {}
    goals    = body.get('goals', [])
    level    = body.get('level', 'beginner')
    duration = body.get('duration', 30)

    try:
        # 1) call GPT
        raw = plan_workout_clarifai(goals, level, duration)

        # 2) try to parse JSON
        try:
            plan_json = json.loads(raw)
            parsed = True
        except json.JSONDecodeError as je:
            logger.error("JSON parse failed: %s\nRAW: %s", je, raw)
            plan_json = None
            parsed = False

        # 3) persist everything
        conn = get_db_connection()
        conn.execute(
            """
            INSERT INTO workout_plans
            (user_id, created_at, level, duration, goals, plan)
            VALUES (?,?,?,?,?,?)
            """,
            (
                '1',
                datetime.datetime.utcnow().isoformat(),
                level,
                duration,
                json.dumps(goals),
                raw
            )
        )
        conn.commit()
        conn.close()

        # 4) return response
        if parsed:
            return jsonify(plan_json)
        else:
            # fallback: send back raw plan text under a key
            return jsonify({ 'raw_plan': raw })

    except Exception as e:
        logger.exception("Plan generation failed")
        return jsonify({ 'error': str(e) }), 500
