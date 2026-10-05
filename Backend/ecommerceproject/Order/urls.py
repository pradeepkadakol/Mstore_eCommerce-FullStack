from django.urls import path
from .views import (
    OrderView,
    OrderListView,
    OrderCancelView,
    AdminOrderListView,
    AdminOrderStatusView,
)
urlpatterns=[
    path('products/<str:id>/place_order',OrderView.as_view(),name='place-order'),
    path('orders',OrderListView.as_view(),name='orders'),
    path('orders/<int:id>/cancel',OrderCancelView.as_view(),name='order-cancel'),
    path('admin/orders',AdminOrderListView.as_view(),name='admin-orders'),
    path('admin/orders/<int:id>',AdminOrderStatusView.as_view(),name='admin-order-status'),
]
