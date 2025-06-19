# 🏋️ GymAI: Smart Equipment Scanner & AI Workout Planner

**GymAI** is an AI-powered fitness assistant that scans gym equipment from images or videos and generates personalized workout plans using cutting-edge GenAI technologies like **Clarifai GPT-4o** and **OpenCV**.

> 🏋️ Scan. 💡 Learn. 🤖 Plan. ✍️ Log. 💬 Chat.

## 🌟 Features

- 📷 **Gym Equipment Scanner**
  - Upload **images or videos** of gym equipment
  - Automatically detects machines and suggests exercises
  - Links to **YouTube tutorials** and **Wikipedia** for learning
- 🧠 **AI Workout Planner**
  - Enter your **fitness goals**, level, and duration
  - Instantly generate structured, personalized workout plans
- 📝 **Workout Logger**
  - Log sets, reps, and weight for each exercise
  - Simple and effective progress tracking
- 🤖 ]]**ChatBot (Pluggable)**
  - Potential for conversational fitness advice
- 🧍‍♀️ **Buddy System (Future Scope)**
  - Match with workout buddies nearby

---

## 🧠 Why GenAI?

This project leverages GenAI for real-world impact in the fitness domain:

- 🤖 **Clarifai GPT-4o**:
  - Used for **multi-modal inference** — understands equipment and exercise types from visual input
  - Provides reasoning over workout structure and planning
- 🧠 **GPT-4o / LLMs** (via prompt chaining):
  - Generates clear, goal-specific workout plans
  - Outputs include warm-up, circuits, and cooldown in structured JSON
- 🎞️ **OpenCV**:
  - Enables **video compatibility** by extracting the first frame from uploaded videos
  - Seamlessly integrates with AI pipeline for consistent analysis

---

## 💻 Built With

- ⚛️ **React** — Interactive frontend UI
- 🐍 **Flask (Python)** — Lightweight backend API
- 📦 **OpenCV** — Video frame extraction on backend
- 🧠 **Clarifai GPT-4o API** — GenAI image understanding + plan generation
- 🌐 **RESTful APIs** — Clean separation of frontend and backend
- 💾 (Optional) **SQLite / DB** — Extendable for history/logging features

---

## 📸 Demo

<img src="https://github.com/yourusername/gymai-scanner/assets/demo-screenshot.png" width="800"/>

Try uploading:

- 📷 A photo of a squat rack or barbell
- 🎞️ A short video scan of your gym
- 🧠 A goal like "toning, 30 minutes, beginner"

And watch GymAI generate your full workout routine!

---

## 🚀 Setup

1. **Clone the repo**  
git clone https://github.com/pkumsi/gymai-scanner.git
cd gymai-scanner

2. **Backend setup**
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py

3. **Frontend setup**
cd ../frontend
npm install
npm start

4. **Visit**
Go to http://localhost:3000 and start uploading

## Submission
Project built during MLH Global Hack Week: GenAI (June 2025)
Built with ❤️ by @pkumsi
