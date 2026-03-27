from django.core.management.base import BaseCommand
from api.models import Lesson, Word, Exercise

class Command(BaseCommand):
    help = 'Заполняет базу тестовыми уроками'

    def handle(self, *args, **kwargs):
        # Чистим старые данные
        Lesson.objects.all().delete()

        # Урок 1 — Приветствия (Английский A1)
        lesson1 = Lesson.objects.create(
            title='Приветствия',
            description='Научись здороваться и прощаться на английском',
            language='en', level='A1', lesson_type='phrases',
            order=1, xp_reward=10
        )
        words1 = [
            ('Hello', 'Привет', 'Hello! How are you?', 'Привет! Как дела?'),
            ('Goodbye', 'Пока', 'Goodbye! See you tomorrow.', 'Пока! Увидимся завтра.'),
            ('Good morning', 'Доброе утро', 'Good morning! Did you sleep well?', 'Доброе утро! Ты хорошо спал?'),
            ('Good night', 'Спокойной ночи', 'Good night! Sweet dreams.', 'Спокойной ночи! Приятных снов.'),
            ('Thank you', 'Спасибо', 'Thank you for your help.', 'Спасибо за помощь.'),
        ]
        for word, translation, example, example_tr in words1:
            Word.objects.create(lesson=lesson1, word=word, translation=translation,
                                example=example, example_translation=example_tr)
        Exercise.objects.create(lesson=lesson1, exercise_type='multiple_choice',
            question='Как переводится "Hello"?',
            correct_answer='Привет',
            options=['Привет', 'Пока', 'Спасибо', 'Доброе утро'], order=1)
        Exercise.objects.create(lesson=lesson1, exercise_type='translate',
            question='Переведи: "Good morning"',
            correct_answer='Доброе утро', options=[], order=2)

        # Урок 2 — Цифры (Английский A1)
        lesson2 = Lesson.objects.create(
            title='Числа 1-10',
            description='Выучи числа от одного до десяти',
            language='en', level='A1', lesson_type='vocabulary',
            order=2, xp_reward=10
        )
        numbers = [
            ('One', 'Один'), ('Two', 'Два'), ('Three', 'Три'),
            ('Four', 'Четыре'), ('Five', 'Пять'), ('Six', 'Шесть'),
            ('Seven', 'Семь'), ('Eight', 'Восемь'), ('Nine', 'Девять'), ('Ten', 'Десять'),
        ]
        for word, translation in numbers:
            Word.objects.create(lesson=lesson2, word=word, translation=translation)
        Exercise.objects.create(lesson=lesson2, exercise_type='multiple_choice',
            question='Как переводится "Five"?',
            correct_answer='Пять',
            options=['Три', 'Пять', 'Семь', 'Девять'], order=1)

        # Урок 3 — Цвета (Английский A1)
        lesson3 = Lesson.objects.create(
            title='Цвета',
            description='Выучи основные цвета на английском',
            language='en', level='A1', lesson_type='vocabulary',
            order=3, xp_reward=10
        )
        colors = [
            ('Red', 'Красный'), ('Blue', 'Синий'), ('Green', 'Зелёный'),
            ('Yellow', 'Жёлтый'), ('Black', 'Чёрный'), ('White', 'Белый'),
        ]
        for word, translation in colors:
            Word.objects.create(lesson=lesson3, word=word, translation=translation)
        Exercise.objects.create(lesson=lesson3, exercise_type='translate',
            question='Переведи: "Blue"',
            correct_answer='Синий', options=[], order=1)

        self.stdout.write(self.style.SUCCESS('✅ База заполнена тестовыми уроками!'))