import { Component, OnInit } from '@angular/core';
import { EcommerceService } from 'src/app/services/ecommerce.service';
import {FormGroup,ReactiveFormsModule,FormsModule,Validators,FormControl} from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signin=new FormGroup({
    "username": new FormControl('',Validators.required),
    "password":new FormControl('',Validators.required)
  })
  usernameError:any
  passwordError:any
  username:any
  busy=false
  
  constructor(private service:EcommerceService,private router:Router) { }

  ngOnInit(): void {
  }

  async signinFunction(){
    if (this.signin.invalid || this.busy) {
      this.signin.markAllAsTouched()
      return
    }
    this.busy=true
    this.usernameError=''
    try {
      const response=await this.service.signinService(this.signin.value)
      if (!response.ok) throw new Error('Invalid username or password.')
      const data=await response.json()
      localStorage.setItem('token',`Bearer ${data.access}`)
      localStorage.setItem('jwt',String(data.jwt))
      localStorage.setItem('user',this.signin.value.username || '')
      await this.router.navigateByUrl(data.jwt ? '/admin/dashboard' : '/')
    } catch {
      this.usernameError='Invalid username or password.'
    } finally {
      this.busy=false
    }
  }
}
