# Mood Journey API

A Django REST API backend for a mental health app that generates personalized 5-step emotional journeys based on the user's current mood and context.

## Project Overview

This API powers a mobile application designed to guide users through interactive, educational journeys that help them transition from one emotional state to another (e.g., sadness to happiness, anxiety to calm). Each journey consists of 5 steps with quizzes, educational content, and guided activities with precise timing controls.

### Key Features

- **Single API Endpoint**: Generates an entire 5-step journey in one request
- **AI Integration**: Uses Claude or GPT to create personalized content
- **Emotional Transitions**: Supports pathways from negative to positive emotional states
- **Interactive Content**: Includes quizzes, activities, and educational content
- **Timing Controls**: Provides timing parameters for frontend display
- **Reward System**: Awards medals upon journey completion

## Technical Architecture

### Technologies

- **Django 4.2+**: Core framework
- **Django REST Framework**: API development
- **SQLite**: Development database (can be upgraded to PostgreSQL)
- **Anthropic Claude API** or **OpenAI GPT API**: Content generation

### Project Structure

```
mood_journey_api/
├── manage.py
├── requirements.txt
├── db.sqlite3
├── mood_journey/           # Main Django project
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── api/                    # API app
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations/
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   ├── views.py
│   └── services/
│       ├── __init__.py
│       ├── ai_service.py   # AI integration
│       └── course_generator.py  # Course generation logic
└── templates/              # Optional templates for Django admin
```

## Database Schema

### Core Models

```python
# models.py

class EmotionalCourse(models.Model):
    """Stores a complete emotional journey course"""
    user_id = models.CharField(max_length=100)  # External user ID
    from_emotion = models.CharField(max_length=50)
    to_emotion = models.CharField(max_length=50)
    context = models.TextField()  # User's input about why they feel this way
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    json_data = models.JSONField()  # Stores the entire course JSON

class UserProgress(models.Model):
    """Tracks user progress through a course"""
    course = models.ForeignKey(EmotionalCourse, on_delete=models.CASCADE)
    current_step = models.IntegerField(default=0)
    initial_mood_rating = models.IntegerField(null=True)
    final_mood_rating = models.IntegerField(null=True)
    earned_medal = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)
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

**Response:**
A complete course JSON with all steps, quizzes, educational content, and guided activities following the specified format with nested timing controls.

### Update Progress (Optional)

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

## Implementation Details

### AI Integration

The core of this API is the AI integration that generates personalized content. The system uses a carefully crafted prompt to instruct Claude or GPT to generate the course structure:

```python
# ai_service.py

import requests
import json
from django.conf import settings

