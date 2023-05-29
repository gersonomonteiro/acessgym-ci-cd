import { Component, OnInit, Output } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, Validators } from '@angular/forms'
import { TokenStorageService } from '../_services/auth/token-storage.service'
import { AuthService } from '../_services/auth/auth.service'
import { NotificacaoService } from '../_services/notificacao/notificacao.service'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    Form
    errorData = []
    loading = false
    fieldTextType: boolean
    loginFailed = false
    errMsg

    constructor(
        private authService: AuthService,
        private tokenStorage: TokenStorageService,
        private router: Router,
        private formBuilder: FormBuilder,
        private notificacaoService: NotificacaoService
    ) {
        this.Form = this.formBuilder.group({
            email: ['', Validators.required, Validators.email],
            password: ['', Validators.required],
        })
    }
    ngOnInit() {
        if (this.tokenStorage.loggedIn) {
            this.router.navigate(['/home'])
        }
    }

    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType
    }

    ToasterSuccess(message) {
        this.notificacaoService.showSuccess(message)
    }
    ToasterError(message, title, toastConfig) {
        this.notificacaoService.showError(message, title, toastConfig)
    }

    onSubmit(user) {
        this.loading = true

        this.authService.signin(user).subscribe(
            (res) => {
                this.ToasterSuccess('Success')
                this.tokenStorage.saveToken(res.token)
                this.tokenStorage.saveUserEmail(res.user)
                window.location.reload()
                this.router.navigate(['/home'])
            },
            (err) => {
                this.loading = false
                this.loginFailed = true

                //this.errorData = error.error.errors
                this.errMsg = err
                this.ToasterError(err, '', {
                    timeOut: 30000,
                })
                /*if (this.errorData) {
                    for (let i = 0; i < this.errorData.length; i++) {
                        this.ToasterError(
                            this.errorData[i].msg,
                            this.errorData[i].param,
                            {
                                timeOut: 30000,
                            }
                        )
                    }
                }

                if (error.error.message.length > 0) {
                    this.ToasterError(error.error.message, 'Error', {
                        timeOut: 30000,
                    })
                }*/
            }
        )
    }
}
