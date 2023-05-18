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

  public stringifiedData: any;
  public CurrentUser: any;

  ngOnInit(): void {
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

    const map = new Map({
      basemap: 'gray-vector',
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
      nextBasemap: "hybrid" // allows for toggling to the 'hybrid' basemap
    });

    view.ui.add(toggle, "bottom-right");

    const searchWidget = new Search({
      view: view,
      popupEnabled: true,
      locationEnabled: false,
      resultGraphicEnabled: true,
      container: this.searchDivEl.nativeElement
    });
    searchWidget.on('select-result', (event) => {
      console.log("The selected search result: ", event.result.name);
      this.sharedService.setAddressData(event.result.name)
    });
    view.ui.add(searchWidget, {
      position: 'top-left',
      index: 1,
    });

    this.view = view;
    this.map = map;

    const featureLayer = new FeatureLayer({
      url: "https://esapqa.capetown.gov.za/agsext/rest/services/Theme_Based/Wayleaves/FeatureServer",
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
      var streetlights = new MapImageLayer({
        url: "https://citymaps.capetown.gov.za/agsext/rest/services/Theme_Based/Basic_Services_Infrastructure/MapServer"
      })

      map.add(streetlights);

      /*      Internal layers*/
      var internalLayer = new MapImageLayer({
        url: "https://isap.capetown.gov.za/agsint/rest/services/Theme_Based/Basic_Services_Infrastructure/MapServer"
      })

      map.add(internalLayer);

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



}