def generate_journey_with_claude(emotion, target_emotion, context):
    """Generate a complete journey using Claude API"""
    
    prompt = f"""
    Create a 5-step educational journey to help someone transition from feeling {emotion} to {target_emotion}.
    
    Their context: "{context}"
    
    For each step, include:
    1. A quiz question with 4 multiple-choice options (labeled A, B, C, D)
    2. The correct answer with educational explanation
    3. A guided interactive activity
    
    Make sure to use the following JSON structure, especially for timing controls:
    
    {{
      "course": {{
        "title": "From {emotion.title()} to {target_emotion.title()} Journey",
        "emotion_transition": {{
          "from": "{emotion}",
          "to": "{target_emotion}"
        }},
        "initial_prompt": {{
          "text": "How are you feeling right now on a scale of 1-10?",
          "seconds_wait": 5,
          "input_type": "number_scale",
          "input_range": {{
            "min": 1,
            "max": 10
          }}
        }},
        "steps": [
          {{
            "step_number": 1,
            "quiz": {{
              "question": "...",
              "options": [
                {{"id": "A", "text": "..."}},
                {{"id": "B", "text": "..."}},
                {{"id": "C", "text": "..."}},
                {{"id": "D", "text": "..."}}
              ],
              "correct_answer": "B",
              "seconds_wait": 10
            }},
            "education": {{
              "correct_text": "...",
              "correct_text_seconds_wait": 5,
              "explanation": "...",
              "explanation_seconds_wait": 8
            }},
            "guided_activity": {{
              "title": "...",
              "instructions": {{
                "text": "...",
                "wait": 5
              }},
              "steps": [
                {{
                  "text": "...",
                  "countdown": 4,
                  "wait": 4
                }},
                // More steps...
              ],
              "conclusion": {{
                "text": "...",
                "wait": 3
              }}
            }}
          }},
          // Steps 2-5...
        ],
        "final_check": {{
          "text": "How are you feeling now?",
          "seconds_wait": 8,
          "input_type": "number_scale",
          "input_range": {{
            "min": 1,
            "max": 10
          }},
          "reward_threshold": 5
        }},
        "reward": {{
          "medal_type": "color",
          "title": "Medal of Achievement",
          "description": "...",
          "seconds_wait": 10,
          "techniques_summary": [
            // Techniques learned
          ],
          "congratulations_text": "..."
        }}
      }},
      "metadata": {{
        "version": "1.0",
        "created_date": "2025-04-20",
        "target_emotions": ["{emotion}", "{target_emotion}"],
        "estimated_completion_time_minutes": 15,
        "difficulty_level": "beginner"
      }}
    }}
    """
    
    # Call Claude API
    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": settings.ANTHROPIC_API_KEY,
            "content-type": "application/json"
        },
        json={
            "model": "claude-3-opus-20240229",
            "max_tokens": 4000,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
    )
    
    result = response.json()
    
    # Extract and parse the JSON response
    # Note: Claude may wrap the JSON in markdown code blocks, so we need to extract it
    content = result["content"][0]["text"]
    # Extract JSON from response if needed
    
    # Parse and validate the JSON
    try:
        journey_data = json.loads(content)
        return journey_data
    except json.JSONDecodeError:
        # Fallback to template if AI response is not valid JSON
        return get_journey_template(emotion, target_emotion)
```

### Journey Templates

For rapid development and as a fallback, the API includes pre-built templates:

```python
# course_generator.py

def get_journey_template(emotion, target_emotion):
    """Return a pre-built template for the given emotions"""
    
    # Emotion mapping
    emotion_medals = {
        "sad": "blue",
        "angry": "orange", 
        "anxious": "purple",
        "envy": "green",
        "happy": "gold"
    }
    
    medal_color = emotion_medals.get(emotion, "silver")
    
    # Basic template structure
    template = {
        "course": {
            "title": f"From {emotion.title()} to {target_emotion.title()} Journey",
            "emotion_transition": {
                "from": emotion,
                "to": target_emotion
            },
            "initial_prompt": {
                "text": f"How are you feeling right now on a scale of 1-10? (10 being most {target_emotion})",
                "seconds_wait": 5,
                "input_type": "number_scale",
                "input_range": {
                    "min": 1,
                    "max": 10
                }
            },
            # Steps would be pre-defined per emotion pair
            "steps": get_steps_for_emotion(emotion, target_emotion),
            "final_check": {
                "text": f"How are you feeling now compared to when we started? Has your {emotion} decreased on a scale of 1-10?",
                "seconds_wait": 8,
                "input_type": "number_scale",
                "input_range": {
                    "min": 1,
                    "max": 10
                },
                "reward_threshold": 5
            },
            "reward": {
                "medal_type": medal_color,
                "title": f"{medal_color.title()} Medal of {target_emotion.title()}",
                "description": "This medal represents the neurological and physiological changes you've created through these practices.",
                "seconds_wait": 10,
                "techniques_summary": [
                    # Pre-defined techniques per emotion
                ],
                "congratulations_text": f"Each time you practice these skills, you strengthen the neural pathways that support {target_emotion}!"
            }
        },
        "metadata": {
            "version": "1.0",
            "created_date": "2025-04-20",
            "target_emotions": [emotion, target_emotion],
            "estimated_completion_time_minutes": 15,
            "difficulty_level": "beginner"
        }
    }
    
    return template
