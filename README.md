
![Figmaflow](https://github.com/user-attachments/assets/a768d739-b268-47ea-9f41-b411098fa707)


# Mood Journey API

A Django REST API backend for a mental health app that generates personalized 5-step emotional journeys based on the user's current mood and context.

## Project Overview

This API powers a mobile application designed to guide users through interactive, educational journeys that help them transition from one emotional state to another (e.g., sadness to happiness, anxiety to calm). Each journey consists of 5 steps with quizzes, educational content, and guided activities with precise timing controls.

### Key Features

- **Single API Endpoint**: Generates an entire 5-step journey in one request
- **AI Integration**: Uses Claude via OpenRouter to create personalized content
- **Emotional Transitions**: Supports pathways from negative to positive emotional states
- **Interactive Content**: Includes quizzes, activities, and educational content
- **Timing Controls**: Provides timing parameters for frontend display
- **Reward System**: Awards medals upon journey completion

## Setup Instructions

### Prerequisites

- Python 3.9+
- pip

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Elathius/HackAI2025.git
   cd HackAI2025/backend/DAPPER
   ```

2. Create a virtual environment
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables
   ```bash
   # Create a .env file in the dapi directory with:
   DEBUG=True
   SECRET_KEY=your_secret_key_here
   ALLOWED_HOSTS=localhost,127.0.0.1
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_REFERRER=http://localhost:8000
   ```

5. Run migrations
   ```bash
   cd dapi
   python manage.py migrate
   ```

6. Start development server
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Generate Course

```
POST /api/v1/courses/generate/
```

**Request Body:**
```json
{
  "user_id": "user123",
  "mood": "sad",
  "context": "I didn't get the job I interviewed for last week"
}
```

### Update Progress

```
POST /api/v1/courses/{course_id}/progress/
```

**Request Body:**
```json
{
  "current_step": 3,
  "mood_rating": 7
}
```

### List Courses

```
GET /api/v1/courses/?user_id=user123
```

## Testing

You can test the API using the included `test_api.html` file:

1. Start the Django server
2. Open `test_api.html` in a web browser
3. Fill in the form and click "Generate Journey"

## OpenRouter Integration

This project uses OpenRouter to access Claude AI models. To set up OpenRouter:

1. Sign up at [OpenRouter.ai](https://openrouter.ai/)
2. Create an API key
3. Add the API key to your `.env` file

## Deployment

See the `deployment_guide.md` file for instructions on deploying to PythonAnywhere.
