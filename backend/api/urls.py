from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/me/', views.get_me, name='get_me'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/onboarding/', views.complete_onboarding, name='onboarding'),
    path('lessons/', views.get_lessons, name='lessons'),
    path('lessons/<int:lesson_id>/', views.get_lesson, name='lesson'),
    path('lessons/<int:lesson_id>/complete/', views.complete_lesson, name='complete_lesson'),
]