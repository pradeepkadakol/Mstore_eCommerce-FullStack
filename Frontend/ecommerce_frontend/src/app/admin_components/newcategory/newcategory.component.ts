import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EcommerceService } from 'src/app/services/ecommerce.service';

@Component({
  selector: 'app-newcategory',
  templateUrl: './newcategory.component.html',
  styleUrls: ['./newcategory.component.css']
})
export class NewcategoryComponent implements OnInit {
file?:File
category=new FormGroup({
  "name":new FormControl('',Validators.required)
})
  constructor(private service:EcommerceService) { }
  categorylist:any[]=[]
  error=''
  saving=false
  ngOnInit(): void {
    this.service.categoryService().then(res=>res.json()).then(data=>this.categorylist=data)
   
  }
  onChange(event:any) {
    this.file = event.target.files[0];
    }
  
  async newCategoryFunction(){
    if (this.category.invalid || !this.file || this.saving) {
      this.error='Enter a category name and choose an icon.'
      return
    }
    this.saving=true
    this.error=''
    try {
      const response=await this.service.categoryAddService(this.category.value,this.file)
      if (!response.ok) throw new Error()
      this.categorylist=[...this.categorylist,await response.json()]
      this.category.reset()
      this.file=undefined
    } catch {
      this.error='Category could not be added.'
    } finally {
      this.saving=false
    }
  }
  async categoryRemoveFunction(id:any){
    try {
      const response=await this.service.categoryRemoveService(id)
      if (!response.ok) throw new Error()
      this.categorylist=this.categorylist.filter(item=>item.id!==id)
    } catch {
      this.error='Category could not be removed.'
    }
  }
}
