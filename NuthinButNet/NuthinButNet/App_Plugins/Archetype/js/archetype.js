angular.module("umbraco").controller("Imulus.ArchetypeController", function ($scope, $http, assetsService, angularHelper, notificationsService) {
 
    //$scope.model.value = "";

    //get a reference to the current form
    var form = angularHelper.getCurrentForm($scope);

    //set the config equal to our prevalue config
    $scope.model.config = $scope.model.config.archetypeConfig;
   
    //ini the model
    $scope.model.value = $scope.model.value || { fieldsets: [getEmptyRenderFieldset($scope.model.config.fieldsets[0])] };

    //ini the render model
    $scope.archetypeRenderModel = {};
    initArchetypeRenderModel();
     
    //helper to get $eval the labelTemplate
    $scope.getFieldsetTitle = function(fieldsetConfigModel, fieldsetIndex) {
        var fieldset = $scope.archetypeRenderModel.fieldsets[fieldsetIndex];
        var fieldsetConfig = $scope.getConfigFieldsetByAlias(fieldset.alias);
        var template = fieldsetConfigModel.labelTemplate;

        if (template.length < 1)
            return fieldsetConfig.label;

        var rgx = /{{(.*?)}}*/g;
        var results;
        var parsedTemplate = template;

        while ((results = rgx.exec(template)) !== null) {
            var propertyAlias = results[1];
            var propertyValue = $scope.getPropertyValueByAlias(fieldset, propertyAlias);
            parsedTemplate = parsedTemplate.replace(results[0], propertyValue);
        }

        return parsedTemplate;
    };

    //sort config
    $scope.sortableOptions = {
        axis: 'y',
        cursor: "move",
        handle: ".handle",
        update: function (ev, ui) {

        },
        stop: function (ev, ui) {

        }
    };

    //handles a fieldset add
    $scope.addRow = function (fieldsetAlias, $index) {
        if ($scope.canAdd())
        {
            if ($scope.model.config.fieldsets)
            {
                var newFieldset = getEmptyRenderFieldset($scope.getConfigFieldsetByAlias(fieldsetAlias));

                if (typeof $index != 'undefined')
                {
                    $scope.archetypeRenderModel.fieldsets.splice($index + 1, 0, newFieldset);
                }
                else
                {
                    $scope.archetypeRenderModel.fieldsets.push(newFieldset);
                }
            }
            newFieldset.collapse = true;
            $scope.focusFieldset(newFieldset);
        }
    }

    //rather than splice the archetypeRenderModel, we're hiding this and cleaning onFormSubmitting
    $scope.removeRow = function ($index) {
        if ($scope.canRemove()) {
            if (confirm('Are you sure you want to remove this?')) {
                $scope.archetypeRenderModel.fieldsets[$index].remove = true;
            }
        }
    }

    //helpers for determining if a user can do something
    $scope.canAdd = function ()
    {
        if ($scope.model.config.maxFieldsets)
        {
            return countVisible() < $scope.model.config.maxFieldsets;
        }

        return true;
    }

    //helper that returns if an item can be removed
    $scope.canRemove = function ()
    {   
        return countVisible() > 1;
    }

    //helper that returns if an item can be sorted
    $scope.canSort = function ()
    {
        return countVisible() > 1;
    }

    //helper, ini the render model from the server (model.value)
    function initArchetypeRenderModel() {
        $scope.archetypeRenderModel = removeNulls($scope.model.value);

        _.each($scope.archetypeRenderModel.fieldsets, function (fieldset)
        {
            fieldset.remove = false;
            fieldset.collapse = false;
            fieldset.isValid = true;
        });      
    }

    //helper to get the correct fieldset from config
    $scope.getConfigFieldsetByAlias = function(alias) {
        return _.find($scope.model.config.fieldsets, function(fieldset){
            return fieldset.alias == alias;
        });
    }

    //helper to get a property by alias from a fieldset
    $scope.getPropertyValueByAlias = function(fieldset, propertyAlias) {
        var property = _.find(fieldset.properties, function(p) {
            return p.alias == propertyAlias;
        });
        return (typeof property !== 'undefined') ? property.value : '';
    };
    
    //helper for expanding/collapsing fieldsets
    $scope.focusFieldset = function(fieldset){
        
        var iniState;
        
        if(fieldset)
        {
            iniState = fieldset.collapse;
        }
    
        _.each($scope.archetypeRenderModel.fieldsets, function(fieldset){
            if($scope.archetypeRenderModel.fieldsets.length == 1 && fieldset.remove == false)
            {
                fieldset.collapse = false;
                return;
            }
        
            fieldset.collapse = true;
        });
        
        if(iniState)
        {
            fieldset.collapse = !iniState;
        }
    }
    
    //ini the fieldset expand/collapse
    $scope.focusFieldset();

    //developerMode helpers
    $scope.archetypeRenderModel.toString = stringify;

    //encapsulate stringify (should be built into browsers, not sure of IE support)
    function stringify() {
        return JSON.stringify(this);
    }

    //watch for changes
    $scope.$watch('archetypeRenderModel', function (v) {
        if ($scope.model.config.developerMode) {
            console.log(v);
            if (typeof v === 'string') {
                $scope.archetypeRenderModel = JSON.parse(v);
                $scope.archetypeRenderModel.toString = stringify;
            }
        }
    });

    //helper to count what is visible
    function countVisible()
    {
        var count = 0;

        _.each($scope.archetypeRenderModel.fieldsets, function(fieldset){
            if (fieldset.remove == false) {
                count++;
            }
        });

        return count;
    }

    //helper to sync the model to the renderModel
    function syncModelToRenderModel()
    {
        $scope.model.value = { fieldsets: [] };

        _.each($scope.archetypeRenderModel.fieldsets, function(fieldset){
            var cleanedFieldset =  cleanFieldset(fieldset);

            if(cleanedFieldset){
                $scope.model.value.fieldsets.push(cleanedFieldset);
            }
        });
    }

    //helper to remove properties only used during editing that we don't want in the saved data
    //also removes properties that are no longer in the config
    function cleanFieldset(fieldset)
    {
        if (typeof fieldset != 'function' && !fieldset.remove){

            var fieldsetConfig = $scope.getConfigFieldsetByAlias(fieldset.alias);

            //clone and clean
            var tempFieldset = JSON.parse(JSON.stringify(fieldset));
            delete tempFieldset.remove;
            delete tempFieldset.isValid;
            delete tempFieldset.collapse;

            _.each(tempFieldset.properties, function(property, index){
                var propertyConfig = _.find(fieldsetConfig.properties, function(p){
                    return property.alias == p.alias;
                });

                //just prune the property
                if(propertyConfig){
                    delete property.isValid;
                }
                else 
                {
                    //need to remove the whole property
                    tempFieldset.properties.splice(index, 1);
                }

            });

            return tempFieldset;
        }
    }

    //helper to add an empty fieldset to the render model
    function getEmptyRenderFieldset (fieldsetModel)
    {
        return JSON.parse('{"alias": "' + fieldsetModel.alias + '", "remove": false, "isValid": true, "properties": []}');
    }

    //helper to ensure no nulls make it into the model
    function removeNulls(model){
        if(model.fieldsets){
            _.each(model.fieldsets, function(fieldset, index){
                if(!fieldset){
                    model.fieldsets.splice(index, 1);
                    removeNulls(model);
                }
            });
            
            return model;
        }
    }

    //helper to lookup validity when given a fieldsetIndex and property alias
    $scope.getPropertyValidity = function(fieldsetIndex, alias)
    {
        if($scope.archetypeRenderModel.fieldsets[fieldsetIndex])
        {
            var property = _.find($scope.archetypeRenderModel.fieldsets[fieldsetIndex].properties, function(property){
                return property.alias == alias;
            });
        }

        return (typeof property == 'undefined') ? true : property.isValid;
    }

    //sync things up on save
    $scope.$on("formSubmitting", function (ev, args) {

        //test for form; may have to do this differently for nested archetypes
        if(!form)
            return;

        if(form.$invalid)
        {
            notificationsService.warning("Cannot Save Document", "The document could not be saved because of missing required fields.")
        }
        else 
        {
            syncModelToRenderModel();
        }
    });

    //custom js
    if ($scope.model.config.customJsPath) {
        assetsService.loadJs($scope.model.config.customJsPath);
    } 

    //archetype css
    assetsService.loadCss("/App_Plugins/Archetype/css/archetype.css");

    //custom css
    if($scope.model.config.customCssPath)
    {
        assetsService.loadCss($scope.model.config.customCssPath);
    }
});

