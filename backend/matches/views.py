from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import Match, Carrinho, ReceitaUsuario
from .serializers import (
    MatchSerializer, MatchCreateSerializer,
    CarrinhoSerializer, CarrinhoCreateSerializer,
    ReceitaUsuarioSerializer, ReceitaUsuarioCreateSerializer
)
from recipes.models import Alimento, Bebida, Receita
from recipes.serializers import AlimentoSerializer, BebidaSerializer, ReceitaSerializer

class MatchListView(generics.ListAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Match.objects.all()
        alimento_id = self.request.query_params.get('alimento_id', None)
        bebida_id = self.request.query_params.get('bebida_id', None)
        
        if alimento_id:
            queryset = queryset.filter(alimento_id=alimento_id)
        if bebida_id:
            queryset = queryset.filter(bebida_id=bebida_id)
            
        return queryset

class MatchDetailView(generics.RetrieveAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]

class MatchCreateView(generics.CreateAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchCreateSerializer
    permission_classes = [permissions.IsAdminUser]  # Apenas admin pode criar matches

class CarrinhoListView(generics.ListAPIView):
    serializer_class = CarrinhoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Carrinho.objects.filter(usuario=self.request.user)

class CarrinhoDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CarrinhoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Carrinho.objects.filter(usuario=self.request.user)

class CarrinhoCreateView(generics.CreateAPIView):
    serializer_class = CarrinhoCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class ReceitaUsuarioListView(generics.ListAPIView):
    serializer_class = ReceitaUsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ReceitaUsuario.objects.filter(usuario=self.request.user)

class ReceitaUsuarioDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ReceitaUsuarioSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ReceitaUsuario.objects.filter(usuario=self.request.user)

class ReceitaUsuarioCreateView(generics.CreateAPIView):
    serializer_class = ReceitaUsuarioCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Obter informações do usuário
        user = request.user
        
        # Obter receitas salvas pelo usuário
        receitas_usuario = ReceitaUsuario.objects.filter(usuario=user)
        receitas_serializer = ReceitaUsuarioSerializer(receitas_usuario, many=True)
        
        # Obter carrinhos do usuário
        carrinhos = Carrinho.objects.filter(usuario=user)
        carrinhos_serializer = CarrinhoSerializer(carrinhos, many=True)
        
        # Obter matches recomendados com base no objetivo nutricional do usuário
        matches_recomendados = Match.objects.all()[:5]  # Simplificado para o MVP
        matches_serializer = MatchSerializer(matches_recomendados, many=True)
        
        # Retornar dados do dashboard
        return Response({
            'objetivo_nutricional': user.objetivo_nutricional,
            'receitas_salvas': receitas_serializer.data,
            'carrinhos': carrinhos_serializer.data,
            'matches_recomendados': matches_serializer.data
        })

class MatchesRecomendadosView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Obter informações do usuário
        user = request.user
        
        # Lógica para recomendar matches com base no objetivo nutricional do usuário
        # Por enquanto, simplificado para o MVP
        if user.objetivo_nutricional == 'Perda de peso':
            # Priorizar matches com baixas calorias
            matches = Match.objects.all().order_by('alimento__calorias')[:10]
        elif user.objetivo_nutricional == 'Ganho de massa muscular':
            # Priorizar matches com alimentos ricos em proteínas
            matches = Match.objects.all().order_by('-alimento__proteinas')[:10]
        else:
            # Recomendações padrão
            matches = Match.objects.all()[:10]
        
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)
