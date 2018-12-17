import { Component, OnInit } from '@angular/core';
import { ReportsService } from './reports.service';
import { UpdateReportMessage } from '../ViewModels/updateReportMessageModel';
import { ErrorModel } from '../ViewModels/errormodel';
import { MasterComponent } from '../MasterPage/master.component';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css']
})

export class ReportsComponent implements OnInit {

    reports: any;
    totalMembers: any;
    orderByName: string = 'CreatedAt';
    orderByAsc: boolean = false;
    currentPage: number = 1;
    totalPages: any;
    itemsPerPage: number = 10;
    serverError: ErrorModel;
    displayErrorPage: boolean = false;

    constructor(private reportsService: ReportsService,
        private masterComponent : MasterComponent) { }

    ngOnInit() {
        this.getReports();
    }

    setPageSize(size): void {
        this.itemsPerPage = size;
        this.currentPage = 1;
        this.totalPages = 0;
        this.getReports();
    };

    getReports() {
        this.reportsService
            .getReports(this.currentPage, this.itemsPerPage, this.orderByName, this.orderByAsc)
            .subscribe(response => {
                this.reports = response['content'];
                this.totalMembers = response['content'] != null ? response['content'][0].MembersCount : 0;
            },
            error => {
                let errormodel = new ErrorModel();
                errormodel.message = (error.message != null) ? "Server Error" : "";
                this.serverError = errormodel;//set object for shared model
                this.displayErrorPage = true;
                console.log("Error", error);
            })
    }

    updateReportedMessageByAdmin(msg): void {
        let up = new UpdateReportMessage();
        up.ReportAdminId = msg.ReportAdminId;
        up.ReplyMessage = msg.ReplyMessage;
        if (msg.IsCompleted == true) {
            up.Status = 2;
            msg.Status=2;
        } else { 
            up.Status = 1; 
            msg.Status=1;
        }

        this.reportsService.updateReportedMessageByAdmin(up).subscribe(
            data => {
                this.masterComponent.getReports();
                //this.reports = data['content'];
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

    expandMe(report) {
        report.checked = !report.checked;
    }

    doTextareaValueChange(ev, message) {
        //message.Checked = !message.Checked;
        message.ReplyMessage = ev.target.value;
    }

    getReportsByOrderBy(orderByName) {
        if (orderByName == this.orderByName) {
            this.orderByAsc = !this.orderByAsc;
        }
        else {
            this.orderByAsc = false;
        }
        this.orderByName = orderByName;
        this.getReports();
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }

        this.getReports();
    };

    DisableNextPage(): boolean {
        return this.currentPage === this.totalPages ? false : true;
    };

    setPage(n): void {
        this.currentPage = n;
        this.getReports();
    };

    prevPage(): void {
        if (this.currentPage > 0) {
            this.currentPage--;
        }
        this.getReports();
    };

    DisablePrevPage(): boolean {
        return this.currentPage === 1 ? false : true;
    };

    range(): any {
        var rangeSize = 3;
        var ps = [];
        var start;
        start = this.currentPage;
        let count = this.pageCount();

        if (start > count - rangeSize) {
            if (count < rangeSize)
                start = count - rangeSize;
            else
                start = count - rangeSize + 1;
        }
        for (var i = start; i < start + rangeSize; i++) {

            if (i != -1 && i != -2 && i != -3 && i != -4) {
                ps.push(start > 0 ? i : i + 1);
            }
        }

        this.totalPages = this.pageCount() > ps.length ? this.pageCount() : ps.length;
        return ps;
    };

    pageCount(): any {
        if (this.totalMembers == null || this.totalMembers == undefined)
            return 0;

        return Math.ceil(this.totalMembers / this.itemsPerPage);
    };
}
