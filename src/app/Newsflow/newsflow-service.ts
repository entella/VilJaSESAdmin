import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class NewsflowService {
    httpOptions: any;
    private newsflowListUrl = environment.apiurl + 'api/newsflow/GetNewsflowList/';  // URL to web api
    private postDeletePostUrl = environment.apiurl + 'api/newsflow/DeleteNewsflow/';  // URL to web api
    private postsaveupdatePostUrl = environment.apiurl + 'api/newsflow/SaveUpdateNewsflow/';
    private postFileUpload = environment.apiurl + 'api/newsflow/UploadNewsflowPicture/';
    private RemoveNewsImage = environment.apiurl + 'api/newsflow/RemoveNewsImage/';
    private SaveUpdateNewsflowDetails = environment.apiurl + 'api/newsflow/SaveUpdateNewsflowDetails/';

    constructor(private http: HttpClient) { }

    /** Get:GetNewsflowList List from the server */
    getNewsflowList(currentPage, itemsPerPage, orderByName, orderBy, searchText) {
        return this.http
          .get<any[]>(this.newsflowListUrl + itemsPerPage + '/' + currentPage + '?orderByName=' + orderByName +
            '&orderByAsc=' + orderBy + '&searchText=' + searchText).pipe
            (map(data => data));
    }
    deleteNewsflow(newsId) {
        return this.http.post(this.postDeletePostUrl + '?newsId=' + newsId, '');
    }

    saveupdatePost(postDetails) {
        return this.http.post(this.postsaveupdatePostUrl, postDetails);
    }
    uploadFile(newsId,file: any) {
        var uploadFilehttpOptions = {
            headers: new HttpHeaders({
                'Authorization': sessionStorage.getItem('AccessToken')
            })
        }
        return this.http.post(this.postFileUpload + '?newsId=' + newsId, file);
    }

    saveUpdateNewsflowDetails(newsId,from: any) {
        var uploadFilehttpOptions = {
            headers: new HttpHeaders({
                'Authorization': sessionStorage.getItem('AccessToken')
            })
        }
        return this.http.post(this.SaveUpdateNewsflowDetails + '?newsId=' + newsId, from);
    }

    removeNewsImage(newsId) {
        return this.http.put(this.RemoveNewsImage+ '?newsId=' + newsId, '');
    }
}
