import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { UserService } from 'src/app/_services/user/user.service'
import { User } from 'src/app/_model/user'
import { TokenStorageService } from 'src/app/_services/auth/token-storage.service'
import {
    AbstractControl,
    FormBuilder,
    ValidationErrors,
    Validators,
    FormControl,
    ValidatorFn,
} from '@angular/forms'
import { NotificacaoService } from 'src/app/_services/notificacao/notificacao.service'

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
    currentUser: User
    Form: any
    formChangePwd: any
    avatar: any
    viewMode = 'tab1'
    passwordIsValid = false
    fieldTextType: boolean
    constructor(
        private tokenStorage: TokenStorageService,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private notificacaoService: NotificacaoService,
        private cd: ChangeDetectorRef
    ) {
        this.Form = this.formBuilder.group({
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            phone: ['', Validators.required],
            img: [null],
            email: ['', Validators.required],
            password: ['', Validators.required],
        })

        this.formChangePwd = this.formBuilder.group(
            {
                oldPwd: ['', Validators.required /*this.shouldBeNewPwd*/],
                newPwd: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.maxLength(40),
                    ],
                ],
                confirmPwd: ['', Validators.required],
            },
            {
                validators: [this.matchPwd('newPwd', 'confirmPwd')],
            }
        )
    }

    get oldPwd() {
        return this.formChangePwd.get('oldPwd')
    }

    get newPwd() {
        return this.formChangePwd.get('newPwd')
    }

    get confirmPwd() {
        return this.formChangePwd.get('confirmPwd')
    }

    get f(): { [key: string]: AbstractControl } {
        return this.formChangePwd.controls
    }

    user = {
        email: this.tokenStorage.getUserEmail(),
    }

    ngOnInit() {
        this.Form.disable()
        this.getUser()
    }

    getUser() {
        this.userService.getUserByEmail(this.user).subscribe((res) => {
            this.currentUser = res.user

            if (this.currentUser.image) {
                this.avatar = this.currentUser.image.path
            } else {
                //https://ui-avatars.com/
                this.avatar = `https://ui-avatars.com/api/?background=random&name=${this.currentUser.firstname}+${this.currentUser.lastname}`
            }
        })
    }

    enableForm() {
        this.Form.enable()
    }

    cancel() {
        this.Form.disable()
    }
    onSelectFile(event) {
        // called each time file input changes
        let reader = new FileReader() // HTML5 FileReader API
        const file = (event.target as HTMLInputElement).files[0]
        reader.readAsDataURL(file) // read file as data url

        reader.onload = () => {
            // called once readAsDataURL is completed
            this.avatar = reader.result
            this.Form.patchValue({
                img: file,
            })
            this.Form.get('img').updateValueAndValidity()
        }
    }

    public saveChange(user, id) {
        const formData = new FormData()
        formData.append('firstname', this.Form.get('firstname').value)
        formData.append('lastname', this.Form.get('lastname').value)
        formData.append('phone', this.Form.get('phone').value)
        formData.append('email', this.Form.get('email').value)
        formData.append('image', this.Form.get('img').value)

        this.userService.update(formData, id).subscribe(
            (res) => {
                console.log(res)
                //this.Form.reset();
                this.ToasterSuccess(res.message)
                //location.reload()
            },
            (err) => {
                //this.errorData = err.error.errors

                this.ToasterError(err, 'Error', '')
            }
        )
        console.log(this.Form.value)
    }

    ToasterSuccess(message) {
        this.notificacaoService.showSuccess(message)
    }
    ToasterError(message, title, toastConfig) {
        this.notificacaoService.showError(message, title, toastConfig)
    }
    toggleFieldTextType() {
        this.fieldTextType = !this.fieldTextType
    }
    updatePwd(id) {
        this.userService.updatePwd(this.formChangePwd.value, id).subscribe(
            (res) => {
                this.formChangePwd.reset()
                this.ToasterSuccess(res.message)
            },
            (err) => {
                this.ToasterError(err, 'Error', '')
            }
        )
    }
    onReset(): void {
        this.formChangePwd.reset()
    }

    shouldBeNewPwd(control: AbstractControl): Promise<ValidationErrors | null> {
        return new Promise((resolve, reject) => {
            if (control.value !== '1234') resolve({ shouldBeNewPwd: true })
            else resolve(null)
        })
    }

    matchPwd(controlName: string, checkControlName: string): ValidatorFn {
        return (controls: AbstractControl) => {
            const control = controls.get(controlName)
            const checkControl = controls.get(checkControlName)

            if (checkControl.errors && !checkControl.errors.matching) {
                return null
            }

            if (control.value !== checkControl.value) {
                controls.get(checkControlName).setErrors({ matching: true })
                return { matching: true }
            } else {
                return null
            }
        }
    }
    passwordValid(event) {
        //https://github.com/uzochukwueddie/password-strength
        this.passwordIsValid = event
    }
}
