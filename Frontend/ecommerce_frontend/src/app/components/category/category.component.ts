import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EcommerceService } from 'src/app/services/ecommerce.service';
import {} from 'src/app/components/home/home.component'

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  category:any
  products:any
  error=''
  constructor(private service:EcommerceService,private router:Router,private activeroute:ActivatedRoute) { }

  ngOnInit(): void {
    let id=this.activeroute.snapshot.paramMap.get("id")
    this.service.categoryDetailService(id).then(async res=>{
      if (!res.ok) throw new Error()
      const data=await res.json()
      this.category=data
      this.products=this.category.products
    }).catch(()=>this.error='Category could not be loaded.')
    
  }
  fetchId(id:any){
    this.router.navigate(['product/',id])
  }
  async addtocartCategoryFunction(id:any){
    if (!this.service.fetchToken()) {
      await this.router.navigateByUrl('signin')
      return
    }
    try {
      const response=await this.service.addToCartService(id)
      if (!response.ok) throw new Error()
      await this.router.navigateByUrl('cart')
    } catch {
      this.error='Could not add this product to your cart.'
    }
  }

}
