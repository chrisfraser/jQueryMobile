
// Global variables
var map,
    activeDrawControl,
    activeFeature,
    modifyTempDrawControl,
    vectorLayer,
    icon;

/* ======================================================================
    mapPage
   ====================================================================== */
$(document).on("pageinit", '#mapPage', function(event, ui) {
    //Init the map page by adding the map        
    if (!map) {
        initMap();
    }
    $('#mapToolbar li a').click(function() {
        // Activate the drawing controls
        activateDrawControl(this);
    }).filter('#nav').click();

    $('#mapFeatureConfirm a').click(function() {
        featureConfirm(this);
    });

    var featureDetailsPopup = $("#featureDetails");
    featureDetailsPopup.popup().on({
        popupbeforeposition: function () {
//            $("#featureDetails a").button();
            featureDetailsPopup.trigger('create');
            var w = $(window).width() - 60;
            w = w > 400 ? 400 : w;
            featureDetailsPopup.width(w);
            var h = $(window).height() - 60;
            featureDetailsPopup.width(w);
            featureDetailsPopup.height(h);
            h = featureDetailsPopup.innerHeight();
            featureDetailsPopup.children().not('form').each(function () {
                h -= $(this).outerHeight(true);
            });
            $('#featureDetailsForm').height(h-10);
            $('.ui-popup-screen').off();
        }
    });
});

$(document).on('pageshow', '#mapPage', function() {
    // Bind the resize event on this page to window to fix content height
    $(window).bind('resize.fixsize', fixSize).trigger('resize.fixsize');
    map.render('mapDiv');

});

$(document).on('pagehide', '#mapPage', function() {
    // Unbind the window.resize event so as not to fuck with other pages
    $(window).unbind('.fixsize');
});


/* ======================================================================
    functions
   ====================================================================== */
var initMap = function () {
    // Base layer for map
    var baseLayer = new OpenLayers.Layer.OSM("OpenStreetMap", null, {
        transitionEffect: 'resize',
        attribution: ''
    });

    // Global layer for drawn features
    vectorLayer = new OpenLayers.Layer.Vector('vectorLayer');

    // Register the featureadded event
    vectorLayer.events.register('featureadded', this, featureAdding);

    // We need a global modifyTempDrawControl to use between creating a feature and saving
    modifyTempDrawControl = new OpenLayers.Control.ModifyFeature(vectorLayer, { id: "modifyTempDrawControl", standalone: true });

    var dispProj = new OpenLayers.Projection("EPSG:4326");
    var mapProj = new OpenLayers.Projection("EPSG:900913");
    // create map
    map = new OpenLayers.Map({
        projection: mapProj,
        displayProjection: dispProj,
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }),
            new OpenLayers.Control.Zoom(),
            new OpenLayers.Control.ScaleLine(),
            new OpenLayers.Control.DrawFeature(
                vectorLayer, OpenLayers.Handler.Point, { id: "pointControl" }
            ),
            new OpenLayers.Control.DrawFeature(
                vectorLayer, OpenLayers.Handler.Polygon, { id: "polyControl" }
            ),
            new OpenLayers.Control.ModifyFeature(vectorLayer, { id: "modControl" }),
            modifyTempDrawControl
        ],
        layers: [baseLayer, vectorLayer],
        center: new OpenLayers.LonLat(742000, 5861000),
        zoom: 3
    });
};

// Automatically resize the content div
// These pages mush have a header and fixed footer
var fixSize = function () {
    
    var contentHeight = $.mobile.activePage.children('[data-role="content"]').height(),
        headerHeight = $.mobile.activePage.children('[data-role="header"]').outerHeight(),
        footerHeight = $.mobile.activePage.children('[data-role="footer"]').outerHeight(),
        targetHeight = $(window).height() - headerHeight - footerHeight;
    
    if (contentHeight != (targetHeight)) {
        $.mobile.activePage.children('[data-role="content"]').height(targetHeight);
    }
    
    if (window.map && window.map instanceof OpenLayers.Map) {
        map.updateSize();
    }
};

