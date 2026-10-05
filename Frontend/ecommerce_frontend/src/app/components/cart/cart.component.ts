import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EcommerceService } from 'src/app/services/ecommerce.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart:any[]=[]
  loading=true
  error=''
  constructor(private service:EcommerceService,private router:Router) { }

  ngOnInit(): void {
    
    this.service.cartListservice().then(async res=>{
      if (!res.ok) throw new Error('Cart could not be loaded.')
      this.cart=(await res.json()).reverse()
    }).catch(()=>this.error='Cart could not be loaded.').finally(()=>this.loading=false)
  }
  placeOrderCartFunction(id:any){
    localStorage.setItem("id",id)
    this.router.navigateByUrl('place-order')
  }
  async removeFromCartFunction(id:any){
    try {
      const response=await this.service.removeFromCartService(id)
      if (!response.ok) throw new Error('Could not remove this item.')
      this.cart=this.cart.filter(item=>item.id!==id)
    } catch {
      this.error='Could not remove this item.'
    }
  }
}
