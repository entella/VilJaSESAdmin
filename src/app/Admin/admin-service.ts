import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {


    private membersUrl = environment.apiurl + 'api/admin/GetAdminUsers';  // URL to web api
    private postUpdateAdminUserUrl = environment.apiurl + 'api/admin/UpdateAdminUser';  // URL to web api
    private postUpdateHTMLTextUrl = environment.apiurl + 'api/admin/SaveUpdateHTMLText';  // URL to web api
    private postAddNewFaqUrl = environment.apiurl + 'api/admin/AddDeleteFaq';  // URL to web api

    constructor(
        private http: HttpClient) { }


    /** Get:Admin User List from the server */
    getAdminUserList(currentPage, itemsPerPage, orderByName, orderBy) {
      return this.http.get<any[]>(this.membersUrl + '?pageSize=' + itemsPerPage +
        '&pageNum=' + currentPage + '&orderByName=' + orderByName + '&orderByAsc=' + orderBy).pipe
            (map(data => data));
    }

    /** POST: add to the database */
    updateAdminUser(userDetails) {
        return this.http.post(this.postUpdateAdminUserUrl, userDetails);
    }

    /** POST: update html text */
    UpdateHtmlText(htmlText) {
        return this.http.post(this.postUpdateHTMLTextUrl, htmlText);
    }

    /** POST: add new faq */
    AddDeleteFaq(faqItems) {
        return this.http.post(this.postAddNewFaqUrl, faqItems);
    }
}
