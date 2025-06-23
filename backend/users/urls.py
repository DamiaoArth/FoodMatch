from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserRegistrationView, UserProfileView, UserUpdateView, ChangePasswordView,
    DietaViewSet, RefeicaoViewSet, MedidaCorporalViewSet
)

router = DefaultRouter()
router.register(r'dietas', DietaViewSet, basename='dieta')
router.register(r'refeicoes', RefeicaoViewSet, basename='refeicao')
router.register(r'medidas', MedidaCorporalViewSet, basename='medida')

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('update/', UserUpdateView.as_view(), name='user-update'),
    path('me/', UserUpdateView.as_view(), name='user-me'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('', include(router.urls)),
]