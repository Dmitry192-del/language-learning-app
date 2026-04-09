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
from .models import Lesson, FlashcardSet, Flashcard
from .serializers import LessonSerializer, FlashcardSetSerializer, FlashcardSerializer
from .models import Lesson, FlashcardSet, Flashcard, CardProgress
from datetime import date, timedelta
from groq import Groq
from django.conf import settings
from .models import Lesson, FlashcardSet, Flashcard, CardProgress, Achievement, UserAchievement

User = get_user_model()

def check_achievements(user):
    earned = []
    existing = set(user.achievements.values_list('achievement__code', flat=True))

    def unlock(code):
        if code not in existing:
            try:
                achievement = Achievement.objects.get(code=code)
                UserAchievement.objects.create(user=user, achievement=achievement)
                user.xp += achievement.xp_reward
                user.save()
                earned.append({
                    'title': achievement.title,
                    'icon': achievement.icon,
                    'description': achievement.description,
                })
            except Achievement.DoesNotExist:
                pass

    # Проверяем уроки
    completed_lessons = UserAchievement.objects.filter(
        user=user, achievement__code='first_lesson'
    ).count()
    
    if user.xp >= 10:
        unlock('first_lesson')
    if user.xp >= 50:
        unlock('lesson_5')
    if user.xp >= 100:
        unlock('lesson_10')

    # Streak
    if user.streak >= 3:
        unlock('streak_3')
    if user.streak >= 7:
        unlock('streak_7')
    if user.streak >= 30:
        unlock('streak_30')

    # XP
    if user.xp >= 100:
        unlock('xp_100')
    if user.xp >= 500:
        unlock('xp_500')
    if user.xp >= 1000:
        unlock('xp_1000')

    return earned

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

        earned_achievements = check_achievements(user)
        
        return Response({
            'xp': user.xp,
            'streak': user.streak,
            'xp_earned': lesson.xp_reward,
        })
    except Lesson.DoesNotExist:
        return Response({'error': 'Урок не найден'}, status=404)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def flashcard_sets(request):
    if request.method == 'GET':
        sets = FlashcardSet.objects.filter(user=request.user)
        return Response(FlashcardSetSerializer(sets, many=True).data)
    
    if request.method == 'POST':
        set_obj = FlashcardSet.objects.create(
            user=request.user,
            title=request.data.get('title'),
            language=request.data.get('language', 'en'),
        )
        return Response(FlashcardSetSerializer(set_obj).data, status=201)

@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated])
def flashcard_set_detail(request, set_id):
    try:
        set_obj = FlashcardSet.objects.get(id=set_id, user=request.user)
    except FlashcardSet.DoesNotExist:
        return Response({'error': 'Набор не найден'}, status=404)

    if request.method == 'GET':
        return Response(FlashcardSetSerializer(set_obj).data)
    
    if request.method == 'DELETE':
        set_obj.delete()
        return Response(status=204)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_flashcard(request, set_id):
    try:
        set_obj = FlashcardSet.objects.get(id=set_id, user=request.user)
    except FlashcardSet.DoesNotExist:
        return Response({'error': 'Набор не найден'}, status=404)

    card = Flashcard.objects.create(
        set=set_obj,
        word=request.data.get('word'),
        translation=request.data.get('translation'),
        example=request.data.get('example', ''),
    )
    return Response(FlashcardSerializer(card).data, status=201)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_flashcard(request, card_id):
    try:
        card = Flashcard.objects.get(id=card_id, set__user=request.user)
        card.delete()
        return Response(status=204)
    except Flashcard.DoesNotExist:
        return Response({'error': 'Карточка не найдена'}, status=404)
    
