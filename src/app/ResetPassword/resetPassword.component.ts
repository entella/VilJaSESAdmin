import { Component, OnInit, Input } from '@angular/core';
import { User } from './user';
import { BaseResponse } from '../BaseResponse';
import { ResetPasswordService } from './resetPassword-service';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { SetPasswordViewModel } from '../ViewModels/setPasswordViewModel';

@Component({
    selector: 'app-login',
    templateUrl: './resetPassword.component.html',
    styleUrls: ['./resetPassword.component.css']
})



export class resetPasswordComponent {
    title = 'VilJaSESAdmin';
    email: string;
    password: string;
    repassword: string;
    display: any;
    linkValue: string;
    displayReset: any;
    success: boolean;
    isPwdChanged: boolean;
    message: string;
    modalError: string;
    modalErrorBool: boolean;
    userId: number;
    linkId: number;
    body: any;

    constructor(private resetPasswordService: ResetPasswordService, private router: Router, private route: ActivatedRoute) {
        sessionStorage.removeItem('AccessToken');
    }

    ngOnInit() {
        this.display = 'none';
        this.displayReset = 'none';
        this.openModal('reset');
        this.isPwdChanged = false;
        const queryParams = this.route.snapshot.queryParams
        const routeParams = this.route.snapshot.params;
        this.linkValue = routeParams.id;
        this.ResetForgotPassword();
        this.body = document.getElementsByTagName('body')[0];
    }
    ResetForgotPassword(): void {
        this.resetPasswordService.ResetPassword(this.linkValue).subscribe(
            data => {
                //this.router.navigate(['members']);
                this.success = data['success'];
                this.message = data['message'];

                if (this.success == true) {
                    var res = data['content'];
                    this.userId=res.userId;
                    this.linkId=res.linkId;
                }
                console.log("POST Request is successful ", data);
            },
            error => {
                console.log("Error", error);
            }
        );
    }
    ChangePassword(): void {
        this.modalErrorBool = false;
        if ((this.password == '' || this.password === undefined) && (this.repassword == '' || this.repassword === undefined) && this.modalErrorBool == false) {
            this.modalErrorBool = true;
            this.modalError = "Password are required fields.";
        }
        var l = 0;
        if (this.password != '') {
            l = this.password.length;
        }
        if (l <= 4 && this.modalErrorBool == false) {
            this.modalErrorBool = true;
            this.modalError = "Please enter at least 5 characters in password.";
        }
        if (this.password != this.repassword && this.modalErrorBool == false) {
            this.modalErrorBool = true;
            this.modalError = "The new password and confirmation password do not match.";
        }
        if (this.modalErrorBool == false) {
            let set = new SetPasswordViewModel();
            set.userId = this.userId;
            set.linkId = this.linkId;
            set.ConfirmPassword = this.repassword;
            this.resetPasswordService.changePassword(set).subscribe(
                data => {
                    this.isPwdChanged = true;
                    console.log("POST Request is successful ", data);
                },
                error => {
                    console.log("Error", error);
                }
            );
        }
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
        this.body.classList.remove('modal-open');
    }
    onOkButton() {
        this.router.navigate(['']);
    }

}