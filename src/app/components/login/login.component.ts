import {
  trigger,
  style,
  animate,
  transition,
  state,
  Component,
  OnInit } from '@angular/core';
  import { FormGroup, FormControl, Validators } from '@angular/forms';
  import { HttpService } from '../../providers/http';
  import { UserService } from '../../providers/user';
  import { Loader } from '../../providers/loader';
  import { Router } from '@angular/router';
declare var Materialize;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [
      trigger('changeSize' , [
      state('login', style({
        height: '670px'
      })),
      state('signup', style({
        height: '920px'
      })),
      transition('login => signup', animate('200ms ease-out')),
      transition('signup => login', animate('200ms ease-out'))
  , ]),
    trigger('changeForm' , [
      state('login', style({
        left: '0%'
      })),
      state('signup', style({
        left: 'calc(-100% - 30px)'
      })),
      transition('login => signup', animate('200ms ease-out')),
      transition('signup => login', animate('200ms ease-out'))
  , ]),
  ]


})
export class LoginComponent implements OnInit {
  state: string = 'login';
  loginForm: FormGroup;
  signupForm: FormGroup;
  constructor(private user: UserService, private http: HttpService, private router: Router) {

    this.loginForm = new FormGroup({
      'username': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
    this.signupForm =  new FormGroup({
      'firstname': new FormControl('', Validators.required),
      'lastname': new FormControl('', Validators.required),
      'email': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required),
      'confirm_password': new FormControl('', Validators.required),
    });
  }
  ngOnInit() {
  }
  form_toggle() {
    this.state = (this.state === 'login' ? 'signup' : 'login');
    console.log(this.state);
  }
  login() {
    if (this.loginForm.valid) {
      Loader.present();
      this.user.login(this.loginForm.value['username'], this.loginForm.value['password'])
        .subscribe(data => {
            Materialize.toast('Login Success');
            this.router.navigate(['/profile']);
            Loader.dismiss();
        }, error => {
            if (error.status === 401) {
              Materialize.toast('Invalid Credentials');
            } else {
              Materialize.toast('Something unexpected happened');
            }
            Loader.dismiss();

        });
    }
  }
  signup() {
    if (this.signupForm.valid && this.signupForm.value['password'] === this.signupForm.value['confirm_password']) {
      // this.user.signuo(this.signupForm.value["firstname"])
      Loader.present();
      this.http.post('/api/signup', this.signupForm.value)
        .subscribe(res => {
          Materialize.toast('Signup Success');
          Loader.dismiss();
        }, err => {
            Materialize.toast('Something unexpected happened');
            Loader.dismiss();
        });
    }
  }
}
