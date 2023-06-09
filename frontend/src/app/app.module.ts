import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { ToastrModule } from 'ngx-toastr'
import { CommonModule } from '@angular/common'

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CalendarModule } from '@syncfusion/ej2-angular-calendars'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './login/login.component'
import { HomeComponent } from './home/home.component'

import { authInterceptorProviders } from './_helpers/auth.interceptor'
import { AuthGuardService } from './_services/auth/auth-guard.service'
import { AuthService } from './_services/auth/auth.service'
import { ProfileComponent } from './user/profile/profile.component'
import { ErrorInterceptorProviders } from './_helpers/ErrorInterceptor'
import { TesteComponent } from './teste/teste.component'
import { MenuLateralComponent } from './shered/menu-lateral/menu-lateral.component'
import { ListRoleComponent } from './identity/role/list-role/list-role.component'
import { ListUserComponent } from './identity/user/list-user/list-user.component'
import { AddUserComponent } from './identity/user/add-user/add-user.component'
import { AddRoleComponent } from './identity/role/add-role/add-role.component'
import { ConfirmationDialogComponent } from './shered/confirmation-dialog/confirmation-dialog.component'
import { ConfirmationDialogService } from './shered/confirmation-dialog/confirmation-dialog.service'
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { HeaderComponent } from './shered/header/header.component'
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io'
import { ListClientComponent } from './client/list-client/list-client.component'
import { AddClientComponent } from './client/add-client/add-client.component'
import { NgTempusdominusBootstrapModule } from 'ngx-tempusdominus-bootstrap'
import { ModalService } from './client/modal/modal.service'
import { AcessControlComponent } from './client/acess-control/acess-control.component'
import { CameraComponent } from './client/camera/camera.component'
import { WebcamModule } from 'ngx-webcam'
import { ViewClientComponent } from './client/view-client/view-client.component'
import { NgxPermissionsModule } from 'ngx-permissions'
import { ForbiddenComponent } from './shered/forbdidden/forbidden/forbidden.component'
import { Ng2SearchPipeModule } from 'ng2-search-filter'
import { SwitchComponent } from './shered/switch/switch.component'
import { ViewRoleComponent } from './identity/role/view-role/view-role.component'
import { StrongPasswordComponent } from './shered/strong-password/strong-password.component'
import { EditClientComponent } from './client/edit-client/edit-client.component'
import { DonutComponent } from './home/charts/donut/donut.component'
import { NgApexchartsModule } from 'ng-apexcharts'
import { SplineComponent } from './home/charts/spline/spline.component'
import { BarComponent } from './home/charts/bar/bar.component';
import { PolarComponent } from './home/charts/polar/polar.component';
import { ReciboComponent } from './mensalidade/recibo/recibo.component';
import { AddReciboComponent } from './mensalidade/add-recibo/add-recibo.component';
const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} }

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        ProfileComponent,
        TesteComponent,
        MenuLateralComponent,
        ListRoleComponent,
        ListUserComponent,
        AddUserComponent,
        AddRoleComponent,
        ConfirmationDialogComponent,
        HeaderComponent,
        ListClientComponent,
        AddClientComponent,
        AcessControlComponent,
        CameraComponent,
        ViewClientComponent,
        ForbiddenComponent,
        SwitchComponent,
        ViewRoleComponent,
        StrongPasswordComponent,
        EditClientComponent,
        DonutComponent,
        SplineComponent,
        BarComponent,
        PolarComponent,
        ReciboComponent,
        AddReciboComponent,
        
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        CommonModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        SocketIoModule.forRoot(config),
        NgTempusdominusBootstrapModule,
        WebcamModule,
        NgxPermissionsModule.forRoot(),
        Ng2SearchPipeModule,
        CalendarModule,
        NgApexchartsModule,
    ],
    providers: [
        authInterceptorProviders,
        ErrorInterceptorProviders,
        AuthGuardService,
        AuthService,
        ConfirmationDialogService,
        ModalService,
        NgbActiveModal,
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        ConfirmationDialogComponent,
        AddClientComponent,
        AcessControlComponent,
        EditClientComponent,
        AddReciboComponent,
    ],
})
export class AppModule {}
