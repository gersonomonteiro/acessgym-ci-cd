import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/_model/user';
import { AuthGuardService } from 'src/app/_services/auth/auth-guard.service';
import { AuthService } from 'src/app/_services/auth/auth.service';
import { TokenStorageService } from 'src/app/_services/auth/token-storage.service';
import { UserService } from 'src/app/_services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentUser: User;
  avatar: any;
  public mostrarUserProfie: boolean = false;
  isLoggedIn: boolean = false;
  user

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private userService: UserService,
    private authGuardService: AuthGuardService
  ) {}


  ngOnInit() {
    this.user = {
      email: this.tokenStorage.getUserEmail(),
    };
    this.isLoggedIn = this.authGuardService.canActivate();

    this.userService.getUserByEmail(this.user).subscribe((res) => {
      this.currentUser = res.user;

      if (this.currentUser.image) {
        this.avatar = this.currentUser.image.path;
      } else {
        this.avatar = `https://ui-avatars.com/api/?background=random&name=${this.currentUser.firstname}+${this.currentUser.lastname}`;
      }

    });
  }

  logout() {
    this.authService.signOut();
    //this.router.navigate(['/login']);
  }

  showUserProfile() {
    this.mostrarUserProfie = true;
  }

}
