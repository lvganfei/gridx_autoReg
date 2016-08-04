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

casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg, 'INFO');
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

casper.test.begin('ExtendedSelect Row test case', 27, function suite1(test){
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

			var temArr = rowStatus.split('\n');
			
			/*utils.dump(rowStatus);
			utils.dump(temArr);
			this.echo(temArr.length);*/
			test.assertEquals(temArr.length, 200, '06--The selected rows in rowStatus textArea is 200!')
		})
		
	});

	//Deselect All button test
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

	//Sinle select/deselect by mouse click
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

	//MultiSelect by mouse when holding CTRL
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

			test.assertEquals(rowStatus,'4\n8', '19--Now the 4th and 8th row should be selected now!');
		});
		
	});

	//Single Deslect byu mouse Holding CTRL
	casper.then(function deSelectByCtrl(){
		var classOf8;
		var rowStatus;

		//Ctrl click the 8th row
		this.evaluate(function ctrlClikRow(selector){
			var ele = document.querySelector(selector);

			// create event in old ugly way
			var mouseDownEvt = document.createEvent('MouseEvents'), mouseUpEvt = document.createEvent('MouseEvents');

			mouseDownEvt.initMouseEvent("mousedown", true, true, window, 1, 0, 0, 0, 0, true, false, false, false, 0, null);
			ele.dispatchEvent(mouseDownEvt);

			mouseUpEvt.initMouseEvent("mouseup", true, true, window, 2, 0, 0, 0, 0, true, false, false, false, 0, null);
			ele.dispatchEvent(mouseUpEvt);		


		}, 'div.gridxRowHeaderRow[rowid="8"] td');

		this.then(function checkSelected(){
			this.capture(screenshotFolder+'afterCtrlClickAgain.png');
			rowStatus = this.evaluate(function(){
				return document.getElementById('rowStatus').value;
			});

			//check the rowStatus textarea
			test.assertEquals(rowStatus,'4', '20--Now the 4th and 8th row should be selected now!');

			//check the class of 8th row
			classOf8 = this.getElementAttribute('div.gridxRowHeaderRow[rowid="8"]', 'class');
			test.assertEquals(classOf8.indexOf('gridxRowSelected'), -1, '21--Now the 8th row is unselected!');

			this.then(function tearDown(){
				//Deselect all after test
				this.click(x('//table[@class="testboard"]//button[text()="Deselect All"]'));
			})
		});

	});

	//swipe select by mouse(mousedown and mouseup)
	casper.then(function swipeSelect(){
		//mouse down on the 3rd row header. Use this.mous.action() instead of this.mouseEvent()!
		this.mouse.down('div.gridxRowHeaderRow[rowid="3"] td');

		//this.mouseEvent('mousedown', 'div.gridxRowHeaderRow[rowid="3"] td');
		//mouse move and up on the 7th row header
		this.mouse.move('div.gridxRowHeaderRow[rowid="7"] td');
		this.mouse.up('div.gridxRowHeaderRow[rowid="7"] td');
		//this.mouseEvent('mousemove', 'div.gridxRowHeaderRow[rowid="7"] td');
		//this.mouseEvent('mouseup', 'div.gridxRowHeaderRow[rowid="7"] td');

		this.then(function checkSwipeResult(){
			var rowStatus = this.evaluate(function(){
				return document.getElementById('rowStatus').value;
			});
			this.capture(screenshotFolder+'afterSwipe.png');

			test.assertEquals(rowStatus, '3\n4\n5\n6\n7', '22--The 3-7 rows are selected!');

			this.then(function tearDown(){
				//Deselect all after test
				this.click(x('//table[@class="testboard"]//button[text()="Deselect All"]'));
				this.reload(this.gridLoadCheck);
				
			})

		})
	});

	
	//a11y select by keyboard(SPACE key)
	casper.then(function selectBySpaceKey(){

		//press TAB 3 times
		for(var i=0;i<3;i++){
			this.page.sendEvent('keypress', this.page.event.key.Tab);
		}
		

		this.then(function operation(){

			//workaround for the bug not retain focus in rowheader from previous step
			this.page.sendEvent('keypress', this.page.event.key.Tab);

			//press Arrow down key twice focusing on the 3th row and press space key
			this.then(function pressDownKey(){
				this.page.sendEvent('keypress', this.page.event.key.Down);
				this.page.sendEvent('keypress', this.page.event.key.Down);
			});
			
			this.then(function pressSpaceKey(){
				this.page.sendEvent('keypress', this.page.event.key.Space);
			})

			

		});

		this.then(function checkResult(){
			
			var rowStatus, classofRow;
			
			this.capture(screenshotFolder+'afterSpaceKey.png');

			rowStatus = this.evaluate(function(){
				return document.getElementById('rowStatus').value;
			});

			// get the class of row#2
			classofRow = this.getElementAttribute('div.gridxRow[rowid="2"]', 'class');

			test.assertEquals(rowStatus, '2', '23--The row#2 get selected!');

			test.assertMatch(classofRow, /gridxRowSelected/g, '24--The class of row#2 has selected theme!');
		})
	
	
	});

	//A11y: multi selection by keyboard (SHIFT+ARROW)
	casper.then(function multiSelectByKeyboard(){

		//click the rowheader#6 for test begaining
		this.click('div.gridxRowHeaderRow[rowid="6"] td');	

		//press shift+arrow down once
		this.then(function(){
			this.page.sendEvent('keypress', this.page.event.key.Down, null, null, 0x02000000);
		});

		this.wait(1000);

		this.echo('here a gridx or phantomjs bug exists, shift+ArrowDown key can only press once, second press will make casperjs loss response!', 'ERROR');
/*		here a gridx or phantomjs bug exists, after the first shift+Down key, the second key press make the casperjs crack down
		this.then(function(){
			this.page.sendEvent('keypress', this.page.event.key.Down, null, null, 0x02000000);

		});*/


		this.then(function checkReult(){
			var rowStatus = this.evaluate(function(){
				return document.getElementById('rowStatus').value;
			});

			this.capture(screenshotFolder+'afterShiftDownPressed.png');

			test.assertEquals(rowStatus, '6\n7', '25--The 6,7 rows should be selected!');

		})

	});


	/*Turn on triggerOnCell*/
	casper.then(function openTriggerOnCell(){

		this.evaluate(function(){
			grid.select.row.triggerOnCell = true;
		})

	});

	casper.then(function singleSelectOnCell(){

		//click the Genre cell in the row#5
		this.click('div.gridxRow[rowid="5"] td[colid="Genre"]');
		
		this.then(function checkReult(){
			var rowStatus = this.evaluate(function(){
				return document.getElementById('rowStatus').value;
			});

			test.assertEquals(rowStatus, '5', '26--The row#5 should be selected by clicking the cell!');
		})	
	});

	//multi select by mouse swipe
	casper.then(function multiSelectOnCell(){

		//swipe select 5-8 row
		this.mouse.down('div.gridxRow[rowid="5"] td[colid="Genre"]');
		this.mouse.move('div.gridxRow[rowid="8"] td[colid="Genre"]');
		this.mouse.up('div.gridxRow[rowid="8"] td[colid="Genre"]');

		this.then(function checkReult(){
			
			this.capture(screenshotFolder+'afterSwipeOnCell.png');

			var rowStatus = this.evaluate(function(){
				return document.getElementById('rowStatus').value;
			});

			test.assertEquals(rowStatus, '5\n6\n7\n8', '27--The row#5-8 should be selected by swiping the cell!');
		})

	});

	//multi select by holding CTRL key and clicking on cell
	casper.then(function multiSelectOnCellByCtrl(){

		//click the row#4
		this.click('div.gridxRow[rowid="4"] td[colid="Genre"]');

		this.then(function checkPrecon(){
			var rowStatus = this.evaluate(function(){
				return document.getElementById('rowStatus').value;
			});

			test.assertEquals(rowStatus,'4', '28--Now the former 5-8 row unslected and row#4 should be selected!');
		});

		//click the row#6 when holding CTRL
		this.then(function CtrlClickOnCell6(){
			this.evaluate(function ctrlClikRow(selector){
			var ele = document.querySelector(selector);

			// create event in old ugly way
			var mouseDownEvt = document.createEvent('MouseEvents'), mouseUpEvt = document.createEvent('MouseEvents');

			mouseDownEvt.initMouseEvent("mousedown", true, true, window, 1, 0, 0, 0, 0, true, false, false, false, 0, null);
			ele.dispatchEvent(mouseDownEvt);

			mouseUpEvt.initMouseEvent("mouseup", true, true, window, 2, 0, 0, 0, 0, true, false, false, false, 0, null);
			ele.dispatchEvent(mouseUpEvt);		


			}, 'div.gridxRow[rowid="6"] td[colid="Genre"]');
		});

		//click the row#8 when holding CTRL
		this.then(function CtrlClickOnCell8(){
			this.evaluate(function ctrlClikRow(selector){
				var ele = document.querySelector(selector);

				// create event in old ugly way
				var mouseDownEvt = document.createEvent('MouseEvents'), mouseUpEvt = document.createEvent('MouseEvents');

				mouseDownEvt.initMouseEvent("mousedown", true, true, window, 1, 0, 0, 0, 0, true, false, false, false, 0, null);
				ele.dispatchEvent(mouseDownEvt);

				mouseUpEvt.initMouseEvent("mouseup", true, true, window, 2, 0, 0, 0, 0, true, false, false, false, 0, null);
				ele.dispatchEvent(mouseUpEvt);		


			}, 'div.gridxRow[rowid="8"] td[colid="Genre"]');
		});

		//now 4,6,8 row should be selected
		this.then(function checkReult(){

			var rowStatus = this.evaluate(function(){
				return document.getElementById('rowStatus').value;
			});

			test.assertEquals(rowStatus, '4\n6\n8', '29--Now row 4,6,8 should be selected!');

		})
		
	});

	//for cell selection part:
	//1.Click on cell 2,Genre(Jazz)
	//2.Hold down SHIFT and click on cell 3, Artist(Emerson), now the selected id are ok: [2, Genre],[3,Genre],[2,Artist],[3,Artist]
	//3. click on cell 1,Genre(Classic Rock), now the selection is highlighted but selected ids are: [1,Genre],[2,Genre],[3,Genre], not [1,Genre],[2,Genre]
	


	casper.run(function(){
		test.done();
	});
});