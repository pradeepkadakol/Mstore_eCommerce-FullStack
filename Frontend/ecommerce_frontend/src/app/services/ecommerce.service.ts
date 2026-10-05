import { Injectable } from '@angular/core';



const apiBaseURL='http://127.0.0.1:8001/api';
const signupURL=`${apiBaseURL}/signup`;
const signinURL=`${apiBaseURL}/signin`;
const productsURL=`${apiBaseURL}/products`;
@Injectable({
  providedIn: 'root'
})

export class EcommerceService {
  
  
  constructor() { }
  
  fetchToken(){
    return localStorage.getItem('token')
  }
  registrationService(data:any){
    let header=new Headers
    header.append('Content-Type','application/json')
    let options={
      method:"POST",
      headers:header,
      body:JSON.stringify(data)
    }
    return fetch(signupURL,options)
  }
  
  signinService(data:any){
    let header=new Headers
    header.append('Content-Type','application/json')
    let options={
      method:"POST",
      body:JSON.stringify(data),
      headers:header
    }
    return fetch(signinURL,options)
  }
  ProductsService(search:string='',signal?:AbortSignal){
    let header=new Headers
    let options={
      method:"GET",
      headers:header
    }
    return fetch(search ? `${productsURL}?search=${encodeURIComponent(search)}` : productsURL,{...options,signal})
  }
  productDetailService(id:any){
    let header=new Headers
    let options={
      method:"GET",
      headers:header
    }
    return fetch(`${apiBaseURL}/products/${id}`,options)
  }
  addToCartService(id:any){
    let header=new Headers
    let token =this.fetchToken()
    if(token){
      header.append('Authorization',token)
    }
    let options={
      method:"POST",
      headers:header
    }
    return fetch(`${apiBaseURL}/products/${id}/add_to_cart`,options)
  }
  cartListservice(){
    let header=new Headers
    let token =this.fetchToken()
    if(token){
      header.append('Authorization',token)
    }
    let options={
      method:"GET",
      headers:header
    }
    return fetch(`${apiBaseURL}/cart`,options)
  }
  placeOrderService(id:any,data:any){
    let header=new Headers
    header.append('Content-Type','application/json')
    let token =this.fetchToken()
    if(token){
      header.append('Authorization',token)
    }
    let options={
      method:"POST",
      headers:header,
      body:JSON.stringify(data)
    }
    return fetch(`${apiBaseURL}/products/${id}/place_order`,options)
  }
  OrderListService(){
    let header=new Headers
    let token =this.fetchToken()
    if(token){
      header.append('Authorization',token)
    }
    let options={
      method:"GET",
      headers:header
    }
    return fetch(`${apiBaseURL}/orders`,options)
  }
  adminOrdersService(){
    const header=new Headers
    const token=this.fetchToken()
    if (token) header.append('Authorization',token)
    return fetch(`${apiBaseURL}/admin/orders`,{method:'GET',headers:header})
  }
  adminOrderStatusService(id:number,status:string){
    const header=new Headers
    header.append('Content-Type','application/json')
    const token=this.fetchToken()
    if (token) header.append('Authorization',token)
    return fetch(`${apiBaseURL}/admin/orders/${id}`,{
      method:'PATCH',headers:header,body:JSON.stringify({status})
    })
  }
  orderCancelservice(id:any){
    let header=new Headers
    let token =this.fetchToken()
    if(token){
      header.append('Authorization',token)
    }
    let options={
      method:"PUT",
      headers:header
    }
    return fetch(`${apiBaseURL}/orders/${id}/cancel`,options)
  }
  removeFromCartService(id:any){
    let header=new Headers
    let token =this.fetchToken()
    if(token){
      header.append('Authorization',token)
    }
    let options={
      method:"DELETE",
      headers:header
    }
    return fetch(`${apiBaseURL}/cart/${id}`,options)
  }
  categoryService(){
    let header=new Headers
    let options={
      method:"GET",
      headers:header
    }
    return fetch(`${apiBaseURL}/category`,options)
  }
  categoryDetailService(id:any){
    let header=new Headers
    let options={
      method:"GET",
      headers:header
    }
    return fetch(`${apiBaseURL}/category/${id}`,options)
  }
  addReviewService(id:any,data:any){
    let header=new Headers
    header.append('Content-Type','application/json')
    let token =this.fetchToken()
    if(token){
      header.append('Authorization',token)
    }
    let options={
      method:"POST",
      headers:header,
      body:JSON.stringify(data)
    }
    return fetch(`${apiBaseURL}/products/${id}/add_review`,options)
  }
  addProductService(data:any,file:any){
   

    var formdata=new FormData()
    for ( const key of Object.keys(data) ) {
      var value = data[key];
      formdata.append(key,value);
      }
    formdata.append("image", file, file.name);
    let header=new Headers
    let token =this.fetchToken()
    if(token){
      header.append('Authorization',token)
    }
    
    let options={
      method:"POST",
      headers:header,
      body:formdata
    }
    return fetch(`${apiBaseURL}/products/add`,options)
  }
  productRemoveService(id:any){
    let header=new Headers
    let token =this.fetchToken()
    if(token){
      header.append('Authorization',token)
    }
    let options={
      method:"DELETE",
      headers:header
    }
    return fetch(`${apiBaseURL}/products/${id}/remove`,options)
  }
  productEditService(id:any,data:any,file:any){
    let header=new Headers
    
    let token =this.fetchToken()
    if(token){
      header.append('Authorization',token)
    }
    var formdata=new FormData()
    for ( const key of Object.keys(data) ) {
      var value = data[key];
      formdata.append(key,value);
      }
    if (file) formdata.append("image", file, file.name);
    let options={
      method:"PATCH",
      headers:header,
      body:formdata
    }
    return fetch(`${apiBaseURL}/products/${id}/edit`,options)
  }

  categoryAddService(data:any,file:any){
    let header=new Headers
    
    let token =this.fetchToken()
    if(token){
      header.append('Authorization',token)
    }
    var formdata=new FormData()
    for ( const key of Object.keys(data) ) {
      var value = data[key];
      formdata.append(key,value);
      }
    formdata.append("icon", file, file.name);
    let options={
      method:"POST",
      headers:header,
      body:formdata
    }
    return fetch(`${apiBaseURL}/category/add`,options)
  }
  categoryRemoveService(id:any){
    let header=new Headers
    let token =this.fetchToken()
    if(token){
      header.append('Authorization',token)
    }
    let options={
      method:"DELETE",
      headers:header
    }
    return fetch(`${apiBaseURL}/category/${id}/remove`,options)
  }
}
