import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { UpdateReportMessage } from '../ViewModels/updateReportMessageModel';

@Injectable({
    providedIn: 'root'
})
export class ReportsService {

    private reportsApiUrl = environment.apiurl + 'api/adminreport/getallReports/';  // URL to web api
    private postUpdateReportedMessageByAdmin = environment.apiurl + 'api/adminProfile/UpdateReportedMessageByAdmin';
    private unhandledReportsCountUrl = environment.apiurl + 'api/adminreport/getbadgecount/';

    constructor(private http: HttpClient) { }

    getReports(currentPage, itemsPerPage, orderByName, orderByAsc) {
        return this.http
            .get<any[]>(this.reportsApiUrl + itemsPerPage + '/' + currentPage + '?orderByName='+ orderByName + '&orderByAsc=' +orderByAsc);
    }

    updateReportedMessageByAdmin(UpdateReportMessage) {
        return this.http.post(this.postUpdateReportedMessageByAdmin, UpdateReportMessage);
    }

    getUnhandledReportsCount() {
        return this.http
            .get<any>(this.unhandledReportsCountUrl);
    }
}
