from flask import Flask
from flask_cors import CORS
from database import init_db

# Import route blueprints
from routes.gym_scanner import gym_scanner_bp
from routes.workout_planner import planner_bp
from routes.chat_bot import chat_bp
from routes.workout_logger import logger_bp

# Create Flask app instance
app = Flask(__name__)
CORS(app)

# Initialize database
init_db()

# Register routes
app.register_blueprint(gym_scanner_bp, url_prefix='/api')
app.register_blueprint(planner_bp, url_prefix='/api')
app.register_blueprint(chat_bp, url_prefix='/api')
app.register_blueprint(logger_bp, url_prefix='/api')

# Start server
if __name__ == '__main__':
    app.run(debug=True)
