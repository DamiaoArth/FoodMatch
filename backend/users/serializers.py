from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import MedidaCorporal, Dieta, Refeicao
from recipes.serializers import ReceitaSerializer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'nome', 'renda', 'objetivo_nutricional', 'data_criacao']
        read_only_fields = ['id', 'data_criacao']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'nome', 'password', 'password_confirm', 'renda', 'objetivo_nutricional']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "As senhas não conferem."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['nome', 'renda', 'objetivo_nutricional']
        
class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "As senhas não conferem."})
        return attrs


class MedidaCorporalSerializer(serializers.ModelSerializer):
    imc = serializers.ReadOnlyField()
    classificacao_imc = serializers.ReadOnlyField()
    
    class Meta:
        model = MedidaCorporal
        fields = [
            'id', 'usuario', 'data_registro', 'peso', 'altura', 'cintura', 'quadril',
            'braco_direito', 'braco_esquerdo', 'coxa_direita', 'coxa_esquerda',
            'panturrilha_direita', 'panturrilha_esquerda', 'pescoco', 'torax',
            'percentual_gordura', 'imc', 'classificacao_imc'
        ]
        read_only_fields = ['id', 'usuario', 'data_registro', 'imc', 'classificacao_imc']


class MedidaCorporalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedidaCorporal
        fields = [
            'peso', 'altura', 'cintura', 'quadril',
            'braco_direito', 'braco_esquerdo', 'coxa_direita', 'coxa_esquerda',
            'panturrilha_direita', 'panturrilha_esquerda', 'pescoco', 'torax',
            'percentual_gordura'
        ]
    
    def create(self, validated_data):
        # O usuário será fornecido pelo perform_create na view
        # Não precisamos obter o usuário aqui, pois ele virá como parâmetro
        # Criar uma nova instância de MedidaCorporal
        medida = MedidaCorporal(**validated_data)
        medida.save()
        return medida


class RefeicaoSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    horario_formatado = serializers.CharField(source='get_horario_formatado', read_only=True)
    receita_details = ReceitaSerializer(source='receita', read_only=True)
    
    class Meta:
        model = Refeicao
        fields = [
            'id', 'dieta', 'tipo', 'tipo_display', 'horario', 'horario_formatado',
            'descricao', 'calorias', 'proteinas', 'carboidratos', 'gorduras',
            'receita', 'receita_details'
        ]
        read_only_fields = ['id']


class RefeicaoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refeicao
        fields = [
            'dieta', 'tipo', 'horario', 'descricao', 'calorias',
            'proteinas', 'carboidratos', 'gorduras', 'receita'
        ]


class DietaSerializer(serializers.ModelSerializer):
    refeicoes = RefeicaoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Dieta
        fields = [
            'id', 'usuario', 'nome', 'descricao', 'data_inicio', 'data_fim',
            'calorias_diarias', 'ativa', 'refeicoes'
        ]
        read_only_fields = ['id', 'usuario']


class DietaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dieta
        fields = [
            'nome', 'descricao', 'data_inicio', 'data_fim',
            'calorias_diarias', 'ativa'
        ]
    
    def create(self, validated_data):
        request = self.context.get('request')
        usuario = request.user
        
        dieta = Dieta.objects.create(
            usuario=usuario,
            **validated_data
        )
        return dieta