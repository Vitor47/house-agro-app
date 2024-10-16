import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MultiResult, request } from "@nativescript-community/perms";
import {
  ActionBarComponent,
  NativeScriptFormsModule,
  NativeScriptRouterModule,
} from "@nativescript/angular";
import { CoreTypes } from "@nativescript/core";
import * as geolocation from "@nativescript/geolocation";
import {
  CameraUpdate,
  GoogleMap,
  MapReadyEvent,
} from "@nativescript/google-maps";
import { GoogleMapsModule } from "@nativescript/google-maps/angular";

@Component({
  selector: "ns-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  standalone: true,
  imports: [
    NativeScriptRouterModule,
    ReactiveFormsModule,
    NativeScriptFormsModule,
    ActionBarComponent,
    GoogleMapsModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HomeComponent {
  async onReady(event: MapReadyEvent) {
    const map: GoogleMap = event.map;

    const response = (await request("location", {
      type: "always",
    })) as unknown as MultiResult;
    if (response["android.permission.ACCESS_COARSE_LOCATION"] == "authorized") {
      map.myLocationEnabled = true;
      map.uiSettings.myLocationButtonEnabled = true;

      geolocation.enableLocationRequest().then(() => {
        geolocation
          .getCurrentLocation({
            desiredAccuracy: CoreTypes.Accuracy.high,
            maximumAge: 5000,
            timeout: 20000,
          })
          .then((currentLocation) => {
            map.animateCamera(
              CameraUpdate.fromCoordinate(
                {
                  lat: currentLocation.latitude,
                  lng: currentLocation.longitude,
                },
                40
              )
            );
          });
      });
    }
  }
}
