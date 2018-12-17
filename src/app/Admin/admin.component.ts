import { Component, OnInit, Input } from '@angular/core';
import { AdminService } from './admin-service';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Routes, Router } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AboutUs } from '../ViewModels/aboutUs';
import { FaqDetail } from '../ViewModels/faq';
import { ErrorModel } from '../ViewModels/errormodel';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
    title = 'app';
    totalMembers: any;
    currentPage: number = 1;
    totalPages: any;
    itemsPerPage: number = 10;
    searchText: string = '';
    orderByName: string = 'CreatedAt';
    orderByAsc: boolean = false;
    restItems: any;
    configurationItems: any;
    faqItems: any;
    htmlText: any;
    Question: string = '';
    Answer: string = '';
    FaqId = 0;
    selectedFaqId = 0;
    display: any;
    displaydel: any;
    public Editor = ClassicEditor;
    public Editor1 = ClassicEditor;
    public Editor2 = ClassicEditor;
    serverError: ErrorModel;
    displayErrorPage: boolean = false;
    modalErrorBool : boolean = false;
    modalError: string;
    body: any;
    //range: any;
    constructor(private adminService: AdminService, private router: Router) { }

    
    ngOnInit() {
        this.getAdminUsersList();
        this.display = 'none';
        this.displaydel = 'none';
        this.body = document.getElementsByTagName('body')[0];
    }

    // ------------- Pagination Starts ------------------
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

    setPageSize(size): void {
        this.itemsPerPage = size;
        this.currentPage = 1;
        this.totalPages = 0;
        this.getAdminUsersList();
    };

    pageCount(): any {
        if (this.totalMembers == null)
            return 0;

        if (this.totalMembers > 0)
            if (this.totalMembers == undefined)
                return 0;
            else
                return Math.ceil(this.totalMembers / this.itemsPerPage);
    };


    prevPage(): void {
        if (this.currentPage > 0) {
            this.currentPage--;
        }

        this.getAdminUsersList();
    };

    DisablePrevPage(): boolean {
        return this.currentPage === 1 ? false : true;
    };

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }

        this.getAdminUsersList();
    };

    DisableNextPage(): boolean {
        return this.currentPage === this.totalPages ? false : true;
    };

    setPage(n): void {
        this.currentPage = n;
        this.getAdminUsersList();
    };
    // ------------- Pagination Ends ------------------

    // Read all REST Items
    getAdminUsersList(): void {
        this.adminService.getAdminUserList(this.currentPage, this.itemsPerPage, this.orderByName, this.orderByAsc)
            .subscribe(
            restItems => {
                this.restItems = restItems['content'].users;
                this.totalMembers = restItems['content'].users != null ? restItems['content'].users[0].MembersCount : 0;
                this.configurationItems = restItems['content'].configurationList;
                this.faqItems = restItems['content'].faqList;
            },
            error => {
                let errormodel = new ErrorModel();
                errormodel.message = (error.message != null) ? "Server Error" : "";
                this.serverError = errormodel;//set object for shared model
                this.displayErrorPage = true;
                console.log("Error", error);
            })
    }

    goToAdminDetail(userId) {
        this.router.navigate(['/adminDetailProfile/' + userId]);
    }
  
    updateConfiguration(HTMLText, id): void {
        let uc = new AboutUs();
        uc.HTMLText = HTMLText;
        uc.Id = id;
        this.adminService.UpdateHtmlText(uc).subscribe(
            data => {
                this.configurationItems = data['content'];
                this.openModal("save", 0);
                console.log("POST Request is successful ", data);
            },
            error => {
                let errormodel = new ErrorModel();
                errormodel.message = (error.message != null) ? "Server Error" : "";
                this.serverError = errormodel;//set object for shared error model
                this.displayErrorPage = true;
                console.log("Error", error);
            }
        );
        console.log(this.configurationItems[0].HTMLText);
    };

    AddFaq(question, answer, FaqId): void {
        this.modalErrorBool = false;
        if ((question == '' || question === undefined || question == "<p>&nbsp;</p>") || (answer == '' || answer === undefined || answer == "<p>&nbsp;</p>") && this.modalErrorBool == false) {
            this.modalErrorBool = true;
            this.modalError = "please enter all required fields.";
        }
        let af = new FaqDetail();
        af.Id = FaqId;
        af.Question = question;
        af.Answer = answer;
        if (this.modalErrorBool == false) {
            this.adminService.AddDeleteFaq(af).subscribe(
                data => {
                    this.faqItems = data['content'];
                    this.Question = '';
                    this.Answer = '';
                    this.openModal("save", 0);
                    this.modalErrorBool = false;
                    console.log("POST Request is successful ", data);
                },
                error => {
                    let errormodel = new ErrorModel();
                    errormodel.message = (error.message != null) ? "Server Error" : "";
                    this.serverError = errormodel;//set object for shared error model
                    this.displayErrorPage = true;
                    console.log("Error", error);
                }
            );
        }
    };

    DeleteFaq(): void {
        let af = new FaqDetail();
        af.Id = this.selectedFaqId;
        this.adminService.AddDeleteFaq(af).subscribe(
            data => {
                this.faqItems = data['content'];
                this.selectedFaqId = 0;
                this.onCloseModal();
                console.log("POST Request is successful ", data);
            },
            error => {
                let errormodel = new ErrorModel();
                errormodel.message = (error.message != null) ? "Server Error" : "";
                this.displayErrorPage = true;
                this.serverError = errormodel;//set object for shared error model
                console.log("Error", error);
            }
        );
    };

    openModal(val, selectedId) {
        if (val == 'del') {
            this.selectedFaqId = selectedId;
            this.displaydel = 'block'
        }
        else if (val == 'save') {
            this.selectedFaqId = selectedId;
            this.display = 'block'
        }
        else {
            this.display = 'block';
        }
        this.body.classList.add('modal-open');
    };
    onCloseModal() {
        this.displaydel = 'none';
        this.display = 'none';
        this.body.classList.remove('modal-open');
    };

    getMembersByOrderBy(orderByName) {
        if (orderByName == this.orderByName) {
            this.orderByAsc = !this.orderByAsc;
        }
        else {
            this.orderByAsc = false;
        }
        this.orderByName = orderByName;
        this.getAdminUsersList();
    }
}
