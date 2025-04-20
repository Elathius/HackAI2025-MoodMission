from django.db import models

# Create your models here.

class EmotionalCourse(models.Model):
    """Stores a complete emotional journey course"""
    user_id = models.CharField(max_length=100)  # External user ID
    from_emotion = models.CharField(max_length=50)
    to_emotion = models.CharField(max_length=50)
    context = models.TextField()  # User's input about why they feel this way
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    json_data = models.JSONField()  # Stores the entire course JSON
    
    def __str__(self):
        return f"Journey from {self.from_emotion} to {self.to_emotion} for {self.user_id}"

class UserProgress(models.Model):
    """Tracks user progress through a course"""
    course = models.ForeignKey(EmotionalCourse, on_delete=models.CASCADE)
    current_step = models.IntegerField(default=0)
    initial_mood_rating = models.IntegerField(null=True)
    final_mood_rating = models.IntegerField(null=True)
    earned_medal = models.BooleanField(default=False)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Progress for {self.course.user_id} - Step {self.current_step}"
