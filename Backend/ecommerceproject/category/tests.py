from django.test import TestCase
from rest_framework.test import APIClient

from .models import Category


class CategoryPermissionsTests(TestCase):
    def test_public_can_read_but_cannot_edit_category(self):
        category=Category.objects.create(name="Phones",icon="category_icons/phone.jpg")
        client=APIClient()

        read=client.get(f"/api/category/{category.id}")
        update=client.patch(f"/api/category/{category.id}",{"name":"Hacked"})

        self.assertEqual(read.status_code,200)
        self.assertIn(update.status_code,(401,403))
        category.refresh_from_db()
        self.assertEqual(category.name,"Phones")
