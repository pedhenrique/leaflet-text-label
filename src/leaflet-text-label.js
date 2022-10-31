import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import { v4 as uuidv4 } from "uuid";

function handleTextAreaClick(e) {
  console.log("handleTextAreaClick");
  L.DomEvent.stopPropagation(e);
  if (this._isEditing || this._guideRect.pm.dragging()) {
    return;
  }
  this._edit();
}

function handleTextAreaBlur(e) {
  console.log("handleTextAreaBlur");
  this._text = this._textAreaElement.value;
  if (this.getText()) {
    this._guideRect.setStyle({ opacity: 0 });
  }
  this._isEditing = false;
  this._map.dragging.enable();
  this._guideRect.pm.enableLayerDrag();
  this.bringToBack();

  L.DomEvent.off(this._textAreaElement, "mousedown", stopPropagation);
  L.DomEvent.off(this._textAreaElement, "mouseup", stopPropagation);
  L.DomEvent.off(this._textAreaElement, "mousemove", stopPropagation);

  this._setViewingSVG();

  this.fire("editend", {
    text: this._textAreaElement.value,
    bounds: this._bounds,
    id: this._uuid,
  });
}

function stopPropagation(event) {
  L.DomEvent.stopPropagation(event);
}

function handleDragStart(e) {
  console.log("handleDragStart");
  e.layer.setStyle({ opacity: 1 });
}

function handleDragEnd(e) {
  console.log("handleDragEnd");

  if (this.getText()) {
    e.layer.setStyle({ opacity: 0 });
  }
}

function handleDrag(e) {
  console.log("handleDrag");

  this._bounds = e.layer.getBounds();
  this.setBounds(this._bounds);
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

    // initialize an empty svg
    L.SVGOverlay.prototype.initialize.call(
      this,
      this._svgElement,
      this._bounds,
      { ...this._options, interactive: true }
    );
  },
  onAdd: function (map) {
    const _mousemove = ({ latlng }) => {
      this._corner2 = latlng;
      this._guideRect.setBounds(L.latLngBounds(this._corner1, this._corner2));
    };

    map.once("mousedown", ({ latlng }) => {
      map.dragging.disable();
      this._corner1 = latlng;
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
      map.on("mousemove", _mousemove);
    });

    map.once("mouseup", ({ latlng }) => {
      map.dragging.enable();
      this._corner2 = latlng;
      map.off("mousemove", _mousemove);
      this._bounds = L.latLngBounds(this._corner1, this._corner2);
      this._setWidthHeightBounds(map, this._bounds);
      this.setBounds(this._bounds);
      this._guideRect.on("dblclick", handleTextAreaClick, this);
      this._guideRect.on("pm:dragstart", handleDragStart);
      this._guideRect.on("pm:dragend", handleDragEnd, this);
      this._guideRect.on("pm:drag", handleDrag, this);
      this._edit();
    });

    L.SVGOverlay.prototype.onAdd.call(this, map);
  },
  onRemove: function (map) {
    this._guideRect.off("dblclick", handleTextAreaClick, this);
    this._guideRect.off("pm:dragstart", handleDragStart);
    this._guideRect.off("pm:dragend", handleDragEnd, this);
    this._guideRect.off("pm:drag", handleDrag, this);
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
    this.bringToFront();
    this._setEditSVG();
    this._textAreaElement.value = this._text;
    this._guideRect.setStyle({ opacity: 1 });
    this._map.dragging.disable();
    this._textAreaElement.focus();
    L.DomEvent.on(this._textAreaElement, "mousedown", stopPropagation);
    L.DomEvent.on(this._textAreaElement, "mouseup", stopPropagation);
    L.DomEvent.on(this._textAreaElement, "mousemove", stopPropagation);
    L.DomEvent.on(this._textAreaElement, "blur", handleTextAreaBlur, this);
  },
  getText: function () {
    return this._text;
  },
});

L.leafletTextLabel = function () {
  return new L.LeafletTextLabel();
};
