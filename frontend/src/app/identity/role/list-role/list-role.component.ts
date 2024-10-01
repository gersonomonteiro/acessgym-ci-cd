import { Component, OnInit } from "@angular/core";
import { NgbTypeaheadWindow } from "@ng-bootstrap/ng-bootstrap/typeahead/typeahead-window";
import { NgxPermissionsService } from 'ngx-permissions'
import { NotificacaoService } from "src/app/_services/notificacao/notificacao.service";
import { PermissionService } from "src/app/_services/permission/permission.service";
import { RoleService } from "src/app/_services/role/role.service";
import { ConfirmationDialogService } from "../../../shered/confirmation-dialog/confirmation-dialog.service";
import { UserService } from "src/app/_services/user/user.service";
import { TokenStorageService } from "src/app/_services/auth/token-storage.service";

@Component({
  selector: "app-list-role",
  templateUrl: "./list-role.component.html",
  styleUrls: ["./list-role.component.css"],
})
export class ListRoleComponent implements OnInit {
  roles: any;
  user;
  correntUserRoles
  showAddRole: boolean = false;
  numeroPermissions: number;
  page = 1;
  pageSize = 5;
  collectionSize: number;
  currentRate = 8;

  constructor(
    private roleService: RoleService,
    private notificacaoService: NotificacaoService,
    private confirmationDialogService: ConfirmationDialogService,
    private permissionService: PermissionService,
    private tokenStorage: TokenStorageService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.roleService.show().subscribe((res) => {
      this.roles = res.role.filter((role) => role.name !== "superadmin");
      
      this.collectionSize = this.roles.length;

      this.user = {
        email: this.tokenStorage.getUserEmail(),
      };
      //this.isLoggedIn = this.authGuardService.canActivate();
      
      this.userService.getUserByEmail(this.user).subscribe((res) => {
        this.correntUserRoles = res.user.roles;        
      });
    });

    this.getPermissions();
  }
  desabledButtonForAdmin(adminRole: any): boolean {    
    return this.isAdmin(this.correntUserRoles) && adminRole.toLowerCase() === 'admin'
  }

  isAdmin(roles: any): boolean {
    return roles.some((role: any) => role.name != "superadmin");
  }

  onClickMe() {
    this.showAddRole = !this.showAddRole;
  }

  public openConfirmationDialog(id) {
    this.confirmationDialogService
      .confirm("Por favor confirma..", "Você realmente quer apagar... ?")
      .then((confirmed) => {
        if (confirmed) {
          this.removeRole(id);
          const index = this.roles.findIndex(role => role.id === id);

          if (index !== -1) {
            this.roles.splice(index, 1); // Remove o elemento correto
          }
        } else {
          console.log("not confirmed");
        }
      })
      .catch(() =>
        console.log(
          "User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)"
        )
      );
  }

  removeRole(id) {
    this.roleService.remove(id).subscribe(
      (role) => {
        console.log(role);
        this.ToasterSuccess(role.message);
        //window.location.reload()
      },
      (err) => {
        console.log(err);
        this.ToasterError(err, "Error", "");
      }
    );
    
  }

  getPermissions() {
    this.permissionService.show().subscribe((res) => {
      this.numeroPermissions = res.permission;
    });
  }
  isDisabled(role: any): boolean {
    return role === "internal";
  }

  ToasterSuccess(message) {
    this.notificacaoService.showSuccess(message);
  }
  ToasterError(message, title, toastConfig) {
    this.notificacaoService.showError(message, title, toastConfig);
  }
}
