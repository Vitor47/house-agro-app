import { Injectable } from "@angular/core";

import "@nativescript/firebase-auth";
import { firebase } from "@nativescript/firebase-core";

@Injectable({
  providedIn: "root",
})
export class UserService {
  async Login(email: string, password: string) {
    await firebase().auth().signInWithEmailAndPassword(email, password);
    return true;
  }

  isLogin() {
    return !!firebase().auth().currentUser;
  }
}
