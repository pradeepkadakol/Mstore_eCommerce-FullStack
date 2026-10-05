from django.contrib.auth import get_user_model
from django.test import TestCase
from unittest.mock import patch
from rest_framework.test import APIClient

from cart.models import Cart
from category.models import Category
from product.models import Product
from .models import Order
from .serializers import AdminOrderStatusSerializer


class CheckoutTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="buyer", password="password123")
        category = Category.objects.create(name="Phones", icon="category_icons/phone.jpg")
        self.product = Product.objects.create(
            name="Phone", description="A phone", price="129.00",
            image="product_images/phone.jpg", category=category,
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_checkout_preserves_cart_quantity(self):
        Cart.objects.create(user=self.user, product=self.product, quantity=3)

        response = self.client.post(
            f"/api/products/{self.product.id}/place_order",
            {"billing_address": "123 Main Street", "payment_method": "cash-on-delivery"},
        )

        self.assertEqual(response.status_code, 201)
        order = Order.objects.get(user=self.user, product=self.product)
        self.assertEqual(order.quantity, 3)
        self.assertEqual(response.data["quantity"], 3)
        self.assertFalse(Cart.objects.filter(user=self.user, product=self.product).exists())

    def test_checkout_missing_product_returns_404(self):
        response = self.client.post(
            "/api/products/00000000-0000-0000-0000-000000000001/place_order",
            {"billing_address": "123 Main Street", "payment_method": "cash-on-delivery"},
        )
        self.assertEqual(response.status_code, 404)

    def test_checkout_rejects_unprocessed_online_payment(self):
        response=self.client.post(
            f"/api/products/{self.product.id}/place_order",
            {"billing_address":"123 Main Street","payment_method":"Paypal"},
        )
        self.assertEqual(response.status_code,400)
        self.assertFalse(Order.objects.filter(user=self.user).exists())

    def test_checkout_rejects_quantity_changed_since_preview(self):
        Cart.objects.create(user=self.user,product=self.product,quantity=2)
        response=self.client.post(
            f"/api/products/{self.product.id}/place_order",
            {"billing_address":"123 Main Street","payment_method":"cash-on-delivery","expected_quantity":1},
        )
        self.assertEqual(response.status_code,409)
        self.assertFalse(Order.objects.filter(user=self.user).exists())
        self.assertEqual(Cart.objects.get(user=self.user,product=self.product).quantity,2)

    def test_order_list_contains_absolute_image_url(self):
        Order.objects.create(user=self.user, product=self.product, billing_address="123 Main Street")
        response = self.client.get("/api/orders")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data[0]["product"]["image"].startswith("http://testserver/media/"))

    def test_delivered_order_cannot_be_cancelled(self):
        order=Order.objects.create(user=self.user,product=self.product,billing_address="123 Main Street",status="order-delivered")
        response=self.client.put(f"/api/orders/{order.id}/cancel")
        self.assertEqual(response.status_code,400)
        order.refresh_from_db()
        self.assertEqual(order.status,"order-delivered")


class AdminOrderTests(TestCase):
    def setUp(self):
        user_model=get_user_model()
        self.admin=user_model.objects.create_superuser(username="admin",email="admin@example.com",password="password123")
        self.buyer=user_model.objects.create_user(username="buyer",password="password123")
        category=Category.objects.create(name="Phones",icon="category_icons/phone.jpg")
        product=Product.objects.create(name="Phone",description="A phone",price="129.00",image="product_images/phone.jpg",category=category)
        self.order=Order.objects.create(user=self.buyer,product=product,billing_address="123 Main Street")

    def test_only_admin_can_list_orders(self):
        client=APIClient()
        client.force_authenticate(user=self.buyer)
        self.assertEqual(client.get("/api/admin/orders").status_code,403)

        client.force_authenticate(user=self.admin)
        response=client.get("/api/admin/orders")
        self.assertEqual(response.status_code,200)
        self.assertEqual(response.data[0]["user"],"buyer")
        self.assertEqual(response.data[0]["product"]["name"],"Phone")

    def test_admin_can_advance_but_not_reopen_order(self):
        client=APIClient()
        client.force_authenticate(user=self.admin)
        response=client.patch(f"/api/admin/orders/{self.order.id}",{"status":"on-transit"})
        self.assertEqual(response.status_code,200)
        self.order.refresh_from_db()
        self.assertEqual(self.order.status,"on-transit")

        response=client.patch(f"/api/admin/orders/{self.order.id}",{"status":"order-placed"})
        self.assertEqual(response.status_code,400)

    def test_admin_update_does_not_overwrite_concurrent_cancellation(self):
        client=APIClient()
        client.force_authenticate(user=self.admin)
        validate_status=AdminOrderStatusSerializer.validate_status

        def cancel_after_validation(serializer,value):
            result=validate_status(serializer,value)
            Order.objects.filter(pk=self.order.pk).update(status="order-cancelled")
            return result

        with patch.object(AdminOrderStatusSerializer,"validate_status",cancel_after_validation):
            response=client.patch(f"/api/admin/orders/{self.order.id}",{"status":"on-transit"})

        self.assertEqual(response.status_code,409)
        self.order.refresh_from_db()
        self.assertEqual(self.order.status,"order-cancelled")
