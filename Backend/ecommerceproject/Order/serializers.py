from rest_framework import serializers
from .models import Order
from product.serializers import ProductSummarySerializer

class OrderSerializer(serializers.ModelSerializer):
    product=serializers.CharField(read_only=True)
    status=serializers.CharField(read_only=True)
    payment_method=serializers.ChoiceField(choices=[("cash-on-delivery","cash-on-delivery")])
    expected_quantity=serializers.IntegerField(min_value=1,write_only=True,required=False)
    class Meta:
        model=Order
        fields=[
            "id",
            "product",
            "status",
            "ordered_date",
            "billing_address",
            "payment_method",
            "quantity",
            "expected_quantity",
        ]
        extra_kwargs={
            "billing_address":{"required":True},
        }

class OrderListSerializer(serializers.ModelSerializer):
    product=serializers.CharField(read_only=True)
    status=serializers.CharField(read_only=True)
    payment_method=serializers.CharField(read_only=True)
    product=ProductSummarySerializer(read_only=True)
    class Meta:
        model=Order
        fields=[
            "id",
            "product",
            "status",
            "ordered_date",
            "billing_address",
            "payment_method",
            "quantity",
        ]


class AdminOrderListSerializer(OrderListSerializer):
    user=serializers.CharField(source="user.username",read_only=True)

    class Meta(OrderListSerializer.Meta):
        fields=OrderListSerializer.Meta.fields+["user"]


class AdminOrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model=Order
        fields=["status"]

    def validate_status(self, value):
        allowed={
            "order-placed":{"on-transit","order-cancelled"},
            "on-transit":{"order-delivered"},
            "order-cancelled":set(),
            "order-delivered":set(),
        }
        if value != self.instance.status and value not in allowed[self.instance.status]:
            raise serializers.ValidationError("This order status change is not allowed.")
        return value
