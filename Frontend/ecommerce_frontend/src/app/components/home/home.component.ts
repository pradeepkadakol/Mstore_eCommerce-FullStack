import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EcommerceService } from 'src/app/services/ecommerce.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
products:any[]=[]
categories:any[]=[]
error=''
categoryError=''
searchTerm=''
loading=true
private productRequest?:AbortController
private searchSubscription?:Subscription
  constructor(private service:EcommerceService,private router:Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.searchSubscription=this.route.queryParamMap.subscribe(params=>{
      this.searchTerm=params.get('search') || ''
      this.loadProducts()
    })
    this.service.categoryService().then(async res=>{
      if (!res.ok) throw new Error()
      this.categories=await res.json()
    }).catch(()=>this.categoryError='Categories could not be loaded.')
  }

  ngOnDestroy():void {
    this.productRequest?.abort()
    this.searchSubscription?.unsubscribe()
  }

  private loadProducts(){
    this.productRequest?.abort()
    const request=new AbortController()
    this.productRequest=request
    this.error=''
    this.loading=true
    this.service.ProductsService(this.searchTerm,request.signal).then(async res=>{
      if (!res.ok) throw new Error()
      const products=await res.json()
      if (this.productRequest===request) this.products=products
    }).catch(error=>{
      if (this.productRequest===request && error?.name!=='AbortError') this.error='Products could not be loaded.'
    }).finally(()=>{
      if (this.productRequest===request) this.loading=false
    })
  }

  fetchId(id:any){
    this.router.navigate(['product/',id])
  }
  async addtocartHomeFunction(id:any){
    let token=localStorage.getItem('token')
    if(token){
      try {
        const response=await this.service.addToCartService(id)
        if (!response.ok) throw new Error()
        await this.router.navigateByUrl('cart')
      } catch {
        this.error='Could not add this product to your cart.'
      }
    }
    else{
      this.router.navigateByUrl('signin')
    }
  }
  navigateToCategoryFunction(id:any){
    this.router.navigate(['category/',id])
  }  
}
