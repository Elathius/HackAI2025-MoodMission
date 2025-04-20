from django.urls import path
from . import views

urlpatterns = [
    path("api/v1/courses/generate/", views.generate_course, name="generate-course"),
    path("api/v1/courses/<int:course_id>/progress/", views.update_progress, name="update-progress"),
    path("api/v1/courses/", views.CourseListView.as_view(), name="course-list"),
]
