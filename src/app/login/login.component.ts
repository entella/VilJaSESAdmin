import { Component, OnInit, Input } from '@angular/core';
import { User } from './user';
import { BaseResponse } from '../BaseResponse';
import { LoginService } from './login-service';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})



export class LoginComponent {
    title = 'VilJaSESAdmin';
    email: string;
    password: string;
    isLoginFailed: boolean;
    display: any;
    resetEmail: string;
    displayReset: any;
    success: boolean;
    message: string;
    body: any;

    constructor(private loginService: LoginService, private router: Router) {
        sessionStorage.removeItem('AccessToken');
    }

    ngOnInit() {
        this.display = 'none';
        this.displayReset = 'none';
        this.body = document.getElementsByTagName('body')[0];
    }
    loginAccount(form): void {
        let user = new User(this.email, this.password);
        this.loginService.loginAccount(user)
            .subscribe(data => {
                if (data.content != null) {
                    sessionStorage.setItem('AccessToken', data.content);
                    this.router.navigate(['/Newsflow']);
                }
                else {
                    this.isLoginFailed = true;
                    form.resetForm();
                }
            })
        //},
        //    (err: HttpErrorResponse) => { }
    };
    SendForgotPasswordEmail(): void {
        if (this.resetEmail == '' || this.resetEmail === undefined) {
            this.success = false;
            this.message = "Email is required field.";
            return;
        }
        this.loginService.SendForgotPasswordEmail(this.resetEmail).subscribe(
            data => {
                //this.router.navigate(['members']);
                this.resetEmail = '';
                this.success = data['success'];
                this.message = data['message'];
                console.log("POST Request is successful ", data);
            },
            error => {
                console.log("Error", error);
            }
        );
    }
    openModal(val) {
        if (val == 'reset') {
            this.displayReset = 'block'
        }
        this.display = 'block';
        this.body.classList.add('modal-open');
    }
    onCloseModal() {
        this.displayReset = 'none';
        this.display = 'none';
        this.resetEmail = '';
        this.success = false;
        this.message = '';
        this.body.classList.remove('modal-open');
    }

}