import { Component, Input, OnInit } from "@angular/core";
//import { User } from "src/app/_model/user";
import { NotificacaoService } from "src/app/_services/notificacao/notificacao.service";
import { RoleService } from "src/app/_services/role/role.service";
import { UserService } from "src/app/_services/user/user.service";
import { ConfirmationDialogService } from "../../../shered/confirmation-dialog/confirmation-dialog.service";
import { TokenStorageService } from "src/app/_services/auth/token-storage.service"
import { constants } from "src/app/common/constants/backend"

interface User {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  image: {
    path: string;
  } | null;
  roles: Role[];
}

interface Role {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  user_roles: {
    createdAt: string;
    updatedAt: string;
    user_id: number;
    role_id: number;
  };
  permission: [];
}

@Component({
  selector: "app-list-user",
  templateUrl: "./list-user.component.html",
  styleUrls: ["./list-user.component.css"],
})
export class ListUserComponent implements OnInit {
  users: User[];
  showAddUser: boolean = false;
  numeroRoles: number;
  searchText;
  myEmail;
  userEmail;
  rolesTemp;
  avatarBaseUrl: string = `${constants.BASE_API_URL}/uploads/`;
  avatarApiUrl: string = "https://ui-avatars.com/api/?background=random&name=";

  page = 1;
  pageSize = 5;
  collectionSize: number;
  currentRate = 8;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private confirmationDialogService: ConfirmationDialogService,
    private notificacaoService: NotificacaoService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit() {
    this.userService.list().subscribe((res) => {
      this.users = res.user;
      this.collectionSize = this.users.length;
    });
    this.myEmail = this.tokenStorage.getUserEmail();
    this.getNumeroRole();
  }

  isSuperadmin(user: any): boolean {
    return user === 1;
  }

  isMyUser(users: any, myEmail: any): boolean {
    return users.some((user: any) => user.username === myEmail);
  }
  desabledButtonForMyUser(myEmail: any): boolean {
    return this.myEmail === myEmail;
  }
  desabledButtonForOtherUser(email: any, id: any): boolean {
    return id === 1 && this.myEmail != email;
  }

  onClickMe() {
    this.showAddUser = !this.showAddUser;
  }

  getNumeroRole() {
    this.roleService.show().subscribe((res) => {
      this.numeroRoles = res.role;
    });
  }

  public openConfirmationDialog(id, index) {
    this.confirmationDialogService
      .confirm("Por favor confirma..", "Você realmente quer apagar... ?")
      .then((confirmed) => {
        if (confirmed) {
          this.removeUser(id);
          this.users.splice(index, 1);
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

  removeUser(id) {
    this.userService.remove(id).subscribe(
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
    console.log(`role id ${id}`);
  }

  ToasterSuccess(message) {
    this.notificacaoService.showSuccess(message);
  }
  ToasterError(message, title, toastConfig) {
    this.notificacaoService.showError(message, title, toastConfig);
  }
}
