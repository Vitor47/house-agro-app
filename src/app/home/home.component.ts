import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import {
  NativeScriptFormsModule,
  NativeScriptRouterModule,
} from "@nativescript/angular";

import { PasswordRegx } from "../utils/validators";

@Component({
  selector: "ns-login",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
  standalone: true,
  imports: [
    NativeScriptRouterModule,
    ReactiveFormsModule,
    NativeScriptFormsModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SignInComponent {
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [
      Validators.required,
      Validators.pattern(PasswordRegx),
    ]),
  });

  get email() {
    return this.form.get("email");
  }

  get password() {
    return this.form.get("password");
  }

  onLogin() {
    if (this.form.valid) {
      return true;
    } else {
      this.form.markAllAsTouched();
    }
  }
}
