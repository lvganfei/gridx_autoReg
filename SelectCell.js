var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/SelectCell/';

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

casper.on('remote.alert', function(message){
	this.echo('[Remote alert message]: '+ message, 'ERROR');
});

//refresh grid function
casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};

casper.test.begin('Select Cell test', 7, function suite1(test){
	casper.start(cases.testPagePrefix+cases.SelectCell, function pageLoadCheck(){
		this.waitFor(function check(){
			return this.exists('td.gridxCell ');
		}, function then(){
			this.echo('page loaded!');
			this.capture(screenshotFolder+'originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
		}, 10000);

	});

	//open the select Cell section in the accordionPane
	casper.then(function selectCellAction(){
		this.clickLabel('Select Cell Actions', 'span');
		this.waitForText('Clear cell selection', function columnSelectionShow(){
			this.capture(screenshotFolder+'beforeTest.png');
			test.assertTextExists('Clear cell selection', 'The cell action buttons are ready!');
		}, function timeOut(){
			this.echo('The cell buttons not display!');
		});
		
	});

	casper.then(function selectCell(){
		this.clickLabel('Select cell(row 4, column Album)', 'span');
		this.then(function checkCellisSelected(){

			var selectedCell = this.evaluate(function(){
				return grid.select.cell.getSelected();
			});

			test.assertEquals(selectedCell, [["4", "Album"]], '01--The (Album, 4) cell get selected!');

			var cellClass = this.getElementAttribute('div[rowid="4"] td[colid=Album]', 'class');

			utils.dump(cellClass);
			test.assertNotEquals(cellClass.indexOf('gridxCellSelected'), -1, '02--The (Album, 4) cell should have gridxCellSelected class!');
		
			//Verify the result of Is cell(row 4, column Album) selected?
			this.waitForAlert(function(response){
				test.assertMatch(response.data, /true/g, '03--The result of "Is cell(row 4, column Album) selected" should be TRUE!');
    			this.echo("Alert received: " + response.data);
    			this.sendKeys('body', '\uE00C');
			});
			this.clickLabel('Is cell(row 4, column Album) selected', 'span');	

		})
	});

	casper.then(function deselectCell(){
		//click the Deselect cell(row 4, column Album) button
		this.clickLabel('Deselect cell(row 4, column Album)', 'span');
		this.then(function checkNameisDeselected(){
			var cellClass = this.getElementAttribute('div[rowid="4"] td[colid=Album]', 'class');
			test.assertEquals(cellClass.indexOf('gridxCellSelected'), -1, '04--The (Album, 4) cell should NOT have gridxCellSelected class!');
		});

		//Verify the result of Is column Name selected?
		this.waitForAlert(function(response){
			test.assertMatch(response.data, /false/g, '05--The result of "Is cell(row 4, column Album) selected?" should be FALSE!');
    		this.echo("Alert received: " + response.data);
    		this.sendKeys('body', '\uE00C');
		});
		this.clickLabel('Is cell(row 4, column Album) selected', 'span');		
	});

	casper.then(function isCellSelected(){
			
		//click Select cell(row 4, column Album) button
		this.clickLabel('Select cell(row 4, column Album)', 'span');
		this.capture(screenshotFolder+'afterSelectCell.png');
		
		this.waitForAlert(function(response){
			test.assertMatch(response.data, /true/g, '06--The result of "Is cell(row 4, column Album) selected" should be true!')
    		this.echo("Alert received: " + response.data);
    		this.sendKeys('body', '\uE00C');
		});
		//click the "Is column Name selected?" button
		this.clickLabel('Is cell(row 4, column Album) selected', 'span');	
		

	});

	casper.then(function getSelection(){
		this.waitForAlert(function(response){
			test.assertMatch(response.data, /4,Album/g, '07--The result of Get selected cells should be 4,Album!')
    		this.echo("Alert received: " + response.data);
    		this.sendKeys('body', '\uE00C');
		});
		//click the "Get selected cells" button
		this.clickLabel('Get selected cells', 'span');
	});

	casper.then(function clearSelection(){
		
		//click the "Clear cell selection" button
		this.clickLabel('Clear cell selection', 'span');

		this.waitForAlert(function(response){
			test.assertEquals(response.data, 'selected cells: ', '08--The result of "Selected cells" now should be empty!')
    		this.echo("Alert received: " + response.data);
    		this.sendKeys('body', '\uE00C');
		});
		//click the "Get selected cells" button again
		this.clickLabel('Get selected cells', 'span');
	});
	casper.run(function(){
		test.done();
	});
});