angular.module("umbraco").controller("Imulus.ArchetypeConfigController", function ($scope, $http, assetsService, dialogService, archetypePropertyEditorResource) {
    
    //$scope.model.value = ""; 
    //console.log($scope.model.value); 

    //define empty items
    var newPropertyModel = '{"alias": "", "remove": false, "collapse": false, "label": "", "helpText": "", "dataTypeId": "-88", "value": ""}';
    var newFieldsetModel = '{"alias": "", "remove": false, "collapse": false, "labelTemplate": "", "icon": "", "label": "", "properties": [' + newPropertyModel + ']}';
    var defaultFieldsetConfigModel = JSON.parse('{"showAdvancedOptions": false, "hideFieldsetToolbar": false, "enableMultipleFieldsets": false, "hideFieldsetControls": false, "hidePropertyLabel": false, "maxFieldsets": null, "fieldsets": [' + newFieldsetModel + ']}');

    //ini the model
    $scope.model.value = $scope.model.value || defaultFieldsetConfigModel;
    
    //ini the render model
    initConfigRenderModel();
 
    //get the available datatypes
    archetypePropertyEditorResource.getAllDataTypes().then(function(data) {
        $scope.availableDataTypes = data;
    });

    //iconPicker
    $scope.selectIcon = function(fieldset){
        var dialog = dialogService.iconPicker({
            callback: function(data){
                fieldset.icon = data;
            }
        });
    }

    //config for the sorting
    $scope.sortableOptions = {
        axis: 'y',
        cursor: "move",
        handle: ".handle",
        update: function (ev, ui) {

        },
        stop: function (ev, ui) {

        }
    };
    
    //function that determines how to manage expanding/collapsing fieldsets
    $scope.focusFieldset = function(fieldset){
        var iniState;
        
        if(fieldset)
        {
            iniState = fieldset.collapse;
        }
        
        _.each($scope.archetypeConfigRenderModel.fieldsets, function(fieldset){
            if($scope.archetypeConfigRenderModel.fieldsets.length == 1 && fieldset.remove == false)
            {
                fieldset.collapse = false;
                return;
            }

            if(fieldset.label)
            {
                fieldset.collapse = true;
            }
            else
            {
                fieldset.collapse = false;
            }
        });
        
        if(iniState)
        {
            fieldset.collapse = !iniState;
        }
    }

    //ini the fieldsets
    $scope.focusFieldset();

    //function that determines how to manage expanding/collapsing properties
    $scope.focusProperty = function(properties, property){
        var iniState;
        
        if(property)
        {
            iniState = property.collapse;
        }

        _.each(properties, function(property){
            if(property.label)
            {
                property.collapse = true;
            }
            else
            {
                property.collapse = false;
            }
        });
        
        if(iniState)
        {
            property.collapse = !iniState;
        }
    }

    //ini the properties
    _.each($scope.archetypeConfigRenderModel.fieldsets, function(fieldset){
            $scope.focusProperty(fieldset.properties);
    });
    
    //setup JSON.stringify helpers
    $scope.archetypeConfigRenderModel.toString = stringify;
    
    //encapsulate stringify (should be built into browsers, not sure of IE support)
    function stringify() {
        return JSON.stringify(this);
    }
    
    //watch for changes
    $scope.$watch('archetypeConfigRenderModel', function (v) {
        //console.log(v);
        if (typeof v === 'string') {     
            $scope.archetypeConfigRenderModel = JSON.parse(v);
            $scope.archetypeConfigRenderModel.toString = stringify;
        }
    });
    
    //helper that returns if an item can be removed
    $scope.canRemoveFieldset = function ()
    {   
        return countVisibleFieldset() > 1;
    }

    //helper that returns if an item can be sorted
    $scope.canSortFieldset = function ()
    {
        return countVisibleFieldset() > 1;
    }
    
    //helper that returns if an item can be removed
    $scope.canRemoveProperty = function (fieldset)
    {   
        return countVisibleProperty(fieldset) > 1;
    }

    //helper that returns if an item can be sorted
    $scope.canSortProperty = function (fieldset)
    {
        return countVisibleProperty(fieldset) > 1;
    }

    $scope.getDataTypeNameById = function (id) {
        if ($scope.availableDataTypes == null) // Might not be initialized yet?
            return "";

        var dataType = _.find($scope.availableDataTypes, function(d) {
            return d.id == id;
        });

        return dataType == null ? "" : dataType.name;
    }
    
    //helper to count what is visible
    function countVisibleFieldset()
    {
        var count = 0;

        _.each($scope.archetypeConfigRenderModel.fieldsets, function(fieldset){
            if (fieldset.remove == false) {
                count++;
            }
        });

        return count;
    }
    
    //determines how many properties are visible
    function countVisibleProperty(fieldset)
    {
        var count = 0;

        for (var i in fieldset.properties) {
            if (fieldset.properties[i].remove == false) {
                count++;
            }
        }

        return count;
    }
   
    //handles a fieldset add
    $scope.addFieldsetRow = function ($index, $event) {
        $scope.archetypeConfigRenderModel.fieldsets.splice($index + 1, 0, JSON.parse(newFieldsetModel));
        $scope.focusFieldset();
    }
    
    //rather than splice the archetypeConfigRenderModel, we're hiding this and cleaning onFormSubmitting
    $scope.removeFieldsetRow = function ($index) {
        if ($scope.canRemoveFieldset()) {
            if (confirm('Are you sure you want to remove this?')) {
                $scope.archetypeConfigRenderModel.fieldsets[$index].remove = true;
            }
        }
    }
    
    //handles a property add
    $scope.addPropertyRow = function (fieldset, $index) {
        fieldset.properties.splice($index + 1, 0, JSON.parse(newPropertyModel));
    }
    
    //rather than splice the archetypeConfigRenderModel, we're hiding this and cleaning onFormSubmitting
    $scope.removePropertyRow = function (fieldset, $index) {
        if ($scope.canRemoveProperty(fieldset)) {
            if (confirm('Are you sure you want to remove this?')) {
                fieldset.properties[$index].remove = true;
            }
        }
    }
    
    //helper to ini the render model
    function initConfigRenderModel()
    {
        $scope.archetypeConfigRenderModel = $scope.model.value;

        _.each($scope.archetypeConfigRenderModel.fieldsets, function(fieldset){

            fieldset.remove = false;

            if(fieldset.label)
            {
                fieldset.collapse = true;
            }

            _.each(fieldset.properties, function(fieldset){
                fieldset.remove = false;
            });
        });
    }
    
    //sync things up on save
    $scope.$on("formSubmitting", function (ev, args) {
        syncModelToRenderModel();
    });
    
    //helper to sync the model to the renderModel
    function syncModelToRenderModel()
    {
        $scope.model.value = $scope.archetypeConfigRenderModel;
        var fieldsets = [];
        
        _.each($scope.archetypeConfigRenderModel.fieldsets, function(fieldset){
            //check fieldsets
            if (!fieldset.remove) {
                fieldsets.push(fieldset);
                
                var properties = [];

                _.each(fieldset.properties, function(property){
                   if (!property.remove) {
                        properties.push(property);
                    } 
                });

                fieldset.properties = properties;
            }
        });
        
        $scope.model.value.fieldsets = fieldsets;
    }
    
    //archetype css
    assetsService.loadCss("/App_Plugins/Archetype/css/archetype.css");
});

