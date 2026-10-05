import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { EcommerceService } from 'src/app/services/ecommerce.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnInit {
  order=new FormGroup({
    "billing_address":new FormControl('',Validators.required),
    "payment_method":new FormControl('cash-on-delivery',Validators.required)
  })
  constructor(private service:EcommerceService,private router:Router) { }
  product:any
  product_id:string|null=localStorage.getItem("id")
  quantity=1
  error=''
  placing=false
  async ngOnInit(): Promise<void> {
    await this.loadDetails()
  }

  private async loadDetails():Promise<boolean> {
    if (!this.product_id) {
      this.error='Choose a product before checkout.'
      return false
    }
    try {
      const [productResponse,cartResponse]=await Promise.all([
        this.service.productDetailService(this.product_id),
        this.service.cartListservice()
      ])
      if (!productResponse.ok || !cartResponse.ok) throw new Error()
      const [product,cart]=await Promise.all([productResponse.json(),cartResponse.json()])
      this.quantity=cart.filter((item:any)=>item.product.id===this.product_id)
        .reduce((total:number,item:any)=>total+item.quantity,0) || 1
      this.product=product
      return true
    } catch {
      this.product=undefined
      this.error='Checkout details could not be loaded.'
      return false
    }
  }

  async orderform(){
    if (this.order.invalid || !this.product_id || this.placing) {
      this.order.markAllAsTouched()
      return
    }
    this.error=''
    this.placing=true
    try {
      const response=await this.service.placeOrderService(this.product_id,{
        ...this.order.value,expected_quantity:this.quantity
      })
      if (response.status===409) {
        if (await this.loadDetails()) this.error='Cart changed. Review the updated total before placing your order.'
        return
      }
      if (!response.ok) throw new Error('Order could not be placed. Please try again.')
      localStorage.removeItem('id')
      await this.router.navigateByUrl('order')
    } catch (error) {
      this.error=error instanceof Error ? error.message : 'Order could not be placed.'
    } finally {
      this.placing=false
    }
  }


}
