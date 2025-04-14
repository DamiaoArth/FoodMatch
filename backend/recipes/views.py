from rest_framework import generics, permissions
from .models import Alimento, Bebida, Receita
from .serializers import AlimentoSerializer, BebidaSerializer, ReceitaSerializer, ReceitaDetailSerializer

class AlimentoListView(generics.ListAPIView):
    queryset = Alimento.objects.all()
    serializer_class = AlimentoSerializer
    permission_classes = [permissions.IsAuthenticated]

class AlimentoDetailView(generics.RetrieveAPIView):
    queryset = Alimento.objects.all()
    serializer_class = AlimentoSerializer
    permission_classes = [permissions.IsAuthenticated]

class BebidaListView(generics.ListAPIView):
    queryset = Bebida.objects.all()
    serializer_class = BebidaSerializer
    permission_classes = [permissions.IsAuthenticated]

class BebidaDetailView(generics.RetrieveAPIView):
    queryset = Bebida.objects.all()
    serializer_class = BebidaSerializer
    permission_classes = [permissions.IsAuthenticated]

class ReceitaListView(generics.ListAPIView):
    queryset = Receita.objects.all()
    serializer_class = ReceitaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Receita.objects.all()
        # Implementar filtros por calorias, tempo de preparo, etc.
        return queryset

class ReceitaDetailView(generics.RetrieveAPIView):
    queryset = Receita.objects.all()
    serializer_class = ReceitaDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class ReceitaCreateView(generics.CreateAPIView):
    queryset = Receita.objects.all()
    serializer_class = ReceitaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save()
        
class ReceitaUpdateView(generics.UpdateAPIView):
    queryset = Receita.objects.all()
    serializer_class = ReceitaDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_update(self, serializer):
        serializer.save()
        
class ReceitaDeleteView(generics.DestroyAPIView):
    queryset = Receita.objects.all()
    serializer_class = ReceitaSerializer
    permission_classes = [permissions.IsAuthenticated]
