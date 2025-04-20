from rest_framework import serializers
from .models import EmotionalCourse, UserProgress

class EmotionalCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmotionalCourse
        fields = ['id', 'user_id', 'from_emotion', 'to_emotion', 
                  'context', 'created_at', 'completed', 'json_data']

class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = ['id', 'course', 'current_step', 'initial_mood_rating',
                  'final_mood_rating', 'earned_medal', 'last_updated']
