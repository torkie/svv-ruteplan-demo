OpenLayers.AwsomeIcon = OpenLayers.Class({

    /** 
     * Property: size 
     * {<OpenLayers.Size>|Object} An OpenLayers.Size or
     * an object with a 'w' and 'h' properties.
     */
    size: null,

    /** 
     * Property: offset 
     * {<OpenLayers.Pixel>|Object} distance in pixels to offset the
     * image when being rendered. An OpenLayers.Pixel or an object
     * with a 'x' and 'y' properties.
     */
    offset: null,

    /** 
     * Property: calculateOffset 
     * {Function} Function to calculate the offset (based on the size)
     */
    calculateOffset: null,

    /** 
     * Property: imageDiv 
     * {DOMElement} 
     */
    imageDiv: null,

    /** 
     * Property: px 
     * {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an object
     * with a 'x' and 'y' properties.
     */
    px: null,

    icon: null,
    markerColor: 'blue',
    iconColor: 'white',
    prefix: 'fa',
    className: null,

    /** 
     * Constructor: OpenLayers.Icon
     * Creates an icon, which is an image tag in a div.  
     *
     * url - {String} 
     * size - {<OpenLayers.Size>|Object} An OpenLayers.Size or an
     *                                   object with a 'w' and 'h'
     *                                   properties.
     * offset - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an
     *                                      object with a 'x' and 'y'
     *                                      properties.
     * calculateOffset - {Function} 
     */
    initialize: function (icon, markerColor, iconColor, prefix) {

        this.icon = icon;
        this.markerColor = markerColor;
        this.iconColor = iconColor;
        this.prefix = prefix;
        this.size = { w: 35, h: 45 };
        this.offset ={ x: -17, y: -42 };

        var id = OpenLayers.Util.createUniqueID("OL_Icon_");
        this.imageDiv = OpenLayers.Util.createDiv();
        this.imageDiv.id = id;
        this.imageDiv.className = 'awesome-marker';
        this.imageDiv.style.textAlign = 'center';
        this.imageDiv.innerHTML = this._createInner();
        this._setIconStyles(this.imageDiv, 'icon-' + markerColor);
    },

    _createInner : function() {
        var iconClass, iconColorClass = "", iconColorStyle = "";

        if (this.icon.slice(0, this.prefix.length + 1) === this.prefix + "-") {
            iconClass = this.icon;
        } else {
            iconClass = this.prefix + "-" + this.icon;
        }

        if (this.iconColor) {
            if (this.iconColor === 'white' || this.iconColor === 'black') {
                iconColorClass = "icon-" + this.iconColor;
            } else {
                iconColorStyle = "style='color: " + this.iconColor + "' ";
            }
        }

        return "<i " + iconColorStyle + "class='" + this.prefix + " " + iconClass + " " + iconColorClass + "'></i>";
    },

    _setIconStyles : function(img, name) {
        var anchor;
        if (name === 'shadow') {
            anchor = [10, 12];
        } else {
            anchor = [17, 42];
        }

        img.className = 'awesome-marker-' + name + " " + img.className;


        img.style.marginLeft = (-anchor.x) + 'px';
        img.style.marginTop = (-anchor.y) + 'px';

        if (this.size) {
            img.style.width = this.size.w + 'px';
            img.style.height = this.size.h + 'px';
        }
    },

    /** 
     * Method: destroy
     * Nullify references and remove event listeners to prevent circular 
     * references and memory leaks
     */
    destroy: function () {
        // erase any drawn elements
        this.erase();

        OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild);
        this.imageDiv.innerHTML = "";
        this.imageDiv = null;
    },

    /** 
     * Method: clone
     * 
     * Returns:
     * {<OpenLayers.Icon>} A fresh copy of the icon.
     */
    clone: function () {
        return new OpenLayers.AwsomeIcon(this.url, this.icon, this.markerColor, this.iconColor, this.prefix);
    },

    /**
     * Method: setSize
     * 
     * Parameters:
     * size - {<OpenLayers.Size>|Object} An OpenLayers.Size or
     * an object with a 'w' and 'h' properties.
     */
    setSize: function (size) {
    },

    /**
     * Method: setUrl
     * 
     * Parameters:
     * url - {String} 
     */
    setUrl: function (url) {
    },

    /** 
     * Method: draw
     * Move the div to the given pixel.
     * 
     * Parameters:
     * px - {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an
     *                                  object with a 'x' and 'y' properties.
     * 
     * Returns:
     * {DOMElement} A new DOM Image of this icon set at the location passed-in
     */
    draw: function (px) {
        OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,
                                            null,
                                            null,
                                            this.size,
                                            this.url,
                                            "absolute");
        this.moveTo(px);
        return this.imageDiv;
    },

    /** 
     * Method: erase
     * Erase the underlying image element.
     */
    erase: function () {
        if (this.imageDiv != null && this.imageDiv.parentNode != null) {
            OpenLayers.Element.remove(this.imageDiv);
        }
    },

    /** 
     * Method: setOpacity
     * Change the icon's opacity
     *
     * Parameters:
     * opacity - {float} 
     */
    setOpacity: function (opacity) {
        OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, null,
                                            null, null, null, null, opacity);

    },

    /**
     * Method: moveTo
     * move icon to passed in px.
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>|Object} the pixel position to move to.
     * An OpenLayers.Pixel or an object with a 'x' and 'y' properties.
     */
    moveTo: function (px) {
        //if no px passed in, use stored location
        if (px != null) {
            this.px = px;
        }

        if (this.imageDiv != null) {
            if (this.px == null) {
                this.display(false);
            } else {
                if (this.calculateOffset) {
                    this.offset = this.calculateOffset(this.size);
                }
                OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, {
                    x: this.px.x + this.offset.x,
                    y: this.px.y + this.offset.y
                });
            }
        }
    },

    /** 
     * Method: display
     * Hide or show the icon
     *
     * Parameters:
     * display - {Boolean} 
     */
    display: function (display) {
        this.imageDiv.style.display = (display) ? "" : "none";
    },


    /**
     * APIMethod: isDrawn
     * 
     * Returns:
     * {Boolean} Whether or not the icon is drawn.
     */
    isDrawn: function () {
        // nodeType 11 for ie, whose nodes *always* have a parentNode
        // (of type document fragment)
        var isDrawn = (this.imageDiv && this.imageDiv.parentNode &&
                       (this.imageDiv.parentNode.nodeType != 11));

        return isDrawn;
    },

    CLASS_NAME: "OpenLayers.AwsomeIcon"
});