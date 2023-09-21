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
import Sketch from '@arcgis/core/widgets/Sketch';
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
import { Polygon } from '@arcgis/core/geometry';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import * as Geometry from '@arcgis/core/geometry/Geometry';
import FeatureForm from '@arcgis/core/widgets/FeatureForm';
import FeatureTemplates from '@arcgis/core/widgets/FeatureTemplates';
import ExpressionInfo from '@arcgis/core/form/ExpressionInfo';
import FieldElement from '@arcgis/core/form/elements/FieldElement';
import BasemapToggle from '@arcgis/core/widgets/BasemapToggle';
import { SharedService } from "src/app/shared/shared.service"

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

@Component({
  selector: 'app-project-details-map-view',
  templateUrl: './project-details-map-view.component.html',
  styleUrls: ['./project-details-map-view.component.css']
})
export class ProjectDetailsMapViewComponent implements OnInit {
  /*  @Input() data: string; //retrieves this data from the parent component*/
  @Input() data: any; //retrieves this data from the parent component
  constructor(
    private sharedService: SharedService
    /*        @Inject(ARCGIS_CONFIG) private config: ArcgisConfig,*/
    //private deviceService: DeviceDetectorService,
    //  private translate: TranslateService,
  ) { /*this.helper = new HHelpers()*/ }

  /*  This binds the element to the component's element. Without this, when the index page is rendered, the viewMap element does not exist*/
  @ViewChild('viewDiv', { static: true }) private viewDivEl!: ElementRef;
  @ViewChild('searchDiv', { static: true }) private searchDivEl!: ElementRef;
  private helper: any;
  public view!: MapView;
  public slideToggleScript: string = 'Show Feature Table';
  public isChecked: boolean = false;
  public isLoading = true;
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

  stringifiedData: any;
  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;

  //MapURLs
  featureServerViewURL: string;
  zonesURL: string;
  basicServicesInfrustructureSanitized: string;
  basicServicesInfrustructureUnsanitized: string;

  AllConfig: ConfigList[] = [];
  MapConfig: ConfigList[] = [];


  ngOnInit(): void {
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    this.AllConfig = this.sharedService.getAllConfig();
    this.mapURLLoader();

    if (this.data.applicationID != null && this.data.applicationID != undefined) {
    } else {
      this.data.applicationID = this.sharedService.getApplicationID();
    }
    this.positionAndMapLoad();
  }

  private async positionAndMapLoad() {
    await this.setPosition();
    await this.initializeMap();
  }

