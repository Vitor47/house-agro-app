import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MultiResult, request } from "@nativescript-community/perms";
import {
  ActionBarComponent,
  NativeScriptFormsModule,
  NativeScriptRouterModule,
} from "@nativescript/angular";
import { CoreTypes, ImageSource } from "@nativescript/core";
import * as geolocation from "@nativescript/geolocation";
import {
  CameraUpdate,
  GoogleMap,
  MapReadyEvent,
  MapView,
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
  mapView: MapView;
  map: GoogleMap;

  cattles = [];

  public onMapReady(event) {
    const mapView = event.object;
    this.mapView = mapView;
  }

  async onReady(event: MapReadyEvent) {
    const map: GoogleMap = event.map;
    this.map = map;

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
                16
              )
            );

            this.cattles = [
              {
                id: 1,
                lat: currentLocation.latitude + 0.001,
                lng: currentLocation.longitude + 0.001,
              },
              {
                id: 2,
                lat: currentLocation.latitude + 0.002,
                lng: currentLocation.longitude - 0.001,
              },
              {
                id: 3,
                lat: currentLocation.latitude - 0.001,
                lng: currentLocation.longitude + 0.002,
              },
              {
                id: 4,
                lat: currentLocation.latitude - 0.002,
                lng: currentLocation.longitude - 0.002,
              },
              {
                id: 5,
                lat: currentLocation.latitude + 0.0015,
                lng: currentLocation.longitude - 0.0015,
              },
            ];

            let cattleIcon = ImageSource.fromFileSync("~/assets/cattle.webp");
            cattleIcon = cattleIcon.resize(100);

            this.cattles.forEach((cattle) => {
              map.addMarker({
                position: {
                  lat: cattle.lat,
                  lng: cattle.lng,
                },
                title: `Cattle ${cattle.id}`,
                snippet: `Lat: ${cattle.lat}, Lng: ${cattle.lng}`,
                icon: cattleIcon,
              });
            });
          });
      });
    }
  }

  async onSearch(query: string) {
    if (query) {
      if (query) {
        const cattleFound = this.cattles.filter((cattle) =>
          `Cattle ${cattle.id}`.toLowerCase().includes(query.toLowerCase())
        );

        if (cattleFound.length) {
          this.map.animateCamera(
            CameraUpdate.fromCoordinates(
              cattleFound.map((cattle) => ({
                lat: cattle.lat,
                lng: cattle.lng,
              })),
              16
            )
          );
        } else {
          console.log("Cattle não encontrado!");
        }
      }
    }
  }
}
