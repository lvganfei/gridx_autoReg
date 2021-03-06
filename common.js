var caseToPage = {
	'testPagePrefix':'http://idx.ibm.com/dojo_1.10.5/gridx/tests/',
	'SimplestGrid':'test_grid.html',
	'ColumnResizer':'test_grid_columnResizer.html',
	'SingleSort':'test_grid_sort.html',
	'CellWidget':'test_grid_cellWidget.html',
	'Edit':'test_grid_edit.html',
	'ColumnLock':'test_grid_columnLock.html',
	'SelectRow':'test_grid_select.html',
	'SelectColumn':'test_grid_select.html',
	'SelectCell':'test_grid_select.html',
	'ExtendedSelectRow':'test_grid_extendedSelect.html',
	'ExtendedSelectColumn':'test_grid_extendedSelect.html',
	'ExtendedSelectCell':'test_grid_extendedSelect.html',
	'IndirectSelect':'test_grid_indirectSelect.html',
	'FilterBar':'test_grid_filter.html',
	'QuickFilter':'test_grid_filter.html',
	'PaginationBar':'test_grid_paginationBar.html',
	'PaginationBarDD':'test_grid_paginationBar.html',
	'DndColumn':'test_grid_dnd_rearrange.html',
	'DndRow':'test_grid_dnd_rearrange.html',
	'DND/Tree':'test_grid_tree.html',
	'Menu':'test_grid_menu.html',
	'NestedSort':'test_grid_sort.html',
	'Persist':'test_grid_persist.html',
	'SummaryBar':'test_grid_summary.html',
	'Tree':'test_grid_tree.html',
	'Exporter':'test_grid_exporter.html',
	'Printer':'test_grid_printer.html',
	'Toolbar':'test_grid_bar.html',
	'VirtualVScroller':'test_grid_virtualScroller.html',
	'Dnd(non-grid target)':'test_grid_dndcolumn_nongrid_target.html',
	'AlwaysEditing':'test_grid_alwaysEditing.html',
	'UnselectableRow':'test_grid_unselectableRow.html',
	'lazyLoad':'test_grid_tree_lazyload.html',
	'GroupHeader':'test_grid_groupHeader.html',
	'hiddenColumns':'test_grid_hiddenColumns.html',
	'rowHeader':'test_grid_rowHeader.html',
	'Resize':'test_grid_resize.html',
	'Dod':'test_grid_dod.html',
	'AddRow':'test_grid_addRow.html',
	'autoSizing':'test_grid_autoHeight_autoWidth.html'
};

var config = {
	verbose: false, 
	logLevel:'debug',
	viewportSize: {width:1280, height:800}
	/*onError: function(msg, arr){
		casper.echo('error message is; '+msg,'ERROR');
	},
	onLoadError:function(_casper, url, status){
		casper.echo('This url is cant be loaded: '+url+' and status is: '+status, 'ERROR');
	}*/
};


module.exports.cases = caseToPage;
module.exports.config = config;