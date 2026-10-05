import { Component, OnInit } from '@angular/core';
import { EcommerceService } from 'src/app/services/ecommerce.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
orders:any[]=[]
loading=true
error=''
  constructor(private service:EcommerceService) { }

  ngOnInit(): void {
    this.service.OrderListService().then(async res=>{
      if (!res.ok) throw new Error('Orders could not be loaded.')
      this.orders=(await res.json()).reverse()
    }).catch(()=>this.error='Orders could not be loaded.').finally(()=>this.loading=false)
  }
 async orderCancelFunction(id:any){
  try {
    const response=await this.service.orderCancelservice(id)
    if (!response.ok) throw new Error('Order could not be cancelled.')
    const order=this.orders.find(item=>item.id===id)
    if (order) order.status='order-cancelled'
  } catch {
    this.error='Order could not be cancelled.'
  }
}
}
