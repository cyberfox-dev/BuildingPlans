import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-google-maps-component',
  templateUrl: './google-maps-component.component.html',
  styleUrls: ['./google-maps-component.component.css']
})
export class GoogleMapsComponentComponent implements OnInit {

  enteredAddress: any;
  latitude: any;
  longitude: any;
  markers:any= [];
  content: any;
  position: any;
  markerAdded: boolean = false;
  infoContent = '';

  @Output() markerDblclick: EventEmitter<void> = new EventEmitter();

  onMarkerDblClick() {
    this.markerDblclick.emit();
  }

  //I hope this is the covers the Msunduzi Municipality districts
  @ViewChild("placesRef") placesRef: GooglePlaceDirective | undefined;
  readonly southwest = { lat: -29.730694, lng: 30.169144 };
  readonly southeast = { lat: -29.730694, lng: 30.602760 };
  readonly northeast = { lat: -29.469492, lng: 30.602760 };
  readonly northwest = { lat: -29.469492, lng: 30.169144 };

  readonly bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds(this.southwest, this.northeast); // Create a LatLngBounds object

  options = {
    types: [],
    componentRestrictions: {
      country: 'ZA',
    },
    disableDoubleClickZoom: true,
    bounds: this.bounds, // Set the bounds property - doesn't seem to be working
  } as unknown as Options;

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;

  @ViewChild('searchDiv', { static: true }) private searchDivEl!: ElementRef;
  @ViewChild('coordinateTextX', { static: true }) public coordinateTextXEl!: ElementRef;
  @ViewChild('coordinateTextY', { static: true }) public coordinateTextYEl!: ElementRef;
  @ViewChild('coordinateSearchBtn', { static: true }) public coordinateSearchBtnEl!: ElementRef;
  constructor(private sharedService: SharedService) {
  
  }
  center: google.maps.LatLngLiteral = {
    lat: -29.6182639,
    lng: 30.3795833
  };
  zoom = 12;

  mapOptions = {
    center: this.center,
    zoom: this.zoom,
    disableDoubleClickZoom: true,
  };

  initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -29.6182639, lng: 30.3795833 },
      zoom: 8
    });
  }

  ngOnInit(): void {
    //this.initMap();
    
  }
  ngAfterViewInit() {
    if (this.map) {
      this.map.options = this.mapOptions;
    } 
  }
  display: any;


  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }
  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }


async handleAddressChange(address: Address) {
  // Update the address input
  debugger;
  this.enteredAddress = address.formatted_address;
  this.sharedService.mapAddress = this.enteredAddress;
    // Update the coordinates textboxes
    const xCoordinate = <HTMLInputElement>document.getElementById('coordinateTextX');
    const yCoordinate = <HTMLInputElement>document.getElementById('coordinateTextY');

    if (xCoordinate && yCoordinate) {
      if (address.geometry) {
        const x = address.geometry.location.lng(); // Assuming Google Maps API format
        const y = address.geometry.location.lat(); // Assuming Google Maps API format

        xCoordinate.value = x.toString();
        yCoordinate.value = y.toString();

        this.latitude = y;
        this.longitude = x;

        this.sharedService.latitude = y.toString();
        this.sharedService.longitude = x.toString();

        // Create a new marker at the specified location
        const textBoxMarker = new google.maps.Marker({
          position: { lat: y, lng: x },
          animation: google.maps.Animation.BOUNCE,
          title: this.enteredAddress,
          draggable: true
        });
        this.markers.push(textBoxMarker);

        this.map.panTo(textBoxMarker.getPosition());
        this.markerAdded = true;


        google.maps.event.addListener(textBoxMarker, 'dblclick', () => {
          console.log('Double-clicked the marker');
          textBoxMarker.setMap(null);
          this.markers = [];
          this.markerAdded = false;
        })
      } else {
        xCoordinate.value = '';
        yCoordinate.value = '';
      }
    }
  }



 async addMarkerOnDblClick(event: google.maps.MapMouseEvent) {
    if (!this.markerAdded) {
      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      
      const locationName = await this.getLocationName(position);

      if (locationName) {

        this.latitude = position.lat;
        this.longitude = position.lng;

        this.sharedService.mapAddress = locationName;
        this.sharedService.longitude = this.longitude;
        this.sharedService.latitude = this.latitude;
        const newMarker = new google.maps.Marker({
          position,
          animation: google.maps.Animation.BOUNCE,
          title: locationName, // Set the marker's title to the location name
          draggable: true,
          clickable: true
        });

       
        this.markers.push(newMarker);
        this.enteredAddress = locationName;
        this.markerAdded = true; // Set markerAdded to true to prevent adding more markers

        //newMarker.addListener('dblclick', () => {
        //  newMarker.setMap(null);
        //  this.markers = [];
        //  this.markers = this.markers.filter(marker => marker !== newMarker);
        //  this.markerAdded = false;
        //});

        google.maps.event.addListener(newMarker, 'click', function () {
          newMarker.setMap(null); // Remove the marker from the map
        });

        

   

      }
    } else {
      // Handle the case where you don't want to add more markers
    }
  }

  removeMarker(marker: google.maps.Marker) {
    this.markers.pop(marker);
    this.markers = [];
    this.markerAdded = false;
    this.latitude = '';
    this.longitude = '';
    this.enteredAddress = '';
  }

  getLocationName(latLng: google.maps.LatLngLiteral): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
     
      geocoder.geocode({ location: latLng }, (results, status) => {
        
        if (status === google.maps.GeocoderStatus.OK) {
      
          if (results[0]) {
           
            const locationName = results[0].formatted_address;
            resolve(locationName);
            
          } else {
            resolve(null); // No results found
          }
        } else {
          reject(status);
        }
      });
    });
  }

}

