from rest_framework import generics, permissions, status, viewsets, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from .serializers import (UserSerializer, UserCreateSerializer, UserUpdateSerializer, 
                          ChangePasswordSerializer, MedidaCorporalSerializer, MedidaCorporalCreateSerializer,
                          DietaSerializer, DietaCreateSerializer, RefeicaoSerializer, RefeicaoCreateSerializer)
from .models import MedidaCorporal, Dieta, Refeicao, TipoRefeicao
from django.db.models import Avg, Max, Min
from django.db.models.functions import TruncMonth, TruncWeek
from django.utils import timezone
from datetime import timedelta, datetime, time

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class UserUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserSerializer
    
    def get_object(self):
        return self.request.user

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['password'])
            user.save()
            return Response({'detail': 'Senha alterada com sucesso.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DietaViewSet(viewsets.ModelViewSet):
    serializer_class = DietaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Dieta.objects.filter(usuario=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return DietaCreateSerializer
        return DietaSerializer
    
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
    
    @action(detail=False, methods=['get'])
    def ativa(self, request):
        """Retorna a dieta ativa do usuário."""
        dieta = Dieta.objects.filter(usuario=request.user, ativa=True).first()
        if not dieta:
            return Response({'detail': 'Nenhuma dieta ativa encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(dieta)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def refeicao_atual(self, request):
        """Retorna a refeição atual do usuário com base na hora do dia."""
        dieta = Dieta.objects.filter(usuario=request.user, ativa=True).first()
        if not dieta:
            return Response({'detail': 'Nenhuma dieta ativa encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Obtém a hora atual
        hora_atual = timezone.localtime().time()
        
        # Busca a refeição mais próxima da hora atual
        refeicoes = Refeicao.objects.filter(dieta=dieta).order_by('horario')
        
        if not refeicoes.exists():
            return Response({'detail': 'Nenhuma refeição encontrada na dieta ativa.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Encontra a refeição mais próxima da hora atual
        refeicao_atual = None
        menor_diferenca = None
        
        for refeicao in refeicoes:
            # Calcula a diferença em minutos entre a hora atual e a hora da refeição
            hora_refeicao = refeicao.horario
            hora_atual_minutos = hora_atual.hour * 60 + hora_atual.minute
            hora_refeicao_minutos = hora_refeicao.hour * 60 + hora_refeicao.minute
            
            diferenca = abs(hora_atual_minutos - hora_refeicao_minutos)
            
            if menor_diferenca is None or diferenca < menor_diferenca:
                menor_diferenca = diferenca
                refeicao_atual = refeicao
        
        serializer = RefeicaoSerializer(refeicao_atual)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def refeicoes_do_dia(self, request):
        """Retorna todas as refeições do dia da dieta ativa do usuário."""
        dieta = Dieta.objects.filter(usuario=request.user, ativa=True).first()
        if not dieta:
            return Response({'detail': 'Nenhuma dieta ativa encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        
        refeicoes = Refeicao.objects.filter(dieta=dieta).order_by('horario')
        serializer = RefeicaoSerializer(refeicoes, many=True)
        return Response(serializer.data)


class RefeicaoViewSet(viewsets.ModelViewSet):
    serializer_class = RefeicaoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Refeicao.objects.filter(dieta__usuario=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return RefeicaoCreateSerializer
        return RefeicaoSerializer
    
    def perform_create(self, serializer):
        # Verifica se a dieta pertence ao usuário atual
        dieta_id = self.request.data.get('dieta')
        try:
            dieta = Dieta.objects.get(id=dieta_id, usuario=self.request.user)
            serializer.save()
        except Dieta.DoesNotExist:
            raise serializers.ValidationError({'dieta': 'Dieta não encontrada ou não pertence ao usuário.'})


class MedidaCorporalViewSet(viewsets.ModelViewSet):
    serializer_class = MedidaCorporalSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return MedidaCorporal.objects.filter(usuario=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return MedidaCorporalCreateSerializer
        return MedidaCorporalSerializer
    
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
