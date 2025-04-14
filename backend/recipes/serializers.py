from rest_framework import serializers
from .models import Alimento, Bebida, Receita

class AlimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alimento
        fields = ['id', 'nome', 'calorias', 'proteinas', 'carboidratos', 'gorduras', 'preco_medio']

class BebidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bebida
        fields = ['id', 'nome', 'calorias', 'tipo', 'preco_medio']

class ReceitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receita
        fields = ['id', 'nome', 'ingredientes', 'tempo_preparo', 'calorias_totais', 'imagem']

class ReceitaDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receita
        fields = ['id', 'nome', 'ingredientes', 'modo_preparo', 'tempo_preparo', 'porcoes', 'calorias_totais', 'imagem']