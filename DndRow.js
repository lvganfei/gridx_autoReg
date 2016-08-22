var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/DndRow/';

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
			this.echo('page loaded!');
			this.capture(screenshotFolder+'originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
			this.exit();
		}, 10000);	

};

casper.repeatKey = function(times, key){
	for(var i=0; i < times; i++){
		this.page.sendEvent('keypress', this.page.event.key[key]);
	}
};

casper.test.begin('dnd row test case', 7, function suite1(test){
	
	casper.start(cases.testPagePrefix+cases.DndRow, function pageLoadCheck(){
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

	//defect#12789 for dnd_rearrange.html, triggerOnCell is true
	casper.then(function clickOneRow(){
		//Use the mouse click to select row#2
		this.click('div.gridxRow[rowid="2"] td[colid="Genre"]');

		this.then(function checkResult(){
			var rowClass = this.getElementAttribute('div.gridxRowHeaderRow[rowid="2"]', 'class');
			var selected = this.evaluate(function(){
				return grid.select.row.getSelected();
			});

			test.assertEquals(selected, ["2"], '01--The selected row should be row#2!');
			test.assertMatch(rowClass, /gridxRowSelected/g, '02--The row class should has selected rule!');
		})
	});

	
	//Use the up/down arrow twice to move the cell focus up/down 2 rows
	//use the space key tring to select te row where the cell focus is in. This row not get selected sometime
	casper.then(function spaceKey(){
		var repeatTime, destPos;

		//repeat random time less than 7
		repeatTime = Math.ceil(Math.random()*7);

		//the destination position is repeat time plus 2
		destPos = repeatTime + 2;

		//repeat arrow down key repeatTime times
		this.repeatKey(repeatTime, 'Down');

		//press Space key
		this.then(function spaceKey(){

			this.page.sendEvent('keypress', this.page.event.key.Space);

		});
		
		
		this.then(function checkResult(){

			var rowClass = this.getElementAttribute('div.gridxRowHeaderRow[rowid="'+destPos+'"]', 'class');
			var selected = this.evaluate(function(){
				return grid.select.row.getSelected();
			});

			this.echo(repeatTime);
			this.capture(screenshotFolder+'afterSpaceKey.png');
			test.assertEquals(selected, [destPos.toString()], '03--Now the selected row should be row#'+destPos+'!');
			test.assertMatch(rowClass, /gridxRowSelected/g, '04--The row#'+destPos+' should has selected style!');
		});

		this.then(function tearDown(){
			this.reload(this.gridLoadCheck);
		})
	});

	//single row rearrange
	casper.then(function singleDnd(){

		//specify which destination row's bottom border to dnd 
		var dragDestin = Math.ceil(Math.random()*8)+1;

		//click the 1st row
		this.then(function click(){
			this.click('div.gridxRow[rowid="1"] td[colid="Genre"]');

		});
		
		this.then(function dndRandom(){
			var dragDestinPos = this.getElementBounds('div.gridxRow[rowid="'+dragDestin+'"] td[colid="Genre"]');
			
			//wait 1 second then drag
			this.wait(1000, function(){

				this.mouseEvent('mouseover', 'div.gridxRow[rowid="1"] td[colid="Genre"]', '50%', '50%');
				this.mouse.down('div.gridxRow[rowid="1"] td[colid="Genre"]');

				//move and drop to destination row's bottom
				this.mouse.move(dragDestinPos.left, dragDestinPos.top+dragDestinPos.height);
				this.mouse.up(dragDestinPos.left, dragDestinPos.top+dragDestinPos.height);

			});	
		});

		this.then(function checkResult(){

			var selectedRowid = this.getElementAttribute('div.gridxRow.gridxRowSelected', 'rowid');
			
			//Now after dnd row#1 to destination row, the row#1's new dom order will replace the destination row 
			var draggedRowIndex = this.evaluate(function getDomIndex(){
				var domOrder, nodeList = document.querySelectorAll('div.gridxRow'); 

				//get dom position of selected and dragged row 
				Array.prototype.forEach.call(nodeList, function(ele,index){
				
					if ((ele.className.indexOf('gridxRowSelected') > -1) && ele.getAttribute('rowid') == '1'){
						domOrder = index;
					}
				
				});

				return domOrder;
			});

			this.echo('draggedRowIndex is: '+draggedRowIndex, 'INFO');

			this.wait(1000, function capture(){
				this.echo('dragDestin row is: '+dragDestin, 'INFO');
				this.capture(screenshotFolder+'afterSingleDnd.png');
			});
			
			test.assertEquals(selectedRowid, '1', '05--The selected row should still be 1!');

			//the row being dragged should replace (equal) destination row in dom sequence
			test.assertEquals(draggedRowIndex, dragDestin, '06--Now the new position of dragged row should replace the destination row!');

		})
	});

	//multi row rearrange
	casper.then(function multiRowDndByMouse(){
		//specify a random count to dnd over
		var dragDestin = Math.ceil(Math.random()*7)+2;
		this.reload(this.gridLoadCheck);
		
		this.then(function multiSelect(){

			//select row 1-3 by mouse swipe
			this.mouse.down('div.gridxRow[rowid="1"] td[colid="Genre"]');
			this.mouse.move('div.gridxRow[rowid="3"] td[colid="Genre"]');
			this.mouse.up('div.gridxRow[rowid="3"] td[colid="Genre"]');
		});

		this.then(function dndRandom(){
			
			//specify which destination row's bottom border to dnd 
			
			var dragDestinPos = this.getElementBounds('div.gridxRow[rowid="'+dragDestin+'"] td[colid="Genre"]');
			
			//wait 1 second then drag
			this.wait(1000, function(){

				this.mouseEvent('mouseover', 'div.gridxRow[rowid="1"] td[colid="Genre"]', '50%', '50%');
				this.mouse.down('div.gridxRow[rowid="1"] td[colid="Genre"]');

				//move and drop to destination row's bottom
				this.mouse.move(dragDestinPos.left, dragDestinPos.top+dragDestinPos.height);
				this.mouse.up(dragDestinPos.left, dragDestinPos.top+dragDestinPos.height);

			});	
		});

		this.then(function checkResult(){

			//get the selected rows' id
			var selectedRowid = this.getElementsAttribute('div.gridxRow.gridxRowSelected', 'rowid');

			//Now after dnd rows to destination row, the dragged rows new dom order will replace the destination row 
			var draggedRowIndex = this.evaluate(function getDomIndex(){
				var domOrder = [], nodeList = document.querySelectorAll('div.gridxRow'); 

				//get dom position of selected and dragged row 
				Array.prototype.forEach.call(nodeList, function(ele,index){
				
					if ((ele.className.indexOf('gridxRowSelected') > -1) &&  ["1","2","3"].indexOf(ele.getAttribute('rowid'))>-1){
						domOrder.push(index);
					}
				
				});

				return domOrder;
			});

			this.wait(1000, function afterWait(){
				
				this.echo('multi dragDestin row is: '+dragDestin, 'INFO');
				utils.dump(draggedRowIndex);
				this.capture(screenshotFolder+'afterMultiDnd.png');	

				test.assertEquals(selectedRowid, ["1","2","3"], '07--The selected rows should still be 1-3!');	
			});
			

			
		})
	})

	casper.run(function(){
		test.done();
	});
});