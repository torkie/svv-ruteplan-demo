/****************************************************************************
    leaflet-control-mouseposition.js,

    (c) 2016, FCOO

    https://github.com/FCOO/leaflet-control-mouseposition
    https://github.com/FCOO

****************************************************************************/
(function (L/*, window, document, undefined*/) {
    "use strict";

    L.Control.Mouseposition = L.Control.extend({
        options: {
            VERSION : "1.0.3",
            position: 'bottomleft'
        },

        onAdd: function (map) { 
            map.on('mousemove', this._onMouseposition, this);

            var result = L.DomUtil.create('div', 'leaflet-control-mouseposition-outer hidden');

            //result.append( L.DomUtil.create('div', 'leaflet-control-mouseposition-background') );

            this.textElement = L.DomUtil.create('div', 'leaflet-control-mouseposition');
            result.appendChild( this.textElement );

            this.outerElement = result; 
           
            return result; 
        },

        onRemove: function (map) {
            map.off('mouseposition', this._onMouseposition);
        },

        onClick: function( func, context ){
            L.DomUtil.addClass( this._container, 'leaflet-control-mouseposition-clickable' );
            L.DomEvent.disableClickPropagation( this.outerElement );
            L.DomEvent.addListener( this.outerElement, 'click', func, context );
        },

        _onMouseposition: function ( mouseEvent ) {
            if ((this.mouseEvent ? this.mouseEvent.latlng : null) != (mouseEvent ? mouseEvent.latlng : null)){
                if (mouseEvent && mouseEvent.latlng)
                    L.DomUtil.removeClass( this._container, 'hidden');
                else
                    L.DomUtil.addClass( this._container, 'hidden');

            }
            this.mouseEvent = mouseEvent;
            if (mouseEvent && mouseEvent.latlng)
            {
                if (this._map.options.crs != null)
                {
                    var pt = this._map.options.crs.projection.project(mouseEvent.latlng);
                    this.textElement.innerHTML = "UTM33N: ["+ pt.x.toFixed(2)+", "+ pt.y.toFixed(2)+"]";
                }
                else 
                {
                    this.textElement.innerHTML = mouseEvent.latlng;
                }
            }
        }
    });

    //Extend the options for Leaflet Map
    L.Map.mergeOptions({
        mousepositionControl: false
    });

    L.Map.addInitHook(function () {
        if (this.options.mousepositionControl) {
            this.mousepositionControl = new L.Control.Mouseposition();
            this.addControl(this.mousepositionControl);
        }
    });

    L.Control.mouseposition = function (options) {
        return new L.Control.Mouseposition(options);
    };

}(L, this, document));