```

## Setup Instructions

### Prerequisites

- Python 3.9+
- pip

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-org/mood-journey-api.git
   cd mood-journey-api
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
   # Create a .env file with:
   ANTHROPIC_API_KEY=your_anthropic_api_key
   # or
   OPENAI_API_KEY=your_openai_api_key
   ```

5. Run migrations
   ```bash
   python manage.py migrate
   ```

6. Start development server
   ```bash
   python manage.py runserver
   ```

## Sample API Usage

### Using curl

```bash
curl -X POST http://localhost:8000/api/v1/courses/generate/ \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user123", "mood": "sad", "context": "I failed an important exam"}'
```

### Using JavaScript (React Native)

```javascript
const generateCourse = async (userId, mood, context) => {
  try {
    const response = await fetch('http://your-api-url/api/v1/courses/generate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        mood: mood,
        context: context
      }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating course:', error);
    throw error;
  }
};
```

## JSON Structure Reference

The main course JSON structure has the following format:

```json
{
  "course": {
    "title": "From Sadness to Happiness Journey",
    "emotion_transition": {
      "from": "sadness",
      "to": "happiness"
    },
    "initial_prompt": {
      "text": "How are you feeling right now on a scale of 1-10?",
      "seconds_wait": 5,
      "input_type": "number_scale",
      "input_range": {
        "min": 1,
        "max": 10
      }
    },
    "steps": [
      {
        "step_number": 1,
        "quiz": {
          "question": "...",
          "options": [
            {"id": "A", "text": "..."},
            {"id": "B", "text": "..."},
            {"id": "C", "text": "..."},
            {"id": "D", "text": "..."}
          ],
          "correct_answer": "B",
          "seconds_wait": 10
        },
        "education": {
          "correct_text": "...",
          "correct_text_seconds_wait": 5,
          "explanation": "...",
          "explanation_seconds_wait": 8
        },
        "guided_activity": {
          "title": "...",
          "instructions": {
            "text": "...",
            "wait": 5
          },
          "steps": [
            {
              "text": "...", 
              "countdown": 4, 
              "wait": 4
            },
            // Additional steps
          ],
          "conclusion": {
            "text": "...",
            "wait": 3
          }
        }
      }
      // Steps 2-5 follow the same structure
    ],
    "final_check": {
      "text": "How are you feeling now compared to when we started?",
      "seconds_wait": 8,
      "input_type": "number_scale",
      "input_range": {
        "min": 1,
        "max": 10
      },
      "reward_threshold": 5
    },
    "reward": {
      "medal_type": "red",
      "title": "Red Medal of Emotional Understanding",
      "description": "...",
      "seconds_wait": 10,
      "techniques_summary": [
        // Techniques learned
      ],
      "congratulations_text": "..."
    }
  },
  "metadata": {
    "version": "1.0",
    "created_date": "2025-04-20",
    "target_emotions": ["sadness", "happiness"],
    "estimated_completion_time_minutes": 15,
    "difficulty_level": "beginner"
  }
}
```

## Deployment (Hackathon)

For a hackathon, we recommend:

1. Deploy to a simple hosting service like Heroku or PythonAnywhere
2. Use SQLite database for simplicity
3. Set CORS headers to allow connections from your React Native app
4. Consider implementing a mock AI service first, then connect real AI once functionality is confirmed

## Future Improvements

- Migrate to PostgreSQL for production
- Add user authentication with JWT
- Implement caching for common emotion journeys
- Create an admin dashboard for journey management
- Add analytics to track which journeys are most effective
- Implement more sophisticated AI prompting with examples

## Hackathon Tips

- Start with pre-built templates for each emotion to avoid AI API costs during development
- Focus on getting the API endpoint and data structure right first
- Use mock data for quick iteration
- Test thoroughly with your React Native frontend
- Document the API clearly for team collaboration