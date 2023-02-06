import { Component, Inject, OnInit, ElementRef, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
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
import WebMap from '@arcgis/core/WebMap';
import FormTemplate from "@arcgis/core/form/FormTemplate";
/*import * as esri from 'esri-leaflet';*/
import Layer from "@arcgis/core/layers/Layer"
/*import LayerInfos from '@arcgis/core/widgets/Editor'*/

/*import HHelpers from '../helpers';*/
//import { Injectable } from '@angular/core';

//@Injectable({
//  providedIn: 'root'
//})

@Component({
  selector: 'app-project-details-map',
  templateUrl: './project-details-map.component.html',
  styleUrls: ['./project-details-map.component.css']
})
export class ProjectDetailsMapComponent implements OnInit {

  constructor(
    /*        @Inject(ARCGIS_CONFIG) private config: ArcgisConfig,*/
    //private deviceService: DeviceDetectorService,
    //  private translate: TranslateService,
  ) { /*this.helper = new HHelpers()*/ }

  /*  This binds the element to the component's element. Without this, when the index page is rendered, the viewMap element does not exist*/
  @ViewChild('viewMap', { static: true }) private mapViewEl!: ElementRef;

  @ViewChild('peopelTableDiv', { static: true }) private peopleTableDivEl!: ElementRef;
  @ViewChild('languageTableDiv', { static: true }) private languageTableDivEl!: ElementRef;
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

  ngOnInit(): void {
    this.positionAndMapLoad();
  }

  private async positionAndMapLoad() {
    await this.setPosition();
    await this.initializeMap();

  }

  private initializeMap(): Promise<any> {
    const graphicsLayer = new GraphicsLayer();
    let pointLayer: FeatureLayer, lineLayer: FeatureLayer, polygonLayer: FeatureLayer;

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
      basemap: 'gray-vector',
      layers: [graphicsLayer]
    });

    //const map = new WebMap({
    //  portalItem: {
    //    id: "459a495fc16d4d4caa35e92e895694c8"
    //  }
    //});

    const view = new MapView({
      container: this.mapViewEl.nativeElement,
      map: map,
      zoom: 5,
      center: this.position,
      /*      center: [90, 45]*/
      /*      center: [-33.918861, 18.423300]*/
    });

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

    //const searchWidget = new Search({
    //  view: view,
    //  popupEnabled: false,
    //  locationEnabled: false,
    //  resultGraphicEnabled: false,
    //  container: this.searchDivEl.nativeElement
    //});
    //searchWidget.on('select-result', () => {
    //  this.view.zoom = this.defaultZoom;
    //});
    //view.ui.add(searchWidget, {
    //  position: 'top-right',
    //  index: 1,
    //});

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
    return this.view.when(() => {
      const sketch = new Sketch({
        layer: graphicsLayer,
        view: view,
        // graphic will be selected as soon as it is created
        creationMode: "update"
      });

      view.ui.add(sketch, "top-right");

      var testlayer = new MapImageLayer({
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer"
      })

      map.add(testlayer);

      /*      External layers*/
      var streetlights = new MapImageLayer({
        url: "https://citymaps.capetown.gov.za/agsext/rest/services/Theme_Based/Basic_Services_Infrastructure/MapServer"
      })

      map.add(streetlights);

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
      const featureLayer = new FeatureLayer({
        url: "https://esapqa.capetown.gov.za/agsext/rest/services/Theme_Based/Wayleaves/FeatureServer"
      });

      map.add(featureLayer);


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
        view.map.editableLayers.forEach((layer) => {
          if (layer.type === 'feature') {
            switch (layer.geometryType) {
              case "polygon":
                polygonLayer = featureLayer;
                break;
              case "polyline":
                lineLayer = featureLayer;
                break;
              case "point":
                pointLayer = featureLayer;
                break;
            }
          }
        });

        // Set the point layer's LayerInfo
        const pointInfos = {
          layer: pointLayer,
          formTemplate: { // autocasts to FormTemplate
            elements: [{ // autocasts to Field Elements
              type: "field",
              fieldName: "HazardType",
              label: "Hazard type"
            }, {
              type: "field",
              fieldName: "Description",
              label: "Description"
            }, {
              type: "field",
              fieldName: "SpecialInstructions",
              label: "Special Instructions"
            }, {
              type: "field",
              fieldName: "Status",
              label: "Status"
            }, {
              type: "field",
              fieldName: "Priority",
              label: "Priority"
            }]
          }
        };

        // Set the line layer's LayerInfo
        const lineInfos = {
          layer: lineLayer,
          formTemplate: { // autocasts to FormTemplate
            elements: [{ // autocasts to FieldElement
              type: "field",
              fieldName: "Severity",
              label: "Severity"
            }, {
              type: "field",
              fieldName: "blocktype",
              label: "Type of blockage"
            }, {
              type: "field",
              fieldName: "fullclose",
              label: "Full closure"
            }, {
              type: "field",
              fieldName: "active",
              label: "Active"
            }, {
              type: "field",
              fieldName: "locdesc",
              label: "Location Description"
            }]
          }
        };

        // Set the polygon layer's LayerInfo
        const polyInfos = {
          layer: polygonLayer,
          formTemplate: { // autocasts to FormTemplate
            elements: [{ // autocasts to FieldElement
              type: "field",
              fieldName: "incidenttype",
              label: "Incident Type"
            }, {
              type: "field",
              fieldName: "activeincid",
              label: "Active"
            }, {
              type: "field",
              fieldName: "descrip",
              label: "Description"
            }]
          }
        };

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


      // At the very minimum, set the Editor's view
      const editor = new Editor({
        view: view
      });

      view.ui.add(editor, "top-right");

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
