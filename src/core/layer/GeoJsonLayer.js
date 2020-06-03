/*
 * @Author: Caven
 * @Date: 2020-01-13 10:13:53
 * @Last Modified by: Caven
 * @Last Modified time: 2020-06-03 14:21:04
 */

import { Layer, VectorLayer } from './index'
import { Billboard, Polyline, Polygon, Model } from '../overlay'
import State from '../state/State'

const { Cesium } = DC.Namespace

class GeoJsonLayer extends Layer {
  constructor(id, url, options = {}) {
    if (!url) {
      throw new Error('GeoJsonLayer：the url invalid')
    }
    super(id)
    this._delegate = Cesium.GeoJsonDataSource.load(url, options)
    this.type = Layer.getLayerType('geojson')
    this._state = State.INITIALIZED
  }

  set show(show) {
    this._show = show
    this._delegate &&
      this._delegate.then(dataSource => {
        dataSource.show = this._show
      })
  }

  get show() {
    return this._show
  }

  _createBillboard(entity) {
    if (entity.position && entity.billboard) {
      return Billboard.fromEntity(entity)
    }
  }

  _createPolyline(entity) {
    if (entity.polyline) {
      return Polyline.fromEntity(entity)
    }
  }

  _createPolygon(entity) {
    if (entity.polygon) {
      return Polygon.fromEntity(entity)
    }
  }

  _ceateModel(entity, modelUrl) {
    if (entity) {
      return Model.fromEntity(entity, modelUrl)
    }
  }

  /**
   *
   * @param {*} method
   * @param {*} context
   */
  eachOverlay(method, context) {
    if (this._delegate) {
      this._delegate.then(dataSource => {
        let entities = dataSource.entities.values
        entities.forEach(item => {
          method.call(context, item)
        })
      })
      return this
    }
  }

  /**
   *
   */
  toVectorLayer() {
    let layer = new VectorLayer(this._id)
    this.eachOverlay(item => {
      if (item.billboard) {
        layer.addOverlay(this._createBillboard(item))
      } else if (item.polyline) {
        layer.addOverlay(this._createPolyline(item))
      } else if (item.polygon) {
        layer.addOverlay(this._createPolygon(item))
      }
    })
    return layer
  }

  /**
   *
   */
  toModelLayer() {
    let layer = new VectorLayer(this._id)
    this.eachOverlay(item => {
      layer.addOverlay(this._ceateModel(item))
    })
    return layer
  }
}

Layer.registerType('geojson')

export default GeoJsonLayer
