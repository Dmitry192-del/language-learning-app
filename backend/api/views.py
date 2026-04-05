from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from .serializers import RegisterSerializer, UserSerializer
from .models import Lesson
from .serializers import LessonSerializer

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, username=email, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
    return Response({'error': 'Неверный email или пароль'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    return Response(UserSerializer(request.user).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_onboarding(request):
    user = request.user
    user.target_language = request.data.get('target_language', 'en')
    user.native_language = request.data.get('native_language', 'ru')
    user.level = request.data.get('level', 'A1')
    user.onboarding_completed = True
    user.save()
    return Response(UserSerializer(user).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lessons(request):
    language = request.query_params.get('language', request.user.target_language)
    level = request.query_params.get('level', None)
    
    lessons = Lesson.objects.filter(language=language)
    if level:
        lessons = lessons.filter(level=level)
    
    return Response(LessonSerializer(lessons, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lesson(request, lesson_id):
    try:
        lesson = Lesson.objects.get(id=lesson_id)
        return Response(LessonSerializer(lesson).data)
    except Lesson.DoesNotExist:
        return Response({'error': 'Урок не найден'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_lesson(request, lesson_id):
    try:
        lesson = Lesson.objects.get(id=lesson_id)
        user = request.user

        # Начисляем XP
        user.xp += lesson.xp_reward

        # Обновляем streak
        today = timezone.now().date()
        if user.last_activity:
            diff = (today - user.last_activity).days
            if diff == 1:
                user.streak += 1
            elif diff > 1:
                user.streak = 1
        else:
            user.streak = 1

        user.last_activity = today
        user.save()

        return Response({
            'xp': user.xp,
            'streak': user.streak,
            'xp_earned': lesson.xp_reward,
        })
    except Lesson.DoesNotExist:
        return Response({'error': 'Урок не найден'}, status=404)