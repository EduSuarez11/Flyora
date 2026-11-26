import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { form, FormField, FieldTree, TreeValidationResult, SchemaPathTree, required } from '@angular/forms/signals';
import { IFormData } from '../../models/IFormData';
import { AuthService } from '../../controllers/services/AuthService';
import { StorageGlobal } from '../../../../_shared_/controllers/services/StorageGlobal';

interface ILabelLogin {
  label: string;
  id: string;
  placeholder: string;
}

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private storeGlobal = inject(StorageGlobal);
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
    { label: 'Contraseña', id: 'password', placeholder: 'Introduce tu contraseña' },
  ];

  loginForm = form(this.formDataModel, (schema: SchemaPathTree<IFormData>) => {
    required(schema.email, {message: 'El email es obligatorio.'});
    required(schema.password, {message: 'La contraseña es obligatoria.'});
  }, {
    submission: {
      action: async (
        field: FieldTree<IFormData, string | number>,
        detail: {
          root: FieldTree<IFormData, string | number>;
          submitted: FieldTree<unknown, string | number>
        }
      ): Promise<TreeValidationResult> => {
        const { code, message, data } = await this.authService.requestToAuth('Login', { formData: detail.root });
        if (code === 0) {
          this.storeGlobal.LoginSession(true);
          this.storeGlobal.SetDataClient(data.client);
          this.storeGlobal.SetTokens({ accessToken: data.tokens.accessToken, refreshToken: data.tokens.refreshToken });
          field().reset();
          return null;
        } else {
          return { kind: 'RegisterErrorAPI', message }
        }
      },
      onInvalid(
        field: FieldTree<IFormData, string | number>,
        detail: { root: FieldTree<IFormData, string | number>, submitted: FieldTree<unknown, string | number> }
      ) {
        field.email().markAsTouched();
        field.password().markAsTouched();
      }
    }
  });

  SubmitForm(): void {
    console.log(this.formDataModel());
  }
}
