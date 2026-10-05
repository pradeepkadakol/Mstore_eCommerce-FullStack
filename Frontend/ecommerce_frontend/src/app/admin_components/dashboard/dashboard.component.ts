import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EcommerceService } from 'src/app/services/ecommerce.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private service:EcommerceService,private router:Router) { }

 
  category:any[]=[]
  orders:any[]=[]
  error=''
  ngOnInit(): void {
    this.service.categoryService().then(async res=>{
      if (!res.ok) throw new Error()
      this.category=await res.json()
    }).catch(()=>this.error='Categories could not be loaded.')
    this.service.adminOrdersService().then(async res=>{
      if (!res.ok) throw new Error()
      this.orders=await res.json()
    }).catch(()=>this.error='Orders could not be loaded.')

  }
  addProductFunction(){
    this.router.navigateByUrl('admin/dashboard/product')
  }
  categoryDetail(id:any){
    this.router.navigate(['admin/dashboard/category/',id])
  }
  categoryAddFunction(){
    this.router.navigateByUrl('admin/dashboard/category_new')
  }
  async updateOrderStatus(order:any,status:string){
    try {
      const response=await this.service.adminOrderStatusService(order.id,status)
      if (!response.ok) throw new Error()
      order.status=(await response.json()).status
    } catch {
      this.error='Order status could not be updated.'
    }
  }
}
