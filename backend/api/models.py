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