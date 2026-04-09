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
    path('flashcards/', views.flashcard_sets, name='flashcard_sets'),
    path('flashcards/<int:set_id>/', views.flashcard_set_detail, name='flashcard_set_detail'),
    path('flashcards/<int:set_id>/cards/', views.add_flashcard, name='add_flashcard'),
    path('flashcards/cards/<int:card_id>/', views.delete_flashcard, name='delete_flashcard'),
    path('flashcards/cards/<int:card_id>/review/', views.review_card, name='review_card'),
    path('flashcards/due/', views.due_cards, name='due_cards'),
    path('ai/chat/', views.ai_chat, name='ai_chat'),
    path('achievements/', views.get_achievements, name='achievements'),
    path('stats/', views.activity_stats, name='stats'),
]