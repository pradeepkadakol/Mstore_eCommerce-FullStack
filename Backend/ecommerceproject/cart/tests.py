from django.contrib.auth import get_user_model
from django.test import TestCase
from django.db import IntegrityError, transaction
from rest_framework.test import APIClient

from category.models import Category
from product.models import Product
from .models import Cart


class CartTests(TestCase):
    def test_add_to_cart_respects_quantity_limit(self):
        user=get_user_model().objects.create_user(username="buyer",password="password123")
        category=Category.objects.create(name="Phones",icon="category_icons/phone.jpg")
        product=Product.objects.create(name="Phone",description="A phone",price="129.00",image="product_images/phone.jpg",category=category)
        Cart.objects.create(user=user,product=product,quantity=10)
        client=APIClient()
        client.force_authenticate(user=user)

        response=client.post(f"/api/products/{product.id}/add_to_cart")

        self.assertEqual(response.status_code,400)
        self.assertEqual(Cart.objects.get(user=user,product=product).quantity,10)

    def test_cart_has_one_row_per_user_and_product(self):
        user=get_user_model().objects.create_user(username="buyer",password="password123")
        category=Category.objects.create(name="Phones",icon="category_icons/phone.jpg")
        product=Product.objects.create(name="Phone",description="A phone",price="129.00",image="product_images/phone.jpg",category=category)
        Cart.objects.create(user=user,product=product)

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                Cart.objects.create(user=user,product=product)
