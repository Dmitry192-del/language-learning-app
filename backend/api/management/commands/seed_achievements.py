from django.core.management.base import BaseCommand
from api.models import Achievement

class Command(BaseCommand):
    help = 'Заполняет базу достижениями'

    def handle(self, *args, **kwargs):
        Achievement.objects.all().delete()

        achievements = [
            ('first_lesson', '🎯', 'Первый шаг', 'Пройди свой первый урок', 0),
            ('lesson_5', '📚', 'Студент', 'Пройди 5 уроков', 20),
            ('lesson_10', '🎓', 'Отличник', 'Пройди 10 уроков', 50),
            ('streak_3', '🔥', 'На волне', 'Занимайся 3 дня подряд', 10),
            ('streak_7', '⚡', 'Неделя силы', 'Занимайся 7 дней подряд', 30),
            ('streak_30', '👑', 'Легенда', 'Занимайся 30 дней подряд', 100),
            ('xp_100', '⭐', 'Сотня', 'Набери 100 XP', 0),
            ('xp_500', '🌟', 'Полпути', 'Набери 500 XP', 0),
            ('xp_1000', '💫', 'Мастер', 'Набери 1000 XP', 0),
            ('cards_10', '🃏', 'Коллекционер', 'Создай 10 карточек', 15),
            ('ai_chat', '🤖', 'Технарь', 'Проведи первый AI диалог', 10),
        ]

        for code, icon, title, desc, xp in achievements:
            Achievement.objects.create(
                code=code, icon=icon, title=title,
                description=desc, xp_reward=xp
            )

        self.stdout.write(self.style.SUCCESS('✅ Достижения добавлены!'))