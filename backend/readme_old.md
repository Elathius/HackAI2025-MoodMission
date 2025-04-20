Only use this readme as a suggestion, not the direction.

# Mental Health App - Hackathon Project



We're developing the back-end for a mental health focused app where it takes you through a guided and educational journey aimed at improving and educating you about your mood and why things feel a certain way and etc.
 Now: What is the best way for this backend to function with a react front-end, should there be a restful API system where each page makes a call and gets a response with all the data on it and then that is used to render the page quickly for the user? 

Keeping in mind: 
The api calls will have some processing using third party APIs such as Claude or GPT, also we need to store those things in a db in some way so we can re-use it Also, is it a good idea to maintain a hidden "profile" about a user that we get from Claude/GPT that we can use as "context" when we do make queries about a said user? How should this backend system look like, what kind of DBs and schemas should we use, tell me everything

Also, keep in mind a few more things:
The primary focus here is only the back-end, the front-end is seperate.
We're using django with the best option for our db.
We want what makes all of this funcitonal, not production ready, we're doing this in a a timeline of a day or less.


Imp flow:
As the app begins, the user is prompted and asked about their current mood, based on that information, theyre prompted to tell us in more detail about why that is, they have both options to either speak (we use a backend process to convert into text) or simply type their thohughts in, that information is then sent to the backend It is used by the AI to generate a small "course" with lets say 5 steps, at each step they are given fun quizzes about the emotion they are going through and that is used as a leeway into educating them about the said emotion For example, a question is: Should you should you not go grocery shopping while you're sad and hungry? If they no, its the correct answer and if yes then its wrong and then they are given an explanation such as "Correct! You should ideally not 'because you feel more inclined to make impulse decisions because the brain chemistry in that state is altertered in this specic way which results in this specific thing happeneing etc"

At the end of this journey to education and steps, it is expected for them to be in a "improved" state, at which point theyre igven a collectible medal as a reward!

Now, about the backend side of this:

at the point where the user gives us his information dump about how he is feeling and etc, we use that we a way to generate the entire course and send it as a response including thingsl ike, questions, no of steps, quetion1, question2, etc and at the same time at each step there is an option for the user to "Add more context", this way all the information can be stored in a var in one go and be used to render the pages as ncessary

AI Generated Suggestion for project:


## Project Overview
A mental health focused mobile application that guides users through an educational journey to improve and understand their mood. The app provides personalized insights using AI (Claude/GPT) while maintaining user context for a continuously improving experience.

## Architecture

### Frontend
- **React Native for Android**
- Simple, focused UI with journey-based navigation
- Minimal state management using Context API

### Backend
- **Django with Django REST Framework**
- **Database**: SQLite for hackathon (can upgrade to PostgreSQL later)
- **AI Integration**: Claude/GPT for personalized insights

## Core Components

### 1. User Authentication
Simple token-based authentication without refresh mechanisms for hackathon purposes.

### 2. Journey System
Pre-defined educational modules about mental health that users progress through.

### 3. Assessment System
Questionnaires that collect user input for AI analysis.

### 4. AI Context Profile
A "hidden profile" that stores insights about the user from AI interactions.

### 5. Resource Library
Educational materials about mental health concepts.

## Database Schema

### Simplified Models

```python
# users/models.py
class User(AbstractUser):
    # Use Django's built-in user model
    pass

# journey/models.py
class Module(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    order = models.IntegerField(default=0)

class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)
    context_data = models.JSONField(default=dict)  # Store AI context here
```

## API Endpoints (7 total)

1. **Authentication**
   - `/api/auth/` - Handle login/registration in one endpoint

2. **User Journey**
   - `/api/journey/` - Get all content modules and track progress
   - `/api/journey/<module_id>/` - Get specific module content

3. **Assessments**
   - `/api/assessment/` - Get assessment questions
   - `/api/assessment/submit/` - Submit answers and get AI-generated insights

4. **User Context**
   - `/api/context/` - Get/update user's AI profile/context

5. **Resources**
   - `/api/resources/` - Get educational content

## AI Integration

### Quick Implementation

```python
def get_ai_insights(user_input, user_context=None):
    # Simplified AI call
    try:
        context = user_context or {}
        prompt = f"""
        User reflection: {user_input}
        
        User context: {json.dumps(context)}
        
        Provide brief mental health insights and suggestions:
        """
        # Your AI API call here (Claude or GPT)
        # Example with hypothetical API:
        response = ai_client.complete(prompt=prompt, max_tokens=300)
        return response.text
    except Exception as e:
        # Fail gracefully during hackathon
        return "We're still processing your insights."
```

### Storing Context

After each meaningful AI interaction, extract key insights and store them in the user's profile:

```python
# Update user context after assessment
user_progress = UserProgress.objects.get(user=user, module=module)
if 'context_data' not in user_progress.context_data:
    user_progress.context_data = {}
user_progress.context_data['latest_insights'] = ai_response
user_progress.save()
```

## Implementation Priorities

1. **Core Journey Flow**
   - User can progress through educational modules
   - Simple progress tracking
   
2. **Basic Assessment**
   - Implement one comprehensive assessment
   - AI analysis of responses
   
3. **Context Building**
   - Store insights from user interactions
   - Use context in future AI calls

4. **Personalization**
   - Use stored context to personalize content
   - Adapt recommendations based on user progress

## Development Shortcuts

1. **Use Django Admin** for content management
2. **Pre-write Content** instead of generating dynamically
3. **Mock AI Responses** during development if API calls are slow
4. **Focus on Core Flow** rather than edge cases
5. **Use SQLite** instead of setting up PostgreSQL

## Setup Instructions

### Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install django djangorestframework django-cors-headers requests

# Create project
django-admin startproject mental_health_backend
cd mental_health_backend

# Create apps
python manage.py startapp users
python manage.py startapp journey

# Apply migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver
```

### Frontend Setup

```bash
# Install React Native CLI
npm install -g react-native-cli

# Create project
npx react-native init MentalHealthApp

# Install dependencies
cd MentalHealthApp
npm install axios @react-navigation/native @react-navigation/stack

# Run on Android
npx react-native run-android
```

## Next Steps (Post-Hackathon)

1. **Migrate to PostgreSQL** for production
2. **Implement refresh tokens** for better security
3. **Add more comprehensive error handling**
4. **Create admin dashboard** for content management
5. **Improve AI context building** with more sophisticated analysis

## Notes on Database Choice

**SQLite** is sufficient for the hackathon because:
- Zero configuration required
- Comes built-in with Django
- Perfect for rapid development
- Handles the scale of a demo well

PostgreSQL would be better for production due to:
- Better concurrency for multiple users
- JSON field support for context storage
- More robust for scaling
- Better security features

## Hackathon Timeline Example (3 days)

**Day 1:**
- Backend: Set up Django, create models, basic API endpoints
- Frontend: Set up React Native, navigation structure

**Day 2:**
- Backend: Implement AI integration, finish API endpoints
- Frontend: Create all main screens, connect to API

**Day 3:**
- Polish UI/UX
- Add sample content
- Test full user journey
- Prepare demo

Remember: Focus on demonstrating the core concept rather than building a complete product!



-----

