import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MultiResult, request } from "@nativescript-community/perms";
import {
  ActionBarComponent,
  NativeScriptFormsModule,
  NativeScriptRouterModule,
} from "@nativescript/angular";
import { CoreTypes, ImageSource } from "@nativescript/core";
import { firebase } from "@nativescript/firebase-core";
import * as geolocation from "@nativescript/geolocation";
import {
  CameraUpdate,
  GoogleMap,
  MapReadyEvent,
  MapView,
  Marker,
} from "@nativescript/google-maps";
import { GoogleMapsModule } from "@nativescript/google-maps/angular";
import { Observable } from "rxjs";

interface Cattle {
  id: number;
  name: string;
  lat: number;
  lng: number;
}
interface ChildEvent {
  type: "added" | "changed";
  data: Cattle;
}

const myObs = new Observable<ChildEvent>((subscriber) => {
  const add = firebase()
    .database()
    .ref("/cattles")
    .on("child_added", (data, previousKey) => {
      subscriber.next({
        type: "added",
        data: data.val(),
      });
    });
  const change = firebase()
    .database()
    .ref("/cattles")
    .on("child_changed", (data, previousKey) => {
      subscriber.next({
        type: "changed",
        data: data.val(),
      });
    });
  return () => {
    firebase().database().ref("/cattles").off("child_added", add);
    firebase().database().ref("/cattles").off("child_changed", change);
  };
});

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

  cattles = new Map<number, { cattle: Cattle; marker?: Marker }>();

  constructor() {
    myObs.subscribe((evt) => {
      const existing = this.cattles.get(evt.data.id);
      let cattleData = {
        ...existing,
        cattle: evt.data,
        marker: this.updateMarker(evt.data, existing?.marker),
      };

      this.cattles.set(evt.data.id, cattleData);
    });
  }

  async onMapReady(event) {
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
            for (const [key, value] of this.cattles.entries()) {
              this.cattles.set(key, {
                ...value,
                marker: this.updateMarker(value.cattle),
              });
            }
          });
      });
    }
  }
  cattleIcon = ImageSource.fromFileSync("~/assets/cattle.webp").resize(100);

  updateMarker(cattle: Cattle, existingMarker?: Marker) {
    if (existingMarker) {
      existingMarker.position = {
        lat: cattle.lat,
        lng: cattle.lng,
      };
      return existingMarker;
    }
    if (!this.map) {
      return null;
    }
    return this.map.addMarker({
      position: {
        lat: cattle.lat,
        lng: cattle.lng,
      },
      title: `${cattle.name}`,
      snippet: `Lat: ${cattle.lat}, Lng: ${cattle.lng}`,
      icon: this.cattleIcon,
    });
  }

  async onSearch(query: string) {
    if (query) {
      if (query) {
        const cattleFound = Array.from(this.cattles.values())
          .map((data) => data.cattle)
          .filter((cattle) =>
            cattle.name.toLowerCase().includes(query.toLowerCase())
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
