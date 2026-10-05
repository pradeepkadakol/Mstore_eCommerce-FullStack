import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EcommerceService } from 'src/app/services/ecommerce.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  constructor(private service:EcommerceService,private activeroute:ActivatedRoute,private formBuilder: FormBuilder) { }
  product= new FormGroup({
    "name":new FormControl('',),
    "price":new FormControl('',),
    "description":new FormControl('',),
    "category":new FormControl('',)
  })
  file?:File
  productdetail:any
  category:any
  error=''
  saved=false
  saving=false
  ngOnInit(): void {
    let id=this.activeroute.snapshot.paramMap.get("id")
    this.service.productDetailService(id).then(async res=>{
      if (!res.ok) throw new Error()
      this.productdetail=await res.json()
      this.product.patchValue({
        name:this.productdetail.name,
        price:this.productdetail.price,
        description:this.productdetail.description,
        category:this.productdetail.category
      })
    }).catch(()=>this.error='Product could not be loaded.')
    this.service.categoryService().then(res=>res.json()).then(data=>this.category=data)
  }
  onChange(event:any) {
    this.file = event.target.files[0];
    }
    async editProductFunction(id:any){
      if (this.product.invalid || this.saving) return
      this.saving=true
      this.error=''
      this.saved=false
      try {
        const response=await this.service.productEditService(id,this.product.value,this.file)
        if (!response.ok) throw new Error()
        this.productdetail=await response.json()
        this.saved=true
      } catch {
        this.error='Product could not be updated.'
      } finally {
        this.saving=false
      }
    }
}
