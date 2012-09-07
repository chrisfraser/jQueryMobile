
// Global variables
var map;

/* ======================================================================
    mapPage
   ====================================================================== */
$(document).on("pageinit", '#mapPage', function (event, ui) {
    $('#mapToolbar li a').click(function () {
        $('#mapToolbar').hide();
        $('#mapFeatureConfirm').show();
    });
    $('#mapCancel').click(function () {
        // Todo: Cancel actions

        $('#mapFeatureConfirm').hide();
        $('#mapToolbar').show();
    });
    $('#mapCancel').click(function () {
        // Todo: Cancel actions

        $('#mapFeatureConfirm').hide();
        $('#mapToolbar').show();
    });
});

$(document).on('pageshow', '#mapPage', function() {
    // Bind the resize event on this page to window to fix content height
    $(window).bind('resize.fixsize', fixSize).trigger('resize.fixsize');
    //Init the map page by adding the map        
    if (!map) {
        initMap();
    }

});

$(document).on('pagehide', '#mapPage', function() {
    // Unbind the window.resize event so as not to fuck with other pages
    $(window).unbind('.fixsize');
});


/* ======================================================================
    functions
   ====================================================================== */
var initMap = function() {
    // create map
    map = new OpenLayers.Map({
        div: "mapDiv",
        theme: null,
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            new OpenLayers.Control.Zoom(),
            new OpenLayers.Control.ScaleLine()
        ],
        layers: [
            new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize',
                attribution: ''
                
            })
        ],
        center: new OpenLayers.LonLat(742000, 5861000),
        zoom: 3
    });
};

// Automatically resize the content div
// These pages mush have a header and fixed footer
var fixSize = function() {
    var contentHeight = $.mobile.activePage.children('[data-role="content"]').height(),
        headerHeight = $.mobile.activePage.children('[data-role="header"]').outerHeight(),
        footerHeight = $.mobile.activePage.children('[data-role="footer"]').outerHeight(),
        targetHeight = $(window).height() - headerHeight - footerHeight;
    console.log('sizing');
    if (contentHeight != (targetHeight)) {
        $.mobile.activePage.children('[data-role="content"]').height(targetHeight);
    }
    if (window.map && window.map instanceof OpenLayers.Map) {
        map.updateSize();
    }
};