angular.module("umbraco.directives").directive('archetypeProperty', function ($compile, $http, archetypePropertyEditorResource, umbPropEditorHelper) {
    
    function getFieldsetByAlias(fieldsets, alias)
    {
        return _.find(fieldsets, function(fieldset){
            return fieldset.alias == alias;
        });
    }

    function getPropertyIndexByAlias(properties, alias){
        for (var i in properties)
        {
            if (properties[i].alias == alias) {
                return i;
            }
        }
    }

    function getPropertyByAlias(fieldset, alias){
        return _.find(fieldset.properties, function(property){
            return property.alias == alias; 
        });
    }

    //helper that returns a JS ojbect from 'value' string or the original string
    function jsonOrString(value, developerMode, debugLabel){
        if(value && typeof value == 'string'){
            try{
                if(developerMode == '1'){
                    console.log("Trying to parse " + debugLabel + ": " + value); 
                }
                value = JSON.parse(value);
            }
            catch(exception)
            {
                if(developerMode == '1'){
                    console.log("Failed to parse " + debugLabel + "."); 
                }
            }
        }

        if(value && developerMode == '1'){
            console.log(debugLabel + " post-parsing: ");
            console.log(value); 
        }

        return value;
    }

    var linker = function (scope, element, attrs, ngModelCtrl) {
        var configFieldsetModel = getFieldsetByAlias(scope.archetypeConfig.fieldsets, scope.fieldset.alias);
        var view = "";
        var label = configFieldsetModel.properties[scope.propertyConfigIndex].label;
        var dataTypeId = configFieldsetModel.properties[scope.propertyConfigIndex].dataTypeId;
        var config = null;
        var alias = configFieldsetModel.properties[scope.propertyConfigIndex].alias;
        var defaultValue = configFieldsetModel.properties[scope.propertyConfigIndex].value;
        var umbracoPropertyAlias = scope.umbracoPropertyAlias;

        //try to convert the defaultValue to a JS object
        defaultValue = jsonOrString(defaultValue, scope.archetypeConfig.developerMode, "defaultValue");

        //grab info for the selected datatype, prepare for view
        archetypePropertyEditorResource.getDataType(dataTypeId).then(function (data) {
            //transform preValues array into object expected by propertyeditor views
            var configObj = {};
            _.each(data.preValues, function(p) {
                configObj[p.key] = p.value;
            });
            config = configObj;

            //determine the view to use [...] and load it
            archetypePropertyEditorResource.getPropertyEditorMapping(data.selectedEditor).then(function(propertyEditor) {
                var pathToView = umbPropEditorHelper.getViewPath(propertyEditor.view);

                //load in the DefaultPreValues for the PropertyEditor, if any
                var defaultConfigObj =  {};
                if (propertyEditor.hasOwnProperty('defaultPreValues')) {
                    _.each(propertyEditor.defaultPreValues, function(p) {
                        _.extend(defaultConfigObj, p)
                    });
                }
                var mergedConfig = _.extend(defaultConfigObj, config);

                loadView(pathToView, mergedConfig, defaultValue, alias, umbracoPropertyAlias, scope, element, ngModelCtrl);
            });
        });

        ngModelCtrl.$parsers.push(validate);
        ngModelCtrl.$formatters.push(validate);

        function validate(renderModel){
            var valid = true;

            _.each(renderModel, function(fieldset){
                fieldset.isValid = true;
                _.each(fieldset.properties, function(property){
                    property.isValid = true;

                    var propertyConfig = getPropertyByAlias(configFieldsetModel, property.alias);

                    if(propertyConfig && propertyConfig.required && property.value == ""){
                        fieldset.isValid = false;
                        property.isValid = false;
                        valid = false;
                    }
                });
            });

            ngModelCtrl.$setValidity('validation', valid);
            return renderModel;
        }
    }

    function loadView(view, config, defaultValue, alias, umbracoPropertyAlias, scope, element, ngModelCtrl) {
        if (view)
        {
            $http.get(view).success(function (data) {
                if (data) {
                    if (scope.archetypeConfig.developerMode == '1')
                    {
                        console.log(scope);
                    }

                    //define the initial model and config
                    scope.model = {};
                    scope.model.config = {};

                    //ini the property value after test to make sure a prop exists in the renderModel
                    var renderModelPropertyIndex = getPropertyIndexByAlias(scope.archetypeRenderModel.fieldsets[scope.fieldsetIndex].properties, alias);

                    if (!renderModelPropertyIndex)
                    {
                        scope.archetypeRenderModel.fieldsets[scope.fieldsetIndex].properties.push(JSON.parse('{"alias": "' + alias + '", "value": "' + defaultValue + '"}'));
                        renderModelPropertyIndex = getPropertyIndexByAlias(scope.archetypeRenderModel.fieldsets[scope.fieldsetIndex].properties, alias);
                    }
                    scope.model.value = scope.archetypeRenderModel.fieldsets[scope.fieldsetIndex].properties[renderModelPropertyIndex].value;

                    //set the config from the prevalues
                    scope.model.config = config;

                    //some items need an alias
                    scope.model.alias = "archetype-property-" + umbracoPropertyAlias + "-" + scope.fieldsetIndex + "-" + scope.propertyConfigIndex;

                    //watch for changes since there is no two-way binding with the local model.value
                    scope.$watch('model.value', function (newValue, oldValue) {
                        scope.archetypeRenderModel.fieldsets[scope.fieldsetIndex].properties[renderModelPropertyIndex].value = newValue;

                        //trigger the validation pipeline
                        ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
                    });

                    element.html(data).show();
                    $compile(element.contents())(scope);
                }
            });
        }
    }

    return {
        require: "^ngModel",
        restrict: "E",
        rep1ace: true,
        link: linker,
        scope: {
            property: '=',
            propertyConfigIndex: '=',
            archetypeConfig: '=',
            fieldset: '=',
            fieldsetIndex: '=',
            archetypeRenderModel: '=',
            umbracoPropertyAlias: '='
        }
    }
});
angular.module("umbraco.directives").directive('archetypeLocalize', function (archetypeLocalizationService) {
	var linker = function (scope, element, attrs){

		var key = scope.key;
        
        archetypeLocalizationService.localize(key).then(function(value){
        	if(value){
        		element.html(value);
        	}
        });
	}   

	return {
	    restrict: "E",
	    rep1ace: true,
	    link: linker,
	    scope: {
	    	key: '@'
	    }
	}
});
angular.module('umbraco.services').factory('archetypeLocalizationService', function($http, $q, userService){
    var service = {
        resourceFileLoaded: false,
        dictionary: {},
        localize: function(key) {
            var deferred = $q.defer();

            if(service.resourceFileLoaded){
                var value = service._lookup(key);
                deferred.resolve(value);
            }
            else{
                service.initLocalizedResources().then(function(dictionary){
                   var value = service._lookup(key);
                   deferred.resolve(value); 
                });
            } 

            return deferred.promise;
        },
        _lookup: function(key){
            return service.dictionary[key];
        },
        initLocalizedResources:function () {
            var deferred = $q.defer();
            userService.getCurrentUser().then(function(user){
                $http.get("/App_plugins/Archetype/langs/" + user.locale + ".js") 
                    .then(function(response){
                        service.resourceFileLoaded = true;
                        service.dictionary = response.data;

                        return deferred.resolve(service.dictionary);
                    }, function(err){
                        return deferred.reject("Lang file missing");
                    });
            });
            return deferred.promise;
        }
    }

    return service;
});
angular.module('umbraco.resources').factory('archetypePropertyEditorResource', function($q, $http, umbRequestHelper){
    return { 
        getAllDataTypes: function() {
            // Hack - grab DataTypes from Tree API, as `dataTypeService.getAll()` isn't implemented yet
            return umbRequestHelper.resourcePromise(
                $http.get("/umbraco/backoffice/UmbracoTrees/DataTypeTree/GetNodes?id=-1&application=developer&tree=&isDialog=false"), 'Failed to retrieve datatypes from tree service'
            ).then(function (data) {
                return data.map(function(d) {
                    return { "id": d.id, "name": d.name }
                }); 
            });
        },
        getDataType: function(id) {
        	return umbRequestHelper.resourcePromise(
        		$http.get("/umbraco/backoffice/ArchetypeApi/ArchetypeDataType/GetById?id=" + id), 'Failed to retrieve datatype'
    		);
        },
        getPropertyEditorMapping: function(alias) {
            return umbRequestHelper.resourcePromise(
                $http.get("/App_plugins/Archetype/js/propertyEditors.views.js"), 'Failed to retrieve datatype mappings'
            ).then(function (data) {
                var result = _.find(data, function(d) {
                    return d.propertyEditorAlias === alias;
                });

                if (result != null) 
                    return result;

                return "";
            });
        }
    }
}); 