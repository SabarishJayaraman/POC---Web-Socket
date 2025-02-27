import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LiveUpdatesComponent } from "./live-updates/live-updates.component";
import { FlightTrackerComponent } from "./flight-tracker/flight-tracker.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LiveUpdatesComponent, FlightTrackerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'web-socket-client';
}
