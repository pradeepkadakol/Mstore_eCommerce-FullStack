from django.shortcuts import render
from .models import Order
from .serializers import OrderSerializer,OrderListSerializer,AdminOrderListSerializer,AdminOrderStatusSerializer
from rest_framework.generics import CreateAPIView,ListAPIView,UpdateAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from product.models import Product
from rest_framework.response import Response
from rest_framework import status
from cart.models import Cart
from django.db import transaction
from django.shortcuts import get_object_or_404

class OrderView(CreateAPIView):
    serializer_class=OrderSerializer
    queryset=Order.objects.all()
    permission_classes=[IsAuthenticated]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        user=request.user
        serializer.is_valid(raise_exception=True)
        expected_quantity=serializer.validated_data.pop("expected_quantity",None)
        product=get_object_or_404(Product, id=kwargs.get("id"))
        cart_items=Cart.objects.select_for_update().filter(user=user,product=product)
        quantity=sum(item.quantity for item in cart_items) or 1
        if expected_quantity is not None and quantity != expected_quantity:
            return Response({"message":"Cart quantity changed. Review checkout before ordering."},status=status.HTTP_409_CONFLICT)
        serializer.save(user=user,product=product,quantity=quantity)
        cart_items.delete()
        return Response(serializer.data,status=status.HTTP_201_CREATED)

class OrderListView(ListAPIView):

    serializer_class=OrderListSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).select_related("product")
    
class OrderCancelView(UpdateAPIView):

    serializer_class=OrderSerializer
    queryset=Order.objects.all()
    permission_classes=[IsAuthenticated]
    lookup_url_kwarg="id"

    def update(self, request, *args, **kwargs):
        updated=Order.objects.filter(id=kwargs.get("id"),user=request.user,status="order-placed").update(status="order-cancelled")
        order=get_object_or_404(Order, id=kwargs.get("id"), user=request.user)
        if not updated:
            return Response({"message":"Only placed orders can be cancelled."},status=status.HTTP_400_BAD_REQUEST)
        return Response(OrderSerializer(order).data)


class AdminOrderListView(ListAPIView):
    serializer_class=AdminOrderListSerializer
    permission_classes=[IsAdminUser]
    queryset=Order.objects.select_related("product","user").order_by("-ordered_date")


class AdminOrderStatusView(UpdateAPIView):
    serializer_class=AdminOrderStatusSerializer
    permission_classes=[IsAdminUser]
    queryset=Order.objects.all()
    lookup_url_kwarg="id"

    def update(self, request, *args, **kwargs):
        order=self.get_object()
        serializer=self.get_serializer(order,data=request.data,partial=kwargs.get("partial",False))
        serializer.is_valid(raise_exception=True)
        new_status=serializer.validated_data.get("status",order.status)
        if new_status != order.status:
            updated=Order.objects.filter(pk=order.pk,status=order.status).update(status=new_status)
            if not updated:
                return Response({"message":"Order changed. Reload it before updating."},status=status.HTTP_409_CONFLICT)
            order.status=new_status
        return Response(self.get_serializer(order).data)
