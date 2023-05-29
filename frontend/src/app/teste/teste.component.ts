//import { NgSwitch, NgSwitchCase } from '@angular/common'
import { Component, OnInit, VERSION } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NgxPermissionsService } from 'ngx-permissions'
import { User } from '../_model/user'
import { TokenStorageService } from '../_services/auth/token-storage.service'
import { UserService } from '../_services/user/user.service'
import { ClientService } from '../_services/client/client.service'
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ValidatorFn,
    Validators,
    FormArray
} from '@angular/forms'
import Stepper from 'bs-stepper'
@Component({
    selector: 'app-teste',
    templateUrl: './teste.component.html',
    styleUrls: ['./teste.component.css'],
})
export class TesteComponent{
    name = 'Angular 6';
  userForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: [],
      phones: this.fb.array([
        this.fb.control(null)
      ])
    })
  }

  iaddPhone(): void {
    (this.userForm.get('phones') as FormArray).push(
      this.fb.control(null)
    );
  }

  addPhone() {
    const phone = this.userForm.controls.phones as FormArray;
    phone.push(this.fb.group({
      tipo: '',
      numero: '',
    }));
  }

  removePhone(index) {
    (this.userForm.get('phones') as FormArray).removeAt(index);
  }

  getPhonesFormControls(): AbstractControl[] {
    return (<FormArray> this.userForm.get('phones')).controls
  }

  send(values) {
    console.log(values);
  }
}
