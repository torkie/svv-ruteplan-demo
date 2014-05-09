///<reference path="../../ts/typings/openlayers/openlayers.d.ts"/>
module OpenLayers {
    export class AwsomeIcon extends OpenLayers.Class {
        
        /** 
 * Property: offset 
 * {<OpenLayers.Pixel>|Object} distance in pixels to offset the
 * image when being rendered. An OpenLayers.Pixel or an object
 * with a 'x' and 'y' properties.
 */
        offset: OpenLayers.Pixel;

        /** 
    * Property: px 
    * {<OpenLayers.Pixel>|Object} An OpenLayers.Pixel or an object
    * with a 'x' and 'y' properties.
    */
        px: OpenLayers.Pixel;
        
        /** 
    * Property: url 
    * {String}  image url
    */
        url = null;

        /** 
     * Property: imageDiv 
     * {DOMElement} 
     */
        imageDiv : HTMLElement;

        icon = "home";
        markerColor = "blue";
        iconColor = "white";
        prefix = "fa";

        size= new OpenLayers.Size(35, 45);


        constructor(url, icon, markerColor, iconColor, prefix) {
            super();

            this.url = url;
            this.icon = icon;
            this.markerColor = markerColor;
            this.iconColor = iconColor;
            this.prefix = prefix;
            //this.size = size || {w: 20, h: 20};
            //       this.offset = offset || {x: -(this.size.w/2), y: -(this.size.h/2)};
            //       this.calculateOffset = calculateOffset;

            var id = OpenLayers.Util.createUniqueID("OL_Icon_");
            this.imageDiv = OpenLayers.Util.createDiv();
            this.imageDiv.id = id;
            this.imageDiv.className = 'awsome-marker';

            this.imageDiv.innerHTML = this._createInner();
            this._setIconStyles(this.imageDiv, 'icon-' + markerColor);
        }

        _createInner() {
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
        }

        _setIconStyles(img, name) {
            var anchor;
            if (name === 'shadow') {
                anchor = [10, 12];
            } else {
                anchor = [17, 42];
            }

            img.className = 'awesome-marker-' + name + ' ' + this.className;

            
                img.style.marginLeft = (-anchor.x) + 'px';
                img.style.marginTop = (-anchor.y) + 'px';

            if (this.size) {
                img.style.width = this.size.x + 'px';
                img.style.height = this.size.y + 'px';
            }
        }

        /** 
     * Method: destroy
     * Nullify references and remove event listeners to prevent circular 
     * references and memory leaks
     */
        destroy() {
            // erase any drawn elements
            this.erase();

            OpenLayers.Event.stopObservingElement(<HTMLElement>this.imageDiv.firstChild);
            this.imageDiv.innerHTML = "";
            this.imageDiv = null;
        }

        /** 
     * Method: clone
     * 
     * Returns:
     * {<OpenLayers.Icon>} A fresh copy of the icon.
     */
        clone() {
            return new OpenLayers.AwsomeIcon(this.url);
        }

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
        draw(px) {
            OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv,
                null,
                null,
                this.size,
                this.url,
                "absolute");
            this.moveTo(px);
            return this.imageDiv;
        }

        /** 
   * Method: erase
   * Erase the underlying image element.
   */
        erase() {
            if (this.imageDiv != null && this.imageDiv.parentNode != null) {
                OpenLayers.Element.remove(this.imageDiv);
            }
        }

        /** 
     * Method: setOpacity
     * Change the icon's opacity
     *
     * Parameters:
     * opacity - {float} 
     */
        setOpacity(opacity) {
            OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, null,
                null, null, null, null, opacity);

        }

        /**
     * Method: moveTo
     * move icon to passed in px.
     *
     * Parameters:
     * px - {<OpenLayers.Pixel>|Object} the pixel position to move to.
     * An OpenLayers.Pixel or an object with a 'x' and 'y' properties.
     */
        moveTo(px) {
            //if no px passed in, use stored location
            if (px != null) {
                this.px = px;
            }

            if (this.imageDiv != null) {
                OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, {
                    x: this.px.x + this.offset.x,
                    y: this.px.y + this.offset.y
                });

            }
        }

        /** 
 * Method: display
 * Hide or show the icon
 *
 * Parameters:
 * display - {Boolean} 
 */
        display(display) {
            this.imageDiv.style.display = (display) ? "" : "none";
        }

        /**
     * APIMethod: isDrawn
     * 
     * Returns:
     * {Boolean} Whether or not the icon is drawn.
     */
        isDrawn() {
            // nodeType 11 for ie, whose nodes *always* have a parentNode
            // (of type document fragment)
            var
                isDrawn = (this.imageDiv && this.imageDiv.parentNode &&
                (this.imageDiv.parentNode.nodeType != 11));

            return isDrawn;
        }

        CLASS_NAME = "OpenLayers.AwesomeIcon";

    }
}