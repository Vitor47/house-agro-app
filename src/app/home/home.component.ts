import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ReactiveFormsModule
} from "@angular/forms";

import {
  NativeScriptFormsModule,
  NativeScriptRouterModule,
} from "@nativescript/angular";


@Component({
  selector: "ns-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  standalone: true,
  imports: [
    NativeScriptRouterModule,
    ReactiveFormsModule,
    NativeScriptFormsModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HomeComponent {}
