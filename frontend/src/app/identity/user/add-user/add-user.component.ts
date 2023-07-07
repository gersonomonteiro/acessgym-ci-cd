import { Component, OnInit, Output } from "@angular/core";
import {
  Validators,
  FormBuilder,
  FormArray,
  FormControl,
} from "@angular/forms";

import { AuthService } from "src/app/_services/auth/auth.service";
import { NotificacaoService } from "src/app/_services/notificacao/notificacao.service";
import { RoleService } from "src/app/_services/role/role.service";

import Stepper from "bs-stepper";
import { UserService } from "src/app/_services/user/user.service";
import { TokenStorageService } from "src/app/_services/auth/token-storage.service";

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.css"],
})
export class AddUserComponent implements OnInit {
  roles: any;
  user;
  Form: any;
  private stepper: Stepper;
  fieldTextType: boolean;
  passwordIsValid = false;
  roleList: any;

  constructor(
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificacaoService: NotificacaoService,
    private userService: UserService,
    private tokenStorage: TokenStorageService
  ) {
    this.Form = this.formBuilder.group({
      firstname: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      lastname: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      phone: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
        ],
      ],
      ative: [true, Validators.required],
      roles: this.formBuilder.array([], [Validators.required]),
    });
  }

  getAllRole() {
    this.roleService.show().subscribe((res) => {
      this.roles = res.role.filter((role) => role.name != "superadmin");
      this.user = {
        email: this.tokenStorage.getUserEmail(),
      };
      //this.isLoggedIn = this.authGuardService.canActivate();

      this.userService.getUserByEmail(this.user).subscribe((res) => {
        let roles = res.user.roles;
        
        if (this.isAdmin(roles)) {
          this.roles = this.roles.filter((role) => role.name != "Admin");
          
        }
      });
    });
  }
  isAdmin(roles: any): boolean {
    return roles.some((role: any) => role.name != "superadmin");
  }

  onCheckboxChange(e) {
    const roles: FormArray = this.Form.get("roles") as FormArray;

    if (e.target.checked) {
      roles.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      roles.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          roles.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  ngOnInit() {
    this.getAllRole();
    this.stepperInt();
  }

  next() {
    this.stepper.next();
  }
  previous() {
    this.stepper.previous();
  }
  stepperInt() {
    this.stepper = new Stepper(document.querySelector("#stepper1"), {
      linear: false,
      animation: true,
    });
  }

  onSubmit(): void {
    this.authService.signup(this.Form.value).subscribe(
      (user) => {
        this.ToasterSuccess(user.message);
        this.Form.reset();
        window.location.reload();
      },
      (err) => {
        this.ToasterError(err, "Error", "");
      }
    );
  }

  ToasterSuccess(message) {
    this.notificacaoService.showSuccess(message);
  }
  ToasterError(message, title, toastConfig) {
    this.notificacaoService.showError(message, title, toastConfig);
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  passwordValid(event) {
    //https://github.com/uzochukwueddie/password-strength
    this.passwordIsValid = event;
  }
}
