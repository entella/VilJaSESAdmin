import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app.routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MembersComponent } from './Members/members.component';
import { MasterComponent } from './MasterPage/master.component';
import { ProfileComponent } from './Profile/profile.component';
import { AdminComponent } from './Admin/admin.component';
import { AdminDetailComponent } from './AdminDetail/admindetail.component';
import { MasterModule } from './MasterPage/master.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { resetPasswordComponent } from './ResetPassword/resetPassword.component';
import { NewsflowComponent } from './Newsflow/newsflow.component';
import { ErrorPageComponent } from './ErrorPage/errorpage.component';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { ReportsComponent } from './reports/reports.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './interceptor.service';

import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        MasterModule,
        CKEditorModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule

        //The HttpClientInMemoryWebApiModule module intercepts HTTP requests
        //and returns simulated server responses.
        //Remove it when a real server is ready to receive requests.
        //HttpClientInMemoryWebApiModule.forRoot(
        //    InMemoryDataService, { dataEncapsulation: false }
        //)
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        MembersComponent,
        MasterComponent,
        ProfileComponent,
        ReportsComponent, AdminComponent, AdminDetailComponent, resetPasswordComponent, NewsflowComponent, ErrorPageComponent
    ],
    providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: InterceptorService,
          multi: true
        }
      ],
    bootstrap: [AppComponent]
})
export class AppModule { }
