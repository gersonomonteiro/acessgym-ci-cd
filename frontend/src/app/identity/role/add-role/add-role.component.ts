import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NotificacaoService } from "src/app/_services/notificacao/notificacao.service";
import { PermissionService } from "src/app/_services/permission/permission.service";

import { RoleService } from "src/app/_services/role/role.service";
import { UserService } from "src/app/_services/user/user.service";

interface Permission {
    name: string;
  }
  
import Stepper from "bs-stepper";
@Component({
  selector: "app-add-role",
  templateUrl: "./add-role.component.html",
  styleUrls: ["./add-role.component.css"],
})

export class AddRoleComponent implements OnInit {

    
  Form: any;
  permissions: Permission[] = [];
  users: [];
  private stepper: Stepper;
  isAllSelected: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private notificacaoService: NotificacaoService,
    private permissionService: PermissionService,
    private userService: UserService
  ) {
    this.Form = this.formBuilder.group({
      name: ["", Validators.required],
      description: [""],
      permissions: this.formBuilder.array([], [Validators.required]),
      users: this.formBuilder.array([], [Validators.required]),
    });
  }

  ngOnInit() {
    this.getAllPermissions();
    this.getAllUsers();
    this.stepperInt();
  }

  getAllPermissions() {
    this.permissionService.show().subscribe((res) => {
      this.permissions = res.permission.filter(permission => permission.name !== 'INTERNAL');
    });
  }

  getAllUsers() {
    this.userService.list().subscribe((res) => {
      this.users = res.user;
      console.log(this.users);
    });
  }
  onSelectAll(e) {
    const permissions: FormArray = this.Form.get("permissions") as FormArray;

    this.isAllSelected = e.target.checked;

    if (this.isAllSelected) {
      this.permissions.forEach((permission) => {
        if (!permissions.value.includes(permission.name)) {
          permissions.push(new FormControl(permission.name));
        }
      });
    } else {
      while (permissions.length !== 0) {
        permissions.removeAt(0);
      }
    }
  }
  onCheckboxChange(e) {
    const permissions: FormArray = this.Form.get("permissions") as FormArray;

    if (e.target.checked) {
      permissions.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      permissions.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          permissions.removeAt(i);
          return;
        }
        i++;
      });
    }
    // Atualiza o estado do "Select All" baseado na seleção atual
  this.isAllSelected = this.permissions.length === permissions.length;
  }

  isChecked(permissionName: string): boolean {
    const permissions: FormArray = this.Form.get('permissions') as FormArray;
    return permissions.value.includes(permissionName);
  }

  onCheckboxAddUserChange(e) {
    const users: FormArray = this.Form.get("users") as FormArray;

    if (e.target.checked) {
      users.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      users.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          users.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onSubmit(): void {
    console.log(this.Form.value);
    this.roleService.store(this.Form.value).subscribe(
      (role) => {
        console.log(role);
        this.ToasterSuccess(role.message);
        this.Form.reset();
        //window.location.reload()
      },
      (err) => {
        console.log(err);
        this.ToasterError(err, "Error", "");
      }
    );
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

  ToasterSuccess(message) {
    this.notificacaoService.showSuccess(message);
  }
  ToasterError(message, title, toastConfig) {
    this.notificacaoService.showError(message, title, toastConfig);
  }
}
