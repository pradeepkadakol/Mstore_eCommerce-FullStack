import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router:Router) { }
  title = 'ecommerce_frontend';
  username:any
  jwt:any
  searchTerm=''
  ngOnInit(): void {
    this.updateHeader()
    this.router.events.pipe(filter(event=>event instanceof NavigationEnd)).subscribe(()=>this.updateHeader())
  }

  private updateHeader(){
    this.username=localStorage.getItem('user')
    this.jwt=localStorage.getItem('jwt')
    this.searchTerm=this.router.parseUrl(this.router.url).queryParams['search'] || ''
  }

  search(){
    this.router.navigate(['/'],{queryParams:{search:this.searchTerm.trim() || null}})
  }

  logoutFunction(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("id")
    localStorage.removeItem("jwt")
    this.username=null
    this.jwt=null
    this.router.navigateByUrl('/signin')
  }

  function ($:any) {
    
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover',
                 function () {
                    $('.dropdown-toggle').trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle').trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
  }
  cart(){
    if(localStorage.getItem('token')){
      this.router.navigateByUrl('cart')
    }
    else{
      this.router.navigateByUrl('signin')
    }
  }
  order(){
    if(localStorage.getItem('token')){
      this.router.navigateByUrl('order')
    }
    else{
      this.router.navigateByUrl('signin')
    }
  }

}
