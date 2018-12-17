import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Routes, Router } from '@angular/router';
import { ReportsService } from 'src/app/reports/reports.service';

@Component({
    selector: 'app-master',
    templateUrl: './master.component.html',
    styleUrls: ['./master.component.css']
})



export class MasterComponent implements OnInit {
    isUserLoggedin: boolean;
    token: string;
    isNavbarCollapsed = true;
    reportBadgeCount: number = 0;
    constructor(private reportsService: ReportsService, private router : Router) { }

    ngOnInit() {
        this.checkIsUserLoggedIn();
        this.getReports();
    }

    checkIsUserLoggedIn() {
        this.token = sessionStorage.getItem('AccessToken');
        this.isUserLoggedin = this.token != null && this.token.length > 0;
    }

    handleMenu() {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    getReports() {
        this.reportsService.getUnhandledReportsCount()
            .subscribe(response => {
                this.reportBadgeCount = response['content'];
            },
                error => {
                })
    }

    redirectToHome(){
        if(!this.isUserLoggedin){
            return;
        }
        this.router.navigate(['/Newsflow']);
    }

}