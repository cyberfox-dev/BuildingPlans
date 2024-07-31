import { Component, Inject, OnInit, ElementRef, OnDestroy, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { watch, whenFalse, whenTrue } from '@arcgis/core/core/watchUtils';
import Graphic from '@arcgis/core/Graphic';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Map from '@arcgis/core/Map';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import MapView from '@arcgis/core/views/MapView';
import FeatureTable from '@arcgis/core/widgets/FeatureTable';
import LayerList from '@arcgis/core/widgets/LayerList';
import Locate from '@arcgis/core/widgets/Locate';
import Search from '@arcgis/core/widgets/Search';
/*import { TranslateService } from '@ngx-translate/core';*/
import Sketch from '@arcgis/core/widgets/Sketch';
/*import { ARCGIS_CONFIG, ArcgisConfig } from '../arcgis';*/
/*import { DeviceDetectorService } from 'ngx-device-detector';*/
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import Legend from '@arcgis/core/widgets/Legend';
import Editor from '@arcgis/core/widgets/Editor';
import EditorViewModel from '@arcgis/core/widgets/Editor';
import FeatureFormViewModel from '@arcgis/core/widgets/Editor';
import WebMap from '@arcgis/core/WebMap';
import FormTemplate from "@arcgis/core/form/FormTemplate";
import * as esri from 'esri-leaflet';
import Layer from "@arcgis/core/layers/Layer"
import Draw from '@arcgis/core/views/draw/Draw';
import { Extent, Point, Polygon, Polyline } from '@arcgis/core/geometry';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import * as Geometry from '@arcgis/core/geometry/Geometry';
import FeatureForm from '@arcgis/core/widgets/FeatureForm';
import FeatureTemplates from '@arcgis/core/widgets/FeatureTemplates';
import ExpressionInfo from '@arcgis/core/form/ExpressionInfo';
import FieldElement from '@arcgis/core/form/elements/FieldElement';
import BasemapToggle from '@arcgis/core/widgets/BasemapToggle';
import { SharedService } from "src/app/shared/shared.service"
import Query from '@arcgis/core/rest/support/Query';
import * as SearchSource from '@arcgis/core/widgets/Search/SearchSource';
import { useAnimation } from '@angular/animations';
import { DepartmentConfigComponent } from "src/app/department-config/department-config.component";
import { ZonesService } from "src/app/service/Zones/zones.service"
import { ActionCenterComponent } from "src/app/action-center/action-center.component";
import { SubDepartmentForCommentService } from "src/app/service/SubDepartmentForComment/sub-department-for-comment.service"
import { ZoneForCommentService } from "src/app/service/ZoneForComment/zone-for-comment.service"
import Fullscreen from '@arcgis/core/widgets/Fullscreen';
import LabelClass from '@arcgis/core/layers/support/LabelClass';
import { NotificationsService } from 'src/app/service/Notifications/notifications.service';
import Popup from '@arcgis/core/widgets/Popup';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import { locationToAddress } from '@arcgis/core/rest/locator';
import Task from '@arcgis/core/tasks/Task';
import { MapService } from 'src/app/service/Map/map.service';
import * as watchUtils from '@arcgis/core/core/watchUtils';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';

//Physical address of project Kyle 16/01/24
import { NewWayleaveComponent } from "src/app/create-new-wayleave/new-wayleave/new-wayleave.component";
//Physical address of project Kyle 16/01/24

//import * as FeatureLayerView from 'esri/views/layers/FeatureLayerView';

/*import { Editor, EditorViewModel, FeatureFormViewModel } from "@arcgis/core/widgets/Editor";*/
/*import * as FeatureForm from 'esri/widgets/FeatureForm';*/
/*import { Map, FeatureLayer, Polygon, Graphic, geometryEngine, SimpleFillSymbol } from "@arcgis/core";*/
/*import { description } from 'esri/layers/support/VoxelVariable';*/
/*import * as FieldElement from '@arcgis/core/form/elements/FieldElement';*/
/*import LayerInfos from '@arcgis/core/widgets/Editor'*/

/*import HHelpers from '../helpers';*/
//import { Injectable } from '@angular/core';

//@Injectable({
//  providedIn: 'root'
//})

interface Element {
  type: "field";
  fieldName: string;
  label: string;
}

interface GeometryInterface {
  type: String,
  rings: [[number, number], [number, number], [number, number], [number, number], [number, number]],
};

interface GraphicInterface {
  geometry: GeometryInterface,
  symbol: SimpleFillSymbol,
};

interface ElementPropertiesInterface {
  type: "field",
  fieldName: string,
  label: string,
  description: string,
  visibilityExpression: string,

};

interface FormTemplateInterface {
  title: string,
  description: string,
  elements: Element[],
  clone?: any,
  expressionInfos?: any,
  preserveFieldValuesWhenHidden?: boolean

};


interface LayerInfo {
  layer: FeatureLayer;
  formTemplate: FormTemplate;
  enabled?: boolean;
  addEnabled?: boolean;
  updateEnabled?: boolean;
  deleteEnabled?: boolean;
  attributeUpdatesEnabled?: boolean;
  geometryUpdatesEnabled?: boolean;
}

export interface ZoneList {
  zoneID: number;
  zoneName: string;
  departmentID: number;
  subDepartmentID: number;
  mapObjectID: number;
}

export interface ConfigList {
  configID: number,
  configName: string,
  configDescription: string,
  dateCreated: Date,
  dateUpdated: Date,
  createdById: string,
  isActive: boolean,
  utilitySlot1: string,
  utilitySlot2: string,
  utilitySlot3: string,
}
//export interface DistributionList {

//  directorate: string;
//  email: string;
//  fullName: string;
//  mapObjectID: number;
//  subDepartmentID: number;
//  subDepartmentName: string;
//  userID: string;
//  zoneID: number;
//  zoneName: string;

//}

@Component({
  selector: 'app-project-details-map',
  templateUrl: './project-details-map.component.html',
  styleUrls: ['./project-details-map.component.css']
})
export class ProjectDetailsMapComponent implements OnInit {
  /*  @Input() data: string; //retrieves this data from the parent component*/
  @Input() data: any; //retrieves this data from the parent component

  constructor(
    public sharedService: SharedService,
    private departmentConfigComponent: DepartmentConfigComponent,
    private zonesService: ZonesService,
    private actionCenterComponent: ActionCenterComponent,
    private subDepartmentForCommentService: SubDepartmentForCommentService,
    private zoneForCommentService: ZoneForCommentService,
    private notificationsService: NotificationsService,
    private mapService: MapService,

    //Physical address of project Kyle 16/01/24
    private newWayleaveComponent : NewWayleaveComponent,
     //Physical address of project Kyle 16/01/24

    /*    private query: Query,*/
    /*        @Inject(ARCGIS_CONFIG) private config: ArcgisConfig,*/
    //private deviceService: DeviceDetectorService,
    //  private translate: TranslateService,
  ) { /*this.helper = new HHelpers()*/ }

  /*  This binds the element to the component's element. Without this, when the index page is rendered, the viewMap element does not exist*/
  @ViewChild('viewDiv', { static: true }) private viewDivEl!: ElementRef;
  //@ViewChild('formDiv', { static: true }) private formDivEl!: ElementRef;
  //@ViewChild('addTemplatesDiv', { static: true }) private addTemplatesDivEl!: ElementRef;
  //@ViewChild('peopelTableDiv', { static: true }) private peopleTableDivEl!: ElementRef;
  //@ViewChild('languageTableDiv', { static: true }) private languageTableDivEl!: ElementRef;
  @ViewChild('searchDiv', { static: true }) private searchDivEl!: ElementRef;
  @ViewChild('coordinateTextX', { static: true }) public coordinateTextXEl!: ElementRef;
  @ViewChild('coordinateTextY', { static: true }) public coordinateTextYEl!: ElementRef;
  @ViewChild('coordinateSearchBtn', { static: true }) public coordinateSearchBtnEl!: ElementRef;
  private helper: any;
  public view!: MapView;
  public slideToggleScript: string = 'Show Feature Table';
  public isChecked: boolean = false;
  public isLoading = false;
  public loadingText: string;
  public loadingTime: number;

  //For maps
  isLoading2: boolean = false;
  /*  private isMobile: boolean = this.deviceService.isMobile();*/
  private map!: Map;
  private pointPeopleLayer!: FeatureLayer;
  private pointLanguageLayer!: FeatureLayer;
  private pollyPeopleLayer!: FeatureLayer;
  private pollyLanguageLayer!: FeatureLayer;
  private pntpplnCtryLayer!: FeatureLayer;
  private locateWidget!: Locate;
  private position!: number[];
  private peopleTable!: FeatureTable;
  private languageTable!: FeatureTable;
  private layerList!: LayerList;
  private oldGraphics: any;
  private defaultZoom: number = 6;
  private assignTo: string = "";
  ZoneList: ZoneList[] = [];
  Zone: ZoneList;
  AllConfig: ConfigList[] = [];
  MapConfig: ConfigList[] = [];
  ServerType: string;
  /*  zoneAdminUsers: any;*/
  /*  DistributionList: DistributionList[] = []*/


  stringifiedData: any;
  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;

  //MapURLs
  featureServerEditURL: string;
  zonesURL: string;
  infrustructureURL: string;
  searchERFURL: string;
  featureServerLineEditURL: string;

  loadingStartTime = 0; // Variable to store the start time for the main operation
  loadingTimer = null; // Variable to store the timer for the main operation
  takingTooLong = "";
  //public isActive: string = "1";
  //public applicationID: string = "1";

  // This is to manage the buffer for each drawn polygon and line.
  //addedFeatures: Graphic[] = []; // Array to store original polygon graphics
  //bufferedGraphics: Graphic[] = []; // Array to store buffer graphics

  //  createdByID: string;

  /*  public createdByID: string = "123344";*/

  ngOnInit(): void {
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);

    this.positionAndMapLoad();
    let editConfigCrimeLayer, editConfigPoliceLayer;
    this.departmentConfigComponent.getAllSubDepartments();

    this.sharedService.distributionList.splice(0, this.sharedService.distributionList.length);
    this.sharedService.totalAddedFeatures = 0;
    this.AllConfig = this.sharedService.getAllConfig();
    this.mapURLLoader();


  }

  private async positionAndMapLoad() {
    if (this.data.applicationID != null || this.data.applicationID != undefined || this.data.applicationID != "") {
      this.data.applicationID = this.sharedService.getApplicationID();
    } else {
    }
    await this.setPosition();
    await this.initializeMap();
  }

  //returntotalAddedFeatures(): number {
  //  return this.totalAddedFeatures;
  //}

  //private initializeData(): string {
  //  /*  this.sharedService.getApplicationID()*/
  ////Convert the local storage JSON data to an array object
  //this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
  ////Local storage userID
  //this.CurrentUser = JSON.parse(this.stringifiedData);
  //  this.createdByID = this.CurrentUser.appUserId;

  //  console.log("get Data ven " + this.createdByID + this.data)
  //  return this.createdByID;
  //}

  private async initializeMap(): Promise<any> {
    console.log("ApplicationID " + this.data.applicationID)
    console.log(this.sharedService.getApplicationID())
    console.log("IsActive " + this.data.isActive)
    console.log("CreatedByID " + this.data.createdByID)

    /*    const graphicsLayer = new GraphicsLayer();*/
    var pointLayer = new FeatureLayer;
    var lineLayer = new FeatureLayer;
    var polygonLayer = new FeatureLayer;

    //this.pntpplnCtryLayer = new FeatureLayer({
    //  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer",
    //  id: 'pntpplnCtryLayer',
    //  outFields: ['OBJECTID', ...this.helper.outfields['pntpplnCtryLayer']],
    //});

    //this.pointLanguageLayer = new FeatureLayer({
    //  url: this.config.pntlangFeatureServer,
    //  id: 'pntlangLayer',
    //  title: this.getTranslation('Common_Languages'),
    //  outFields: ['OBJECTID', ...this.helper.outfields['pointLanguageLayer']],
    //  opacity: 0.8,
    //  popupTemplate: popupLang,
    //  visible: false
    //});

    //this.pollyPeopleLayer = new FeatureLayer({
    //  url: this.config.peidFeatureServer,
    //  id: 'pollyPeopleLayer',
    //  title: 'People Geo',
    //  outFields: ['PEID'],
    //  opacity: 0.01,
    //  listMode: 'hide'
    //});

    //this.pollyLanguageLayer = new FeatureLayer({
    //  url: this.config.languageFeatureServer,
    //  id: 'pollyLanguageLayer',
    //  title: 'Language Geo',
    //  outFields: ['langCd'],
    //  listMode: 'hide',
    //  opacity: 0.01
    //});

    const map = new Map({
      basemap: 'hybrid',
      /*      layers: [graphicsLayer]*/
      /*      layers: [pointLayer, lineLayer, polygonLayer]*/

    });

    //const map = new WebMap({
    //  portalItem: {
    //    id: "459a495fc16d4d4caa35e92e895694c8"
    //  }
    //});

    // Create the search source configuration for Cape Town, South Africa
    //Use this tool to verify boundaries: http://bboxfinder.com ymin,xmin,ymax,xmax
    const theExtent = new Extent({
      /*      Cape Town*/
      ymin: -29.708332,
      xmin: 30.224762,
      ymax: -29.510135,
      xmax: 30.491180,

      //Western Cape
      //ymin: -34.867905,
      //xmin: 17.314453,
      //ymax: -30.391830,
      //xmax: 24.268799,
    });

    const view = new MapView({
      container: this.viewDivEl.nativeElement,
      map: map,
      extent: theExtent,
      zoom: 5,
      center: [30.3928, -29.6168], // Pietermaritzburg, South Africa coordinates. This is the center of the boundary
      /*      center: this.position,*/
      //Hides the zoom buttons
      ui: {
        components: ["attribution"]
      }
    });

    // Toggle basemap
    const toggle = new BasemapToggle({
      // 2 - Set properties
      view: view, // view that provides access to the map's 'topo-vector' basemap
      nextBasemap: "gray-vector" // allows for toggling to the 'hybrid' basemap
    });

    view.ui.add(toggle, "bottom-right");
    //view.when(() => {
    //  const sketch = new Sketch({
    //    layer: graphicsLayer,
    //    view: view,
    //    // graphic will be selected as soon as it is created
    //    creationMode: "update"
    //  });

    //  view.ui.add(sketch, "top-right");

    //});

    //const view = new MapView({
    //  container,
    //  map,
    //  zoom: this.defaultZoom,
    //  center: this.position
    //});

    // Create a GraphicsLayer to add the search result point
    const sketchGraphicsLayer = new GraphicsLayer();
    sketchGraphicsLayer.title = "Sketch"

    map.add(sketchGraphicsLayer);

    // Create a GraphicsLayer to add the search result point
    const graphicsLayer = new GraphicsLayer();
    graphicsLayer.title = "Co-ordinate result"

    // Create a Popup Instance
    const customPopup = new Popup({
      content: "Latitude: {latitude}<br>Longitude: {longitude}",
      /*      visible: true, // Set to true when showing,*/
      title: "Coordinate Search Result",
    });
    //view.ui.add(customPopup); // Add popup to the view's UI

    // Handle the custom search button click
    const coordinateSearchBtn = this.coordinateSearchBtnEl.nativeElement;
    const elementx = this.coordinateTextXEl.nativeElement;
    const elementy = this.coordinateTextYEl.nativeElement;

    coordinateSearchBtn.addEventListener("click", () => {
      const x = elementx.value;
      const y = elementy.value;
      /*const [x, y] = coordinateTextX.split(",");*/
      //const x = coordinateTextX.split(",");
      //const y = coordinateTextY.split(",");

      if (x && y) {
        const point = new Point({
          longitude: parseFloat(x),
          latitude: parseFloat(y),
          spatialReference: view.spatialReference
        });

        map.add(graphicsLayer);

        const symbol = new SimpleMarkerSymbol({

          /*          type: "simple-marker",*/
          style: "circle", // or "square", "diamond", etc., depending on your preferred style
          color: [255, 0, 0], // Red color, change the RGB values to the desired color
          size: "12px", // Size of the symbol
          outline: {
            color: [0, 0, 0], // Color of the outline
            width: 1 // Width of the outline
          }
        });

        graphicsLayer.removeAll();
        graphicsLayer.add(new Graphic({
          geometry: point,
          symbol: symbol

        }));


        //customPopup.viewModel.content = {
        //  latitude: parseFloat(y),
        //  longitude: parseFloat(x)
        //};

        customPopup.open({
          location: point, // Display the popup at the searched point
          shouldFocus: true
        });

        view.goTo(point); // Center the view on the searched point
        view.zoom = 20
        this.sharedService.setCoordinateData(x + "," + y);

      }

    });



    const searchExtent = {
      geometry: theExtent
    };

    const sources = [{
      url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
      name: 'Cape Town, South Africa',
      placeholder: "Search Cape Town",
      /*      maxResults: 3,*/
      filter: searchExtent,
      location: view.center
    }, {
      layer: new FeatureLayer({
        url: this.searchERFURL,
        outFields: ["*"]
      }),
      placeholder: "Find ERF",
      suggestionsEnabled: true,
      searchFields: ["PRTY_NMBR"],
      displayField: "PRTY_NMBR",
      /*        exactMatch: false,*/
      outFields: ["*"],
      name: "ERF",
      filter: searchExtent,
      /*     maxResults: 3,*/
      location: view.center // Set the location to the center of the view
    }];

    //Remove default search source: https://community.esri.com/t5/developers-questions/disable-quot-arcgis-world-grocoding-quot-in-search/m-p/806620#M5367
    const searchWidget = new Search({
      view: view,
      popupEnabled: true,
      locationEnabled: false,
      resultGraphicEnabled: true,
      container: this.searchDivEl.nativeElement,
      sources: sources,
     
      /*      activeSourceIndex: 1, //for some odd reasons, index 0 contains a source already.*/
      includeDefaultSources: false,
      allPlaceholder: "Find address or ERF"
    });

    searchWidget.on('select-result', (event) => {
      /*      this.view.zoom = this.defaultZoom;*/
      console.log("The selected search result: ", event.result.name);
      this.sharedService.setAddressData(event.result.name)
    });
    view.ui.add(searchWidget, {
      position: 'top-left',
      index: 1,
    });

    this.view = view;
    this.map = map;

    //this.view.constraints = {
    //  rotationEnabled: false,
    //  minZoom: 10,
    //  maxZoom: 0
    //};
    //this.locateWidget = new Locate({
    //  view: view,
    //});
    //this.locateWidget.on('locate', () => {
    //  this.view.zoom = this.defaultZoom;
    //});

    //if (this.isMobile) {
    //  this.view.popup.collapseEnabled = false;
    //  this.view.ui.remove('zoom');
    //  this.view.ui.add(this.locateWidget, 'bottom-right');
    //} else {
    //  this.view.popup.dockEnabled = true;
    //  this.view.popup.dockOptions = {
    //    position: 'bottom-right',
    //    buttonEnabled: false,
    //    breakpoint: false
    //  }
    //  this.view.ui.add(this.locateWidget, 'top-left');
    //}

    const featureLayer = new FeatureLayer({
      url: this.featureServerEditURL,
      title: "Wayleaves edit layer",
      /*        definitionExpression: "OBJECTID = 1"*/
      /*            definitionExpression: "CRTD_BY_ID = 777"*/
      /*      definitionExpression: "CRTD_BY_ID = '22ee5b58-db0e-4774-8245-bf7b59670e44'",*/
      definitionExpression: "WLMS_APLC_KEY = '" + this.data.applicationID + "'"
    });

    const featureLayerLine = new FeatureLayer({
      url: this.featureServerLineEditURL,
      title: "Wayleaves edit layer",
      /*        definitionExpression: "OBJECTID = 1"*/
      /*            definitionExpression: "CRTD_BY_ID = 777"*/
      /*      definitionExpression: "CRTD_BY_ID = '22ee5b58-db0e-4774-8245-bf7b59670e44'",*/
      definitionExpression: "WLMS_APLC_KEY = '" + this.data.applicationID + "'"
    });

    const elementOne: ElementPropertiesInterface = {
      type: "field",
      fieldName: "cREATED_bYid",
      label: "Choose incident type",
      description: 'none',
      visibilityExpression: '',
    }

    const polyOne: FormTemplateInterface = {
      title: "El Paso Trails",
      description: "Collect info on popular trails",
      elements: [elementOne],

    }

    //featureLayer.formTemplate = {
    //  title: "El Paso Trails",
    //  description: "Collect info on popular trails",
    //  elements: [elementOne],
    //  expressionInfos: '',
    //  preserveFieldValuesWhenHidden: true
    //}



    //    const elementTwo: ElementPropertiesInterface = {
    //      type: "field",
    //      fieldName: "WLMS_APLC_KEY",
    //      label: "Choose incident type",
    //    }

    //    //const templates = new FeatureTemplates({
    //    //  container: this.viewDivEl.nativeElement,
    //    //  layers: [featureLayer]
    ////    });

    //    const featureForm = new FeatureForm({
    //      view: view, // required if using Arcade expressions using the $map global variable
    ///*      container: "formDiv",*/
    //      container: this.viewDivEl.nativeElement,
    //      layer: featureLayer,
    //      formTemplate: {
    //        title: "Enter the incident number",
    //        elements: [
    //          elementOne,
    //          elementTwo
    //        ]
    //      }
    //    });


    //const polygon = new Polygon({
    //  rings: [[[-117, 32], [-116, 32], [-116, 33], [-117, 33], [-117, 32]]],
    //  spatialReference: { wkid: 4326 }
    //});

    //if (geometryEngine.isSimple(polygon)) {
    //  const graphic = new Graphic({
    //    geometry: polygon,
    //    symbol: new SimpleFillSymbol(),
    //    attributes: {
    //      IsActive: true,
    //      CREATED_BYid: 12345,
    //      WLMS_APLC_KEY: "My Polygon"
    //    }
    //  });

    //  featureLayer.applyEdits({
    //    addFeatures: [graphic]
    //  }).then((editsResult) => {
    //    console.log("Polygon added to feature layer");
    //  }).catch((error) => {
    //    console.error("Error adding polygon to feature layer: ", error);
    //  });
    //} else {
    //  console.error("Geometry is not simple and cannot be added to feature layer");
    //}

    /*    Zoom into the FeatureServer layer. This doesn't seem to work too well since the FeatureServer layer is empty*/
    //featureLayer.when(() => {
    //  view.goTo(featureLayer.fullExtent);
    //});

    //const form = new FeatureForm({
    //  fieldConfig: [
    //    { name: "Location", label: "Location!!!" },
    //    { name: "tEST", label: "test!!!" },
    //  ]

    //});




    return this.view.when(() => {

      //Symbol for drawn polygons and polylines
      const mainSymbol = {
        type: "simple-fill",
        color: [255, 255, 0, 0.5], // Red with 50% transparency
        outline: {
          color: [255, 255, 0, 1], // Solid red outline
          width: 1
        },
        style: "backward-diagonal", // Hatch lines style
        // You can adjust the space between hatch lines if needed
        // For example, space: 5 will create a gap of 5 pixels between lines
      };

      const sketch = new Sketch({
        layer: sketchGraphicsLayer,
        view: view,
        // graphic will be selected as soon as it is created
        creationMode: "update",
        availableCreateTools: ["polygon", "polyline"], // Specify the allowed geometries (in this case, only polygons)
        viewModel: new SketchViewModel({
          view: view,
          layer: sketchGraphicsLayer,
          polygonSymbol: {
            type: 'simple-fill',
            style: "solid",
            color: [0, 0, 0, 0], //transparent
            outline: {
              width: 1,
              style: "solid",
              color: [255, 0, 0, 1] //red
            }
          },
          polylineSymbol: {
            style: "solid",
            color: [255, 0, 0, 1], //red
            width: 1,
            type: "simple-line"
          }
        }),
        
      });

      view.ui.add(sketch, "top-right");

      //Add a test layer
      //var testlayer = new MapImageLayer({
      //  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer"
      //})

      //map.add(testlayer);

      /*      External layers*/
      //var streetlights = new MapImageLayer({
      //  url: "https://citymaps.capetown.gov.za/agsext/rest/services/Theme_Based/Basic_Services_Infrastructure/MapServer",
      //});

      //map.add(streetlights);

      //kyle 23/07/24
      //var zones = new MapImageLayer({
      //  url: this.zonesURL,

      //})

      //map.add(zones);

      //var infrustructure = new MapImageLayer({
      //  url: this.infrustructureURL,

      //})

      //map.add(infrustructure);
      //kyle 23/07/24

      /*      Add layerlist and legend*/
      var layerList = new LayerList({
        view: view
      });

      view.ui.add(layerList, "top-left");

      var legend = new Legend({
        view: view
      });

      view.ui.add(legend, "top-left");

      // Connect to the geodatabase
      //      const featureLayer = new FeatureLayer({
      //        url: "https://esapqa.capetown.gov.za/agsext/rest/services/Theme_Based/Wayleaves/FeatureServer",
      //        title: "Wayleaves edit layer",
      ///*        definitionExpression: "OBJECTID = 1"*/
      //      });

      map.add(featureLayer);

      map.add(featureLayerLine);

      //Commented out fullscreen mode because it has a bug that causes the map to disappear.
      //const fullscreen = new Fullscreen({
      //  view: view
      //});

      //view.ui.add(fullscreen, 'bottom-left');

      // Create a polygon feature in the layer
      //featureLayer.applyEdits({
      //  addFeatures: [{
      //    geometry: {
      //      type: "polygon",
      //      rings: [[[-122.45, 37.75], [-122.42, 37.72], [-122.40, 37.75], [-122.45, 37.75]]]
      //    },
      //    attributes: {
      //      field_name: "value"
      //    }
      //  }]
      //}).then(result => {
      //  console.log(result);
      //});



      /*      view.map.loadAll().then(() => {*/
      //view.map.editableLayers.forEach((layer) => {
      //  if (layer.type === 'feature') {
      //    switch (layer.geometryType) {
      //      case "polygon":
      //        polygonLayer = featureLayer;
      //        break;
      //      //case "polyline":
      //      //  lineLayer = featureLayer;
      //      //  break;
      //      //case "point":
      //      //  pointLayer = featureLayer;
      //      //  break;
      //    }
      //  }
      //});

      // Set the point layer's LayerInfo
      //const pointInfos = {
      //  layer: pointLayer,
      //  formTemplate: { // autocasts to FormTemplate
      //    elements: [{ // autocasts to Field Elements
      //      type: "field",
      //      fieldName: "HazardType",
      //      label: "Hazard type"
      //    }, {
      //      type: "field",
      //      fieldName: "Description",
      //      label: "Description"
      //    }, {
      //      type: "field",
      //      fieldName: "SpecialInstructions",
      //      label: "Special Instructions"
      //    }, {
      //      type: "field",
      //      fieldName: "Status",
      //      label: "Status"
      //    }, {
      //      type: "field",
      //      fieldName: "Priority",
      //      label: "Priority"
      //    }]
      //  }
      //};

      // Set the line layer's LayerInfo
      //const lineInfos = {
      //  layer: lineLayer,
      //  formTemplate: { // autocasts to FormTemplate
      //    elements: [{ // autocasts to FieldElement
      //      type: "field",
      //      fieldName: "Severity",
      //      label: "Severity"
      //    }, {
      //      type: "field",
      //      fieldName: "blocktype",
      //      label: "Type of blockage"
      //    }, {
      //      type: "field",
      //      fieldName: "fullclose",
      //      label: "Full closure"
      //    }, {
      //      type: "field",
      //      fieldName: "active",
      //      label: "Active"
      //    }, {
      //      type: "field",
      //      fieldName: "locdesc",
      //      label: "Location Description"
      //    }]
      //  }
      //};

      // Set the polygon layer's LayerInfo
      //const polyInfos = {
      //  layer: polygonLayer,
      //  //enableEditing: true,
      //  //enableDeleting: true,
      //  //enableSelfIntersectionCheck: true,
      //  //keepGlobeCylinder: false,
      //  formTemplate: { // autocasts to FormTemplate
      //    elements: [{ // autocasts to FieldElement
      //      type: "field",
      //      fieldName: "incidenttype",
      //      label: "Incident Type"
      //    } as FieldElement, {
      //      type: "field",
      //      fieldName: "activeincid",
      //      label: "Active"
      //    } as FieldElement, {
      //      type: "field",
      //      fieldName: "descrip",
      //      label: "Description"
      //    } as FieldElement]
      //  }
      //};

      /*         Begin Editor constructor*/
      //        const editor = new Editor({
      //          view: view,
      //          /*          layerInfos: [pointInfos, lineInfos, polyInfos],*/
      //          layerInfos: [{
      //            layer: featureLayer, // pass in the feature layer,
      //            formTemplate: { // autocastable to FormTemplate
      //              elements: [
      //                { // autocastable to FieldElement
      //                  type: "field",
      //                  fieldName: "fulladdr",
      //                  label: "Full Address"
      //                }
      //              ]
      //            },
      //          enabled: true, // Default is true, set to false to disable editing functionality.
      //          addEnabled: true, // Default is true, set to false to disable the ability to add a new feature.
      //          updateEnabled: false, // Default is true, set to false to disable the ability to edit an existing feature.
      //    deleteEnabled: false, // Default is true, set to false to disable the ability to delete features.
      //    attributeUpdatesEnabled: true, // Default is true, set to false to disable the ability to edit attributes in the update workflow.
      //    geometryUpdatesEnabled: true, // Default is true, set to false to disable the ability to edit feature geometries in the update workflow.

      //          });
      ///*      End Editor constructor*/


      ///*         Add the widget to the view*/
      //              view.ui.add(editor, "top-right");

      ///*       Add the editor widget*/


      // At the very minimum, set the Editor's view - Editor Commented Out
      //const editor = new Editor({
      //  layerInfos: [{
      //    layer: featureLayer,

      //    /*          maxAllowableArea: 1000000*/
      //  },
      //  {
      //    layer: featureLayerLine,

      //    /*          maxAllowableArea: 1000000*/
      //  }
      //  ],
      //  view: view as MapView,

      //  /*        allowedWorkflows: "update",*/
      //});
      //view.ui.add(editor, "top-right");


      // Listen to the create event of the Editor widget. - Editor Commented Out
      //editor.on('submit', (event) => {
      //  // Get a reference to the feature that was just created.
      //  //const graphic = event.graphic;
      //  //// Set the values of the attributes for the new feature.
      //  //graphic.attributes = {
      //  //  LU_ACTV_STS: "9999",
      //  //  /*          cREATED_bYid: "99",*/
      //  //  // other attribute values
      //  //};

      //  console.log('submitted form')
      //  // Save the new feature.
      //  //const featureFormViewModel = editor.viewModel.featureFormViewModel;
      //  //featureFormViewModel.submit();
      //});

      /*      This code is hit when certain actions take place on the view area, regarding the editor. Actions such as deleting polygons. Draw actions aren't hit though :('. - Editor Commented Out*/
      //editor.viewModel.watch("state", (event) => {
      //  console.log(event);
      //});

      //view.whenLayerView(zones).then((layerView) => {
      //  layerView.on('layerview-create', (event) => {
      //    // The layer view has been created, you can now execute queries
      //    console.log('Layer view created:', event.layerView);
      //  });
      //});

      // Listen to sketch widget's create event.
      sketch.on("create", (event) => {


        // check if the create event's state has changed to complete indicating
        // the graphic create operation is completed.
        if (event.state === "complete") {
          this.toggleLoadingIndicator(true, "Processing drawing"); // Show loading indicator

          // use the graphic.geometry to determine if it's a polyline or polygon
          const drawnGeometry = event.graphic.geometry;
          var firstPoint;

          if (drawnGeometry.type === "polygon") {
            // Handle the drawn polygon
            const drawnPolygon = drawnGeometry as Polygon;

            // Access the first point of the first ring
            firstPoint = drawnPolygon.rings[0][0];
            // The rest of your code for processing polygons...

          } else if (drawnGeometry.type === "polyline") {
            // Handle the drawn polyline
            const drawnPolyline = drawnGeometry as Polyline;

            // Access the first point of the first ring            
            firstPoint = drawnPolyline.paths[0][0];

            // The rest of your code for processing polylines...

          }

            // Buffer the drawn polygon by 20 meters
            const bufferedGeometry = geometryEngine.geodesicBuffer(drawnGeometry, 20, 'meters') as Polygon;
          // remove the graphic from the layer. Sketch adds
          // the completed graphic to the layer by default.
          /*graphicsLayer.remove(event.graphic);*/

          // use the graphic.geometry to query features that intersect it
          /*          selectFeatures(event.graphic.geometry);*/

          // Convert the projected coordinates to a Point object
          var pointObject = new Point({
            x: firstPoint[0],
            y: firstPoint[1],
            spatialReference: this.view.spatialReference
          });

          this.sharedService.setCoordinateData(pointObject.longitude + "," + pointObject.latitude);

          //Retrive the address for the co-ordinates above
          // Perform reverse geocoding
          // Create a Point object
          const reverseGeocodeParams: __esri.locatorLocationToAddressParams = {
            location: pointObject,
            /*        distance: 500, // Adjust the search distance as needed*/
            /*        outFields: ["*"] // Retrieve all fields*/
          };

          // Define the URL of the geocoding service
          var geocodingServiceUrl = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

          var requestOptions = {
            maxLocations: 1, // Limit the number of results to 1
            minScore: 75, // Set a minimum match score
            // Other options as needed
          };

          locationToAddress(geocodingServiceUrl, reverseGeocodeParams, requestOptions)
            .then((response) => {
              // Display the result
              var address = response.address;
              console.log("Reverse Geocoded Address:", address);

              // Do something with the address (e.g., display it on the UI)
              this.sharedService.setAddressData(address);

              //Physical address of project Kyle 16/01/24
              this.newWayleaveComponent.addressSaved = true;
              //Physical address of project Kyle 16/01/24
            })
            .catch((error) => {
              console.error("Reverse Geocoding Error:", error);
            });

          let applicationIDAsString: string = this.data.applicationID.toString();

          //Convert IsInternal to a string
          var IsInternal = this.CurrentUserProfile[0].isInternal ? "Internal" : "External";

          // Use the MapService to send the geometry to the backend
          this.mapService.processGeometry(drawnGeometry, this.data.createdByID, applicationIDAsString, bufferedGeometry, IsInternal).subscribe(
            (data: any) => {
              this.toggleLoadingIndicator(false, ""); // Show loading indicator
              console.log('Success:', data);
              this.sharedService.distributionList = data.dateSet;

              console.log("Distribution list:",this.sharedService.distributionList);
              // Handle the success response from the backend as needed

              //Draw buffer
              // Create a symbol for the buffered graphic (you can customize the symbol as needed)
              const bufferSymbol = {
                type: "simple-fill",
                color: [255, 255, 0, 0.5], // Red with 50% transparency
                outline: {
                  color: [255, 255, 0, 1], // Solid red outline
                  width: 1
                },
                style: "backward-diagonal", // Hatch lines style
                // You can adjust the space between hatch lines if needed
                // For example, space: 5 will create a gap of 5 pixels between lines
              };

              // Create a new graphic with the buffered geometry
              const bufferedGraphic = new Graphic({
                // @ts-ignore
                geometry: bufferedGeometry,
                symbol: bufferSymbol,
              });

              // Add the buffered graphic to the array
              /*      this.bufferedGraphics.push(bufferedGraphic);*/

              // Add the buffered graphic to the map
              this.view.graphics.add(bufferedGraphic);

            },
            (error) => {
              console.error('Error:', error);
              // Handle errors appropriately
            }
          );


          console.log(drawnGeometry);
        }
      });

      //This handles drawings to the polygon layer - Editor Commented Out*/
      featureLayer.on("edits", (event) => {
        //Test to send polygon to backend

        // Now, get the drawn polygon's geometry
        // @ts-ignore
        //const drawnPolygon = event.edits.addFeatures[0].geometry;
        //let applicationIDAsString: string = this.data.applicationID.toString();

        //// Use the MapService to send the polygon to the backend
        //this.mapService.processGeometry(drawnPolygon, this.data.createdByID, applicationIDAsString).subscribe(
        //  (response) => {
        //    console.log('Success:', response);
        //    // Handle the success response from the backend as needed
        //  },
        //  (error) => {
        //    console.error('Error:', error);
        //    // Handle errors appropriately
        //  }
        //);

                this.editFeatureServer(event)
      });

      //This handles drawings to the line layer
      featureLayerLine.on("edits", (event) => {
        this.editFeatureServer(event)
      });

      // Listen to the 'before-apply-edits' event of the Editor widget - Editor Commented Out
      //editor.on('create', (event) => {
      //  if (event.addedFeatures.length > 0) {
      //    const addedPolygon = event.addedFeatures[0].geometry;

      //    // Create a query to check if the drawn polygon intersects any features in the target layer
      //    const mapServerLayer = new FeatureLayer({
      //      url: 'https://esapqa.capetown.gov.za/agsext/rest/services/Theme_Based/Wayleave_Infrastructure/MapServer/134'
      //    });

      //    const query2 = new Query();

      //    query2.spatialRelationship = "intersects";

      //    // @ts-ignore
      //    query.geometry = event.edits.addFeatures[0].geometry;
      //    //Add objectID to the fields returned as it isn't returned by default
      //    query2.outFields = ['OBJECTID'];

      //    mapServerLayer.queryFeatures(query2).then((result) => {

      //      const features = result.features;

      //      if (result.features.length > 0) {
      //        // Prevent applying the edits
      //        event.preventDefault();
      //        console.log('Intersects with features in the layer. Edits not applied.');
      //      }
      //    });

      //  }
      //});



      /*      Async: This code can be deleted, but use it for referencing when using promises.*/
      //featureLayer.on("edits", async (event) => {
      //  // Clear the distribution list. This should be moved to when the application is successfully captured and on "Create new wayleave".
      //  this.sharedService.distributionList.splice(0, this.sharedService.distributionList.length);

      //  // Count the number of polygons drawn/deleted to prevent submitting the form without inserting a polygon.
      //  const countPolygon = event.addedFeatures.length;
      //  const subtractPolygon = event.deletedFeatures.length;

      //  // Count all added features
      //  this.sharedService.totalAddedFeatures += countPolygon;
      //  console.log(this.sharedService.totalAddedFeatures);
      //  this.sharedService.totalAddedFeatures -= subtractPolygon;
      //  console.log("Total added features", this.sharedService.totalAddedFeatures);

      //  // Create a new Query object
      //  const query = new Query();

      //  // Set the spatial relationship to "intersects" or "contains" based on your requirement
      //  query.spatialRelationship = "intersects";

      //  // Set the geometry of the query to the drawn polygon
      //  // @ts-ignore
      //  query.geometry = event.edits.addFeatures[0].geometry;

      //  // Set the fields to be returned by the query
      //  query.outFields = ['OBJECTID'];

      //  // Set up the layer in the MapServer to query against
      //  const mapServerLayerUrl = []; // This checks just the electricity layer.

      //  // Start loop from here
      //  for (var i = 0; i < this.sharedService.subDepartmentList.length; i++) {
      //    // Get current mapLayerID
      //    const mapLayerID = this.sharedService.subDepartmentList[i].mapLayerID;
      //    // Get subDepartmentID for the current
      //    const SubDepartmentID = this.sharedService.subDepartmentList[i].subDepartmentID;
      //    console.log(SubDepartmentID);

      //    // Get list of managers by zone
      //    await this.actionCenterComponent.getUserBySubDepartmentAndRoleName(SubDepartmentID, "Department Admin").toPromise().then((data: any) => {
      //      if (data.responseCode == 1) {
      //        const zoneAdminUsers = data.dateSet;

      //        if (mapLayerID == null) {
      //          /* This code runs when a subdepartment consists of multiple regions */
      //        } else if (mapLayerID == -1) {
      //          // Send to ALL Admin users in this subdepartment
      //          this.sharedService.distributionList = this.sharedService.distributionList.concat(zoneAdminUsers);
      //          console.log("Distribution list", this.sharedService.distributionList);
      //        } else if (mapLayerID > -1) {
      //          // Set up the layer in the MapServer to query against
      //          mapServerLayerUrl[i] = "https://esapqa.capetown.gov.za/agsext/rest/services/Theme_Based/Wayleaves_Regions/MapServer/" + mapLayerID;

      //          const mapServerLayer = new FeatureLayer({
      //            url: mapServerLayerUrl[i]
      //          });

      //          // Query the layer for the current subdepartment. The intersecting layer objectIDs should be returned.
      //          mapServerLayer.queryFeatures(query).then((result) => {
      //            // Handle the resulting features that intersect or are within the drawn polygon
      //            const features = result.features;
      //            // Do something with the features

      //            features.forEach(async (feature) => {
      //              const OBJECTID = feature.attributes.OBJECTID;
      //              const filteredList = zoneAdminUsers.filter(obj => obj.mapObjectID === OBJECTID);

      //              this.sharedService.distributionList = this.sharedService.distributionList.concat(filteredList);
      //              console.log("Distribution list", this.sharedService.distributionList);
      //            });
      //          });
      //        } else {
      //          // This code runs if the field is null or contains something unexpected
      //        }
      //      } else {
      //        // alert("Invalid Email or Password");
      //        // alert(data.responseMessage);
      //      }
      //    }).catch(error => {
      //      console.log("Error:", error);
      //    });
      //  }

      //  // Promise to ensure that addToSubDepartmentForComment() runs after all the other code
      //  const promise = new Promise<void>((resolve) => {
      //    // Run the code you want to execute after the other code is finished
      //    this.addToSubDepartmentForComment();
      //    resolve();
      //  });

      //  // Await the resolution of the promise before continuing
      //  await promise;
      //});


      // Subscribe to the draw-complete event of the Editor widget - Editor Commented Out
      //editor.viewModel.featureFormViewModel.on("submit", (event) => {
      //  console.log(event);
      //  // Get the drawn polygon's geometry
      //  //  const drawnPolygon = event.graphic.geometry;

      //  //  // Create a new Query object
      //  //  const query = new Query();

      //  //  // Set the spatial relationship to "intersects" or "contains" based on your requirement
      //  //  query.spatialRelationship = "intersects";

      //  //  // Set the geometry of the query to the drawn polygon
      //  //  query.geometry = drawnPolygon;

      //  //  // Set up the layer in the MapServer to query against
      //  //  const mapServerLayerUrl = "https://esapqa.capetown.gov.za/agsext/rest/services/Theme_Based/Wayleaves_Regions/MapServer/0"; //this checks just the electricity layer.
      //  //  const mapServerLayer = new FeatureLayer({
      //  //    url: mapServerLayerUrl
      //  //  });

      //  //  // Perform the spatial query
      //  //  mapServerLayer.queryFeatures(query).then((result) => {
      //  //    // Handle the resulting features that intersect or are within the drawn polygon
      //  //    const features = result.features;
      //  //    // Do something with the features
      //  //  });
      //});

      ///*       create a new instance of draw*/
      //      let draw = new Draw({
      //        view: view
      //      });

      //      //// create an instance of draw polyline action
      //      //// the polyline vertices will be only added when
      //      //// the pointer is clicked on the view
      //      let action = draw.create("polygon", { mode: "click" });
      //      // fires when the drawing is completed
      //      action.on("draw-complete", function (event) {
      //        console.log("Yes, it works");
      //        if (event.graphic) {
      //          event.graphic.attributes = {
      //            IsActive: "1",
      //            cREATED_bYid: "10",
      ///*            column3: "Value3"*/
      //          };
      //        }

      //        /*        geometry: event.geometry,*/


      //      });

      // Create a polygon geometry
      //const polygon: GeometryInterface = {
      //  type: "polygon",
      //  rings: [
      //    [-118.818984489994, 34.0137559967283], //Longitude, latitude
      //    [-118.806796597377, 34.0215816298725], //Longitude, latitude
      //    [-118.791432890735, 34.0163883241613], //Longitude, latitude
      //    [-118.79596686535, 34.008564864635],   //Longitude, latitude
      //    [-118.808558110679, 34.0035027131376]  //Longitude, latitude
      //  ]
      //};

      //const simpleFillSymbol = {
      //  type: "simple-fill",
      //  color: [227, 139, 79, 0.8],  // Orange, opacity 80%
      //  outline: {
      //    color: [255, 255, 255],
      //    width: 1
      //  }
      //};

      //const graphicsLayer = new GraphicsLayer();
      //map.add(graphicsLayer);

      //const polygonGraphic = new Graphic({
      //  geometry: polygon,
      //  symbol: simpleFillSymbol,

      //});
      /*      graphicsLayer.add(polygonGraphic);*/

      //editor.on("create", function (event) {
      //  if (event.graphic) {
      //    event.graphic.attributes = {
      //      LU_ACTV_STS: "9999",
      //    };
      //  }
      //});

      //Zooms into Cape Town, or rather, shows the 'fullExtent of the layer'
      //kyle 23/07/24
      view.when(() => {
        view.goTo(view.center);
      });

      // Create the Form template and pass in elements
      const formTemplate = new FormTemplate({
        title: "Application info",
        description: "Enter all relevant information below",
        /*      elements: [groupElement] // Add all elements to the template*/
      });

      // Add a new feature form with grouped fields
      //const form = new FeatureForm({
      //  container: "form",
      //  groupDisplay: "sequential", // only display one group at a time
      //  formTemplate: formTemplate // set it to template created above
      //});


      // Expression created within ExpressionInfos and is referenced in element
      const expression = new ExpressionInfo({
        name: "alwaysHidden",
        expression: "false"
      });

      const expression2 = new ExpressionInfo({
        name: "assignIsActive",
        expression: "Text('" + this.data.isActive + "')",
      });

      const expression3 = new ExpressionInfo({
        name: "assignApplicationID",
        returnType: 'string',
        expression: "Text('" + this.data.applicationID + "')",
      });

      const expression4 = new ExpressionInfo({
        name: "assignCreatedByID",
        /*        expression: this.initializeData()*/
        returnType: 'string',
        expression: "Text('" + this.data.createdByID + "')",
        /*        expression: "$feature.TEMP",*/

      });

      // Reference an already-defined visibilityExpression set within the ExpressionInfos
      const fieldElement = new FieldElement({
        /*  type: "field",*/
        fieldName: "CRTD_BY_ID",
        label: "createdByID",
        /*        valueExpression: "assignCreatedByID",*/
        valueExpression: "assignCreatedByID",
        /*                  visibilityExpression: "alwaysHidden",*/
   
        editable: false,

      });

      const fieldElement2 = new FieldElement({
        /*  type: "field",*/
        fieldName: "LU_ACTV_STS",
        label: "isActive",
        valueExpression: "assignIsActive",
       
        editable: false,
        /*                        visibilityExpression: "alwaysHidden"*/
      });

      const fieldElement3 = new FieldElement({
        /*  type: "field",*/
        fieldName: "WLMS_APLC_KEY",
        label: "applicationID",
        valueExpression: "assignApplicationID",
       
        editable: false,
        /*                        visibilityExpression: "alwaysHidden"*/
      });

      formTemplate.expressionInfos = [expression, expression2, expression3, expression4];
      formTemplate.elements = [fieldElement, fieldElement2, fieldElement3];

      featureLayer.formTemplate = formTemplate
      featureLayerLine.formTemplate = formTemplate

      console.log("num of features: " + this.getCount(featureLayer, ""));
    })



    /*    });*/

  };



  //private addLayers() {
  //  return Promise.all([
  //    this.initializePeopleLayer(),
  //    this.map.add(this.pointLanguageLayer),
  //  ]);
  //};

  //private async initializePeopleLayer() {

  //  const popupPeople = new PopupTemplate({
  //    title: '{Name}',
  //    overwriteActions: true,
  //    outFields: ['OBJECTID', ...this.helper.outfields['popupPeople']],
  //    content: (feature: __esri.Feature) => {
  //      const div = document.createElement('div');
  //      const {
  //        PicURLS,
  //        Lang,
  //        Pop = 0,
  //        Special,
  //      } = feature.graphic.attributes;

  //      div.innerHTML = `<div style="float: left"><img src=${PicURLS}></div>
  //                  <div style="float: left;padding-left: 10px;"><p><b>${this.getTranslation('Common_Population')}: </b>${Pop.toLocaleString()}</p>
  //                  <p><b>${this.getTranslation('Common_Language')}: </b>${Lang}</p><p>
  //                  <p><b>${this.getTranslation('Common_Status')}: </b>${this.getStatus(Special)}</p></div>`;

  //      return div;
  //    },
  //    fieldInfos: this.helper.popupPeopleFieldInfo(),
  //  });

  //  const graphics = await this.queryPeopleGraphics();
  //  this.oldGraphics = graphics;

  //  this.pointPeopleLayer = new FeatureLayer({
  //    id: 'pntPeopleLayer',
  //    title: this.getTranslation('Common_PeopleGroups'),
  //    fields: this.helper.peopleFields(),
  //    source: graphics,
  //    objectIdField: 'OBJECTID',
  //    geometryType: 'point',
  //    spatialReference: { wkid: 3857 },
  //    opacity: 0.8,
  //    popupTemplate: popupPeople,
  //    renderer: this.helper.peopleLayerRenderer(),
  //  });

  //  return this.map.add(this.pointPeopleLayer);
  //};

  //private getTranslation(key: string): string {
  //  return this.translate.instant(key);
  //};

  //private getStatus = (stat: number): string => {
  //  if (stat === 0) return `<span style="color: rgb(${this.helper.mapColors[0]});">${this.getTranslation('Common_Status1')}</span>`;
  //  if (stat === 1) return `<span style="color: rgb(${this.helper.mapColors[1]});">${this.getTranslation('Common_Status2')}</span>`;
  //  if (stat === 2) return `<span style="color: rgb(${this.helper.mapColors[2]});">${this.getTranslation('Common_Status3')}</span>`;
  //  return this.getTranslation('Common_Unknown');
  //};

  //private initializePeopleTable() {
  //  this.peopleTable = new FeatureTable({
  //    view: this.view,
  //    layer: this.pointPeopleLayer,
  //    filterGeometry: this.view.extent,
  //    fieldConfigs: [{
  //      name: 'Name',
  //      label: this.getTranslation('Common_PeopleName'),
  //      direction: 'asc',
  //    }, {
  //      name: 'Ctry',
  //      label: this.getTranslation('Common_Country'),
  //    }, {
  //      name: 'Pop',
  //      label: this.getTranslation('Common_Population'),
  //    }, {
  //      name: 'Lang',
  //      label: this.getTranslation('Common_Language'),
  //    }, {
  //      name: 'SpecialString',
  //      label: this.getTranslation('Common_Status'),
  //    }],
  //    container: this.peopleTableDivEl.nativeElement
  //  });
  //};

  //private initializeLanguageTable() {
  //  this.languageTable = new FeatureTable({
  //    view: this.view,
  //    layer: this.pointLanguageLayer,
  //    fieldConfigs: [{
  //      name: 'Language',
  //      label: this.getTranslation('Common_Language'),
  //      direction: 'asc'
  //    }, {
  //      name: 'ROL',
  //      label: 'ROL'
  //    }],
  //    container: this.languageTableDivEl.nativeElement
  //  });
  //  // this table is set invisible because its dom element is hidden on first load
  //  this.languageTable.visible = false;
  //};

  //private async watchLayerViews(): Promise<void> {
  //  const [
  //    peopleLayer,
  //    languageLayer
  //  ] = await this.whenLayerViews();

  //  whenTrue(this.view, 'stationary', async () => {
  //    if (this.view.extent && this.peopleTable) {
  //      await this.updatePeople(); // wait for update before applying filter
  //      this.peopleTable.filterGeometry = this.view.extent;
  //    }
  //  });

  //  whenFalse(this.view, 'updating', () => {
  //    if (this.view.extent && this.languageTable) {
  //      this.languageTable.filterGeometry = this.view.extent;
  //    }
  //    this.isLoading = false;
  //  });
  //  // when language layer is visible, get rid of the people layer
  //  watch(languageLayer, 'visible', (e) => {
  //    if (e) {
  //      this.pointPeopleLayer.visible = false;
  //      this.view.popup.close();
  //      this.view.graphics.removeAll();
  //      this.peopleTable.visible = false;
  //      this.languageTable.visible = true;
  //    }
  //  });
  //  // when the people layer is visible, get rid of the language layer
  //  watch(peopleLayer, 'visible', (e) => {
  //    if (e) {
  //      this.pointLanguageLayer.visible = false;
  //      this.view.popup.close();
  //      this.view.graphics.removeAll();
  //      this.languageTable.visible = false;
  //      this.peopleTable.visible = true;
  //    }
  //  });
  //};

  //private whenLayerViews() {
  //  return Promise.all([
  //    this.view.whenLayerView(this.pointPeopleLayer),
  //    this.view.whenLayerView(this.pointLanguageLayer)
  //  ]);
  //};

  //private async positionAndMapLoad() {
  //  /*    await this.setPosition();*/
  //  await this.initializeMap();
  //  /*    await this.addLayers();*/
  //  console.log('map is initialized');
  //  this.layerList = new LayerList({
  //    view: this.view,
  //  })
  //  this.view.ui.add(this.layerList, 'bottom-left');
  //  //this.initializePeopleTable();
  //  //this.initializeLanguageTable();
  //  //this.watchLayerViews();

  //  this.view.popup.watch('selectedFeature', async (feature) => {
  //    this.view.graphics.removeAll();
  //    const PEID = feature && feature.attributes.PEID;
  //    const ROL = feature && feature.attributes.ROL;
  //    if (this.view.popup.visible && ROL) {
  //      const query = this.pollyLanguageLayer.createQuery();
  //      query.where = `langCd = '${ROL}'`;
  //      query.returnGeometry = true;
  //      query.geometry = this.view.extent;
  //      const lanQueryResults = await this.pollyLanguageLayer.queryFeatures(query);
  //      const graphics = lanQueryResults.features.map((polyFeat) => {
  //        return new Graphic({
  //          geometry: polyFeat.geometry,
  //          symbol: new SimpleFillSymbol({
  //            color: [38, 0, 92, 0.4],
  //            style: 'solid',
  //            outline: {
  //              color: [38, 0, 92, 0.4],
  //              width: 0.5
  //            }
  //          })
  //        })
  //      })
  //      this.view.graphics.addMany(graphics);
  //    }
  //    if (this.view.popup.visible && PEID) {
  //      const query = this.pollyPeopleLayer.createQuery();
  //      query.where = `PEID = ${PEID}`;
  //      query.returnGeometry = true;
  //      query.geometry = this.view.extent;
  //      const queryResults = await this.pollyPeopleLayer.queryFeatures(query);
  //      const graphics = queryResults.features.map((polyFeat) => {
  //        const color = this.helper.setMapColorOpacity(feature.attributes.Special);
  //        return new Graphic({
  //          geometry: polyFeat.geometry,
  //          symbol: new SimpleFillSymbol({
  //            color,
  //            style: 'solid',
  //            outline: {
  //              color,
  //              width: 0.5
  //            }
  //          })
  //        })
  //      })
  //      this.view.graphics.addMany(graphics);
  //    }
  //  })

  //  watch(this.view.popup.viewModel, 'active', () => {
  //    const feature = this.view.popup.selectedFeature;
  //    if (!this.view.popup.visible) {
  //      this.view.graphics.removeAll();
  //      return;
  //    }
  //    if (!feature) {
  //      this.view.graphics.removeAll();
  //      return;
  //    }
  //  });
  //};

  //private async updatePeople() {
  //  const newGraphics = await this.queryPeopleGraphics();
  //  const editResp = await this.pointPeopleLayer.applyEdits({
  //    addFeatures: newGraphics,
  //    deleteFeatures: this.oldGraphics
  //  });
  //  this.oldGraphics = editResp.addFeatureResults;
  //};

  //private async queryPeopleGraphics() {
  //  const query = this.pntpplnCtryLayer.createQuery();
  //  query.returnGeometry = true;
  //  query.geometry = this.view.extent;
  //  const queryResults = await this.pntpplnCtryLayer.queryFeatures(query);
  //  return queryResults.features.map((feat) => {
  //    const SpecialString = this.getStatus(feat.attributes.Special);
  //    return new Graphic({
  //      geometry: feat.geometry,
  //      attributes: {
  //        SpecialString,
  //        ...feat.attributes
  //      }
  //    })
  //  });
  //};

  getCount(featureLayer, token) {

    var xmlhttp = new XMLHttpRequest();
    var url = featureLayer + "/query?f=json&where=1=1&returnCountOnly=true";

    if (token) {
      url = url + "&token=" + token;
    }

    xmlhttp.open("GET", url, false);
    xmlhttp.send();

    if (xmlhttp.status !== 200) {
      return (xmlhttp.status);
    } else {
      var responseJSON = JSON.parse(xmlhttp.responseText)
      if (responseJSON.error) {
        return (JSON.stringify(responseJSON.error));
      } else {
        return JSON.stringify(responseJSON.count);
      }
    }
  }

  private async setPosition(): Promise<void> {
    try {
      const {
        coords
      } = await this.helper.getPosition();

      this.position = [coords.longitude, coords.latitude]
    } catch (error) {
      this.position = [0, 0];
      this.defaultZoom = 1;
    }
  };

  private getZoneByMapObjectID(SubDepartmentID: number, MapObjectID: number) {

    this.zonesService.getZoneByMapObjectID(SubDepartmentID, MapObjectID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZoneList = {} as ZoneList;
          const current = data.dateSet[i];
          tempZoneList.departmentID = current.departmentID;
          tempZoneList.mapObjectID = current.mapObjectID;
          tempZoneList.subDepartmentID = current.subDepartmentID;
          tempZoneList.zoneID = current.zoneID;
          tempZoneList.zoneName = current.zoneName;
          this.ZoneList.push(tempZoneList);
          this.Zone = tempZoneList;

          /*          return this.Zone;*/
        }
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
        /*        return null;*/
      }
      console.log("reponse", data);
      return null;
    }, error => {
      console.log("Error: ", error);
      /*      return null;*/
    })
  }

  //Checks if a drawn object intercepts an infrustructure in a given set of layers
  private InterceptInfrustructureChecker(currentSubDepartmentName: string, subDepartmentContainingInfrustructure: string, query: Query, exclusionUponInterception: number, baseURL: string, numbers: number[]): Promise<number[]> {
    // Record the start time for InterceptInfrustructureChecker
    const interceptionStartTime = Date.now();

    return new Promise<number[]>((resolve, reject) => {
      if (currentSubDepartmentName === subDepartmentContainingInfrustructure) {
        let numOfInterceptions = 0;
        const exclusionsList: number[] = [];
        const countNumber = numbers.length;
        const layerURLs = numbers.map(number => `${baseURL}${number}`);

        const checkInterceptions = (index: number) => {
          this.toggleLoadingIndicator(true, "Checking if infrustructure is intersected for " + subDepartmentContainingInfrustructure + " (" + countNumber + "/" + index + ")"); // Show loading indicator

          if (index >= layerURLs.length) {
            // All layers have been checked, resolve with the final exclusionsList
            resolve(exclusionsList);
            return;
          }

          if (numOfInterceptions >= 1) {
            // Stop checking if an interception has already been found
            resolve(exclusionsList);
            return;
          }

          const layerURL = layerURLs[index];
          const mapServerLayer = new FeatureLayer({
            url: layerURL
          });

          mapServerLayer.queryFeatures(query)
            .then(result => {
              numOfInterceptions += result.features.length;

              if (numOfInterceptions >= 1) {
                // Remove bulkwater from the exclusions list
                exclusionsList.splice(exclusionsList.indexOf(exclusionUponInterception), 1);
              } else {
                // Remove subdepartment first to prevent duplication of exclusions
                exclusionsList.splice(exclusionsList.indexOf(exclusionUponInterception), 1);
                // Exclude bulkwater subdepartment
                exclusionsList.push(exclusionUponInterception);
              }

              // Continue with the next layer
              checkInterceptions(index + 1);
            })
            .catch(error => {
              reject(error);
            });
        };

        // Calculate the time taken for InterceptInfrustructureChecker
        const interceptionEndTime = Date.now();
        const interceptionTimeInSeconds = (interceptionEndTime - interceptionStartTime) / 1000;

        console.log(`InterceptInfrustructureChecker took ${interceptionTimeInSeconds} seconds to complete.`);

        // Start checking interceptions
        checkInterceptions(0);
        this.toggleLoadingIndicator(false, null); // Show loading indicator

      } else {
        // Handle other mapLayerID cases here
        resolve([]);
        this.toggleLoadingIndicator(false, null); // Show loading indicator
      }
    });
  }


  // Method to toggle the loading indicator
  toggleLoadingIndicator(isLoading: boolean, loadingText: string) {
    this.isLoading = isLoading;
    this.loadingText = loadingText;
  }

  mapURLLoader() {
    this.MapConfig = this.AllConfig.filter((config) => config.configName === 'Map');


    // Filter the list so that only the first row with 'ServerType', is returned.
    this.ServerType = this.AllConfig.find((config) => config.configName === 'ServerType').utilitySlot1;
    const MapConfigForServer = this.MapConfig.filter((config) => config.utilitySlot1 === this.ServerType);


    //Check if user is internal or external
    if (this.CurrentUserProfile[0].isInternal) {
      //Internal users have access to both Internal and external layers
      const MapConfigForServerForUser = MapConfigForServer.filter((config) => config.utilitySlot2 === 'External');

      MapConfigForServerForUser.forEach((config) => {
        switch (config.utilitySlot3) {
          case 'FeatureServer(Edit)':
            // Handle the case when UtilitySlot3 is 'FeatureServer(Edit)'
            this.featureServerEditURL = config.configDescription
            console.log(`Handling FeatureServer(Edit) for ConfigID ${config.configID}`);
            // Add your code here for this case
            break;
          case 'FeatureServerLine(Edit)':
            // Handle the case when UtilitySlot3 is 'FeatureServer(Edit)'
            this.featureServerLineEditURL = config.configDescription
            console.log(`Handling FeatureServer(Edit) for ConfigID ${config.configID}`);
            // Add your code here for this case
            break;
          //kyle 23/07/24
          //case 'Zones':
          //  // Handle the case when UtilitySlot3 is 'Zones'
          //  this.zonesURL = config.configDescription
          //  console.log(`Handling Zones for ConfigID ${config.configID}`);
          //  // Add your code here for this case
          //  break;
          //case 'Infrustructure':
          //  // Handle the case when UtilitySlot3 is 'Zones'
          //  this.infrustructureURL = config.configDescription

          //  console.log(`Handling Zones for ConfigID ${config.configID}`);
          //  // Add your code here for this case
          //  break;
          //kyle 23/07/24

          case 'SearchERF':
            // Handle the case when UtilitySlot3 is 'Zones'
            this.searchERFURL = config.configDescription

            console.log(`Handling Zones for ConfigID ${config.configID}`);
            // Add your code here for this case
            break;

          // Add more cases as needed
          default:
            // Handle the case when UtilitySlot3 is not matched with any specific case
            console.log(`Handling default case for ConfigID ${config.configID}`);
            // Add your default code here
            break;
        }
      });

    } else if (!this.CurrentUserProfile[0].isInternal) {
      const MapConfigForServerForUser = MapConfigForServer.filter((config) => config.utilitySlot2 === 'External');

      MapConfigForServerForUser.forEach((config) => {
        switch (config.utilitySlot3) {
          case 'FeatureServer(Edit)':
            // Handle the case when UtilitySlot3 is 'FeatureServer(Edit)'
            this.featureServerEditURL = config.configDescription
            console.log(`Handling FeatureServer(Edit) for ConfigID ${config.configID}`);
            // Add your code here for this case
            break;
          case 'FeatureServerLine(Edit)':
            // Handle the case when UtilitySlot3 is 'FeatureServer(Edit)'
            this.featureServerLineEditURL = config.configDescription
            console.log(`Handling FeatureServer(Edit) for ConfigID ${config.configID}`);
            // Add your code here for this case
            break;
          //kyle 23/07/24

          //case 'Zones':
          ////   Handle the case when UtilitySlot3 is 'Zones'
          ////  this.zonesURL = config.configDescription
          ////  console.log(`Handling Zones for ConfigID ${config.configID}`);
          ////   Add your code here for this case
          ////  break;
          ////case 'Infrustructure':
          ////   Handle the case when UtilitySlot3 is 'Zones'
          ////  this.infrustructureURL = config.configDescription

          ////  console.log(`Handling Zones for ConfigID ${config.configID}`);
          ////   Add your code here for this case
          //  break;
          //kyle 23/07/24

          case 'SearchERF':
            // Handle the case when UtilitySlot3 is 'Zones'
            this.searchERFURL = config.configDescription

            console.log(`Handling Zones for ConfigID ${config.configID}`);
            // Add your code here for this case
            break;

          // Add more cases as needed
          default:
            // Handle the case when UtilitySlot3 is not matched with any specific case
            console.log(`Handling default case for ConfigID ${config.configID}`);
            // Add your default code here
            break;
        }
      });


    } else {
      //do nothing
    }
  }

  editFeatureServer(event) {
    this.loadingStartTime = Date.now(); // Record the start time
    this.toggleLoadingIndicator(true, "Starting up"); // Show loading indicator

    // Clear any previous timer
    if (this.loadingTimer) {
      clearTimeout(this.loadingTimer);
      this.takingTooLong = "";
    }

    this.loadingTimer = setTimeout(() => {
      // Check if the loading screen has been open for more than 10 seconds
      const currentTime = Date.now();
      const elapsedSeconds = (currentTime - this.loadingStartTime) / 1000;

      if (elapsedSeconds > 2) {
        // Display your message here (e.g., alert or console.log)
        this.takingTooLong = "Taking too long ? Your internet connection may be slow.";
        console.log("Loading screen for the main operation has been open for more than 10 seconds.");

      }
    }, 10000); // 10,000 milliseconds = 10 seconds

    try {
      // Start timer for InterceptInfrustructureChecker

      const interceptionStartTime = Date.now();

      this.toggleLoadingIndicator(true, "Starting up"); // Show loading indicator
      /*        console.log("MapConfig:",this.AllConfig)*/

      //Clears the distribution list. This should be moved to when the application is successfully captured and on "Create new wayleave".
      this.sharedService.distributionList.splice(0, this.sharedService.distributionList.length);
      console.log("This is the subdepatmentlist", this.sharedService.subDepartmentList);

      //console.log(event);
      //console.log(this.sharedService.subDepartmentList);

      //Count the number of polygons drawn/deleted to prevent submitting the form without inserting a polygon.
      const countPolygon = event.addedFeatures.length;
      const subtractPolygon = event.deletedFeatures.length;

      //Count all added features. This needs to be updated to include edited features.
      this.sharedService.totalAddedFeatures += countPolygon;
      console.log(this.sharedService.totalAddedFeatures);
      this.sharedService.totalAddedFeatures -= subtractPolygon;
      console.log("Total added features", this.sharedService.totalAddedFeatures);

      //hack to hide loading screen
      if (subtractPolygon >= 1) {
        //this.toggleLoadingIndicator(false, null); // Show loading indicator

      }

      /*        const drawnPolygon = event.addedFeatures;*/

      // Create a new Query object
      const query = new Query();

      // Set the spatial relationship to "intersects" or "contains" based on your requirement
      query.spatialRelationship = "intersects";

      // Set the geometry of the query to the drawn polygon
      /*        query.geometry = event.editedFeatures.editedFeatures.adds[0].geometry;*/

      // Set the geometry of the query to the drawn polygon
      //This part should be looped to account for multiple polygons drawn in one "Create"
      // @ts-ignore
      query.geometry = event.edits.addFeatures[0].geometry;

      // Add the original polygon graphic to the array so its buffer can be managed if deleted or edited on the map
      /*      this.addedFeatures.push(event.edits.addFeatures[0]);*/

      // Buffer the drawn polygon by 20 meters
      const bufferedGeometry = geometryEngine.geodesicBuffer(query.geometry, 20, 'meters');

      //Changed the geometry from the polygon to the bufferedGeometry
      query.geometry = bufferedGeometry as __esri.Geometry;

      // Create a symbol for the buffered graphic (you can customize the symbol as needed)
      const bufferSymbol = {
        type: "simple-fill",
        color: [255, 255, 0, 0.5], // Red with 50% transparency
        outline: {
          color: [255, 255, 0, 1], // Solid red outline
          width: 1
        },
        style: "backward-diagonal", // Hatch lines style
        // You can adjust the space between hatch lines if needed
        // For example, space: 5 will create a gap of 5 pixels between lines
      };

      // Create a new graphic with the buffered geometry
      const bufferedGraphic = new Graphic({
        // @ts-ignore
        geometry: bufferedGeometry,
        symbol: bufferSymbol,
      });

      // Add the buffered graphic to the array
      /*      this.bufferedGraphics.push(bufferedGraphic);*/

      // Add the buffered graphic to the map
      this.view.graphics.add(bufferedGraphic);

      // Use 'as' to cast the geometry to Polygon
      var polygonGeometry = query.geometry as __esri.Polygon;

      // Access the first point of the first ring
      var firstPoint = polygonGeometry.rings[0][0];

      // Convert the projected coordinates to a Point object
      var pointObject = new Point({
        x: firstPoint[0],
        y: firstPoint[1],
        spatialReference: this.view.spatialReference
      });

      this.sharedService.setCoordinateData(pointObject.longitude + "," + pointObject.latitude);

      //Retrive the address for the co-ordinates above
      // Perform reverse geocoding
      // Create a Point object
      const reverseGeocodeParams: __esri.locatorLocationToAddressParams = {
        location: pointObject,
        /*        distance: 500, // Adjust the search distance as needed*/
        /*        outFields: ["*"] // Retrieve all fields*/
      };

      // Define the URL of the geocoding service
      var geocodingServiceUrl = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

      var requestOptions = {
        maxLocations: 1, // Limit the number of results to 1
        minScore: 75, // Set a minimum match score
        // Other options as needed
      };

      locationToAddress(geocodingServiceUrl, reverseGeocodeParams, requestOptions)
        .then((response) => {
          // Display the result
          var address = response.address;
          console.log("Reverse Geocoded Address:", address);

          // Do something with the address (e.g., display it on the UI)
          this.sharedService.setAddressData(address);

         //Physical address of project Kyle 16/01/24
          this.newWayleaveComponent.addressSaved = true;
         //Physical address of project Kyle 16/01/24

        })
        .catch((error) => {
          console.error("Reverse Geocoding Error:", error);
        });

      //Add objectID to the fields returned as it isn't returned by default
      query.outFields = ['OBJECTID'];

      // Set up the layer in the MapServer to query against
      const mapServerLayerUrl = [];
      let exclusionsList: number[] = [];

      //Start loop from here
      for (var i = 0; i < this.sharedService.subDepartmentList.length; i++) {
        this.toggleLoadingIndicator(true, "Processing " + this.sharedService.subDepartmentList[i].subDepartmentName); // Show loading indicator

        //The ZoneAdminUsers for Bulk water and Waste Water and Treatment must always be returned - this code can be improved later - this is merely a fix that was hardcoded in.
        if (this.sharedService.subDepartmentList[i].isSetForAutomaticDistribution || this.sharedService.subDepartmentList[i].subDepartmentName == "Bulk Water" || this.sharedService.subDepartmentList[i].subDepartmentName == "Waste Water and Treatment") {
          this.toggleLoadingIndicator(true, null); // Show loading indicator

          //Get current mapLayerID
          const mapLayerID = this.sharedService.subDepartmentList[i].mapLayerID
          //Get subDepartmentID for the current
          const SubDepartmentID = this.sharedService.subDepartmentList[i].subDepartmentID;
          const SubDepartmentName = this.sharedService.subDepartmentList[i].subDepartmentName;
          console.log(SubDepartmentID);

          //Check if department is excluded either due to routing or other reasons
          //if (SubDepartmentID! in exclusionsList) {

          //}

          //Get list of managers by zone. Managers are Depatment Admins, 'Department Admins' includes both Zone and Subdepartment admins. Subdepartments have at least one zone - zone1.
          this.actionCenterComponent.getUserBySubDepartmentAndRoleName(SubDepartmentID, "Department Admin").subscribe(async (data: any) => {
            if (data.responseCode == 1) {
              let zoneAdminUsers = data.dateSet;
              //console.log("ZoneAdminUsers:", zoneAdminUsers);

              //Removes duplicates
              const tempList = zoneAdminUsers;

              const seenCombinations = {}; // To keep track of seen combinations

              zoneAdminUsers = tempList.filter(item => {
                const key = `${item.subDepartmentID}-${item.zoneID}-${item.email}`;

                if (!seenCombinations[key]) {
                  seenCombinations[key] = true;
                  return true;
                }

                return false;
              });

              console.log("ZoneAdminUsers:", zoneAdminUsers);

              //Do nothing if the field is undefined,
              if (mapLayerID == null) {

                //Run this code if the department has only a single region, i.e., the entire city is the region
              } else if (mapLayerID == -1) {
                this.toggleLoadingIndicator(true, "Processing " + SubDepartmentName + " (-1 layers)"); // Show loading indicator
                //Bulk water
                const bulkWaterExclusions = await this.InterceptInfrustructureChecker(SubDepartmentName, 'Bulk Water', query, 1022, this.infrustructureURL + '/', [70, 134, 68, 55, 56, 69, 75, 130, 54, 76, 77, 135, 71, 136, 58, 53, 60, 131, 138, 61, 73, 137, 51, 63, 50, 62, 132, 133, 78, 52, 57, 59]);

                //Join lists
                exclusionsList = exclusionsList.concat(bulkWaterExclusions);

                //Effluent
                const effluentExclusions = await this.InterceptInfrustructureChecker(SubDepartmentName, 'Water Demand Management', query, 1023, this.infrustructureURL + '/', [100, 101, 102, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114]); //Removed 103 because it is a 'fields' layer and no polygons are present on it.

                // Calculate the time taken for InterceptInfrustructureChecker
                const interceptionEndTime = Date.now();
                const interceptionTimeInSeconds = (interceptionEndTime - interceptionStartTime) / 1000;

                console.log(`InterceptInfrustructureChecker took ${interceptionTimeInSeconds} seconds to complete.`);

                //Join lists
                exclusionsList = exclusionsList.concat(effluentExclusions);
                console.log(exclusionsList);
                /*                  this.toggleLoadingIndicator(false, null); // Show loading indicator*/

                //Send too ALL Admin users in this subdepartment
                this.sharedService.distributionList = this.sharedService.distributionList.concat(zoneAdminUsers);

                //Removes all the excluded departments
                this.sharedService.distributionList = this.sharedService.distributionList.filter(item => !exclusionsList.includes(item.subDepartmentID));
                /*                    this.sharedService.distributionList.push(tempDistributionList);*/
                //console.log("For department " + this.sharedService.subDepartmentList[i].subDepartmentName + " the application will be distributed to the following Admin users, as this department has no zones, therefore we assume it is the entire city", this.sharedService.distributionList);
                46
                //This code runs when a subdepartment consists of multiple regions
              } else if (mapLayerID > -1) {
                this.toggleLoadingIndicator(true, "Processing " + SubDepartmentName + "(>-1 layers)"); // Show loading indicator

                // Set up the layer in the MapServer to query against
                mapServerLayerUrl[i] = this.zonesURL + "/" + mapLayerID;

                const mapServerLayer = new FeatureLayer({
                  url: mapServerLayerUrl[i]
                });

                //Query the layer for the current subdepartment. The intersecting layer objectIDs should be returned.
                mapServerLayer.queryFeatures(query).then((result) => {
                  this.toggleLoadingIndicator(true, "Processing " + SubDepartmentName + " (Checking results)"); // Show loading indicator

                  // Handle the resulting features that intersect or are within the drawn polygon
                  const features = result.features;
                  // Do something with the features

                  //Get the number of OBJECTS here and their OBJECTIDs
                  /*              const numOfObjects = result.features.length;*/

                  // Iterate through the features
                  features.forEach((feature) => {
                    this.toggleLoadingIndicator(true, "Processing " + SubDepartmentName + " (Checking results " + feature.attributes.OBJECTID + ")"); // Show loading indicator

                    //Get the objectID for the current iterated polygon interception
                    // @ts-ignore
                    const OBJECTID = feature.attributes.OBJECTID;
                    //Filter the list returned from the server to only include the departments that have been intercepted during polygon drawing.

                    //const distance = geometryEngine.distance(query.geometry, feature.geometry, 'meters');
                    //return distance <= 2;

                    const filteredList = zoneAdminUsers.filter(obj => obj.mapObjectID === OBJECTID && obj.subDepartmentID === SubDepartmentID);

                    this.sharedService.distributionList = this.sharedService.distributionList.concat(filteredList);
                    //Removes all the excluded departments
                    this.sharedService.distributionList = this.sharedService.distributionList.filter(item => !exclusionsList.includes(item.subDepartmentID));

                    /*                      Removes duplicates caused for whatever reason.*/
                    const tempList = this.sharedService.distributionList;

                    const seenCombinations = {}; // To keep track of seen combinations

                    this.sharedService.distributionList = tempList.filter(item => {
                      const key = `${item.subDepartmentID}-${item.zoneID}-${item.email}`;

                      if (!seenCombinations[key]) {
                        seenCombinations[key] = true;
                        return true;
                      }

                      return false;
                    });

                    /*                      this.sharedService.distributionList = [...new Set(this.sharedService.distributionList)];*/

                    /*                    this.sharedService.distributionList.push(tempDistributionList);*/
                    console.log("Distribution list", this.sharedService.distributionList);
                    //  this.toggleLoadingIndicator(false, null); // Show loading indicator
                    /*                        this.drawingIsComplete += 1;*/
                    //this.toggleLoadingIndicator(false, null);

                  });

                  this.toggleLoadingIndicator(false, null);
                });


                //This code runs if the field is null or contains something unexpected
              } else {
                //  this.toggleLoadingIndicator(false, null); // Show loading indicator
              }

              /*              console.log(filteredList);*/
              // Use the filteredList as needed
            }
            else {
              //this.toggleLoadingIndicator(false, null); // Show loading indicator
              //alert("Invalid Email or Password");
              /*              alert(data.responseMessage);*/
              /*        return null;*/
            }
            /*            console.log("reponse", data);*/
            return null;
          }, error => {
            //this.toggleLoadingIndicator(false, null); // Show loading indicator
            console.log("Error:", error);
          });


          //Nullish coalescing
          //if (mapLayerID !== null && mapLayerID !== undefined) {
          //}
          /*          console.log("Number of subdepartments", i);*/
        } else {
          //do not distribute to this department.
        }

        //  this.toggleLoadingIndicator(false, null); // Show loading indicator
      }

      //this.toggleLoadingIndicator(false); // Hide loading indicator when done

      //Energy
      // Perform the spatial query

      //await alert("This application will be assigned to the following managers: \r" + this.assignTo);

      //console.log(this.sharedService.totalAddedFeatures);
      //this.assignTo = "";

      //Now get the geometry of this polygon using the globalID
      //this.toggleLoadingIndicator(false, null); // Show loading indicator

    } catch (error) {
      this.toggleLoadingIndicator(true, "An error occured while processing your drawing, please try again."); // Show loading indicator
    } finally {
      clearTimeout(this.loadingTimer); // Clear the timer for the main operation
      this.toggleLoadingIndicator(false, null);
      this.takingTooLong = "";
    }
  }

  // Function to buffer a given geometry by a specified distance

}
