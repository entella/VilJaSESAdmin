import { Component, OnInit, Input } from '@angular/core';
import { NewsflowService } from './newsflow-service';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { RouterModule, Routes, Router } from '@angular/router';
import { NewsModel } from '../ViewModels/NewsModel';
import { VgAPI } from 'videogular2/core';
import { unescapeIdentifier } from 'typescript';
import { ErrorModel } from '../ViewModels/errormodel';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-Newsflow',
    templateUrl: './Newsflow.component.html',
    styleUrls: ['./Newsflow.component.css']
})

export class NewsflowComponent implements OnInit {
    title = '';
    restItems: any;
    totalMembers: any;
    currentPage: number = 1;
    totalPages: any;
    itemsPerPage: number = 15;
    searchText: string = '';
    orderByName: string = 'CreatedAt';
    orderByAsc: boolean = false;
    display: any;
    displayPost: any;
    displayDelete: any;
    editPostId: number;
    postMessage: string;
    logoUrl: any
    PictureUrl: any;
    showVideo: boolean = false;
    videoType: string = '';
    api: VgAPI;
    logoFileToUpload: File;
    fileToUpload: File;
    serverError: ErrorModel;
    displayErrorPage: boolean = false;
    body: any;
    selectedPost: any;
    success: boolean;
    message: string;

    constructor(private newsflowService: NewsflowService, private router: Router) { }

    private readonly staticImageOnVideoSelection = environment.apiurl + 'content/images/default-video-thumbnail.png';

    ngOnInit() {
        this.editPostId = 0;
        this.logoUrl = '';
        this.PictureUrl = '';
        this.postMessage = '';
        this.display = 'none';
        this.displayPost = 'none';
        this.displayDelete = 'none';
        this.getNewsflowList();
        //let editNews = new NewsModel();
        //editNews.NewsId=0;
        this.body = document.getElementsByTagName('body')[0];
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
        this.getNewsflowList();
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

        this.getNewsflowList();
    };

