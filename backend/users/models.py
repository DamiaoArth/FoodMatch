from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    """Define um model manager para User model com sem username."""

    def _create_user(self, email, password, **extra_fields):
        """Cria e salva um usuário com o email e senha fornecidos."""
        if not email:
            raise ValueError('O email é obrigatório')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Modelo de usuário personalizado que usa email como identificador único."""
    username = None
    email = models.EmailField(_('email address'), unique=True)
    nome = models.CharField(_('nome'), max_length=100)
    renda = models.DecimalField(_('renda mensal'), max_digits=10, decimal_places=2, null=True, blank=True)
    objetivo_nutricional = models.CharField(_('objetivo nutricional'), max_length=100, null=True, blank=True)
    data_criacao = models.DateTimeField(_('data de criação'), auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome']

    objects = UserManager()

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = _('usuário')
        verbose_name_plural = _('usuários')
