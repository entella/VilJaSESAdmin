import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './login/login.component';
import { MembersComponent } from './Members/members.component';
import { ProfileComponent } from './Profile/profile.component';
import { MasterComponent } from './MasterPage/master.component';
import { ReportsComponent } from './reports/reports.component';
import { AdminComponent } from './Admin/admin.component';
import { AdminDetailComponent } from './AdminDetail/admindetail.component';
import { resetPasswordComponent } from './ResetPassword/resetPassword.component';
import { NewsflowComponent } from './Newsflow/newsflow.component';

const routes: Routes = [
    {
        path: '',
        component: MasterComponent,
        children: [
            {
                outlet: 'master',
                path: '',
                component: LoginComponent
            },
            {
                outlet: 'master',
                path: 'login',
                component: LoginComponent
            }
        ]
    },
    {
        path: 'members',
        component: MasterComponent,
        children: [
            {
                outlet: 'master',
                path: '',
                component: MembersComponent
            }

        ]
    },
    {
        path: 'profile/:id',
        component: MasterComponent,
        children: [
            {
                outlet: 'master',
                path: '',
                component: ProfileComponent
            }

        ]
    },
    {
        path: 'reports',
        component: MasterComponent,
        children: [
            {
                outlet: 'master',
                path: '',
                component: ReportsComponent
            }

        ]
    },
    {
        path: 'adminProfile',
        component: MasterComponent,
        children: [
            {
                outlet: 'master',
                path: '',
                component: AdminComponent
            }

        ]
    },
    {
        path: 'adminDetailProfile/:id',
        component: MasterComponent,
        children: [
            {
                outlet: 'master',
                path: '',
                component: AdminDetailComponent
            }

        ]
    },
    {
        path: 'adminDetailProfile',
        component: MasterComponent,
        children: [
            {
                outlet: 'master',
                path: '',
                component: AdminDetailComponent
            }

        ]
    },
    {
        path: 'ResetPassword/:id',
        component: MasterComponent,
        children: [
            {
                outlet: 'master',
                path: '',
                component: resetPasswordComponent
            }

        ]
    },
    {
        path: 'Newsflow',
        component: MasterComponent,
        children: [
            {
                outlet: 'master',
                path: '',
                component: NewsflowComponent
            }

        ]
    },
    //{ path: '', redirectTo: '/login', pathMatch: 'full' },
    //{ path: 'login', component: LoginComponent },
    //{ path: 'members', component: MembersComponent }
    //{ path: 'detail/:id', component: HeroDetailComponent },
    //{ path: 'heroes', component: HeroesComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }