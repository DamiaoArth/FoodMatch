from rest_framework import serializers
from .models import Match, Carrinho, ReceitaUsuario
from recipes.serializers import AlimentoSerializer, BebidaSerializer, ReceitaSerializer
from users.serializers import UserSerializer

class MatchSerializer(serializers.ModelSerializer):
    alimento = AlimentoSerializer(read_only=True)
    bebida = BebidaSerializer(read_only=True)
    
    class Meta:
        model = Match
        fields = ['id', 'alimento', 'bebida', 'score_nutricional', 'descricao']

class MatchCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['alimento', 'bebida', 'score_nutricional', 'descricao']

class CarrinhoSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)
    
    class Meta:
        model = Carrinho
        fields = ['id', 'usuario', 'total_estimado', 'status', 'data_criacao']

class CarrinhoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrinho
        fields = ['usuario', 'total_estimado', 'status']

class ReceitaUsuarioSerializer(serializers.ModelSerializer):
    usuario = UserSerializer(read_only=True)
    receita = ReceitaSerializer(read_only=True)
    
    class Meta:
        model = ReceitaUsuario
        fields = ['id', 'usuario', 'receita', 'data_selecao']

class ReceitaUsuarioCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReceitaUsuario
        fields = ['usuario', 'receita']