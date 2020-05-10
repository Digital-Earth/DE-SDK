/*
 * @Author: Caven
 * @Date: 2020-03-17 16:19:15
 * @Last Modified by: Caven
 * @Last Modified time: 2020-05-10 10:58:10
 */

const { Cesium } = DC.NameSpace

class Edit {
  constructor(plotInfo) {
    this._viewer = plotInfo.viewer
    this._plotEvent = plotInfo.plotEvent
    this._layer = plotInfo.layer
    this._overlay = plotInfo.overlay
    this._markers = []
    this._currentMarker = undefined
  }

  _mouseMoveHandler(e) {}

  _mouseRightClickHandler(e) {
    this._unbindEnvet()
    this._layer.clear()
    this._plotEvent.raiseEvent({
      type: DC.OverlayType.POLYLINE,
      points: DC.T.transformCartesianArrayToWGS84Array(this._positions)
    })
  }

  _bindEvent() {
    this._viewer.on(
      Cesium.ScreenSpaceEventType.MOUSE_MOVE,
      this._mouseMoveHandler,
      this
    )
    this._viewer.on(
      Cesium.ScreenSpaceEventType.RIGHT_CLICK,
      this._mouseRightClickHandler,
      this
    )
  }

  _unbindEnvet() {
    this._viewer.off(
      Cesium.ScreenSpaceEventType.MOUSE_MOVE,
      this._mouseMoveHandler,
      this
    )

    this._viewer.off(
      Cesium.ScreenSpaceEventType.RIGHT_CLICK,
      this._mouseRightClickHandler,
      this
    )
  }

  _prepareMarkers() {}

  start() {
    this._layer.clear()
    this._bindEvent()
    this._prepareMarkers()
  }
}

export default Edit
