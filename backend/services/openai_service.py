import os
import base64
import re
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# Use Clarifai's hosted GPT-4o
client = OpenAI(
    base_url="https://api.clarifai.com/v2/ext/openai/v1",
    api_key=os.getenv("CLARIFAI_API_KEY")
)
def scan_gym_image_clarifai(image_bytes):
    print("[INFO] scan_gym_image_clarifai called")
    b64 = base64.b64encode(image_bytes).decode('utf-8')
    prompt = """
    Identify all gym equipment in this photo.
    For each, list 3–5 exercises and the target muscle groups.
    Return strictly valid JSON in this format:
    {
      "equipment": [ … ]
    }
    """

    resp = client.chat.completions.create(
        model="https://clarifai.com/openai/chat-completion/models/gpt-4o",
        messages=[{
          "role": "user",
          "content": [
            { "type": "text",      "text": prompt },
            { "type": "image_url", "image_url": { "url": f"data:image/jpeg;base64,{b64}" } }
          ]
        }],
        max_tokens=1000
    )

    result = resp.choices[0].message.content
    print("[✅] Clarifai response:", result)

    # Try parsing the JSON string (strip backticks if needed)
    try:
        if result.startswith("```json"):
            result = result.strip("```json").strip("```").strip()

        parsed = json.loads(result)

        # Normalize exercises if they are just strings
        for eq in parsed.get("equipment", []):
            if isinstance(eq.get("exercises"), list) and all(isinstance(ex, str) for ex in eq["exercises"]):
                eq["exercises"] = [
                    {"name": ex, "target_muscles": eq.get("target_muscle_groups", [])}
                    for ex in eq["exercises"]
                ]

        return parsed
    except Exception as e:
        print("[❌] JSON parsing failed:", e)
        return {"error": "Invalid JSON returned from AI"}


def plan_workout_clarifai(goals, level, duration):
    prompt = """
Return a workout plan as pure JSON (no markdown, no extra text) using exactly this schema:

{
  "warmup": [
    { "exercise": "Jumping Jacks", "duration": "1 minute" },
    ...
  ],
  "circuits": [
    {
      "name": "Circuit 1",
      "duration": "10 minutes",
      "rounds": 2,
      "exercises": [
        { "exercise": "Bodyweight Squats", "sets": 2, "reps": 12, "rest": "30s" },
        ...
      ]
    },
    {
      "name": "Circuit 2",
      "duration": "10 minutes",
      "rounds": 2,
      "exercises": [
        { "exercise": "Lunges", "sets": 2, "reps": 10, "rest": "30s" },
        ...
      ]
    }
  ],
  "cooldown": [
    { "exercise": "Hamstring Stretch", "duration": "30s per leg" },
    ...
  ]
}

Create a ${duration}-minute ${level} workout to achieve goals: ${', '.join(goals)}.
    """
    resp = client.chat.completions.create(
      model="https://clarifai.com/openai/chat-completion/models/gpt-4o",
      messages=[{"role":"user","content":prompt}],
      max_tokens=800
    )
    return resp.choices[0].message.content

def chatbot_response_clarifai(message):
    response = client.chat.completions.create(
        model="https://clarifai.com/openai/chat-completion/models/gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful fitness coach."},
            {"role": "user", "content": message}
        ],
        max_tokens=500
    )

    return response.choices[0].message.content
    