  private async initializeMap(): Promise<any> {
    this.data.applicationID = this.sharedService.getViewApplicationIndex().applicationID;
    console.log("ApplicationID " + this.data.applicationID)
    console.log("IsActive " + this.data.isActive)
    console.log("CreatedByID " + this.data.createdByID)

    //const map = new Map({
    //  basemap: 'gray-vector',
    //});

    const map = new Map({
      basemap: 'hybrid',
      /*      layers: [graphicsLayer]*/
      /*      layers: [pointLayer, lineLayer, polygonLayer]*/

    });

    const view = new MapView({
      container: this.viewDivEl.nativeElement,
      map: map,
      zoom: 5,
      center: this.position,
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

    //const searchWidget = new Search({
    //  view: view,
    //  popupEnabled: true,
    //  locationEnabled: false,
    //  resultGraphicEnabled: true,
    //  container: this.searchDivEl.nativeElement
    //});

    //searchWidget.on('select-result', (event) => {
    //  console.log("The selected search result: ", event.result.name);
    //  this.sharedService.setAddressData(event.result.name)
    //});
    //view.ui.add(searchWidget, {
    //  position: 'top-left',
    //  index: 1,
    //});

    this.view = view;
    this.map = map;

    const featureLayer = new FeatureLayer({
      url: this.featureServerViewURL,
      title: "Client's polygon",
      /*        definitionExpression: "OBJECTID = 1"*/
      /*            definitionExpression: "CRTD_BY_ID = 777"*/
      /*      definitionExpression: "CRTD_BY_ID = '22ee5b58-db0e-4774-8245-bf7b59670e44'",*/
      definitionExpression: "WLMS_APLC_KEY = '" + this.data.applicationID + "'"
    });

    return this.view.when(() => {

      /*    This is used to zoom into the area of the relevant polygons for the application*/
      const query = featureLayer.createQuery()
      query.where = "WLMS_APLC_KEY = '" + this.data.applicationID + "'";
      featureLayer.queryExtent(query).then(function (result) {
        view.goTo(result.extent);
      })

      /*      External layers*/
      var externalLayer = new MapImageLayer({
        url: this.basicServicesInfrustructureSanitized,
      })

      map.add(externalLayer);

      /*      Internal layers*/
      var internalLayer = new MapImageLayer({
        url: this.basicServicesInfrustructureUnsanitized,
      })

      map.add(internalLayer);

   /*   Regions*/
      var zones = new MapImageLayer({
        url: this.zonesURL,

      })

      map.add(zones);

      /*      Add layerlist and legend*/
      var layerList = new LayerList({
        view: view
      });

      view.ui.add(layerList, "top-left");

      var legend = new Legend({
        view: view
      });

      view.ui.add(legend, "top-left");

      map.add(featureLayer);

      // At the very minimum, set the Editor's view
      //const editor = new Editor({
      //  layerInfos: [{
      //    layer: featureLayer,

      //  }],
      //  view: view as MapView,
      //  /*        allowedWorkflows: "update",*/
      //});
      //view.ui.add(editor, "top-right");

    })
  };

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

  mapURLLoader() {
    this.MapConfig = this.AllConfig.filter((config) => config.configName === 'Map');

    // Filter the list so that only the first row with 'ServerType', is returned.
    const serverType = this.AllConfig.find((config) => config.configName === 'ServerType').utilitySlot1;
    const MapConfigForServer = this.MapConfig.filter((config) => config.utilitySlot1 === serverType);

    //Check if user is internal or external
    if (this.CurrentUserProfile[0].isInternal) {
      //Internal users have access to both Internal and external layers
      const MapConfigForServerForUserE = MapConfigForServer.filter((config) => config.utilitySlot2 === 'External');

      MapConfigForServerForUserE.forEach((config) => {
        switch (config.utilitySlot3) {
          case 'FeatureServer(View)':
            // Handle the case when UtilitySlot3 is 'FeatureServer(Edit)'
            this.featureServerViewURL = config.configDescription
            console.log(`Handling FeatureServer(View) for ConfigID ${config.configID}`);
            // Add your code here for this case
            break;

          case 'Zones':
            // Handle the case when UtilitySlot3 is 'Zones'
            this.zonesURL = config.configDescription
            console.log(`Handling Zones for ConfigID ${config.configID}`);
            // Add your code here for this case
            break;
          case 'BasicServicesInfrastructure':
            // Handle the case when UtilitySlot3 is 'Zones'
            this.basicServicesInfrustructureSanitized = config.configDescription

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

      const MapConfigForServerForUserI = MapConfigForServer.filter((config) => config.utilitySlot2 === 'Internal');

      MapConfigForServerForUserI.forEach((config) => {
        switch (config.utilitySlot3) {
          case 'FeatureServer(View)':
            // Handle the case when UtilitySlot3 is 'FeatureServer(Edit)'
            this.featureServerViewURL = config.configDescription
            console.log(`Handling FeatureServer(View) for ConfigID ${config.configID}`);
            // Add your code here for this case
            break;

          case 'Zones':
            // Handle the case when UtilitySlot3 is 'Zones'
            this.zonesURL = config.configDescription
            console.log(`Handling Zones for ConfigID ${config.configID}`);
            // Add your code here for this case
            break;
          case 'BasicServicesInfrastructure':
            // Handle the case when UtilitySlot3 is 'Zones'
            this.basicServicesInfrustructureUnsanitized = config.configDescription

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

        //Add all "Other" maps
        const MapConfigForServerForUserForTypeOther = MapConfigForServerForUserI.filter((config) => config.utilitySlot3 === 'Other');

        MapConfigForServerForUserForTypeOther.forEach((config) => {
          // Perform the action for each configuration with UtilitySlot3 equal to 'Other'
          /*      Internal layers*/
          var otherLayer = new MapImageLayer({
            url: config.configDescription,
            visible: false
          })

          this.map.add(otherLayer);

          console.log(`Performing action for ConfigID ${config.configID}`);
          // Add your code here to perform the action
        });

      });

    } else if (!this.CurrentUserProfile[0].isInternal) {
      const MapConfigForServerForUser = MapConfigForServer.filter((config) => config.utilitySlot2 === 'External');

      MapConfigForServerForUser.forEach((config) => {
        switch (config.utilitySlot3) {
          case 'FeatureServer(View)':
            // Handle the case when UtilitySlot3 is 'FeatureServer(Edit)'
            this.featureServerViewURL = config.configDescription
            console.log(`Handling FeatureServer(Edit) for ConfigID ${config.configID}`);
            // Add your code here for this case
            break;

          case 'Zones':
            // Handle the case when UtilitySlot3 is 'Zones'
            this.zonesURL = config.configDescription
            console.log(`Handling Zones for ConfigID ${config.configID}`);
            // Add your code here for this case
            break;
          case 'BasicServicesInfrastructure':
            // Handle the case when UtilitySlot3 is 'Zones'
            this.basicServicesInfrustructureSanitized = config.configDescription

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

}
