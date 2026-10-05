import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EcommerceService } from 'src/app/services/ecommerce.service';
import { FormGroup,Validators,FormControl } from '@angular/forms'

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  constructor(private service:EcommerceService,private activerouter:ActivatedRoute,private router:Router) { }

  reviewform=new FormGroup({
    "description":new FormControl('',Validators.required),
    "rating":new FormControl('',Validators.required),
    "title": new FormControl('')
  })

  product:any
  reviews:any
  error=''

  ngOnInit(): void {
    let id=this.activerouter.snapshot.paramMap.get("id")
    this.service.productDetailService(id).then(async res=>{
      if (!res.ok) throw new Error()
      const data=await res.json()
      this.product=data
      this.reviews=this.product.reviews
    }).catch(()=>this.error='Product could not be loaded.')
  }

  async addToCartFunction(id:any){
    
    let token=localStorage.getItem("token")
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
  placeorderFunction(id:any){
    let token=localStorage.getItem("token")
    if(token){
    localStorage.setItem("id",id)
    this.router.navigateByUrl('place-order')
    }
    else{
      this.router.navigateByUrl('signin')
    }
  }


  async addReviewFunction(id:any){
    if (this.reviewform.invalid) {
      this.reviewform.markAllAsTouched()
      return
    }
    let token=localStorage.getItem("token")
    if(token){
    try {
      const response=await this.service.addReviewService(id,this.reviewform.value)
      if (!response.ok) throw new Error()
      const review=await response.json()
      this.reviews=[review,...this.reviews]
      this.reviewform.reset()
    } catch {
      this.error='Review could not be submitted.'
    }
    }
    else{
      this.router.navigateByUrl('signin')
    }
  }
}

