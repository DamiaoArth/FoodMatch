from django.db import models
from django.utils.translation import gettext_lazy as _

class Alimento(models.Model):
    nome = models.CharField(_('nome'), max_length=100)
    calorias = models.DecimalField(_('calorias'), max_digits=6, decimal_places=2)
    proteinas = models.DecimalField(_('proteínas (g)'), max_digits=6, decimal_places=2)
    carboidratos = models.DecimalField(_('carboidratos (g)'), max_digits=6, decimal_places=2)
    gorduras = models.DecimalField(_('gorduras (g)'), max_digits=6, decimal_places=2)
    preco_medio = models.DecimalField(_('preço médio'), max_digits=10, decimal_places=2)
    
    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = _('alimento')
        verbose_name_plural = _('alimentos')

class Bebida(models.Model):
    nome = models.CharField(_('nome'), max_length=100)
    calorias = models.DecimalField(_('calorias'), max_digits=6, decimal_places=2)
    tipo = models.CharField(_('tipo'), max_length=50, help_text=_('Ex: suco, chá, energético'))
    preco_medio = models.DecimalField(_('preço médio'), max_digits=10, decimal_places=2)
    
    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = _('bebida')
        verbose_name_plural = _('bebidas')

class Receita(models.Model):
    nome = models.CharField(_('nome'), max_length=100)
    ingredientes = models.TextField(_('ingredientes'))
    modo_preparo = models.TextField(_('modo de preparo'), null=True, blank=True)
    tempo_preparo = models.IntegerField(_('tempo de preparo (min)'))
    porcoes = models.IntegerField(_('porções'), default=1)
    calorias_totais = models.DecimalField(_('calorias totais'), max_digits=6, decimal_places=2)
    imagem = models.ImageField(_('imagem'), upload_to='receitas/', null=True, blank=True)
    
    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = _('receita')
        verbose_name_plural = _('receitas')