def sm2(ease_factor, interval, repetitions, quality):
    if quality < 3:
        repetitions = 0
        interval = 1
    else:
        if repetitions == 0:
            interval = 1
        elif repetitions == 1:
            interval = 6
        else:
            interval = round(interval * ease_factor)
        repetitions += 1
        ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        ease_factor = max(1.3, ease_factor)

    next_review = date.today() + timedelta(days=interval)
    return ease_factor, interval, repetitions, next_review


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def review_card(request, card_id):
    quality = request.data.get('quality', 3)
    try:
        card = Flashcard.objects.get(id=card_id, set__user=request.user)
    except Flashcard.DoesNotExist:
        return Response({'error': 'Карточка не найдена'}, status=404)

    progress, _ = CardProgress.objects.get_or_create(
        user=request.user,
        card=card,
        defaults={'ease_factor': 2.5, 'interval': 1, 'repetitions': 0}
    )

    ef, interval, reps, next_review = sm2(
        progress.ease_factor,
        progress.interval,
        progress.repetitions,
        quality
    )

    progress.ease_factor = ef
    progress.interval = interval
    progress.repetitions = reps
    progress.next_review = next_review
    progress.save()

    return Response({
        'next_review': next_review,
        'interval': interval,
        'repetitions': reps,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def due_cards(request):
    today = date.today()
    progress = CardProgress.objects.filter(
        user=request.user,
        next_review__lte=today
    ).select_related('card')

    cards = []
    for p in progress:
        cards.append({
            'id': p.card.id,
            'word': p.card.word,
            'translation': p.card.translation,
            'example': p.card.example,
            'next_review': p.next_review,
        })

    return Response(cards)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_chat(request):
    message = request.data.get('message', '')
    situation = request.data.get('situation', 'general')
    history = request.data.get('history', [])
    language = request.user.target_language

    language_names = {
        'en': 'English', 'de': 'German',
        'fr': 'French', 'es': 'Spanish',
        'it': 'Italian', 'zh': 'Chinese',
    }

    situations = {
        'coffee': 'You are a barista in a coffee shop. The user is a customer ordering coffee.',
        'airport': 'You are an airport staff member. The user is a traveler asking for help.',
        'apartment': 'You are a landlord showing an apartment. The user wants to rent it.',
        'interview': 'You are a job interviewer. The user is a candidate for a position.',
        'general': 'You are a friendly language tutor having a casual conversation.',
    }

    system_prompt = f"""You are a language learning assistant helping someone practice {language_names.get(language, 'English')}.

Situation: {situations.get(situation, situations['general'])}

Rules:
1. ALWAYS respond in {language_names.get(language, 'English')} only
2. Keep responses short (2-3 sentences max)
3. Be natural and conversational
4. If the user makes a grammar mistake, gently correct it at the end of your response in brackets like [Correction: ...]
5. Stay in character for the situation"""


    messages = [{'role': 'system', 'content': system_prompt}]
    for msg in history:
        messages.append({'role': msg['role'], 'content': msg['content']})
    messages.append({'role': 'user', 'content': message})

    client = Groq(api_key=settings.GROQ_API_KEY)
    response = client.chat.completions.create(
        model='llama-3.3-70b-versatile',
        messages=messages,
        max_tokens=200,
    )

    reply = response.choices[0].message.content

    return Response({'reply': reply})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_achievements(request):
    user_achievements = UserAchievement.objects.filter(
        user=request.user
    ).select_related('achievement').order_by('-earned_at')

    all_achievements = Achievement.objects.all()

    result = []
    earned_codes = set(user_achievements.values_list('achievement__code', flat=True))

    for achievement in all_achievements:
        result.append({
            'code': achievement.code,
            'title': achievement.title,
            'description': achievement.description,
            'icon': achievement.icon,
            'xp_reward': achievement.xp_reward,
            'earned': achievement.code in earned_codes,
        })

    return Response(result)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def activity_stats(request):
    from django.utils import timezone
    from datetime import timedelta

    user = request.user
    today = timezone.now().date()
    
    # Последние 7 дней
    days = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        days.append({
            'date': day.strftime('%d.%m'),
            'xp': 0,
        })

    return Response({
        'total_xp': user.xp,
        'streak': user.streak,
        'level': user.level,
        'days': days,
    })