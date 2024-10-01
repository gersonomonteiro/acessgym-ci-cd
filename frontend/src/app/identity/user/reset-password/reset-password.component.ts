import { Component, OnInit, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NotificacaoService } from "src/app/_services/notificacao/notificacao.service";
import { UserService } from "src/app/_services/user/user.service";
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
  FormControl,
  ValidatorFn,
} from "@angular/forms";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"],
})
export class ResetPasswordComponent implements OnInit {
  formChangePwd: any;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  newPassword: string;
  confirmPassword: string;
  passwordsMismatch: boolean = false;
  constructor(
    private activeModal: NgbActiveModal,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private notificacaoService: NotificacaoService
  ) {
    this.formChangePwd = this.formBuilder.group({
      newPwd: [
        "",
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
        ],
      ],
      confirmPwd: ["", Validators.required],
    });
  }

  ngOnInit() {}

  checkPasswords() {
    this.passwordsMismatch = this.newPassword !== this.confirmPassword;
  }

  resetPassword(id: number) {
    console.log(this.formChangePwd.value)
    if (!this.passwordsMismatch && this.newPassword && this.confirmPassword) {
      this.userService.resetPwd(this.formChangePwd.value, id).subscribe(
        (res) => {
          this.formChangePwd.reset();
          this.ToasterSuccess(res.message);
          this.decline()
        },
        (err) => {
          this.ToasterError(err, "Erro", "");
        }
      );
    } else {
      this.passwordsMismatch = true;
    }
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    //this.activeModal.close(true);
    //console.log(this.Form.value)
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  ToasterSuccess(message) {
    this.notificacaoService.showSuccess(message);
  }
  ToasterError(message, title, toastConfig) {
    this.notificacaoService.showError(message, title, toastConfig);
  }
}
