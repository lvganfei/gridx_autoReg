var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/ColumnResizer/';

casper.options.verbose = false;
casper.options.logLevel = 'debug';
casper.options.viewportSize = {width:1280, height:800};

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

//refresh grid function, eleId is the id of grid you want to refresh.
casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};

casper.test.begin('case ColumnResizer', 5, function suite1(test){

	casper.start(cases.testPagePrefix+cases.ColumnResizer, function pageLoadCheck(){
		this.waitFor(function check(){
			return this.exists('td.gridxCell ');
		}, function then(){
			this.echo('page loaded!');
			this.capture(screenshotFolder+'originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
			this.exit();
		}, 10000);

	});

	casper.then(function beforeTest(){
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
		//reset test page
		this.reload(function resetTestpage(){
			this.waitForSelector('td.gridxCell ', function waitForHeader(){
				this.echo('page reloaded!');
			});
			
		});
		
	});

	casper.then(function columnResizerManually(){
		//resize Artist column 
		var startDndX = this.getElementBounds('#grid-Artist').left, startDndY = this.getElementBounds('#grid-Artist').top, columnWidth = this.getElementBounds('#grid-Artist').width, columnHeight = this.getElementBounds('#grid-Artist').height;
		//hover on the right edge of Artist
		this.mouse.move(startDndX+columnWidth, startDndY+columnHeight/2);
		//mouse down on the right edge of Artist
		this.mouse.down(startDndX+columnWidth, startDndY+columnHeight/2);
		//move right with 300px offset
		this.mouse.move(startDndX+columnWidth+300, startDndY+columnHeight/2);
		//mouse up at the target coordinate
		this.mouse.up(startDndX+columnWidth+300, startDndY+columnHeight/2);
		this.capture(screenshotFolder+ 'afterResizeColumnManually.png');

		test.assertNotEquals(this.getElementBounds('#grid-Artist').width, columnWidth, '03--The column width of Artist should change!');

	});


	casper.run(function(){
		test.done();
	});
});