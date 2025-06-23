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


class MedidaCorporal(models.Model):
    """Modelo para armazenar medidas corporais dos usuários ao longo do tempo."""
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medidas_corporais')
    data_registro = models.DateField(_('data de registro'), auto_now_add=True)
    
    # Medidas básicas
    peso = models.DecimalField(_('peso (kg)'), max_digits=5, decimal_places=2)
    altura = models.DecimalField(_('altura (cm)'), max_digits=5, decimal_places=2)
    
    # Medidas corporais
    cintura = models.DecimalField(_('cintura (cm)'), max_digits=5, decimal_places=2, null=True, blank=True)
    quadril = models.DecimalField(_('quadril (cm)'), max_digits=5, decimal_places=2, null=True, blank=True)
    braco_direito = models.DecimalField(_('braço direito (cm)'), max_digits=5, decimal_places=2, null=True, blank=True)
    braco_esquerdo = models.DecimalField(_('braço esquerdo (cm)'), max_digits=5, decimal_places=2, null=True, blank=True)
    coxa_direita = models.DecimalField(_('coxa direita (cm)'), max_digits=5, decimal_places=2, null=True, blank=True)
    coxa_esquerda = models.DecimalField(_('coxa esquerda (cm)'), max_digits=5, decimal_places=2, null=True, blank=True)
    panturrilha_direita = models.DecimalField(_('panturrilha direita (cm)'), max_digits=5, decimal_places=2, null=True, blank=True)
    panturrilha_esquerda = models.DecimalField(_('panturrilha esquerda (cm)'), max_digits=5, decimal_places=2, null=True, blank=True)
    pescoco = models.DecimalField(_('pescoço (cm)'), max_digits=5, decimal_places=2, null=True, blank=True)
    torax = models.DecimalField(_('tórax (cm)'), max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Índices calculados
    percentual_gordura = models.DecimalField(_('percentual de gordura (%)'), max_digits=5, decimal_places=2, null=True, blank=True)
    
    class Meta:
        verbose_name = _('medida corporal')
        verbose_name_plural = _('medidas corporais')
        ordering = ['-data_registro']
    
    def __str__(self):
        return f"Medidas de {self.usuario.nome} em {self.data_registro}"
    
    @property
    def imc(self):
        """Calcula o Índice de Massa Corporal (IMC)."""
        if self.peso and self.altura:
            # Altura em metros para o cálculo do IMC
            altura_m = self.altura / 100
            return round(self.peso / (altura_m * altura_m), 2)
        return None
    
    @property
    def classificacao_imc(self):
        """Retorna a classificação do IMC."""
        imc = self.imc
        if imc is None:
            return "Não calculado"
        
        if imc < 18.5:
            return "Abaixo do peso"
        elif imc < 25:
            return "Peso normal"
        elif imc < 30:
            return "Sobrepeso"
        elif imc < 35:
            return "Obesidade Grau I"
        elif imc < 40:
            return "Obesidade Grau II"
        else:
            return "Obesidade Grau III"

    class Meta:
        verbose_name = _('usuário')
        verbose_name_plural = _('usuários')


class TipoRefeicao(models.TextChoices):
    CAFE_DA_MANHA = 'cafe_da_manha', _('Café da Manhã')
    LANCHE_MANHA = 'lanche_manha', _('Lanche da Manhã')
    ALMOCO = 'almoco', _('Almoço')
    LANCHE_TARDE = 'lanche_tarde', _('Lanche da Tarde')
    JANTAR = 'jantar', _('Jantar')
    CEIA = 'ceia', _('Ceia')


class Dieta(models.Model):
    """Modelo para armazenar dietas dos usuários."""
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dietas')
    nome = models.CharField(_('nome'), max_length=100)
    descricao = models.TextField(_('descrição'), null=True, blank=True)
    data_inicio = models.DateField(_('data de início'))
    data_fim = models.DateField(_('data de fim'), null=True, blank=True)
    calorias_diarias = models.DecimalField(_('calorias diárias'), max_digits=6, decimal_places=2, null=True, blank=True)
    ativa = models.BooleanField(_('ativa'), default=True)
    
    class Meta:
        verbose_name = _('dieta')
        verbose_name_plural = _('dietas')
        ordering = ['-data_inicio']
    
    def __str__(self):
        return f"Dieta {self.nome} de {self.usuario.nome}"


class Refeicao(models.Model):
    """Modelo para armazenar refeições das dietas dos usuários."""
    dieta = models.ForeignKey(Dieta, on_delete=models.CASCADE, related_name='refeicoes')
    tipo = models.CharField(_('tipo'), max_length=20, choices=TipoRefeicao.choices)
    horario = models.TimeField(_('horário'))
    descricao = models.TextField(_('descrição'))
    calorias = models.DecimalField(_('calorias'), max_digits=6, decimal_places=2, null=True, blank=True)
    proteinas = models.DecimalField(_('proteínas (g)'), max_digits=6, decimal_places=2, null=True, blank=True)
    carboidratos = models.DecimalField(_('carboidratos (g)'), max_digits=6, decimal_places=2, null=True, blank=True)
    gorduras = models.DecimalField(_('gorduras (g)'), max_digits=6, decimal_places=2, null=True, blank=True)
    receita = models.ForeignKey('recipes.Receita', on_delete=models.SET_NULL, null=True, blank=True, related_name='refeicoes')
    
    class Meta:
        verbose_name = _('refeição')
        verbose_name_plural = _('refeições')
        ordering = ['horario']
    
    def __str__(self):
        return f"{self.get_tipo_display()} - {self.dieta.nome}"
    
    def get_horario_formatado(self):
        return self.horario.strftime('%H:%M')
