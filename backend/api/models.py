from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    native_language = models.CharField(max_length=10, default='ru')
    target_language = models.CharField(max_length=10, default='en')
    level = models.CharField(
        max_length=2,
        choices=[('A1', 'A1'), ('A2', 'A2'), ('B1', 'B1'), ('B2', 'B2'), ('C1', 'C1')],
        default='A1'
    )
    xp = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    last_activity = models.DateField(null=True, blank=True)
    onboarding_completed = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
class Lesson(models.Model):
    LANGUAGE_CHOICES = [
        ('en', 'Английский'),
        ('de', 'Немецкий'),
        ('fr', 'Французский'),
        ('es', 'Испанский'),
        ('it', 'Итальянский'),
        ('zh', 'Китайский'),
    ]
    LEVEL_CHOICES = [
        ('A1', 'A1'), ('A2', 'A2'),
        ('B1', 'B1'), ('B2', 'B2'), ('C1', 'C1'),
    ]
    TYPE_CHOICES = [
        ('vocabulary', 'Словарный запас'),
        ('grammar', 'Грамматика'),
        ('phrases', 'Фразы'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES)
    level = models.CharField(max_length=2, choices=LEVEL_CHOICES)
    lesson_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='vocabulary')
    order = models.IntegerField(default=0)
    xp_reward = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.title} ({self.language} - {self.level})'


class Word(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='words')
    word = models.CharField(max_length=200)
    translation = models.CharField(max_length=200)
    example = models.TextField(blank=True)
    example_translation = models.TextField(blank=True)

    def __str__(self):
        return f'{self.word} → {self.translation}'


class Exercise(models.Model):
    TYPE_CHOICES = [
        ('translate', 'Перевод'),
        ('multiple_choice', 'Выбор варианта'),
        ('write', 'Написать фразу'),
    ]

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='exercises')
    exercise_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    question = models.TextField()
    correct_answer = models.TextField()
    options = models.JSONField(default=list, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.exercise_type}: {self.question[:50]}'