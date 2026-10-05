# Mstore_eCommerce-FullStack
# Overview
This project is a full-stack eCommerce platform built using Python, Django, Angular, and SQLite.
The platform provides a comprehensive set of features for online shopping, including product listing, categorization,
product detail, shopping cart, order management, customer reviews, and 
an administrative panel for adding products and categories.

# Features
 - ### Product Listing :
   - A page that displays a list of all available products with detailed information and images.
 - ### Category :
   - Products are grouped into categories for easy browsing.
 - ### Product Detail :
   - A page that displays detailed information about a specific product, including images and customer reviews.
 - ### Shopping Cart :
   - Customers can add products to their shopping cart and view the contents of their cart at any time.
 - ### Order :
   - Customers can place an order for products in their cart with a billing address and cash on delivery. Cart quantity is carried into the order.
 - ### Review :
   - Signed-in customers can leave product reviews.
 - ### Order Management : 
   - The platform provides a dashboard for managing orders, including tracking status.
 - ### Admin Panel :
   - The platform includes an administrative panel for adding,updating and removing products and categories.

# Prerequisites
 - Python 3.13 (tested locally)
 - Node.js and npm (Angular 14 project dependencies are installed with npm)

# Installation
 - Clone the repository to your local machine.
```rake
git clone https://github.com/Itshari891/Mstore_eCommerce-FullStack.git
```
## Backend/ecommerceproject

- Install the required packages
```rake
python -m pip install -r requirement.txt
```
- Set up the database
```rake
python manage.py migrate
```
- Create an administrator account if you need the product and category management screens:
```sh
python manage.py createsuperuser
```
- Start the Backend development server
```sh
python manage.py runserver 8001
```
## Frontend/ecommerce_frontend

- Install the required packages
```rake
npm ci
```

- Start the Frontend development server
```rake
npm start
```
- Access the application in your browser at http://localhost:4200

The frontend API address is `http://127.0.0.1:8001/api`. Run the backend on port 8001 while using the Angular development server. Checkout currently supports cash on delivery; online payment processing requires a payment provider integration.

# ScreenShots
## LOGIN
![Login](https://user-images.githubusercontent.com/106607222/215457105-8a28d6f8-451a-4aa1-bd96-c8d89fa31804.png)

## HOME
![home](https://user-images.githubusercontent.com/106607222/215457210-f620df6f-d547-495d-b1c5-1c9f99db00a5.jpg)

## CATEGORY
![cat](https://user-images.githubusercontent.com/106607222/215457517-c1223503-d36c-4b9a-a1e0-b06e16e5588b.jpg)


## PRODUCT DETAIL
![prod_detail](https://user-images.githubusercontent.com/106607222/215457363-5748a642-9a5e-4e34-95bd-d32f8c24dc93.jpg)

## SHOPPING CART
 ![cart](https://user-images.githubusercontent.com/106607222/215457579-48390ab0-b6a5-4e51-ac1c-da77cfac69ac.jpg)

## ORDERS
![orders](https://user-images.githubusercontent.com/106607222/215457674-d6efdd08-36b5-4d33-8cad-654423757859.jpg)

## ADMIN DASHBOARD
![dashb](https://user-images.githubusercontent.com/106607222/215457808-27eaa28a-e72e-4630-a6f0-431584ac82fa.jpg)

## ADD PRODUCT
![addproduct](https://user-images.githubusercontent.com/106607222/215457861-906da937-4a6e-49df-b137-af2c2c15894f.jpg)
