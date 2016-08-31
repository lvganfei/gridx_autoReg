phantom.outputEncoding="UTF-8";
var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/FilterBar/';

//edit the capser object properties in test instance

casper.options.verbose = config.verbose;
casper.options.logLevel = config.logLevel;
casper.options.viewportSize = config.viewportSize;

//error event handlers
casper.on("page.error", function(msg, trace) {
    this.echo("[Page Error]: " + msg, "ERROR");
});

casper.on('resource.error', function(error){
	this.echo('[Resource error code]: '+ error.errorCode+" [error string]: "+error.errorString+" [error url]: "+error.url+' [id]: '+error.id,'ERROR');
});

casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg, 'INFO');
});

//refresh grid function
casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};

//grid reload function
casper.gridLoadCheck = function(){
		this.waitFor(function check(){
			return this.exists('td.gridxCell ');
		}, function then(){
			this.echo('page loaded!!');
			this.capture(screenshotFolder+'originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
			this.exit();
		}, 10000);	

};


/*<------------------------------test filter bar and filter dialog----------------------------------------------------------------------------------*/
casper.test.begin('Filter bar & dialog test case', 14, function suite(test){
	
	casper.start(cases.testPagePrefix+cases.FilterBar, casper.gridLoadCheck);

	//test case start here
	casper.then(function(){
		this.echo(this.gridLoadCheck);
		this.reload(casper.gridLoadCheck);
		this.then(function(){
			this.refreshGrid('grid');
		})
		
		//this.capture(screenshotFolder+'originGrid.png');
	});


	casper.run(function(){
		test.done();
	});
});