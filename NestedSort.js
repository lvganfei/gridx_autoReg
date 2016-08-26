var cases = require('./common').cases;
var config = require('./common').config;
var utils = require('utils');
var screenshotFolder = 'screenshot/NestedSort/';

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

//refresh grid function
casper.refreshGrid = function(eleId){
	this.evaluate(function(eleId){
		dijit.byId(eleId).body.refresh();
	}, eleId);
};

casper.test.begin('Nested sort test case', 14, function suite1(test){
	casper.start(cases.testPagePrefix+cases.NestedSort, function pageLoadCheck(){
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

	
	//Nested sort test case on the third grid, the Genre column is descending sorted and Artist column is ascendingly sorted
	casper.then(function beforeNestedSort(){
		var originArr1 = [], tempArr1 = [], cutIndex1 = [], originArr2 = [], tempArr2 = [], cutIndex2 = [];
		var cellsInfo1 = this.getElementsInfo('#grid2 td[colid="Genre"][role="gridcell"]');
		var cellsInfo2 = this.getElementsInfo('#grid2 td[colid="Artist"][role="gridcell"]');

		this.then(function getOriginArr(){
			Array.prototype.forEach.call(cellsInfo1, function(element){
				originArr1.push(element.text.trim());
			});

			Array.prototype.forEach.call(cellsInfo2, function(element){
				originArr2.push(element.text.trim());
			});

			this.then(function temp(){
				tempArr1 = originArr1.concat();
				
			})
		});
		

		

		//use array.reduce() to extract the index of element which is not equal pre value and use array.slice() to split array
		this.then(function(){
			tempArr1.reduce(function(pre, cur, curi, array){
				if(cur!=pre){
					cutIndex1.push(curi);
				}
				return cur;
			});

			this.then(function addStarting(){
				utils.dump(tempArr1);
				//add 0 and length of tempArr as starting index
				cutIndex1.unshift(0);
			})
			
		});

		

		this.then(function checkResult(){

			utils.dump(cutIndex1);
			test.assertEquals(originArr1, tempArr1.sort().reverse(), '01--The genre column is sorted descending (the data of it equals to its sorted and reversed data)!');

			//every set of Artist column is sorted descendingly
			cutIndex1.forEach(function(ele, index, arr){
				
				var testSet = originArr2.slice(ele, arr[index+1]);
				utils.dump(testSet);
				test.assertEquals(testSet, testSet.concat().sort().reverse(), (index+2)+'--Every set of data should be descendingly sorted!');					
				
			});
		});

		
	});

	//nested sort the year column and check the sort order
	casper.then(function thirdNestedSort(){
		var originArr1 = [], tempArr1 = [], cutIndex1 = [], originArr2 = [], tempArr2 = [], cutIndex2 = [];
		var cellsInfo1 = this.getElementsInfo('#grid2 td[colid="Genre"][role="gridcell"]');
		var cellsInfo2 = this.getElementsInfo('#grid2 td[colid="Artist"][role="gridcell"]');

		this.then(function getOriginArr(){
			Array.prototype.forEach.call(cellsInfo1, function(element){
				originArr1.push(element.text.trim());
			});

			Array.prototype.forEach.call(cellsInfo2, function(element){
				originArr2.push(element.text.trim());
			});

			this.then(function temp(){
				tempArr1 = originArr1.concat();
				
			})
		});
		
		this.then(function clickYearHeader(){
			
			this.mouse.move('#grid2-Year');
		
			this.click('#grid2-Year div.gridxSortBtnNested');
		});

		this.then(function checkResult(){
			var newArr1 = [], newTempArr1 = [], newCutIndex1 = [], newArr2 = [];
			var newCellsInfo1 = this.getElementsInfo('#grid2 td[colid="Genre"][role="gridcell"]');
			var newCellsInfo2 = this.getElementsInfo('#grid2 td[colid="Artist"][role="gridcell"]');

			this.then(function getOriginArr(){
				Array.prototype.forEach.call(newCellsInfo1, function(element){
					newArr1.push(element.text.trim());
				});

				Array.prototype.forEach.call(newCellsInfo2, function(element){
					newArr2.push(element.text.trim());
				});

				
			});

			this.then(function checkOld(){
				this.capture(screenshotFolder+'afterHoveronColumnHeader.png');

				test.assertEquals(newArr1, originArr1, '05--The sort order of Genre column not chnage!');
				test.assertEquals(newArr2, originArr2, '06--The sort order of Artist column not change!');
			});
			
			this.then(function checkArtistYear(){
				newArr1 = [], newArr2 = [];
				//get the column data fo Artist and Year
				newCellsInfo1 = this.getElementsInfo('#grid2 td[colid="Artist"][role="gridcell"]');
				newCellsInfo2 = this.getElementsInfo('#grid2 td[colid="Year"][role="gridcell"]');

				this.then(function getOriginArr(){
					Array.prototype.forEach.call(newCellsInfo1, function(element){
						newArr1.push(element.text.trim());
					});

					Array.prototype.forEach.call(newCellsInfo2, function(element){
						newArr2.push(element.text.trim());
					});

				
				});

				this.then(function getCutIndexofArtist(){
					newArr1.reduce(function(pre, cur, curi, array){
						if(cur!=pre){
							newCutIndex1.push(curi);
						}
						return cur;
					});

					this.then(function addStarting(){
						utils.dump(newArr1);
						//add 0 and length of tempArr as starting index
						newCutIndex1.unshift(0);
					})
					
				});

				this.then(function checkYearCol(){

					this.echo('Check year column!', 'INFO');
					utils.dump(newCutIndex1);

					//get the every set of year column then sort and compare.
					newCutIndex1.forEach(function(ele, index, arr){
				
						var testSet = newArr2.slice(ele, arr[index+1]);
						utils.dump(testSet);
						test.assertEquals(testSet, testSet.concat().sort(), (index+7)+'--Every set of data should be ascendingly sorted!');					
						
					})
				})
			})
		});

		this.then(function tearDown(){
			this.reload(this.gridLoadCheck);
		})
	});

	//nest sort columns from blank
	casper.then(function nestedSortAgain(){
		
		this.evaluate(function resize(){

				
				grid2.resize({w:1200});

		});

		//resize the grid2 wider to workaround the click wrong place 
		this.then(function scrollRight(){
			
			//sorted Genre col firstly
			this.mouse.move('#grid2-Genre');
			this.click('#grid2-Genre div.gridxSortBtnSingle');
			
		});
		

		//then nested sort Year column
		this.then(function sortYear(){

			this.capture(screenshotFolder+'afterSingleSortGenre.png');
			this.mouse.move('#grid2-Year');
			this.click('#grid2-Year div.gridxSortBtnNested');

		});

		
		//then nested sort Date column
		this.then(function sortDate(){

			this.wait(1000, function(){
				this.capture(screenshotFolder+'afterNestedSortYear.png');
				this.mouse.move('#grid2-DownloadDate');
				this.click('#grid2-DownloadDate div.gridxSortBtnNested');
			})
			

		});

		this.then(function checkResult(){
			//deal with data of Genre Year and date
			var cellsData1 = this.getElementsInfo('#grid2 td[colid="Genre"][role="gridcell"]');
			var cellsData2 = this.getElementsInfo('#grid2 td[colid="Year"][role="gridcell"]');
			var cellsData3 = this.getElementsInfo('#grid2 td[colid="DownloadDate"][role="gridcell"]');

			var nodeToArr = function(nodelist){
				
				var tempArr = [];
				Array.prototype.forEach.call(nodelist, function(e){
					tempArr.push(e.text.trim());
				});
				return tempArr;
			};

			
			this.wait(1000, function capture(){

				var colArr1 = nodeToArr(cellsData1), colArr2 = nodeToArr(cellsData2), colArr3 = nodeToArr(cellsData3);

				utils.dump(colArr1);
				utils.dump(colArr2);
				utils.dump(colArr3);

				var sortData = this.evaluate(function(){
					return grid2.sort.getSortData();
				});

				utils.dump(sortData);
				this.capture(screenshotFolder+'afterNestedSortDate.png');

				test.assertEquals(sortData.length, 3 ,'12--The sort data has 3 entries!');
				test.assertTruthy((sortData[0].colId=='Genre') && (sortData[0].descending === false), '13--The first sorted column is Genre and descending!');
				test.assertTruthy((sortData[1].colId=='Year') && (sortData[1].descending === false), '14--The second sorted column is Year and descending!');
				test.assertTruthy((sortData[2].colId=='DownloadDate') && (sortData[2].descending === false), '15--The third sorted column is DownloadDate and descending!');
				test.assertTruthy((colArr1.length == colArr2.length && colArr2.length == colArr3.length), '16--The length of three column data should be same!');
			});



		})
	});

	casper.run(function(){
		test.done();
	});
});