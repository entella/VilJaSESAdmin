import { Component, OnInit, Input } from '@angular/core';
import { MembersService } from './members-service';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Routes, Router } from '@angular/router';
import { ErrorModel } from '../ViewModels/errormodel';

@Component({
    selector: 'app-members',
    templateUrl: './members.component.html',
    styleUrls: ['./members.component.css']
})

export class MembersComponent implements OnInit {
    title = 'app';
    restItems: any;
    totalMembers: any;
    currentPage: number = 1;
    totalPages: any;
    itemsPerPage: number = 10;
    searchText: string = '';
    orderByName: string = 'CreatedAt';
    orderByAsc: boolean = false;
    displayErrorPage: boolean = false;
    serverError: ErrorModel;
    //range: any;
    constructor(private membersService: MembersService, private router: Router) { }


    ngOnInit() {
        //this.currentPage = 1;
        //this.itemsPerPage = 20;
        this.getMembersList();
    }

    range(): any {
        var rangeSize = 3;
        var ps = [];
        var start;
        start = this.currentPage;
        if (start > this.pageCount() - rangeSize) {
            if (this.pageCount() < rangeSize)
                start = this.pageCount() - rangeSize;
            else
                start = this.pageCount() - rangeSize + 1;
        }
        for (var i = start; i < start + rangeSize; i++) {

            if (i != -1 && i != -2 && i != -3 && i != -4) {
                ps.push(start > 0 ? i : i + 1);
            }
        }

        this.totalPages = this.pageCount() > ps.length ? this.pageCount() : ps.length;
        return ps;
    };
    // ------------- Pagination Starts ------------------

    setPageSize(size): void {
        this.itemsPerPage = size;
        this.currentPage = 1;
        this.totalPages = 0;
        this.getMembersList();
    };

    pageCount(): any {
        if (this.totalMembers == null)
            return 0;

        if (this.totalMembers > 0)
            if (this.totalMembers == undefined)
                return 0;
            else
                return Math.ceil(this.totalMembers / this.itemsPerPage);
        //else
        //    if ($scope.playersModel.usersCount == undefined)
        //        return 0;
        //    else
        //        return Math.ceil($scope.playersModel.usersCount / $scope.itemsPerPage);
    };


    prevPage(): void {
        if (this.currentPage > 0) {
            this.currentPage--;
        }

        this.getMembersList();
    };

    DisablePrevPage(): boolean {
        return this.currentPage === 1 ? false : true;
    };

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }

        this.getMembersList();
    };

    DisableNextPage(): boolean {
        return this.currentPage === this.totalPages ? false : true;
    };

    setPage(n): void {
        this.currentPage = n;
        this.getMembersList();
    };

    //$scope.paginate = function () {

    //};

    // ------------- Pagination Ends ------------------


    // Read all REST Items
    getMembersList(): void {
        this.membersService
            .getMembersList(this.currentPage, this.itemsPerPage, this.orderByName, this.orderByAsc, this.searchText)
            .subscribe(
                restItems => {
                    this.restItems = restItems;
                    this.totalMembers = this.restItems['content'] != null ? this.restItems['content'][0].membersCount : 0;
                    //console.log(this.restItems);
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

    searchMembers(searchText): void {
        this.searchText = searchText;
        this.currentPage = 1;
        this.totalPages = 0;
        this.getMembersList();
        //},
        //    (err: HttpErrorResponse) => { }
    };


    clearSearch(): void {
        this.searchText = '';
        this.currentPage = 1;
        this.totalPages = 0;
        this.getMembersList();
        //},
        //    (err: HttpErrorResponse) => { }
    };

    goToProfile(ProfileId) {
        this.router.navigate(['/profile/' + ProfileId]);
    }

    getMembersByOrderBy(orderByName) {
        if (orderByName == this.orderByName) {
            this.orderByAsc = !this.orderByAsc;
        }
        else {
            this.orderByAsc = false;
        }
        this.orderByName = orderByName;
        this.getMembersList();
    }
}