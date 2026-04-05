from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Word, Exercise, Lesson

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username',
            'native_language', 'target_language',
            'level', 'xp', 'streak',
            'onboarding_completed'
        ]

class WordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Word
        fields = ['id', 'word', 'translation', 'example', 'example_translation']

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'exercise_type', 'question', 'correct_answer', 'options', 'order']

class LessonSerializer(serializers.ModelSerializer):
    words = WordSerializer(many=True, read_only=True)
    exercises = ExerciseSerializer(many=True, read_only=True)
    word_count = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'description', 'language', 'level',
                  'lesson_type', 'order', 'xp_reward', 'word_count', 'words', 'exercises']

    def get_word_count(self, obj):
        return obj.words.count()