// Methood to implement the saving of a feature's details
// Called when a sketch is started and changes the buttons at the bottom
var featureAdding = function (event) {

    // Assign the activeFeature the added feature
    activeFeature = event.feature;

    // Deactivate the current control and activate the modifyTempDraw Control 
    activeDrawControl.deactivate();
    modifyTempDrawControl.activate();
    // Select the added feature for the modifyTempDraw Control and give it the correct renderIntent
    modifyTempDrawControl.selectFeature(activeFeature);
    activeFeature.renderIntent = "select";

    // Redraw the vector layer
    vectorLayer.redraw();

    // Show the confirmation nav bar
    $('#mapToolbar').hide();
    $('#mapFeatureConfirm').show();
};

// Activate/deactivate the draw control
var activateDrawControl = function(element, state) {
    if (activeDrawControl) {
        activeDrawControl.deactivate();
    }
    var control = map.getControlsBy("id", element.id + 'Control')[0];
    if (control) {
        activeDrawControl = control;
        control.activate();
    }
};

// mapSave: Initiate the form data captured for the feature
// Opens the featureForm
var mapSave = function() {
    alert('Opens featureForm to save feature details');
    activeFeature.renderIntent = "default";
    activeFeature.attributes.isUploaded = false;
    vectorLayer.redraw();
    $('#mapFeatureConfirm').hide();
    $('#mapToolbar').show();

    // Deactivate the buttons on the navbar
    deactivateNavButton(this);

    activeDrawControl.activate();
    modifyTempDrawControl.deactivate();
};

// mapSave: Initiate the form data captured for the feature
// Opens the featureForm
var featureConfirm = function(element) {
    var save = $(element).data('confirm');
    if (save) {
        activeFeature.renderIntent = "default";
        activeFeature.attributes.details = featureDetails;
        activeFeature.attributes.isUploaded = false;
        var formHtml = template({ details: activeFeature.attributes.details });
        $('#featureDetailsFormInner').html(formHtml);
        $("#featureDetails").popup("open");
        vectorLayer.redraw();
    } else {
        vectorLayer.removeFeatures([activeFeature]);
    }
    $('#mapFeatureConfirm').hide();
    $('#mapToolbar').show();

    // Deactivate the buttons on the navbar
    deactivateNavButton(element);

    activeDrawControl.activate();
    modifyTempDrawControl.deactivate();
};


// Deactivate the buttons on the navbar
var deactivateNavButton = function(elem) {
    $.wait(0).then(function() {
        $(elem).removeClass($.mobile.activeBtnClass).removeClass($.mobile.focusClass);
        $.mobile.activePage.focus();
    });
};

var featureDetails = [
    {
        id: '1',
        order: 1,
        name: 'FirstField',
        type: 'text',
        validation: {},
        defaultValue: 'textHere',
        value: '',
        helpText: 'Help Me'
    },
    {
        id: '2',
        order: 2,
        name: 'NumericField',
        type: 'number',
        validation: {},
        defaultValue: '0',
        value: '',
        helpText: 'add a number'
    },
    {
        id: '3',
        order: 3,
        name: 'EmailField',
        type: 'email',
        validation: {},
        defaultValue: '0',
        value: '',
        helpText: 'add a number'
    },
    {
        id: '3',
        order: 3,
        name: 'EmailField',
        type: 'email',
        validation: {},
        defaultValue: '0',
        value: '',
        helpText: 'add a number'
    },
    {
        id: '3',
        order: 3,
        name: 'EmailField',
        type: 'email',
        validation: {},
        defaultValue: '0',
        value: '',
        helpText: 'add a number'
    },
    {
        id: '3',
        order: 3,
        name: 'EmailField',
        type: 'email',
        validation: {},
        defaultValue: '0',
        value: '',
        helpText: 'add a number'
    }

];

var source = '{{#each details}}' +
    '<div data-role="fieldcontain">' +
    '<label for="{{this.id}}">{{this.name}}:</label>' +
    '<input type="{{this.type}}" name="username" id="{{this.id}}" value="{{this.value}}" placeholder="{{helpText}}"/>' +
    '</div>' +
    '{{/each}}';
var template = Handlebars.compile(source);
var html = template({ details: featureDetails });