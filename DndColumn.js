var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/DndColumn/';

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

casper.test.begin('Dnd', 14, function suite1(test){
	casper.start(cases.testPagePrefix+cases.DndColumn, function pageLoadCheck(){
		this.waitFor(function check(){
			return this.exists('td.gridxCell ');
		}, function then(){
			this.echo('page loaded!');
			//this.capture(screenshotFolder+'/originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture('fail.png');
			this.exit();
		}, 10000);

	});


	casper.then(function DndColumn(){
		var selectionStartX = this.getElementBounds('#grid-id').left, selectionStartY = this.getElementBounds('#grid-id').top;
	
		this.waitForSelector('#grid-id', function select(){
			this.mouseEvent('mouseover', '#grid-id', '100%', '50%');
		
			//Swept select from id to Order column
			//this.mouse.down(selectionStartX+5, selectionStartY+10);
			this.mouse.down('#grid-id');
			
			//this.mouse.move(selectionStartX+200, selectionStartY+10);
			this.mouse.move('#grid-order');

			//this.mouse.up(selectionStartX+200, selectionStartY+10);
			this.mouse.up('#grid-order');
		});
		
		this.then(function checkResult1(){
			this.capture(screenshotFolder+'SelectFinish.png');
			var selectedCol = this.evaluate(function getSelected(){
				return grid.select.column.getSelected();
			});
			test.assertEquals(selectedCol, ["id", "order"], '01--The selected column should be id and order!');
		});
		
		this.then(function Dnd(){
			//Dnd 300px to right
			var dndStartX = this.getElementBounds('td.gridxColumnSelected[role=gridcell]').left, dndStartY = this.getElementBounds('td.gridxColumnSelected[role=gridcell]').top;
			this.mouseEvent('mouseover', 'td.gridxColumnSelected[role=gridcell]', '50%', '50%');
			this.mouse.down('td.gridxColumnSelected[role=gridcell]');
			this.capture(screenshotFolder+'dndDown.png');
			this.mouse.move(dndStartX+700, dndStartY+10);
			this.capture(screenshotFolder+'dndMove.png');
			this.mouse.up(dndStartX+700, dndStartY+10);
		});
		
		this.then(function checkResult2(){
			this.capture(screenshotFolder+'last.png');

			var colDropX = this.getElementBounds('#grid-id').left;
			this.echo(selectionStartX+' and '+colDropX);
			test.assertNotEquals(selectionStartX, colDropX, '02--The position of dragged column after dnd is changed!');
		});

		this.then(function tearDown(){
			this.reload(casper.gridLoadCheck);
		})
		
	});


	//dnd by keyboard
	casper.then(function dndByKeyboard(){
		
		var idOriHeaderPos = this.getElementBounds('#grid-id'), genreOriHeaderPos = this.getElementBounds('#grid-Genre');


		this.waitForSelector('#grid', function pressTabKey(){
			for(var i=0;i<3;i++){
				this.wait(500, function(){
					this.page.sendEvent('keypress', this.page.event.key.Tab);
				});
			}
	
		});

		this.then(function selectbySpaceKey(){
			this.capture(screenshotFolder+'afterFocusOnHeader.png');
			this.page.sendEvent('keypress', this.page.event.key.Space);
			
		});

		this.then(function multiSelectbyShiftArrow(){
			this.capture(screenshotFolder+'afterSpaceKey.png');

			//select 2 more column by Shift+right key twice
			for(var i=0;i<2;i++){
				this.wait(500, function(){
					this.page.sendEvent('keypress', this.page.event.key.Right, null, null, 0x02000000);
				});
			}

			
		});

		this.wait(1000, function checkResult1(){
			var selected = this.evaluate(function(){
				return grid.select.column.getSelected();
			})
			
			this.capture(screenshotFolder+'afterMultiSelectByShiftArrow.png');

			test.assertEquals(selected, ["id", "order", "Genre"], '03--selected  columns should be id, order, genre!');
		});

		this.then(function dndByShiftArrow(){
			//drag the selected cols toward tight three times cols by Ctrl+right key
			for(var i=0;i<3;i++){
				this.wait(500, function(){
					this.page.sendEvent('keypress', this.page.event.key.Right, null, null, 0x04000000);
				});
			}
			
		});

		this.then(function checkResult2(){
			var idHeaderPos = this.getElementBounds('#grid-id'), genreHeaderPos = this.getElementBounds('#grid-Genre'), idCellPos = this.getElementBounds('div[rowid="9"] td[colid="id"]'), genreCellPos = this.getElementBounds('div[rowid="9"] td[colid="Genre"]');
			var albumHeaderPos = this.getElementBounds('#grid-Album'), nameHeaderPos = this.getElementBounds('#grid-Name');
			
			utils.dump(idOriHeaderPos);
			utils.dump(idHeaderPos);

			this.capture(screenshotFolder+'afterDrag3Times.png');
			//check the left coordinate of id Header and cell, make sure they are vertical aligned
			test.assertEquals(idHeaderPos.left, idCellPos.left, '04--The header and cell of id column should be vertical aligned (same x axis)!');
			//check the left coordinate of Genre Header and cell, make sure they are vertical aligned
			test.assertEquals(genreHeaderPos.left, genreCellPos.left, '05--The header and cell of Genre column should be vertical aligned(same x axis)!');
			//make sure the original and latest position of id column is changed
			test.assertNotEquals(idHeaderPos, idOriHeaderPos, '06--The position of id header should changes!');
			//make sure the differences between original and latest id and Genre are the same
			test.assertEqual(genreHeaderPos.left-genreOriHeaderPos.left, idHeaderPos.left-idOriHeaderPos.left, '07--The Id and Genre column should be dragged a same distance!');
			//make sure selected cols are dragged to postion between Album and Name
			test.assertEqual(albumHeaderPos.left+albumHeaderPos.width, idHeaderPos.left, '08--The right edge of Album col should be equal to left edge of Id col!');
			test.assertEqual(genreHeaderPos.left+genreHeaderPos.width, nameHeaderPos.left, '09--The left edge of Name col should be equal to right of Genre col!');

		});

		//drag them to left one col, now they should palced between year and Album
		this.then(function dndLeft(){

			this.wait(1000, function(){
				this.page.sendEvent('keypress', this.page.event.key.Left, null, null, 0x04000000);
			});

			this.then(function checkResult3(){
				var idHeaderPos = this.getElementBounds('#grid-id'), genreHeaderPos = this.getElementBounds('#grid-Genre'), idCellPos = this.getElementBounds('div[rowid="9"] td[colid="id"]'), genreCellPos = this.getElementBounds('div[rowid="9"] td[colid="Genre"]');
				var albumHeaderPos = this.getElementBounds('#grid-Album'), yearHeaderPos = this.getElementBounds('#grid-Year');
			
				this.capture(screenshotFolder+'afterDndToLeftonce.png');

				//check the left coordinate of id Header and cell, make sure they are vertical aligned
				test.assertEquals(idHeaderPos.left, idCellPos.left, '10--The header and cell of id column should be vertical aligned (same x axis)!');
				//check the left coordinate of Genre Header and cell, make sure they are vertical aligned
				test.assertEquals(genreHeaderPos.left, genreCellPos.left, '11--The header and cell of Genre column should be vertical aligned(same x axis)!');
				
				//make sure the differences between original and latest id and Genre are the same
				test.assertEqual(genreHeaderPos.left-genreOriHeaderPos.left, idHeaderPos.left-idOriHeaderPos.left, '12--The Id and Genre column should be dragged a same distance!');
				//make sure selected cols are dragged to postion between Album and Name
				test.assertEqual(yearHeaderPos.left+yearHeaderPos.width, idHeaderPos.left, '13--The right edge of Year col should be equal to left edge of Id col!');
				test.assertEqual(genreHeaderPos.left+genreHeaderPos.width, albumHeaderPos.left, '14--The left edge of Album col should be equal to right of Genre col!');


			})
		})
	});

	casper.run(function(){
		test.done();
	});
});


