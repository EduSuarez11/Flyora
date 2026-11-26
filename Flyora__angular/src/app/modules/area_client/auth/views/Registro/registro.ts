import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { email, FieldTree, form, FormField, maxLength, minLength, required, TreeValidationResult, validate, FormRoot } from '@angular/forms/signals';
import { IFormData } from '../../models/IFormData';
import { AuthService } from '../../controllers/services/AuthService';
import { StorageGlobal } from '../../../../_shared_/controllers/services/StorageGlobal';

interface IValidatePassword {
  minuscula: boolean;
  mayuscula: boolean;
  digito: boolean;
  simbolo: boolean;
}

@Component({
  selector: 'app-registro',
  imports: [FormField, FormRoot],
  templateUrl: './registro.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './registro.css',
})
export class Registro {
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

  registerForm = form(this.formDataModel, (schema) => {
    required(schema.nombre, { message: 'El nombre es obligatorio.' });
    minLength(schema.nombre, 3, { message: 'El nombre debe tener al menos 3 caracteres.' });
    maxLength(schema.nombre, 30, { message: 'El nombre no puede superar los 30 caracteres.' });

    required(schema.apellidos, { message: 'Los apellidos son obligatorios.' });
    minLength(schema.apellidos, 10, { message: 'Los apellidos deben tener al menos 10 caracteres.' });
    maxLength(schema.apellidos, 50, { message: 'Los apellidos no pueden superar los 50 caracteres.' });

    required(schema.email, { message: 'El correo electrónico es obligatorio.' });
    email(schema.email, { message: 'Introduce un correo electrónico válido.' });
    minLength(schema.email, 5, { message: 'Debe tener al menos 5 caracteres.' });
    maxLength(schema.email, 50, { message: 'No puede superar los 50 caracteres.' });

    required(schema.password, { message: 'La contraseña es obligatoria.' });
    minLength(schema.password, 8, { message: 'Debe tener al menos 8 caracteres.' });
    validate(schema.password, ({ value }) => {
      const password = value();

      if (!password) return null;

      const validatePassword: IValidatePassword = {
        mayuscula: /[A-Z]/.test(password),
        minuscula: /[a-z]/.test(password),
        digito: /[0-9]/.test(password),
        simbolo: /[^A-Za-z0-9]/.test(password)
      }

      if (validatePassword.mayuscula && validatePassword.minuscula && validatePassword.digito && validatePassword.simbolo) {
        return null;
      } else {
        let error = '';
        Object.keys(validatePassword)
          .forEach(
            (key: string) => {
              if (!validatePassword[key as keyof IValidatePassword]) {
                error += `La contraseña no contiene ${key}|`;
              }
            }
          );

        return { kind: 'errorValidatePassword', message: error }
      }
    });

    required(schema.ageAndConditions, { message: 'Debes confirmar que eres mayor de edad.' });
  },
    {
      submission: {
        action: async (
          field: FieldTree<IFormData, string | number>,
          detail: {
            root: FieldTree<IFormData, string | number>;
            submitted: FieldTree<unknown, string | number>
          }
        ): Promise<TreeValidationResult> => {
          const {code, message, data} = await this.authService.requestToAuth('Register', {formData: detail.root});
          if (code === 0) {
            // TODO email para activar cuenta
            
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
          field.nombre().markAsTouched();
          field.apellidos().markAsTouched();
          field.email().markAsTouched();
          field.password().markAsTouched();
          field.repeatPassword().markAsTouched();
          field.ageAndConditions().markAsTouched();
        }
      }
    }
  );
}