    DisablePrevPage(): boolean {
        return this.currentPage === 1 ? false : true;
    };

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }

        this.getNewsflowList();
    };

    DisableNextPage(): boolean {
        return this.currentPage === this.totalPages ? false : true;
    };

    setPage(n): void {
        this.currentPage = n;
        this.getNewsflowList();
    };

    //$scope.paginate = function () {

    //};

    // ------------- Pagination Ends ------------------


    // Read all REST Items
    getNewsflowList(): void {
        this.newsflowService
            .getNewsflowList(this.currentPage, this.itemsPerPage, this.orderByName, this.orderByAsc, this.searchText)
            .subscribe(
                restItems => {
                    this.restItems = restItems;
                    this.totalMembers = this.restItems['content'] != null ? this.restItems['content'][0].NewsCount : 0;
                    //console.log(this.restItems);
                },
                error => {
                    let errormodel = new ErrorModel();
                    errormodel.message = (error.message != null) ? "Server Error" : "";
                    this.serverError = errormodel;//set object for shared model
                    this.displayErrorPage = true;
                    console.log("Error", error);
                })
    }

    searchNewsflow(searchText): void {
        this.searchText = searchText;
        this.currentPage = 1;
        this.totalPages = 0;
        this.getNewsflowList();
    };


    clearSearch(): void {
        this.searchText = '';
        this.currentPage = 1;
        this.totalPages = 0;
        this.getNewsflowList();
    };

    goToProfile(ProfileId) {
        this.router.navigate(['/profile/' + ProfileId]);
    }

    getNewsflowByOrderBy(orderByName) {
        if (orderByName == this.orderByName) {
            this.orderByAsc = !this.orderByAsc;
        }
        else {
            this.orderByAsc = false;
        }
        this.orderByName = orderByName;
        this.getNewsflowList();
    }
    deleteNewsflow(): void {
        this.newsflowService.deleteNewsflow(this.editPostId).subscribe(
            data => {
                this.editPostId = 0;
                this.logoUrl = '';
                this.title = '';
                this.PictureUrl = '';
                this.postMessage = '';
                this.getNewsflowList();
                this.onCloseModal();
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
    deletePost(newsdt) {
        this.editPostId = newsdt.NewsId;
        this.openModal('del');
    }
    saveupdatePost(): void {
        let nw = new NewsModel();
        nw.NewsId = this.editPostId;
        nw.Description = this.postMessage;
        nw.LogoUrl = this.logoUrl;
        nw.Title = this.title;
        nw.PostUrl = this.PictureUrl;
        nw.NewsType = 0;
        this.newsflowService.saveupdatePost(nw).subscribe(
            data => {
                this.editPostId = 0;
                this.logoUrl = '';
                this.title = '';
                this.postMessage = '';
                this.PictureUrl = '';
                this.getNewsflowList();
                this.onCloseModal();
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



    saveUpdateNewsflowDetails(): void {
        if ((this.title == '' && this.postMessage == '')) {
            this.success = false;
            this.message = "News title and message are required fields.";
            return;
        }
        if (this.title == '' || this.title === undefined) {
            this.success = false;
            this.message = "News title is required field.";
            return;
        }
        if (this.postMessage=='' || this.postMessage === undefined) {
            this.success = false;
            this.message = "News message is required field.";
            return;
        }


        let file = this.fileToUpload;
        let logoFile = this.logoFileToUpload;
        var formData = new FormData();

        if (logoFile != null) {
            formData.append('logo', logoFile, logoFile.name);
        }
        if (file != null) {
            formData.append('image', file, file.name);
        }

        formData.append('Title', this.title);
        formData.append('Description', this.postMessage);
        formData.append('NewsType', '1');

        this.newsflowService.saveUpdateNewsflowDetails(this.editPostId, formData).subscribe(
            data => {
                this.editPostId = 0;
                this.logoUrl = '';
                this.title = '';
                this.postMessage = '';
                this.success = true;
                this.message = "";
                this.PictureUrl = '';
                this.getNewsflowList();
                this.onCloseModal();
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

    isInArray(array, word) {
        return array.indexOf(word.toLowerCase()) > -1;
    }

    onLogoFileSelected(event) {
        this.logoFileToUpload = <File>event.target.files[0];

        var allowedExtensions =
            ["jpg", "jpeg", "png", "JPG", "JPEG"];
        let fileExtension = this.logoFileToUpload.name.split('.').pop();

        if (this.isInArray(allowedExtensions, fileExtension)) {
            this.success = true;
            this.message = "";
        } else {
            this.success = false;
            this.message = "Please enter only JPG, JPEG, PNG images";
            return;
        }

        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();

            reader.onload = (event: ProgressEvent) => {
                this.logoUrl = (<FileReader>event.target).result;
            }

            reader.readAsDataURL(event.target.files[0]);
        }
    }

    onFileSelected(event) {
        this.fileToUpload = <File>event.target.files[0];

        var allowedExtensions =
            ["mp4", "MP4","jpg", "jpeg", "png", "JPG", "JPEG"];
        let fileExtension = this.fileToUpload.name.split('.').pop();

        if (this.isInArray(allowedExtensions, fileExtension)) {
            this.success = true;
            this.message = "";
        } else {
            this.success = false;
            this.message = "Please enter only JPG, JPEG, PNG, MP4 files.";
            return;
        }
        if(fileExtension.toLowerCase()== "mp4"){
            this.PictureUrl=this.staticImageOnVideoSelection;
        }
        else{
            if (event.target.files && event.target.files[0]) {
                var reader = new FileReader();
    
                reader.onload = (event: ProgressEvent) => {
                    this.PictureUrl = (<FileReader>event.target).result;
                }
    
                reader.readAsDataURL(event.target.files[0]);
            }
        }
        

        /*if (this.editPostId > 0) {
            var formData = new FormData();
            formData.append('image', this.fileToUpload, this.fileToUpload.name);
            this.newsflowService
                .uploadFile(this.editPostId, formData)
                .subscribe(data => {
                    var baseRes = data['baseRes'];
                    if (baseRes['success']) {
                        this.PictureUrl = data['imageUrl'];
                        this.editPostId = data['newsId'];
                        this.setToShowHideVideo();
                    }

                },
                    error => {
                        let errormodel = new ErrorModel();
                        errormodel.message = (error.message != null) ? "Server Error" : "";
                        this.serverError = errormodel;//set object for shared model
                        this.displayErrorPage = true;
                        console.log("Error", error);
                    });
        }*/
    }

    editPost(newsdt) {
        this.selectedPost = newsdt;
        this.editPostId = newsdt.NewsId;
        this.logoUrl = newsdt.LogoUrl;
        this.title = newsdt.Title;
        this.postMessage = newsdt.Description;
        this.PictureUrl = newsdt.PostUrl;
        this.setToShowHideVideo();
        this.openModal('editpost');
    }

    setToShowHideVideo() {
        let videoFileExtensions = ['mp4'];
        this.showVideo = false;
        if (this.PictureUrl != undefined && this.PictureUrl != null && this.PictureUrl.length > 0) {
            let names = this.PictureUrl.split('.');
            let extension = names[names.length - 1];
            this.showVideo = videoFileExtensions.indexOf(extension) >= 0;
            if (this.showVideo) {
                this.videoType = "video/" + extension;
            }
        }
    }

    removeNewsImage() {
        this.PictureUrl = "";
        this.newsflowService.removeNewsImage(this.editPostId).subscribe(
            data => {
                this.PictureUrl = '';
                this.showVideo = false;
                this.selectedPost.PostUrl = '';
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
    openModal(val) {
        if (val == 'post') {
            this.editPostId = 0;
            this.logoUrl = '';
            this.title = '';
            this.postMessage = '';
            this.PictureUrl = '';
            this.displayPost = 'block'
        } else if (val == 'editpost') {
            this.displayPost = 'block'
        } else if (val = 'del') {
            this.displayDelete = 'block'
        }
        this.success = true;
        this.message = "";
        this.body.classList.add('modal-open');
        this.display = 'block';
    }
    onCloseModal() {
        this.fileToUpload = null;
        this.showVideo = false;
        this.displayPost = 'none';
        this.displayDelete = 'none'
        this.display = 'none';
        this.editPostId = 0;
        this.logoUrl = '';
        this.title = '';
        this.postMessage = '';
        this.PictureUrl = '';
        this.success = true;
        this.message = "";
        this.body.classList.remove('modal-open');
    }
    doTextareaValueChange(ev) {
        this.postMessage = ev.target.value;
    }

    onPlayerReady(api: VgAPI) {
        this.api = api;
        this.api.getDefaultMedia().subscriptions.ended.subscribe(
            () => {
                // Set the video to the beginning
                this.api.getDefaultMedia().currentTime = 0;
            }
        );
    }
}