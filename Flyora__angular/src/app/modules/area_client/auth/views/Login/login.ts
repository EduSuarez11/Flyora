import { Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { IFormData } from '../../models/IFormData';

interface ILabelLogin {
  label: string;
  id: string;
  placeholder: string;

}

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private formDataModel = signal<IFormData>({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    repeatPassword: '',
    ageAndConditions: false,
    tokenRecaptcha: '',
  });

  labelsOfLogin: Array<ILabelLogin> = [
    { label: 'Correo electrónico', id: 'email', placeholder: 'tu@correo.com' },
    { label: 'Contraseña', id: 'password', placeholder: 'Introduce tu contraseña' }
  ];

  loginForm = form(this.formDataModel);

  SubmitForm(): void {
    console.log(this.formDataModel());
  }
}
