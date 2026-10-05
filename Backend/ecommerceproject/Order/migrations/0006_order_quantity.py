from django.core.validators import MinValueValidator
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("Order", "0005_alter_order_payment_method"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="quantity",
            field=models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)]),
        ),
    ]
