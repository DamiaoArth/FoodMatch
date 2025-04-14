from django.urls import path
from .views import (
    MatchListView, MatchDetailView, MatchCreateView,
    CarrinhoListView, CarrinhoDetailView, CarrinhoCreateView,
    ReceitaUsuarioListView, ReceitaUsuarioDetailView, ReceitaUsuarioCreateView,
    DashboardView, MatchesRecomendadosView
)

urlpatterns = [
    path('', MatchListView.as_view(), name='match-list'),
    path('<int:pk>/', MatchDetailView.as_view(), name='match-detail'),
    path('create/', MatchCreateView.as_view(), name='match-create'),
    path('carrinhos/', CarrinhoListView.as_view(), name='carrinho-list'),
    path('carrinhos/<int:pk>/', CarrinhoDetailView.as_view(), name='carrinho-detail'),
    path('carrinhos/create/', CarrinhoCreateView.as_view(), name='carrinho-create'),
    path('receitas-usuario/', ReceitaUsuarioListView.as_view(), name='receitausuario-list'),
    path('receitas-usuario/<int:pk>/', ReceitaUsuarioDetailView.as_view(), name='receitausuario-detail'),
    path('receitas-usuario/create/', ReceitaUsuarioCreateView.as_view(), name='receitausuario-create'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('recomendados/', MatchesRecomendadosView.as_view(), name='matches-recomendados'),
]