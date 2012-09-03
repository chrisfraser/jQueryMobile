
var fixContentHeight = function () {
    var header = $("div[data-role='header']:visible");
    var footer = $("div[data-role='footer']:visible");
    var content = $("div[data-role='content']:visible:visible");
    var viewHeight = $(window).height();

    var contentHeight = viewHeight - header.outerHeight() - footer.outerHeight();
    if ((content.outerHeight() + header.outerHeight() + footer.outerHeight()) !== viewHeight) {
        contentHeight -= (content.outerHeight() - content.height());
        content.height(contentHeight);
    }
    if (window.map && window.map instanceof OpenLayers.Map) {
        map.updateSize();
    }
};
// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

// initialize map when page ready
var map;
var gg = new OpenLayers.Projection("EPSG:4326");
var sm = new OpenLayers.Projection("EPSG:900913");

var initMap = function () {
    // create map
    map = new OpenLayers.Map({
        div: "mapContainer",
        theme: null,
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            new OpenLayers.Control.Zoom()
        ],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize'
            })
        ],
        center: new OpenLayers.LonLat(742000, 5861000),
        zoom: 3
    });

};


var initMapPage = function () {
    //fixContentHeight();
    if (window.map && window.map instanceof OpenLayers.Map) {
        map.updateSize();
    } else {
        //             initialize map
        initMap();
    }

    //$(window).bind("orientationchange resize", fixContentHeight);
};