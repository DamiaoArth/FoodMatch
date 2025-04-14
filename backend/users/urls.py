from django.urls import path
from .views import UserRegistrationView, UserProfileView, UserUpdateView, ChangePasswordView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('update/', UserUpdateView.as_view(), name='user-update'),
    path('me/', UserUpdateView.as_view(), name='user-me'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]