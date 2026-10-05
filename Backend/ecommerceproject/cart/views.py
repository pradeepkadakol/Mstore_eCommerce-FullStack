from django.shortcuts import render
from .models import Cart
from .serializers import CartSerializer,CartListSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import DestroyAPIView,ListAPIView
from product.models import Product
from rest_framework.views import APIView
from rest_framework.status import HTTP_404_NOT_FOUND
from django.shortcuts import get_object_or_404
from django.db import transaction, OperationalError
from django.db.models import F
from time import sleep
from rest_framework.exceptions import ValidationError


class CartAddView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request,*args,**kwargs):
        serializer=CartSerializer(data=request.data)
        id=kwargs.get("id")
        product=get_object_or_404(Product, id=id)
        user=request.user
        serializer.is_valid(raise_exception=True)
        for attempt in range(3):
            try:
                with transaction.atomic():
                    cart,created=Cart.objects.get_or_create(
                        product=product,user=user,
                        defaults={"quantity":serializer.validated_data.get("quantity",1)},
                    )
                    if created:
                        return Response(CartSerializer(cart).data,status=201)
                    updated=Cart.objects.filter(pk=cart.pk,quantity__lt=10).update(quantity=F("quantity")+1)
                    if not updated:
                        raise ValidationError({"quantity":"Maximum quantity is 10."})
                    cart.refresh_from_db(fields=["quantity"])
                    return Response(CartSerializer(cart).data)
            except OperationalError as exc:
                if "locked" not in str(exc).lower() or attempt==2:
                    raise
                sleep(0.05*(attempt+1))


class CartListView(ListAPIView):

    serializer_class=CartListSerializer
    permission_classes=[IsAuthenticated]
    
    def get_queryset(self):
        user=self.request.user
        cart=user.cart_set.select_related("product").all()
        return cart

class CartRemoveView(DestroyAPIView):
    serializer_class=CartSerializer
    permission_classes=[IsAuthenticated]
    lookup_url_kwarg="id"
    
    def delete(self, request, *args, **kwargs):
        id=kwargs.get("id")
        try:
            user=request.user
            cartitem=user.cart_set.get(id=id)
            cartitem.delete()
            return Response({"message":"item removed successfully"})
        except:
            return Response({
                "message":"no such item"
            },status=HTTP_404_NOT_FOUND)
