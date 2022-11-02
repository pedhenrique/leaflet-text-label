import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { v4 as uuidv4 } from "uuid";

function handleDelete(_) {
  this.remove();
}

function getPopupLatLng(bounds, map) {
  const sePoint = map.latLngToLayerPoint(bounds.getSouthEast());
  const swPoint = map.latLngToLayerPoint(bounds.getSouthWest());
  const middleOffset = [(swPoint.x + sePoint.x) / 2, swPoint.y + 50];
  return map.layerPointToLatLng(middleOffset);
}

L.LeafletTextLabel = L.SVGOverlay.extend({
  initialize: function (options) {
    this._corner1 = null;
    this._corner2 = null;
    this._bounds = L.latLngBounds(L.latLng(0, 0), L.latLng(0, 0));
    this._guideRect = null;
    this._width = 0;
    this._height = 0;
    this._options = options;
    this._textAreaElement = null;
    this._uuid = uuidv4();
    this._svgElement = this._createEmptySVG();
    this._isEditing = false;
    this._text = "";
    this._deleteBtn = null;
    this._popup = L.popup({
      className: "leaflet-text-label-popup",
      closeButton: false,
    })
      .setLatLng([0, 0])
      .setContent((layer) => {
        this._deleteBtn = L.DomUtil.create(
          "div",
          "lealfet-text-label-popup-item-btn"
        );
        L.DomEvent.on(this._deleteBtn, "click", handleDelete, this);

        return this._deleteBtn;
      });

    // initialize an empty svg
    L.SVGOverlay.prototype.initialize.call(
      this,
      this._svgElement,
      this._bounds,
      { ...this._options, interactive: true }
    );
  },
  onAdd: function (map) {
    map.once("mousedown", (e) => {
      map.dragging.disable();
      this._corner1 = e.latlng;
      this._guideRect = L.rectangle(
        L.latLngBounds(this._corner1, this._corner1),
        {
          opacity: 1,
          color: "#000",
          fillOpacity: 0,
          dashArray: [5, 5],
          weight: 1,
        }
      ).addTo(map);
      map.on("mousemove", ({ latlng }) => {
        this._corner2 = latlng;
        this._guideRect.setBounds(L.latLngBounds(this._corner1, this._corner2));
      });
    });

    map.once("mouseup", (e) => {
      map.off("mousemove");
      map.dragging.enable();
      this._corner2 = e.latlng;
      this._bounds = L.latLngBounds(this._corner1, this._corner2);
      this._setWidthHeightBounds(map, this._bounds);
      this.setBounds(this._bounds);
      this._addEvents();
      this._edit();
    });

    L.SVGOverlay.prototype.onAdd.call(this, map);
  },
  onRemove: function (map) {
    L.DomEvent.off(this._deleteBtn, "click", handleDelete, this);
    L.DomUtil.remove(this._deleteBtn);
    this._popup.remove();
    L.DomUtil.remove(this._svgElement);
    this._guideRect.remove();
    L.SVGOverlay.prototype.onRemove(map);
  },
  _setWidthHeightBounds: function (map, bounds) {
    const topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
    const bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());
    this._width = Math.abs(bottomRight.x - topLeft.x);
    this._height = Math.abs(bottomRight.y - topLeft.y);
  },
  _createEmptySVG: function () {
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    return svgElement;
  },
  _setEditSVG: function () {
    this._svgElement.setAttribute(
      "viewBox",
      "0 0 " + this._width + " " + this._height
    );
    this._svgElement.innerHTML = `
      <foreignObject x="0" y="0" width="${this._width}" height="${this._height}">
        <textarea id="${this._uuid}"></textarea>
      </foreignObject>
    `;
    this._textAreaElement = document.getElementById(this._uuid);
  },
  _setViewingSVG: function () {
    const tSpanArr = this._text
      .split("\n")
      .map((part) => {
        return `<tspan x="0" dy="${part === "" ? `2em` : `1em`}">${
          part || "&nbsp"
        }</tspan>`;
      })
      .join("\n");

    this._svgElement.innerHTML = `
      <text
        id=${this._uuid}
        x=0
        y=0
        textAnchor="middle"
      >${tSpanArr}</text>
    `;
    this._updateSVGTransform();
  },
  _updateSVGTransform: function () {
    const textNode = document.getElementById(this._uuid);
    if (textNode) {
      const bb = textNode.getBBox();
      const widthTransform = this._width / bb.width;
      const heightTransform = this._height / bb.height;
      this._value =
        widthTransform < heightTransform ? widthTransform : heightTransform;
      textNode.style.transform = "scale(" + this._value + ")";
      textNode.style.transformOrigin = "0px 0px";
    }
  },
  _edit: function () {
    console.log("edit");
    this._isEditing = true;
    this._guideRect.pm.disableLayerDrag();
    // this._guideRect.pm.disableRotate();
    this._guideRect.pm.enable({ snappable: false, preventMarkerRemoval: true });
    this.bringToFront();
    this._setEditSVG();
    this._textAreaElement.value = this._text;
    this._guideRect.setStyle({ opacity: 1 });
    this._map.dragging.disable();
    this._textAreaElement.focus();
    L.DomEvent.on(
      this._textAreaElement,
      "mousemove",
      L.DomEvent.stopPropagation
    );
    L.DomEvent.disableClickPropagation(this._textAreaElement);
    this._map.on("click", ({ latlng }) => {
      if (!this._bounds.pad(0.025).contains(latlng)) {
        this._finishEdit();
      }
    });
  },
  _finishEdit: function () {
    console.log("finish edit");
    this._text = this._textAreaElement.value;
    this._isEditing = false;
    this._guideRect.pm.enableLayerDrag();
    // this._guideRect.pm.enableRotate();
    this._guideRect.pm.disable();
    this.bringToBack();
    this._setViewingSVG();
    if (this.getText()) {
      this._guideRect.setStyle({ opacity: 0 });
    }
    this._map.dragging.enable();
    L.DomEvent.off(
      this._textAreaElement,
      "mousedown",
      L.DomEvent.stopPropagation
    );
    L.DomEvent.off(
      this._textAreaElement,
      "mouseup",
      L.DomEvent.stopPropagation
    );
    L.DomEvent.off(
      this._textAreaElement,
      "mousemove",
      L.DomEvent.stopPropagation
    );
    this._map.off("mousedown");

    this.fire("editend", {
      text: this._textAreaElement.value,
      bounds: this._bounds,
      id: this._uuid,
    });
  },
  _addEvents: function () {
    this._guideRect.on("click", (e) => {
      console.log("handleClick");
      L.DomEvent.stopPropagation(e);
      this._guideRect.setStyle({ opacity: 1 });
      this._popup.setLatLng(getPopupLatLng(this._bounds, this._map));
      this._map.openPopup(this._popup);
    });
    this._guideRect.on("dblclick", (e) => {
      console.log("handledblclick");
      L.DomEvent.stopPropagation(e);
      if (this._isEditing || this._guideRect.pm.dragging()) {
        return;
      }
      this._edit();
    });
    this._guideRect.on("pm:dragstart", (e) => {
      console.log("handleDragStart");
      e.layer.setStyle({ opacity: 1 });
      this._map.closePopup(this._popup);
    });
    this._guideRect.on("pm:dragend", (e) => {
      console.log("handleDragEnd");
      if (this.getText()) {
        e.layer.setStyle({ opacity: 0 });
      }
      this._map.closePopup(this._popup);
    });
    this._guideRect.on("pm:drag", (e) => {
      console.log("handleDrag");
      this._bounds = e.layer.getBounds();
      this.setBounds(this._bounds);
    });

    const handleResize = ({ layer }) => {
      this._bounds = L.latLngBounds(layer.getBounds());
      this._setWidthHeightBounds(this._map, this._bounds);
      this.setBounds(this._bounds);
      this._setEditSVG();
      this._textAreaElement.value = this._text;
    };

    const handleResizeStart = (_) => {
      this._map.closePopup(this._popup);
    };

    const handleResizeEnd = ({ layer }) => {
      this._map.openPopup(this._popup);
      handleResize({ layer });
    };

    this._guideRect.on("pm:markerdragstart", handleResizeStart);
    this._guideRect.on("pm:markerdragend", handleResize);
    this._guideRect.on("pm:markerdrag", handleResize);
  },
  getText: function () {
    return this._text;
  },
});

L.leafletTextLabel = function (options) {
  return new L.LeafletTextLabel(options);
};
