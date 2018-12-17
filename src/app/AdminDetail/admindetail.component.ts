import { Component, OnInit, Input } from '@angular/core';
import { AdminDetailService } from './admindetail-service';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Routes, Router, ActivatedRoute  } from '@angular/router';
import { AdminDetail } from '../ViewModels/admindetailModel';
import { SetPasswordViewModel } from '../ViewModels/setPasswordViewModel';
import { ErrorModel } from '../ViewModels/errormodel';

@Component({
    selector: 'app-admindetail',
    templateUrl: `./admindetail.component.html`,
    styleUrls: ['./admindetail.component.css']
})


export class AdminDetailComponent implements OnInit {
    title = 'app';
    restItems: any;
    admindetailViewModel: any;
    ageList = [];
    citiesItem: any;
    userId: number = 0;
    isEdit: boolean;
    display: any;
    displaydel: any;
    password: string;
    repassword: string;
    success: boolean;
    isPwdChanged: boolean;
    message: string;
    modalError: string;
    modalErrorBool: boolean;
    displayErrorPage: boolean;
    resetMessage: string;
    serverError: ErrorModel;
    body: any;


    constructor(private admindetailService: AdminDetailService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.isEdit = false;
        const queryParams = this.route.snapshot.queryParams
        const routeParams = this.route.snapshot.params;
        this.userId = routeParams.id == undefined ? 0 : routeParams.id;
        if (this.userId == 0) this.isEdit = true;
        this.GetUserDetails(this.userId);
        this.getCities();
        for (let i = 15; i < 85; i++) {
            this.ageList.push(i);
        };
        this.display = 'none';
        this.displaydel = 'none';
        this.body = document.getElementsByTagName('body')[0];
}
    // Read all REST Items
    GetUserDetails(profileId): void {
        this.userId = profileId;
        this.admindetailService.GetUserDetails(this.userId)
            .subscribe(
            restItems => {
                this.restItems = restItems;
                this.admindetailViewModel  = this.restItems['content'];
                //console.log(this.admindetailViewModel);
            }
            )
    }

    getCities(): void {
        this.admindetailService.GetCities()
            .subscribe(
            citiesItem => {
                this.citiesItem = citiesItem['content'];
                console.log(this.citiesItem.content);
            }
            )
    }

    updateUser(): void {
        let ud = new AdminDetail();
       
        ud.UserId = this.admindetailViewModel.UserId;
        ud.FirstName = this.admindetailViewModel.FirstName;
        ud.LastName = this.admindetailViewModel.LastName;
        ud.Email = this.admindetailViewModel.Email;
        ud.Age = this.admindetailViewModel.Age;
        ud.CityId = this.admindetailViewModel.CityId;
        this.admindetailService.updateUser(ud).subscribe(
            data => {
                if(data['success']){
                    this.admindetailViewModel = data['content'];
                    this.isEdit = false;
                    this.openModal('');
                }else{
                   this.message = data['message'];
                }
                
                console.log("POST Request is successful ", data);
            },
            error => {
                let errormodel = new ErrorModel();
                errormodel.message = (error.message != null) ? "Server Error" : "";
                this.serverError = errormodel;//set object for shared model
                this.displayErrorPage = true;
                console.log("Error", error);
            }
        );
    }
    deleteUser(): void {
        this.admindetailService.deleteUser(this.userId).subscribe(
            data => {
                this.router.navigate(['adminProfile']);
                console.log("POST Request is successful ", data);
            },
            error => {
                console.log("Error", error);
            }
        );
    }
 
    editProfile() {
        this.isEdit = true;
    }

    backPage() {
        this.router.navigate(['adminProfile']);
    }
   
    openModal(val) {
        if (val == 'del') {
            this.displaydel = 'block'
        }
        else {
            this.display = 'block';
        }
        this.body.classList.add('modal-open');
    };
    onCloseModal() {
        this.displaydel = 'none';
        this.display = 'none';
        this.body.classList.remove('modal-open');
    };

    ChangePassword(form): void {
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
            set.ConfirmPassword = this.repassword;
            this.admindetailService.changePassword(set).subscribe(
                data => {
                    this.success = data['success'];
                    this.openModal('');
                    form.resetForm();
                    console.log("POST Request is successful ", data);
                },
                error => {
                    let errormodel = new ErrorModel();
                    errormodel.message = (error.message != null) ? "Server Error" : "";
                    this.serverError = errormodel;//set object for shared model
                    this.displayErrorPage = true;
                    console.log("Error", error);
                }
            );
        }
    }

}