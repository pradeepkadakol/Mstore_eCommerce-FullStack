import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EcommerceService } from 'src/app/services/ecommerce.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  constructor(private service:EcommerceService) { }

  product= new FormGroup({
    "name":new FormControl('',Validators.required),
    "price":new FormControl('',Validators.required),
    "description":new FormControl('',Validators.required),
    "category":new FormControl('',Validators.required)
  })
  category:any
  file?:File;
  productdetail:any
  error=''
  saving=false
  
  ngOnInit(): void {
    this.service.categoryService().then(res=>res.json()).then(data=>this.category=data)
  }
  onChange(event:any) {
      this.file = event.target.files[0];
      }

  async addProductFunction(){
    if (this.product.invalid || !this.file || this.saving) {
      this.product.markAllAsTouched()
      this.error='Complete the product details and choose an image.'
      return
    }
    this.saving=true
    this.error=''
    try {
      const response=await this.service.addProductService(this.product.value,this.file)
      if (!response.ok) throw new Error()
      this.productdetail=await response.json()
      this.product.reset()
      this.file=undefined
    } catch {
      this.error='Product could not be added.'
    } finally {
      this.saving=false
    }
  }

}
