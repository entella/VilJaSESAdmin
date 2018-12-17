import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserProfile } from '../ViewModels/profileModel';
import { UpdateReportMessage } from '../ViewModels/updateReportMessageModel';


@Injectable({ providedIn: 'root' })
export class ProfileService {

    // URL to web api
    private getProfileUrl = environment.apiurl + 'api/adminProfile/GetUserProfileDetails/';
    private getCitiesUrl = environment.apiurl + 'api/adminProfile/GetCityDetails';
    private postUpdateProfileUrl = environment.apiurl + 'api/adminProfile/SaveUpdateUserProfile';
    private postDeleteUserProfileUrl = environment.apiurl + 'api/adminProfile/DeleteUserProfile';
    private postBlockUserProfile = environment.apiurl + 'api/adminProfile/BlockUserProfile';
    private postUnblockUserProfile = environment.apiurl + 'api/adminProfile/UnblockUserProfile';
    private postUpdateReportedMessageByAdmin = environment.apiurl + 'api/adminProfile/UpdateReportedMessageByAdmin';
    private postFileUpload = environment.apiurl + 'api/adminProfile/UploadProfilePicture';
    private postremoveProfileImage = environment.apiurl + 'api/adminProfile/RemoveUserProfileImage';
    private getExportProfileUrl = environment.apiurl + 'api/adminProfile/GetUserProfileDetailsForExport';


    constructor(
        private http: HttpClient) { }


    /** Get:GetUserProfileDetails from the server */
    GetUserProfileDetails(profileId) {
        return this.http.get<any[]>(this.getProfileUrl + profileId);
    }
    /** Get:GetCities from the server */
    GetCities() {
        return this.http.get<any[]>(this.getCitiesUrl);
    }

    /** POST: add a new hero to the database */
    updateProfile(profileDetails) {
        return this.http.post(this.postUpdateProfileUrl, profileDetails);
    }

    deleteUserProfile(userid) {
        return this.http.post(this.postDeleteUserProfileUrl + '?userId=' + userid, '');
    }

    blockUserProfile(userid) {
        return this.http.post(this.postBlockUserProfile + '?userId=' + userid, '');
    }
    unblockUserProfile(userid) {
        return this.http.post(this.postUnblockUserProfile + '?userId=' + userid, '');
    }
    updateReportedMessageByAdmin(UpdateReportMessage) {
        return this.http.post(this.postUpdateReportedMessageByAdmin, UpdateReportMessage);
    }

    uploadFile(userid : number, file : any){
        var uploadFilehttpOptions = {
            headers: new HttpHeaders({
                'Authorization': sessionStorage.getItem('AccessToken')
            })
        }
        return this.http.post(this.postFileUpload + '?userId=' + userid, file);
    }

    removeUserProfileImage(prifileId, urlType) {
        return this.http.put(this.postremoveProfileImage+ '?profileId=' + prifileId + '&urltype='+ urlType, '');
    }

    exportProfile(prifileId){
        return this.http.get<any>(this.getExportProfileUrl + '/'+ prifileId);
    }

}