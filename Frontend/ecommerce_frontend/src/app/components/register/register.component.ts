import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators,ReactiveFormsModule,FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { EcommerceService } from 'src/app/services/ecommerce.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  signup=new FormGroup({
    "username":new FormControl('',Validators.required),
    "email":new FormControl('',[Validators.required,Validators.email]),
    "password":new FormControl('',Validators.required),
    "confirm_password":new FormControl('',Validators.required),
  })
  usernameError:any
  emailError:any
  passwordError:any
  value:any
  error=''
  busy=false
  constructor(private service:EcommerceService,private router:Router) { }

  ngOnInit(): void {
  }

  async signupFunction(){
    if (this.signup.invalid || this.busy) {
      this.signup.markAllAsTouched()
      return
    }
    this.error=''
    this.usernameError=''
    this.emailError=''
    this.passwordError=''
    if (this.signup.value.password!==this.signup.value.confirm_password) {
      this.passwordError='Passwords do not match.'
      return
    }
    this.busy=true
    try {
      const response=await this.service.registrationService(this.signup.value)
      const data=await response.json()
      if (!response.ok) {
        this.usernameError=Array.isArray(data.username) ? data.username[0] : data.username
        this.emailError=Array.isArray(data.email) ? data.email[0] : data.email
        this.passwordError=Array.isArray(data.password) ? data.password[0] : data.password
        if (!this.usernameError && !this.emailError && !this.passwordError) this.error='Registration could not be completed.'
        return
      }
      await this.router.navigateByUrl('signin')
    } catch {
      this.error='Registration could not be completed.'
    } finally {
      this.busy=false
    }
  }
}
