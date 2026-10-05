from django.db import migrations, models
from django.db.models import Count, Min, Sum


def merge_duplicate_cart_rows(apps, schema_editor):
    Cart=apps.get_model("cart","Cart")
    duplicates=(Cart.objects.values("user_id","product_id")
                .annotate(rows=Count("id"),keep_id=Min("id"),total=Sum("quantity"))
                .filter(rows__gt=1))
    for row in duplicates:
        items=Cart.objects.filter(user_id=row["user_id"],product_id=row["product_id"])
        items.exclude(id=row["keep_id"]).delete()
        items.filter(id=row["keep_id"]).update(quantity=row["total"])


class Migration(migrations.Migration):
    dependencies=[("cart","0001_initial")]

    operations=[
        migrations.RunPython(merge_duplicate_cart_rows,migrations.RunPython.noop),
        migrations.AddConstraint(
            model_name="cart",
            constraint=models.UniqueConstraint(fields=("user","product"),name="unique_cart_user_product"),
        ),
    ]
