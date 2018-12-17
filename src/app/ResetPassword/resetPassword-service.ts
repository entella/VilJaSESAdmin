import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './user';
import { environment } from 'src/environments/environment';

import { BaseResponse } from '../BaseResponse';
import { SetPasswordViewModel } from '../ViewModels/setPasswordViewModel';
//import { MessageService } from './message.service';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    })
};

@Injectable({ providedIn: 'root' })
export class ResetPasswordService {

    private forgotPasswordUrl = environment.apiurl + 'api/admin/ResetPassword';
    private changePasswordUrl = environment.apiurl + 'api/admin/ChangePassword';
    constructor(
        private http: HttpClient) { }

    ResetPassword(lnk) {
        return this.http.get(this.forgotPasswordUrl + '?lnk=' + lnk, httpOptions);
    }
    changePassword(setPasswordViewModel) {
        return this.http.post(this.changePasswordUrl, setPasswordViewModel, httpOptions);
    }

}