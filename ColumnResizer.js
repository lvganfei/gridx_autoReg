var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/ColumnResizer';

//utils.dump(config);
casper.options.verbose = true;
casper.options.logLevel = 'debug';
casper.options.viewportSize = {width:1280, height:800};

//error event handlers
casper.on("page.error", function(msg, trace) {
    this.echo("[Page Error]: " + msg, "ERROR");
});

casper.on('resource.error', function(error){
	this.echo('[Resource error code]: '+ error.errorCode+" [error string]: "+error.errorString+" [error url]: "+error.url+' [id]: '+error.id,'ERROR');
});

//refresh grid function, eleId is the id of grid you want to refresh.
casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};

casper.test.begin('case ColumnResizer', 4, function suite1(test){

	casper.start(cases.testPagePrefix+cases.ColumnResizer, function pageLoadCheck(){
		this.waitFor(function check(){
			return this.exists('td.gridxCell ');
		}, function then(){
			this.echo('page loaded!');
			this.capture(screenshotFolder+'/originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
		}, 10000);

	});

	casper.then(function firstCase(){
		test.assertEquals(this.getElementBounds('#grid-Album').width, 168, '01--The original width of Album column should be 168px!');
		utils.dump(this.getElementBounds('#grid-Album'));
		/*utils.dump('the text is: '+this.fetchText('#grid-Album'));
		utils.dump(this.getElementAttribute('#grid-Album', 'style'));
		utils.dump(this.getElementInfo('#grid-Album'));*/

	});

	casper.then(function setRandomWidth(){
		//click 3 times
		this.repeat(3, function repeatClick(){
			this.clickLabel('Set a random width to column "Album"', 'span');
			utils.dump(this.getElementBounds('#grid-Album'));
			var colWidth = parseInt(this.fetchText('#colWidthSpan'));
			test.assertEquals(colWidth+8, this.getElementBounds('#grid-Album').width, '02--The Album column width should be equal the set random value!');
		});
		
		
		
	});

	casper.run(function(){
		test.done();
	});
});