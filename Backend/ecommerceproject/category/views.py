from django.shortcuts import render
from rest_framework.generics import ListAPIView,CreateAPIView,RetrieveAPIView,RetrieveUpdateAPIView,DestroyAPIView
# Create your views here.
from .models import Category
from .serializers import CategorySerializer,CategoryDetailSerializer
from rest_framework.permissions import IsAdminUser, IsAuthenticated, BasePermission, SAFE_METHODS
from django.db.models import Avg, Prefetch
from product.models import Product


class CategoryAddView(CreateAPIView):
    serializer_class=CategorySerializer
    queryset=Category.objects.all()
    permission_classes=[IsAdminUser]

class CategoryListView(ListAPIView):
    serializer_class=CategorySerializer
    queryset=Category.objects.all()

 
    

class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS or bool(request.user and request.user.is_staff)


class CategoryDetailView(RetrieveUpdateAPIView):
    lookup_url_kwarg="id"
    serializer_class=CategoryDetailSerializer
    permission_classes=[IsAdminOrReadOnly]
    queryset=Category.objects.prefetch_related(
        Prefetch("products", queryset=Product.objects.select_related("category").annotate(average_rating=Avg("reviews__rating")))
    )
    
class CategoryDeleteView(DestroyAPIView):
    serializer_class=CategoryDetailSerializer
    permission_classes=[IsAdminUser]
    lookup_url_kwarg="id"
    queryset=Category.objects.all()
