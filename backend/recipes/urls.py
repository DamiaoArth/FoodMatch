from django.urls import path
from .views import (
    AlimentoListView, AlimentoDetailView, 
    BebidaListView, BebidaDetailView,
    ReceitaListView, ReceitaDetailView, ReceitaCreateView, ReceitaUpdateView, ReceitaDeleteView
)

urlpatterns = [
    path('alimentos/', AlimentoListView.as_view(), name='alimento-list'),
    path('alimentos/<int:pk>/', AlimentoDetailView.as_view(), name='alimento-detail'),
    path('bebidas/', BebidaListView.as_view(), name='bebida-list'),
    path('bebidas/<int:pk>/', BebidaDetailView.as_view(), name='bebida-detail'),
    path('receitas/', ReceitaListView.as_view(), name='receita-list'),
    path('receitas/<int:pk>/', ReceitaDetailView.as_view(), name='receita-detail'),
    path('receitas/create/', ReceitaCreateView.as_view(), name='receita-create'),
    path('receitas/<int:pk>/update/', ReceitaUpdateView.as_view(), name='receita-update'),
    path('receitas/<int:pk>/delete/', ReceitaDeleteView.as_view(), name='receita-delete'),
]