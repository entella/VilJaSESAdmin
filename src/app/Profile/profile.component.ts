import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from './profile-service';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Routes, Router, ActivatedRoute  } from '@angular/router';
import { UserProfile } from '../ViewModels/profileModel';
import { UpdateReportMessage } from '../ViewModels/updateReportMessageModel';
import { ErrorModel } from '../ViewModels/errormodel';
import { MasterComponent } from '../MasterPage/master.component';
import { VgAPI } from 'videogular2/core';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
    title = 'app';
    restItems: any;
    userProfileViewModel: any;
    messageReportedtoAdmin: any;
    tempReportedMessage = [];
    limitToShowReportedMessage = 5;
    hideLoadMoreButton : boolean = false;
    profileId: number = 0;
    userId: number = 0;
    ageList = [];
    citiesItem: any;
    display: any;
    displaydel: any;
    displayblocked: any;
    displayunblocked: any;
    displayDeleteImagePopup: any;
    displayDeleteVideoPopup: any;
    displayProfileUpdatedPopup: any;
    isEdit: boolean;
    serverError: ErrorModel;
    displayErrorPage: boolean = false;
    body: any;
    showVideo : boolean = false;
    api: VgAPI;
    
    constructor(private profileService: ProfileService, private router: Router, private route: ActivatedRoute,
        private masterComponent : MasterComponent,
        private domSanitizer : DomSanitizer) { }

    ngOnInit() {
        this.isEdit = false;
        this.display = 'none';
        this.displaydel = 'none';
        this.displayblocked = 'none';
        this.displayunblocked = 'none';
        this.displayDeleteImagePopup = 'none';
        this.displayDeleteVideoPopup = 'none';
        this.displayProfileUpdatedPopup = 'none';
        const queryParams = this.route.snapshot.queryParams
        const routeParams = this.route.snapshot.params;
        this.profileId = routeParams.id;
        this.getCities();
        this.getUserProfileDetails(this.profileId);
        for (let i = 15; i < 85; i++) {
            this.ageList.push(i);
        };
        this.body = document.getElementsByTagName('body')[0];
        
    }
    // Read all REST Items
    getUserProfileDetails(profileId): void {
        this.profileId = profileId;
        this.profileService.GetUserProfileDetails(this.profileId)
            .subscribe(
            restItems => {
                this.restItems = restItems;
                //this.totalMembers = this.restItems['content'][0].membersCount;
                this.userProfileViewModel = this.restItems['content'].userProfileViewModel;
                this.messageReportedtoAdmin = this.restItems['content'].messageReportedtoAdmin;
                this.userId = this.userProfileViewModel.UserId;
                this.showVideo = this.userProfileViewModel.VideoUrl != null && this.userProfileViewModel.VideoUrl != undefined && this.userProfileViewModel.VideoUrl.length > 0;
                this.loadMore();
                //console.log(this.restItems);
            },
            error => {
                let errormodel = new ErrorModel();
                errormodel.message = (error.message != null) ? "Server Error" : "";
                this.serverError = errormodel;//set object for shared model
                this.displayErrorPage = true;
                console.log("Error", error);
            })
    }

    getCities(): void {
        this.profileService.GetCities()
            .subscribe(
            citiesItem => {
                this.citiesItem = citiesItem['content'];
                //console.log(this.citiesItem.content);
            },
            error => {
                let errormodel = new ErrorModel();
                errormodel.message = (error.message != null) ? "Server Error" : "";
                this.serverError = errormodel;//set object for shared model
                this.displayErrorPage = true;
                console.log("Error", error);
            }
            )
    }

    updateProfile(): void {
        let up = new UserProfile();
        up.Age = this.userProfileViewModel.Age;
        up.UserProfileId = this.userProfileViewModel.UserProfileId;
        up.FirstName = this.userProfileViewModel.FirstName;
        up.LastName = this.userProfileViewModel.LastName;
        up.CityId = this.userProfileViewModel.CityId;
        up.Aboutme=this.userProfileViewModel.AboutMe;
        this.profileService.updateProfile(up).subscribe(
            data => {
                this.openModal('profileUpdated_popup');
                this.userProfileViewModel = data['content'];
                this.getUserProfileDetails(this.profileId);
                this.isEdit = false;
                //console.log("POST Request is successful ", data);
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

    updateReportedMessageByAdmin(msg) {
        let up = new UpdateReportMessage();
        up.ReportAdminId = msg.ReportAdminId;
        up.ReplyMessage = msg.ReplyMessage;
        if (msg.IsCompleted == true) {
            up.Status = 2;
        } else { up.Status = 1; }
       
        this.profileService.updateReportedMessageByAdmin(up).subscribe(
            data => {
                this.masterComponent.getReports();
                //this.messageReportedtoAdmin = data['content'];
                //console.log("POST Request is successful ", data);
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

    deleteUserProfile(): void {
        this.userId = this.userProfileViewModel.UserId;
        this.profileService.deleteUserProfile(this.userId).subscribe(
            data => {
                this.router.navigate(['members']);
                //console.log("POST Request is successful ", data);
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
    blockUserProfile(): void {
        this.userId = this.userProfileViewModel.UserId;
        this.profileService.blockUserProfile(this.userId).subscribe(
            data => {
                this.router.navigate(['members']);
                //console.log("POST Request is successful ", data);
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
    unblockUserProfile(): void {
        this.userId = this.userProfileViewModel.UserId;
        this.profileService.unblockUserProfile(this.userId).subscribe(
            data => {
                this.router.navigate(['members']);
                //console.log("POST Request is successful ", data);
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

    updateUserProfile() {
        this.updateProfile();
    }
    expandMe(message) {
        message.Checked = !message.Checked;
    }
    editProfile() {
        this.isEdit = true;
    }
    backPage() {
        this.router.navigate(['members']);
    }
    openModal(val) {
        if (val == 'del') {
            this.displaydel = 'block'
        } else if (val == 'blocked') {
            this.displayblocked = 'block'
        }
        else if (val == 'unblocked') {
            this.displayunblocked = 'block'
        }
        else if (val == 'deleteProfileImage_popup') {
            this.displayDeleteImagePopup = 'block';
        }
        else if (val == 'deleteProfileVideo_popup') {
            this.displayDeleteVideoPopup = 'block';
        }
        else if (val == 'profileUpdated_popup') {
            this.displayProfileUpdatedPopup = 'block';
        }
        this.display = 'block';
        this.body.classList.add('modal-open');
    }
    onCloseModal() {
        this.displaydel = 'none';
        this.displayblocked = 'none';
        this.displayunblocked = 'none';
        this.display = 'none';
        this.displayDeleteImagePopup = 'none';
        this.displayDeleteVideoPopup = 'none';
        this.displayProfileUpdatedPopup = 'none';
        this.body.classList.remove('modal-open');
    }
    //doTextareaValueChange(ev, message) {
        //message.Checked = !message.Checked;
        //message.ReplyMessage = ev.target.value;
    //}

    onFileSelected(event){
        var file = <File>event.target.files[0];
        var formData = new FormData();
        formData.append('image', file, file.name);
        this.profileService
        .uploadFile(this.userId, formData)
        .subscribe(data => {
           var baseRes = data['baseRes'];
             if(baseRes['success']){
                 this.userProfileViewModel.PictureUrl = data['imageUrl'];
            }
            
        });
    }

    removeUserProfileImage(profileId, urlType){
        this.onCloseModal();
        this.profileService.removeUserProfileImage(profileId, urlType)
        .subscribe(
            data => {
                if(!data['success'])
                    return;

                    switch(urlType){
                        case 1:
                        this.userProfileViewModel.PictureUrl = '';
                        break;
    
                        case 2:
                        this.showVideo = false;
                        this.userProfileViewModel.VideoUrl = '';
                        break;
                    }

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

    exportProfile(){
        this.profileService
        .exportProfile(this.profileId)
        .subscribe(data => {
            if(data != null && data.success){
                window.open(data.content);
            }else if(data != null){
                console.log(data.message);
            }
            },
            error => {
                let errormodel = new ErrorModel();
                errormodel.message = (error.message != null) ? "Server Error" : "";
                this.serverError = errormodel;//set object for shared model
                this.displayErrorPage = true;
                console.log("Error", error);
            });
    }

    doTextareaValueChange(ev) {
        this.userProfileViewModel.AboutMe = ev.target.value;
    }

    loadMore(){
        
        if(this.messageReportedtoAdmin == undefined || this.messageReportedtoAdmin == null)
            return;

        let len = this.tempReportedMessage.length;
        for(var i=0; i<this.limitToShowReportedMessage;i++){
            if(this.tempReportedMessage.length == this.messageReportedtoAdmin.length){
                this.hideLoadMoreButton = true;
                break;
            }
            this.tempReportedMessage.push(this.messageReportedtoAdmin[len + i]);
        }
    }

    onPlayerReady(api: VgAPI) {
        this.api = api;
        this.api.getDefaultMedia().subscriptions.ended.subscribe(
            () => {
                // Set the video to the beginning
                this.api.getDefaultMedia().currentTime = 0;
            }
        );
    }

}
