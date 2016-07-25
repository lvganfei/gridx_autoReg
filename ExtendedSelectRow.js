var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var x = require('casper').selectXPath;
var screenshotFolder = 'screenshot/ExtendedSelectRow/';

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

//refresh grid function
casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};

casper.gridLoadCheck = function(){
		this.waitFor(function check(){
			return this.exists('td.gridxCell ');
		}, function then(){
			this.echo('page loaded!');
			this.capture(screenshotFolder+'originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
		}, 10000);	

};

casper.test.begin('ExtendedSelect Row test case', 19, function suite1(test){
	casper.start(cases.testPagePrefix+cases.ExtendedSelectRow, this.gridLoadCheck);

	//test case start here
	//Select by buttons
	casper.then(function wait3s(){
		this.wait(3000);
	});
	casper.then(function selectBtn(){

		this.clickLabel('Select', 'button');
		this.capture(screenshotFolder+'afterSelect5row.png');

		var rowStatus = this.evaluate(function(){
			return document.getElementById('rowStatus').value;
		});

		var selectedId = this.getElementsAttribute('div.gridxRow.gridxRowSelected', 'rowid');

		/*this.echo(rowStatus);
		utils.dump(selectedId);
		this.echo(typeof selectedId);*/
		
		//check if the style of selected row 0-5 is changed to gridxRowSelected.
		test.assertEquals(selectedId, ['0','1','2','3','4','5'], '01--The selected ID should be 0-5!');

		//the value of rowStatus textarea is 0-5
		test.assertEquals(rowStatus, '0\n1\n2\n3\n4\n5', '02--Select row is 0-5!');

		//the total number of selected row is 6
		test.assertElementCount('div.gridxRow.gridxRowSelected', 6, '03--The selected rows count is 6!');
	
	});

	//deselect 0-5 rows by clicking the deselect button
	casper.then(function deselectBtn(){
		this.clickLabel('Deselect', 'button');

		var rowStatus = this.evaluate(function(){
			return document.getElementById('rowStatus').value;
		});

		var selectedId = this.getElementsAttribute('div.gridxRow.gridxRowSelected', 'rowid');

		//the value of rowStatus textarea is now empty
		test.assertEquals(rowStatus, '', '04--Now the value of selected row status is empty!');

		//the row has gridxRowSelected class doesnt exist now
		test.assertDoesntExist('div.gridxRowSelected', '05--Now the row has gridxRowSelected class NOT exist!');

	});

	//select all button test
	casper.then(function selectAllBtn(){
		//reload test page
		this.reload(this.gridLoadCheck);

		//click the selectAll button in row section 
		this.then(function(){
			this.click(x('//table[@class="testboard"]/tbody/tr[2]//button[text()="Select All"]'));
		});
		
		
		this.then(function verifySelectedId(){
			this.capture(screenshotFolder+'afterSelectAll.png');
			var rowStatus = this.evaluate(function(){
				return document.getElementById('rowStatus').value;
			});

			utils.dump(rowStatus);
			var temArr = rowStatus.split('\n');
			utils.dump(temArr);
			this.echo(temArr.length);
			test.assertEquals(temArr.length, 200, '06--The selected rows in rowStatus textArea is 200!')
		})
		
	});

	casper.then(function deSelectAll(){
		
		this.click(x('//table[@class="testboard"]//button[text()="Deselect All"]'));
		this.capture(screenshotFolder+'afterDeselectAll.png');

		//verify the value of rowstatus textarea is empty
		var rowStatus = this.evaluate(function(){
			return document.getElementById('rowStatus').value;
		});

		test.assertEquals(rowStatus, '', '07--The selected rows in rowStatus textArea is empty now!');

		var selectedRow = this.evaluate(function(){
			return grid.select.row.getSelected();
		});

		test.assertEquals(selectedRow, [], '08--The slected row should be 0!');
	});

	//defect#13249
	//Hold down SHIFT throughout step below
	//1.click on row id=5(jazz, Andy Narell)
	casper.then(function clickId5(){
		this.click('div.gridxRowHeaderRow[rowid="5"] td');
	});

	//2.click on row id=0(Easy Listening), this shows row id 0-5 highlight, and row id 0-5 selected under selection status as expected
	casper.then(function shiftClick(){

		this.evaluate(function shiftClick(selector){
			var ele = document.querySelector(selector);
			//create event via event constructor
	/*		var mouseDownEvt = new MouseEvent("mousedown",{
				bubbles:true,
				cancelable:true,
				view:window,
				shiftKey: true
			});

			//dispatch a mousedown event
			ele.dispatchEvent(mouseDownEvt);

			var mouseUpEvt = new MouseEvent("mouseup", {
				bubbles:true,
				cancelable:true,
				view:window	
			});

			//dispatch a shift + mouseup event
			ele.dispatchEvent(mouseUpEvt);
		*/

			// create event in old ugly way
			var mouseDownEvt = document.createEvent('MouseEvents'), mouseUpEvt = document.createEvent('MouseEvents');

			mouseDownEvt.initMouseEvent("mousedown", true, true, window, 1, 0, 0, 0, 0, false, false, true, false, 0, null);
			ele.dispatchEvent(mouseDownEvt);

			mouseUpEvt.initMouseEvent("mouseup", true, true, window, 2, 0, 0, 0, 0, false, false, false, false, 0, null);
			ele.dispatchEvent(mouseUpEvt);		

		

		}, 'div.gridxRowHeaderRow[rowid="0"] td');
	
	
		this.capture(screenshotFolder+'afterFirstShiftClick.png');

		//fetch the selected row via gridx getSelected()
		var selectedRow = this.evaluate(function(){
			return grid.select.row.getSelected();
		});

		test.assertEquals(selectedRow, ["0", "1", "2", "3", "4", "5"], '09--The slected row should be 0-5!');

		//the total number of selected row is 6
		test.assertElementCount('div.gridxRow.gridxRowSelected', 6, '10--The selected rows count is 6!');

		var rowStatus = this.evaluate(function(){
			return document.getElementById('rowStatus').value;
		});
	
		//the value of rowStatus textarea is 0-5
		test.assertEquals(rowStatus, '0\n1\n2\n3\n4\n5', '11--Select row is 0-5 in rowstatus textarea!');
	});

	
	
	//3.click on row id=11(World, Andy Statmen), this shows row id 5-11 highlight, but rows0-11 as selected under selection status
	casper.then(function secondShiftClick(){
		this.evaluate(function shiftClick(selector){
			var ele = document.querySelector(selector);
			//create event via event constructor
	/*		var mouseDownEvt = new MouseEvent("mousedown",{
				bubbles:true,
				cancelable:true,
				view:window,
				shiftKey: true
			});

			//dispatch a mousedown event
			ele.dispatchEvent(mouseDownEvt);

			var mouseUpEvt = new MouseEvent("mouseup", {
				bubbles:true,
				cancelable:true,
				view:window	
			});

			//dispatch a shift + mouseup event
			ele.dispatchEvent(mouseUpEvt);
		*/

			// create event in old ugly way
			var mouseDownEvt = document.createEvent('MouseEvents'), mouseUpEvt = document.createEvent('MouseEvents');

			mouseDownEvt.initMouseEvent("mousedown", true, true, window, 1, 0, 0, 0, 0, false, false, true, false, 0, null);
			ele.dispatchEvent(mouseDownEvt);

			mouseUpEvt.initMouseEvent("mouseup", true, true, window, 2, 0, 0, 0, 0, false, false, false, false, 0, null);
			ele.dispatchEvent(mouseUpEvt);		

		

		}, 'div.gridxRowHeaderRow[rowid="11"] td');

		//capture screenshot after second shift click
		this.capture(screenshotFolder+'afterSecondShiftClick.png');

		//the total number of selected row is 7 now
		test.assertElementCount('div.gridxRow.gridxRowSelected', 7, '12--The selected rows count is 7!');

		var rowStatus = this.evaluate(function(){
			return document.getElementById('rowStatus').value;
		});
	
		//the value of rowStatus textarea is 5-11
		test.assertEquals(rowStatus, '5\n6\n7\n8\n9\n10\n11', '13--Select row is 5-11!');

		//the 0-4 rows are not selected now
		test.assertDoesntExist('div.gridxRowSelected[rowid="4"]', '14--The 4th row with gridxRowSelected class should NOT exist!');


		//reload test page after step
		this.reload(this.gridLoadCheck);
	});

	
	casper.then(function singleSelectByMouse(){
		this.click('div.gridxRowHeaderRow[rowid="5"] td');
		var classOf5;
		var rowStatus;

		this.then(function clickOneRow(){
			classOf5 = this.getElementAttribute('div.gridxRowHeaderRow[rowid="5"]', 'class');
			test.assertMatch(classOf5, /gridxRowSelected/g, '15--Now the 5th row should has selected class!');

			rowStatus = this.evaluate(function(){
				return document.getElementById('rowStatus').value;
			});
			test.assertEquals(rowStatus,'5', '16--The 5th row should be selected!');
		});

		

		this.then(function clickAnotherRow(){

			this.click('div.gridxRowHeaderRow[rowid="8"] td');
			this.then(function checkSelected(){

				classOf5 = this.getElementAttribute('div.gridxRowHeaderRow[rowid="5"]', 'class');
				this.echo(classOf5);

				test.assertEquals(classOf5.indexOf('gridxRowSelected'), -1, '17--Now the 5th row is unselected!');

				rowStatus = this.evaluate(function(){
					return document.getElementById('rowStatus').value;
				});

				test.assertEquals(rowStatus,'8', '18--The 8th row should be selected now!');

			});
			
		});


	});

	
	casper.then(function ctrlClick(){
		//Ctrl click the 4th row
		this.evaluate(function ctrlClikRow(selector){
			var ele = document.querySelector(selector);

			// create event in old ugly way
			var mouseDownEvt = document.createEvent('MouseEvents'), mouseUpEvt = document.createEvent('MouseEvents');

			mouseDownEvt.initMouseEvent("mousedown", true, true, window, 1, 0, 0, 0, 0, true, false, false, false, 0, null);
			ele.dispatchEvent(mouseDownEvt);

			mouseUpEvt.initMouseEvent("mouseup", true, true, window, 2, 0, 0, 0, 0, true, false, false, false, 0, null);
			ele.dispatchEvent(mouseUpEvt);		


		}, 'div.gridxRowHeaderRow[rowid="4"] td');

		this.then(function checkSelected(){
			this.capture(screenshotFolder+'afterCtrlClick.png');
			var rowStatus = this.evaluate(function(){
			return document.getElementById('rowStatus').value;
			});

			test.assertEquals(rowStatus,'4\n8', '19--The 4th and 8th row should be selected now!');
		});
		
	})

	//for cell selection part:
	//1.Click on cell 2,Genre(Jazz)
	//2.Hold down SHIFT and click on cell 3, Artist(Emerson), now the selected id are ok: [2, Genre],[3,Genre],[2,Artist],[3,Artist]
	//3. click on cell 1,Genre(Classic Rock), now the selection is highlighted but selected ids are: [1,Genre],[2,Genre],[3,Genre], not [1,Genre],[2,Genre]
	


	casper.run(function(){
		test.done();
	});
});