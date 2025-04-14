from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User
from recipes.models import Alimento, Bebida, Receita

class Match(models.Model):
    alimento = models.ForeignKey(Alimento, on_delete=models.CASCADE, verbose_name=_('alimento'))
    bebida = models.ForeignKey(Bebida, on_delete=models.CASCADE, verbose_name=_('bebida'))
    score_nutricional = models.DecimalField(_('score nutricional'), max_digits=4, decimal_places=2)
    descricao = models.TextField(_('descrição'), blank=True)
    
    def __str__(self):
        return f'{self.alimento.nome} + {self.bebida.nome}'
    
    class Meta:
        verbose_name = _('match')
        verbose_name_plural = _('matches')

class Carrinho(models.Model):
    STATUS_CHOICES = (
        ('em_progresso', _('Em Progresso')),
        ('finalizado', _('Finalizado')),
    )
    
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=_('usuário'))
    total_estimado = models.DecimalField(_('total estimado'), max_digits=10, decimal_places=2, default=0)
    status = models.CharField(_('status'), max_length=50, choices=STATUS_CHOICES, default='em_progresso')
    data_criacao = models.DateTimeField(_('data de criação'), auto_now_add=True)
    
    def __str__(self):
        return f'Carrinho de {self.usuario.nome} - {self.get_status_display()}'
    
    class Meta:
        verbose_name = _('carrinho')
        verbose_name_plural = _('carrinhos')

class ReceitaUsuario(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=_('usuário'))
    receita = models.ForeignKey(Receita, on_delete=models.CASCADE, verbose_name=_('receita'))
    data_selecao = models.DateTimeField(_('data de seleção'), auto_now_add=True)
    
    def __str__(self):
        return f'{self.usuario.nome} - {self.receita.nome}'
    
    class Meta:
        verbose_name = _('receita do usuário')
        verbose_name_plural = _('receitas dos usuários')
        unique_together = ('usuario', 'receita')
