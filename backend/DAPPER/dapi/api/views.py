from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import EmotionalCourse, UserProgress
from .serializers import EmotionalCourseSerializer, UserProgressSerializer
from .services.ai_service import generate_journey_with_claude

@api_view(['POST'])
def generate_course(request):
    """Generate a new emotional journey course"""
    user_id = request.data.get('user_id')
    mood = request.data.get('mood')
    context = request.data.get('context')
    
    # Validate required fields
    if not all([user_id, mood, context]):
        return Response(
            {"error": "Missing required fields. Please provide user_id, mood, and context."}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Default target emotion is 'happy' if not specified
    target_emotion = request.data.get('target_emotion', 'happy')
    
    # Generate journey using Claude (or fallback template)
    journey_data = generate_journey_with_claude(mood, target_emotion, context)
    
    # Create course in database
    course = EmotionalCourse.objects.create(
        user_id=user_id,
        from_emotion=mood,
        to_emotion=target_emotion,
        context=context,
        json_data=journey_data
    )
    
    # Create initial progress
    UserProgress.objects.create(course=course)
    
    # Return the journey data
    return Response(journey_data)

@api_view(['POST'])
def update_progress(request, course_id):
    """Update user progress through a course"""
    try:
        course = EmotionalCourse.objects.get(id=course_id)
        progress = UserProgress.objects.get(course=course)
        
        # Update progress
        if 'current_step' in request.data:
            progress.current_step = request.data['current_step']
        
        if 'mood_rating' in request.data:
            if progress.current_step == 0:
                progress.initial_mood_rating = request.data['mood_rating']
            else:
                progress.final_mood_rating = request.data['mood_rating']
                
                # Check if medal earned
                if progress.final_mood_rating >= 5:
                    progress.earned_medal = True
                    course.completed = True
                    course.save()
        
        progress.save()
        return Response(UserProgressSerializer(progress).data)
    except EmotionalCourse.DoesNotExist:
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

class CourseListView(generics.ListAPIView):
    """List all courses for a specific user"""
    serializer_class = EmotionalCourseSerializer
    
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return EmotionalCourse.objects.filter(user_id=user_id).order_by('-created_at')
        return EmotionalCourse.objects.none()
