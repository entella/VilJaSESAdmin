import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AdminDetail } from '../ViewModels/admindetailModel';


@Injectable({ providedIn: 'root' })
export class AdminDetailService {


    private getUserUrl = environment.apiurl + 'api/admin/GetUserDetails/';  // URL to web api
    private getCitiesUrl = environment.apiurl + 'api/adminProfile/GetCityDetails';
    private postUpdateUserDetailUrl = environment.apiurl + 'api/admin/SaveUpdateAdminUser';  // URL to web api
    private postDeleteUserUrl = environment.apiurl + 'api/admin/DeleteUser';
    private changePasswordUrl = environment.apiurl + 'api/admin/ChangePassword';

    constructor(
        private http: HttpClient) { }


    /** Get:GetUserDetails from the server */
    GetUserDetails(userId) {
        return this.http.get<any[]>(this.getUserUrl + userId).pipe
            (map(data => data));
    }

    /** Get:GetCities from the server */
    GetCities() {
        return this.http.get<any[]>(this.getCitiesUrl);
    }

    /** POST: add to the database */
    updateUser(userDetails) {
        return this.http.post(this.postUpdateUserDetailUrl, userDetails);
    }

     /** POST: isDelete=0  */
    deleteUser(userid) {
        return this.http.post(this.postDeleteUserUrl + '?userId=' + userid, '');
    }
    /** POST: change password*/
    changePassword(setPasswordViewModel) {
        return this.http.post(this.changePasswordUrl, setPasswordViewModel);
    }
}