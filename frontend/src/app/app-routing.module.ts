import { TesteComponent } from './teste/teste.component'
import { ProfileComponent } from './user/profile/profile.component'
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuardService } from './_services/auth/auth-guard.service'
import { ListRoleComponent } from './identity/role/list-role/list-role.component'
import { ListUserComponent } from './identity/user/list-user/list-user.component'
import { AddClientComponent } from './client/add-client/add-client.component'
import { ListClientComponent } from './client/list-client/list-client.component'
import { ViewClientComponent } from './client/view-client/view-client.component'
import { NgxPermissionsGuard } from 'ngx-permissions'
import { ForbiddenComponent } from './shered/forbdidden/forbidden/forbidden.component'
import { ViewRoleComponent } from './identity/role/view-role/view-role.component'
import { ReciboComponent } from './mensalidade/recibo/recibo.component'

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
    {
        path: 'home/teste',
        component: TesteComponent,
        //canActivate: [AuthGuardService],
    },
    {
        path: 'home/profile',
        component: ProfileComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'home/users',
        component: ListUserComponent,
        canActivate: [AuthGuardService, NgxPermissionsGuard],
        data: {
            permissions: {
                only: 'READ_USER',
                //redirectTo: '/forbidden'
            },
        },
    },
    {
        path: 'home/roles',
        component: ListRoleComponent,
        canActivate: [AuthGuardService, NgxPermissionsGuard],
        data: {
            permissions: {
                only: 'CREATE_USER',
                //redirectTo: '/forbidden'
            },
        },
    },
    {
        path: 'home/role',
        component: ViewRoleComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'home/clients',
        component: ListClientComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'home/client',
        component: ViewClientComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'home/mensalidade',
        component: ReciboComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'forbidden',
        component: ForbiddenComponent,
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
