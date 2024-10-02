import {
  platformNativeScript,
  runNativeScriptAngularApp,
} from "@nativescript/angular";

import { firebase } from "@nativescript/firebase-core";

import { AppModule } from "./app/app.module";

firebase().initializeApp();

runNativeScriptAngularApp({
  appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule),
});
