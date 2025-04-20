# Deployment Guide for PythonAnywhere

This guide will walk you through deploying the Mood Journey API on PythonAnywhere.

## 1. Create a PythonAnywhere Account

1. Sign up for a free account at [pythonanywhere.com](https://www.pythonanywhere.com/)
2. After signing up, you'll be taken to your dashboard

## 2. Upload Your Code

### Option 1: Using Git

1. Open a Bash console from your PythonAnywhere dashboard
2. Clone your repository:
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   ```
   
### Option 2: Upload a ZIP file

1. Create a ZIP file of your project locally
2. In PythonAnywhere, go to the Files tab
3. Upload the ZIP file
4. Open a Bash console and unzip the file:
   ```bash
   unzip your-project.zip -d mood-journey-api
   ```

## 3. Set Up a Virtual Environment

1. In the Bash console, create a virtual environment:
   ```bash
   mkvirtualenv --python=python3.9 mood-journey-env
   ```

2. Install the required packages:
   ```bash
   cd ~/your-project-directory
   pip install -r requirements.txt
   ```

## 4. Configure Environment Variables

1. Create a `.env` file in your project directory:
   ```bash
   cd ~/your-project-directory/dapi
   nano .env
   ```

2. Add the following environment variables:
   ```
   # Django settings
   DEBUG=False
   SECRET_KEY=your-secret-key-here
   ALLOWED_HOSTS=yourusername.pythonanywhere.com

   # OpenRouter API settings
   OPENROUTER_API_KEY=your-openrouter-api-key-here
   OPENROUTER_REFERRER=https://yourusername.pythonanywhere.com
   ```

3. Save and exit (Ctrl+X, then Y, then Enter)

## 5. Configure the Web App

1. Go to the Web tab in your PythonAnywhere dashboard
2. Click "Add a new web app"
3. Choose "Manual configuration" (not "Django")
4. Select Python 3.9
5. Enter the path to your project's wsgi file:
   ```
   /home/yourusername/your-project-directory/dapi/dapi/wsgi.py
   ```

6. Set up the virtual environment:
   - In the "Virtualenv" section, enter:
     ```
     /home/yourusername/.virtualenvs/mood-journey-env
     ```

7. Edit the WSGI configuration file (click on the link in the Web tab):
   - Replace the contents with:
     ```python
     import os
     import sys

     # Add your project directory to the sys.path
     path = '/home/yourusername/your-project-directory/dapi'
     if path not in sys.path:
         sys.path.insert(0, path)

     # Set environment variable to tell Django where your settings.py is
     os.environ['DJANGO_SETTINGS_MODULE'] = 'dapi.settings'

     # Activate your virtual environment
     activate_this = '/home/yourusername/.virtualenvs/mood-journey-env/bin/activate_this.py'
     with open(activate_this) as file_:
         exec(file_.read(), dict(__file__=activate_this))

     # Import Django and the WSGI handler
     from django.core.wsgi import get_wsgi_application
     application = get_wsgi_application()
     ```

8. Save the WSGI file

## 6. Set Up Static Files

1. In the Web tab, scroll down to "Static files"
2. Add a static files mapping:
   - URL: `/static/`
   - Directory: `/home/yourusername/your-project-directory/dapi/staticfiles`

## 7. Run Migrations and Collect Static Files

1. Open a Bash console
2. Activate your virtual environment:
   ```bash
   workon mood-journey-env
   ```

3. Navigate to your project directory:
   ```bash
   cd ~/your-project-directory/dapi
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Collect static files:
   ```bash
   python manage.py collectstatic --noinput
   ```

## 8. Reload the Web App

1. Go back to the Web tab
2. Click the "Reload" button for your web app

## 9. Test Your API

Your API should now be accessible at:
```
https://yourusername.pythonanywhere.com/api/v1/courses/
```

You can test the API using tools like Postman, curl, or a simple JavaScript fetch:

```javascript
// Example: Generate a new course
fetch('https://yourusername.pythonanywhere.com/api/v1/courses/generate/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    user_id: 'user123',
    mood: 'sad',
    context: 'I failed an important exam'
  }),
})
.then(response => response.json())
.then(data => console.log(data));
```

## Troubleshooting

1. **500 Server Error**:
   - Check the error logs in the Web tab
   - Common issues include missing environment variables or incorrect paths

2. **Static Files Not Loading**:
   - Verify your static files configuration
   - Make sure you've run `collectstatic`

3. **Database Issues**:
   - Ensure migrations have been applied
   - Check database permissions

4. **API Connection Problems**:
   - Free PythonAnywhere accounts have limitations on external API connections
   - You may need to whitelist the OpenRouter API domain or upgrade to a paid account

## Additional Resources

- [PythonAnywhere Help Pages](https://help.pythonanywhere.com/)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)
- [OpenRouter API Documentation](https://openrouter.ai/docs)
