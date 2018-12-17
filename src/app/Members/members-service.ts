import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class MembersService {
    httpOptions :  any;
    private membersUrl = environment.apiurl + 'api/adminProfile/GetMembers/';  // URL to web api

    constructor(private http: HttpClient) {}

    /** Get:Members List from the server */
    getMembersList(currentPage, itemsPerPage, orderByName, orderBy, searchText) {
        return this.http
        .get<any[]>(this.membersUrl + itemsPerPage + '/' + currentPage + '?orderByName='+ orderByName +'&orderByAsc='+ orderBy +'&searchText=' + searchText).pipe
            (map(data => data));
    }
}