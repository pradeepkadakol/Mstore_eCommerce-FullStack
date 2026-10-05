import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EcommerceService } from 'src/app/services/ecommerce.service';

@Component({
  selector: 'app-adminproducts',
  templateUrl: './adminproducts.component.html',
  styleUrls: ['./adminproducts.component.css']
})
export class AdminproductsComponent implements OnInit {

  constructor(private activeroute:ActivatedRoute,private service:EcommerceService,private router:Router) { }
  category:any
  products:any[]=[]
  error=''
  ngOnInit(): void {
    let id=this.activeroute.snapshot.paramMap.get("id")
    this.service.categoryDetailService(id).then(async res=>{
      if (!res.ok) throw new Error()
      const data=await res.json()
      this.category=data
      this.products=this.category.products
    }).catch(()=>this.error='Products could not be loaded.')
  }
  
  async productRemoveFunction(id:any){
    try {
      const response=await this.service.productRemoveService(id)
      if (!response.ok) throw new Error()
      this.products=this.products.filter(product=>product.id!==id)
    } catch {
      this.error='Product could not be removed.'
    }
  }
  editProduct(id:any){
    this.router.navigate(['admin/dashboard/product/',id])
  }
}
