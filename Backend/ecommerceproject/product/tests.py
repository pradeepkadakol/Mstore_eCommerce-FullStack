from django.db import connection
from django.test import TestCase
from django.test.utils import CaptureQueriesContext
from rest_framework.test import APIClient

from category.models import Category
from .models import Product


class ProductListPerformanceTests(TestCase):
    def test_catalog_query_count_does_not_grow_per_product(self):
        category = Category.objects.create(name="Phones", icon="category_icons/phone.jpg")
        for number in range(6):
            Product.objects.create(
                name=f"Phone {number}", description="A phone", price="129.00",
                image="product_images/phone.jpg", category=category,
            )

        with CaptureQueriesContext(connection) as queries:
            response = APIClient().get("/api/products")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 6)
        self.assertLessEqual(len(queries), 3)

    def test_catalog_can_search_product_names(self):
        category = Category.objects.create(name="Phones", icon="category_icons/phone.jpg")
        Product.objects.create(name="Blue Phone", description="Blue", price="129.00", image="product_images/phone.jpg", category=category)
        Product.objects.create(name="Red Tablet", description="Red", price="199.00", image="product_images/tablet.jpg", category=category)

        response = APIClient().get("/api/products", {"search": "phone"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["name"] for item in response.data], ["Blue Phone"])

    def test_product_detail_exposes_category_for_admin_edit_form(self):
        category=Category.objects.create(name="Phones",icon="category_icons/phone.jpg")
        product=Product.objects.create(name="Phone",description="A phone",price="129.00",image="product_images/phone.jpg",category=category)

        response=APIClient().get(f"/api/products/{product.id}")

        self.assertEqual(response.status_code,200)
        self.assertEqual(response.data["category"],category.id)
