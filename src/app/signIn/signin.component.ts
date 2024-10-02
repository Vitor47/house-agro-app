import { Component, inject, NO_ERRORS_SCHEMA, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import {
  ActionBarComponent,
  NativeScriptFormsModule,
  NativeScriptRouterModule,
  RouterExtensions,
} from "@nativescript/angular";

import { UserService } from "../services/user.service";

import { Toasty } from "@triniwiz/nativescript-toasty";

@Component({
  selector: "ns-login",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
  standalone: true,
  imports: [
    NativeScriptRouterModule,
    ReactiveFormsModule,
    NativeScriptFormsModule,
    ActionBarComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SignInComponent {
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
  });

  private router = inject(RouterExtensions);

  private user = inject(UserService);

  get email() {
    return this.form.get("email");
  }

  get password() {
    return this.form.get("password");
  }

  isLogin = signal(false);
  isError = signal(false);

  async onLogin() {
    if (this.form.valid) {
      this.isLogin.set(true);

      try {
        await this.user.Login(this.email.value, this.password.value);

        this.router.navigate(["/home"], { clearHistory: true });
      } catch (error) {
        const toast = new Toasty({ text: String(error) });
        toast.show();
      } finally {
        this.isLogin.set(false);
      }
    } else {
      this.form.markAllAsTouched();
    }
  }
}