//test dnd column to non-grid target
casper.test.begin('dnd column to non-grid target', 1, function suite2(test){
	casper.start(cases.testPagePrefix+'test_grid_dndcolumn_nongrid_target.html', function pageLoadCheck(){
		this.waitFor(function check(){
			return this.exists('td.gridxCell ');
		}, function then(){
			this.echo('page loaded!');
			this.evaluate(function addlistener(){
				document.body.addEventListener('click', function(e){
					console.log(e.clientX+'&'+e.clientY);
				})
			})
			//this.capture(screenshotFolder+'/originGrid.png');
		}, function timeout(){
			this.echo('cant get element!!!!');
			this.capture(screenshotFolder+'fail.png');
			this.exit();
		}, 10000);

	});

	casper.then(function dndToNonGrid(){
		this.click('#songForm');
		this.echo('suite 2 started!', 'INFO');
		//select Genre column
		this.then(function select(){
			
			this.click('#grid-Genre');

		});

		//dnd Genre column
		this.then(function dndColumn(){
			
			this.mouse.down('div.gridxRow[rowid="1"] td[colid="Genre"]');
			this.mouse.move(335, 365);
			this.mouse.up(335,365);
		});

		this.then(function checkResult(){
			var selectedCol = this.evaluate(function getSelected(){
				return grid.select.column.getSelected();
			});

			test.assertEquals(selectedCol, ["Genre"], '01--The selected column should be Genre!');
			this.capture(screenshotFolder+'afterDndToNonGrid.png');
			test.comment('Dnd doesnt work, a casper or grid bug to be fixed!');
		});
		
	});

	casper.run(function(){
		test.done();
	});

});