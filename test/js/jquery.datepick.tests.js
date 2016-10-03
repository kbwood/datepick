/*
 * datepicker unit tests
 */
var DEBUG = false;
$(function() {

$('#tz').text(new Date().getTimezoneOffset() / -60);

module('Datepicker');

function xtest () {}

function equalDate(d1, d2, message) {
	if (!d1 || !d2) {
		ok(false, message + ' - missing date');
		return;
	}
	equal(d1.toString(), d2.toString(), message);
}

function equalDateArray(a1, a2, message) {
	if (!a1 || !a2) {
		ok(false, message + ' - missing dates');
		return;
	}
	equal(a1.toString(), a2.toString(), message);
}

function normaliseDate(date) {
	date.setHours(12);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date;
}

function init(id, options) {
	$.datepick.setDefaults($.datepick.regionalOptions['']);
	return $(id).datepick('destroy').datepick($.extend({showAnim: ''}, options || {}));
}

var PROP_NAME = 'datepick';

test('Set defaults', function() {
	expect(6);
	equal($.datepick.defaultOptions.showAnim, 'show', 'Initial showAnim');
	equal($.datepick.defaultOptions.showSpeed, 'normal', 'Initial showSpeed');
	$.datepick.setDefaults({showAnim: 'fadeIn'});
	equal($.datepick.defaultOptions.showAnim, 'fadeIn', 'Change showAnim');
	equal($.datepick.defaultOptions.showSpeed, 'normal', 'No change showSpeed');
	$.datepick.setDefaults({showAnim: 'show'});
	equal($.datepick.defaultOptions.showAnim, 'show', 'Restore showAnim');
	equal($.datepick.defaultOptions.showSpeed, 'normal', 'Restore showSpeed');
});

test('Date functions', function() {
	expect(113);
	// daysInMonth
	var dim = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	for (var m = 1; m <= 12; m++) {
		equal($.datepick.daysInMonth(2007, m), dim[m - 1], 'Days in month ' + m + '/2007');
		var date = $.datepick.newDate(2007, m, m + 10); 
		equal($.datepick.daysInMonth(date), dim[m - 1], 'Days in month ' + date);
	}
	dim[1] = 29;
	for (var m = 1; m <= 12; m++) {
		equal($.datepick.daysInMonth(2008, m), dim[m - 1], 'Days in month ' + m + '/2008');
		var date = $.datepick.newDate(2008, m, m + 10); 
		equal($.datepick.daysInMonth(date), dim[m - 1], 'Days in month ' + date);
	}
	// dayOfYear
	var doy = [[$.datepick.newDate(2007, 1, 1), 1], [$.datepick.newDate(2007, 3, 1), 60],
		[$.datepick.newDate(2007, 12, 31), 365], [$.datepick.newDate(2008, 1, 1), 1],
		[$.datepick.newDate(2008, 3, 1), 61], [$.datepick.newDate(2008, 12, 31), 366]];
	for (var i = 0; i < doy.length; i++) {
		var date = doy[i][0];
		equal($.datepick.dayOfYear(date), doy[i][1], 'Day of year ' + date);
		equal($.datepick.dayOfYear(date.getFullYear(), date.getMonth() + 1, date.getDate()), doy[i][1],
			'Day of year ' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
	}
	// iso8601Week
	var woy = [[$.datepick.newDate(2000, 12, 31), 52], [$.datepick.newDate(2001, 1, 1), 1],
		[$.datepick.newDate(2001, 1, 7), 1], [$.datepick.newDate(2001, 1, 8), 2],
		[$.datepick.newDate(2003, 12, 28), 52], [$.datepick.newDate(2003, 12, 29), 1],
		[$.datepick.newDate(2004, 1, 4), 1], [$.datepick.newDate(2004, 1, 5), 2],
		[$.datepick.newDate(2009, 12, 28), 53], [$.datepick.newDate(2010, 1, 3), 53],
		[$.datepick.newDate(2010, 1, 4), 1], [$.datepick.newDate(2010, 1, 10), 1]];
	for (var i = 0; i < woy.length; i++) {
		var date = woy[i][0];
		equal($.datepick.iso8601Week(date), woy[i][1], 'Week of year ' + date);
		equal($.datepick.iso8601Week(date.getFullYear(), date.getMonth() + 1, date.getDate()),
			woy[i][1], 'Week of year ' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
	}
	// today
	var date = $.datepick.today();
	equalDate(date, normaliseDate(new Date()), 'Today');
	equal(date.getHours(), 12, 'Today - hours');
	equal(date.getMinutes(), 0, 'Today - minutes');
	equal(date.getSeconds(), 0, 'Today - seconds');
	equal(date.getMilliseconds(), 0, 'Today - milliseconds');
	// newDate
	var date1 = new Date(2010, 1-1, 26, 12, 34, 56);
	date = $.datepick.newDate(date1);
	equalDate(date, normaliseDate(date1), 'New date 2010-01-26 12:34:56');
	equal(date.getHours(), 12, 'New date - hours');
	equal(date.getMinutes(), 0, 'New date - minutes');
	equal(date.getSeconds(), 0, 'New date - seconds');
	equal(date.getMilliseconds(), 0, 'New date - milliseconds');
	date1 = new Date(2010, 12-1, 1, 12);
	date = $.datepick.newDate(2010, 12, 1);
	equalDate(date, date1, 'New date 2010-12-01');
	equal(date.getHours(), 12, 'New date - hours');
	equal(date.getMinutes(), 0, 'New date - minutes');
	equal(date.getSeconds(), 0, 'New date - seconds');
	equal(date.getMilliseconds(), 0, 'New date - milliseconds');
	// day
	$.datepick.day(date, 25);
	equalDate(date, $.datepick.newDate(2010, 12, 25), 'Day 25');
	equalDate($.datepick.day(date, 0), $.datepick.newDate(2010, 11, 30), 'Day 0');
	// add
	date = $.datepick.newDate(2009, 1, 2);
	equalDate($.datepick.add(date, 1, 'y'), $.datepick.newDate(2010, 1, 2), 'Add 1 y');
	equalDate($.datepick.add(date, -2, 'y'), $.datepick.newDate(2008, 1, 2), 'Add -2 y');
	equalDate($.datepick.add(date, 1, 'm'), $.datepick.newDate(2008, 2, 2), 'Add 1 m');
	equalDate($.datepick.add(date, -2, 'm'), $.datepick.newDate(2007, 12, 2), 'Add -2 m');
	equalDate($.datepick.add(date, 1, 'w'), $.datepick.newDate(2007, 12, 9), 'Add 1 w');
	equalDate($.datepick.add(date, -2, 'w'), $.datepick.newDate(2007, 11, 25), 'Add -2 w');
	equalDate($.datepick.add(date, 1, 'd'), $.datepick.newDate(2007, 11, 26), 'Add 1 d');
	equalDate($.datepick.add(date, -2, 'd'), $.datepick.newDate(2007, 11, 24), 'Add -2 d');
	equalDate($.datepick.add($.datepick.add($.datepick.add($.datepick.add(date, 1, 'd'), 1, 'w'), 1, 'm'), 1, 'y'),
		$.datepick.newDate(2009, 1, 2), 'Add 1 d, 1 w, 1 m, 1 y');
	equalDate($.datepick.add($.datepick.newDate(2008, 2, 20), 2, 'w'),
		$.datepick.newDate(2008, 3, 5), 'Add 2 w over leap day');
	equalDate($.datepick.add($.datepick.newDate(2008, 1, 31), 1, 'm'),
		$.datepick.newDate(2008, 2, 29), 'Add 1 m for leap day');
	equalDate($.datepick.add($.datepick.newDate(2008, 2, 29), 1, 'y'),
		$.datepick.newDate(2009, 2, 28), 'Add 1 y to leap day');
});

test('Format date', function() {
	expect(11);
	$.datepick.setDefaults($.datepick.regionalOptions['']);
	var date = $.datepick.newDate(2001, 2, 3);
	equal($.datepick.formatDate(date), '02/03/2001', 'Format date - default');
	equal($.datepick.formatDate('dd/mm/yyyy', date), '03/02/2001', 'Format date - dd/mm/yyyy');
	equal($.datepick.formatDate('d/m/yy', date), '3/2/01', 'Format date - d/m/yy');
	equal($.datepick.formatDate('yyyy-mm-dd', date), '2001-02-03', 'Format date - yyyy-mm-dd');
	equal($.datepick.formatDate('yy-o', date), '01-34', 'Format date - yy-o');
	equal($.datepick.formatDate('yyyy-oo', date), '2001-034', 'Format date - yyyy-oo');
	equal($.datepick.formatDate('D, M d, yyyy', date), 'Sat, Feb 3, 2001',
		'Format date - D, M d, yyyy');
	equal($.datepick.formatDate('DD, MM d, yyyy', date), 'Saturday, February 3, 2001',
		'Format date - DD, MM d, yyyy');
	equal($.datepick.formatDate('\'day\' d \'of\' MM \'in the year\' yyyy', date),
		'day 3 of February in the year 2001',
		'Format date - \'day\' d \'of\' MM \'in the year\' yyyy');
	var offset = 12 * 60 + date.getTimezoneOffset();
	equal($.datepick.formatDate('@', date), 981158400 + offset * 60, 'Format date - @');
	equal($.datepick.formatDate('!', date), 631167552000000000 + offset * 60 * 1000 * 10000,
		'Format date - !');
});

test('Parse date', function() {
	expect(14);
	$.datepick.setDefaults($.datepick.regionalOptions['']);
	var date = $.datepick.newDate(2001, 2, 3);
	equal($.datepick.parseDate('', ''), null, 'Parse date - empty');
	equalDate($.datepick.parseDate('', '02/03/2001'), date, 'Parse date - default');
	equalDate($.datepick.parseDate('dd/mm/yyyy', '3/2/2001'), date, 'Parse date - dd/mm/yyyy');
	equalDate($.datepick.parseDate('dd/mm/yyyy', '03/02/2001'), date, 'Parse date - dd/mm/yyyy');
	equalDate($.datepick.parseDate('d/m/yy', '3/2/01'), date, 'Parse date - d/m/yy');
	equalDate($.datepick.parseDate('yyyy-mm-dd', '2001-02-03'), date, 'Parse date - yyyy-mm-dd');
	equalDate($.datepick.parseDate('yy-o', '01-34'), date, 'Parse date - yy-o');
	equalDate($.datepick.parseDate('yyyy-oo', '2001-034'), date, 'Parse date - yyyy-oo');
	equalDate($.datepick.parseDate('D, M d, yyyy', 'Sat, Feb 3, 2001'), date,
		'Parse date - D, M d, yyyy');
	equalDate($.datepick.parseDate('DD, MM d, yyyy', 'Saturday, February 3, 2001'), date,
		'Parse date - DD, MM d, yyyy');
	equalDate($.datepick.parseDate('\'day\' d \'of\' MM \'in the year\' yyyy',
		'day 3 of February in the year 2001'), date,
		'Parse date - \'day\' d \'of\' MM \'in the year\' yyyy');
	equalDate($.datepick.parseDate('@', '981158400'), date, 'Parse date - @');
	equalDate($.datepick.parseDate('!', '631167552000000000'), date, 'Parse date - !');
	equalDate($.datepick.parseDate('D M dd yyyy*', new Date(2001, 2 - 1, 3).toString()), date,
		'Parse date - JS Date');
});

test('Parse date errors', function() {
	expect(18);
	$.datepick.setDefaults($.datepick.regionalOptions['']);
	var expectError = function(expr, value, error) {
		try {
			expr();
			ok(false, 'Parsed error ' + value);
		}
		catch (e) {
			equal(e, error, 'Parsed error ' + value);
		}
	};
	expectError(function() { $.datepick.parseDate('d m yy', null); },
		'null', 'Invalid arguments');
	expectError(function() { $.datepick.parseDate(null, 'Sat 2 01'); },
		'Sat 2 01', 'Missing number at position 0');
	expectError(function() { $.datepick.parseDate('dd/mm/yyyy', '01/02/20087'); },
		'01/02/20087', 'Additional text found at end');
	expectError(function() { $.datepick.parseDate('d m yy', 'Sat 2 01'); },
		'Sat 2 01 - d m yy', 'Missing number at position 0');
	expectError(function() { $.datepick.parseDate('dd mm yyyy', 'Sat 2 01'); },
		'Sat 2 01 - dd mm yyyy', 'Missing number at position 0');
	expectError(function() { $.datepick.parseDate('d m yy', '3 Feb 01'); },
		'3 Feb 01 - d m yy', 'Missing number at position 2');
	expectError(function() { $.datepick.parseDate('dd mm yyyy', '3 Feb 01'); },
		'3 Feb 01 - dd mm yyyy', 'Missing number at position 2');
	expectError(function() { $.datepick.parseDate('d m yy', '3 2 AD01'); },
		'3 2 AD01 - d m yy', 'Missing number at position 4');
	expectError(function() { $.datepick.parseDate('d m yyyy', '3 2 AD01'); },
		'3 2 AD01 - dd mm yyyy', 'Missing number at position 4');
	expectError(function() { $.datepick.parseDate('yy-o', '2001-D01'); },
		'2001-D01 - yy-o', 'Unexpected literal at position 2');
	expectError(function() { $.datepick.parseDate('yyyy-oo', '2001-D01'); },
		'2001-D01 - yyyy-oo', 'Missing number at position 5');
	expectError(function() { $.datepick.parseDate('D d M yy', 'D7 3 Feb 01'); },
		'D7 3 Feb 01 - D d M yy', 'Unknown name at position 0');
	expectError(function() { $.datepick.parseDate('D d M yy', 'Sat 3 M2 01'); },
		'Sat 3 M2 01 - D d M yy', 'Unknown name at position 6');
	expectError(function() { $.datepick.parseDate('DD, MM d, yyyy', 'Saturday- Feb 3, 2001'); },
		'Saturday- Feb 3, 2001 - DD, MM d, yyyy', 'Unexpected literal at position 8');
	expectError(function() { $.datepick.parseDate('\'day\' d \'of\' MM (\'\'DD\'\'), yyyy',
		'day 3 of February ("Saturday"), 2001'); },
		'day 3 of Mon2 ("Day7"), 2001', 'Unexpected literal at position 19');
	expectError(function() { $.datepick.parseDate('d m yy', '29 2 01'); },
		'29 2 01 - d m yy', 'Invalid date');
	var settings = {dayNamesShort: $.datepick.regionalOptions['fr'].dayNamesShort,
		dayNames: $.datepick.regionalOptions['fr'].dayNames,
		monthNamesShort: $.datepick.regionalOptions['fr'].monthNamesShort,
		monthNames: $.datepick.regionalOptions['fr'].monthNames};
	expectError(function() { $.datepick.parseDate('D d M yy', 'Mon 9 Avr 01', settings); },
		'Mon 9 Avr 01 - D d M yy', 'Unknown name at position 0');
	expectError(function() { $.datepick.parseDate('D d M yy', 'Lun 9 Apr 01', settings); },
		'Lun 9 Apr 01 - D d M yy', 'Unknown name at position 6');
});

test('Destroy', function() {
	expect(20);
	var inp = init('#inp');
	ok(inp.hasClass('is-datepick'), 'Default - marker class set');
	ok(inp.data(PROP_NAME), 'Default - instance present');
	ok(inp.next().is('#alt'), 'Default - button absent');
	inp.datepick('destroy');
	inp = $('#inp');
	ok(!inp.hasClass('is-datepick'), 'Default - marker class cleared');
	ok(!inp.data(PROP_NAME), 'Default - instance absent');
	ok(inp.next().is('#alt'), 'Default - button absent');
	// With button
	inp = init('#inp', {showTrigger: '<button>...</button>'});
	ok(inp.hasClass('is-datepick'), 'Button - marker class set');
	ok(inp.data(PROP_NAME), 'Button - instance present');
	ok(inp.next().text() == '...', 'Button - button added');
	inp.datepick('destroy');
	inp = $('#inp');
	ok(!inp.hasClass('is-datepick'), 'Button - marker class cleared');
	ok(!inp.data(PROP_NAME), 'Button - instance absent');
	ok(inp.next().is('#alt'), 'Button - button removed');
	// Inline
	var inl = init('#inl');
	ok(inl.hasClass('is-datepick'), 'Inline - marker class set');
	ok(inl.html() != '', 'Inline - content present');
	ok($.data(inl[0], PROP_NAME), 'Inline - instance present');
	ok(inl.next().length == 0 || inl.next().is('p'), 'Inline - button absent');
	inl.datepick('destroy');
	inl = $('#inl');
	ok(!inl.hasClass('is-datepick'), 'Inline - marker class cleared');
	ok(inl.html() == '', 'Inline - content absent');
	ok(!$.data(inl[0], PROP_NAME), 'Inline - instance absent');
	ok(inl.next().length == 0 || inl.next().is('p'), 'Inline - button absent');
});

test('Option', function() {
	expect(12);
	var inp = init('#inp');
	var inst = inp.data(PROP_NAME);
	// Set
	equal(inst.options.showSpeed, 'normal', 'Initial setting showSpeed');
	equal(inp.datepick('option', 'showSpeed'), 'normal', 'Initial instance showSpeed');
	equal($.datepick.defaultOptions.showSpeed, 'normal', 'Initial default showSpeed');
	inp.datepick('option', 'showSpeed', 'fast');
	equal(inst.options.showSpeed, 'fast', 'Change setting showSpeed');
	equal(inp.datepick('option', 'showSpeed'), 'fast', 'Change instance showSpeed');
	equal($.datepick.defaultOptions.showSpeed, 'normal', 'Retain default showSpeed');
	inp.datepick('option', {showSpeed: 'slow'});
	equal(inst.options.showSpeed, 'slow', 'Change setting showSpeed');
	equal(inp.datepick('option', 'showSpeed'), 'slow', 'Change instance showSpeed');
	equal($.datepick.defaultOptions.showSpeed, 'normal', 'Retain default showSpeed');
	inp.datepick('option', {showSpeed: 'slow', showOtherMonths: true});
	equal(inst.options.showSpeed, 'slow', 'Change setting showSpeed');
	equal(inst.options.showOtherMonths, true, 'Change setting showOtherMonths');
	deepEqual(inp.datepick('option'), {pickerClass: '', showOnFocus: true, showTrigger: null,
		showAnim: '', showOptions: {}, showSpeed: 'slow', popupContainer: null,
		alignment: 'bottom', fixedWeeks: false, firstDay: 0, calculateWeek: $.datepick.iso8601Week,
		monthsToShow: 1, monthsOffset: 0, monthsToStep: 1, monthsToJump: 12, useMouseWheel: true,
		changeMonth: true, yearRange: 'c-10:c+10', shortYearCutoff: '+10', showOtherMonths: true,
		selectOtherMonths: false, defaultDate: null, selectDefaultDate: false, minDate: null,
		maxDate: null, dateFormat: 'mm/dd/yyyy', autoSize: false, rangeSelect: false,
		rangeSeparator: ' - ', multiSelect: 0, multiSeparator: ',', onDate: null, onShow: null,
		onChangeMonthYear: null, onSelect: null, onClose: null, altField: null, altFormat: null,
		constrainInput: true, commandsAsDateFormat: false, commands: $.datepick.commands,
		monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'],
		monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
		dateFormat: 'mm/dd/yyyy', firstDay: 0, renderer: $.datepick.defaultRenderer,
		prevText: '&lt;Prev', prevStatus: 'Show the previous month',
		prevJumpText: '&lt;&lt;', prevJumpStatus: 'Show the previous year',
		nextText: 'Next&gt;', nextStatus: 'Show the next month',
		nextJumpText: '&gt;&gt;', nextJumpStatus: 'Show the next year',
		currentText: 'Current', currentStatus: 'Show the current month',
		todayText: 'Today', todayStatus: 'Show today\'s month',
		clearText: 'Clear', clearStatus: 'Clear all the dates',
		closeText: 'Close', closeStatus: 'Close the datepicker',
		yearStatus: 'Change the year', earlierText: '&#160;&#160;▲',
		laterText: '&#160;&#160;▼', monthStatus: 'Change the month',
		weekText: 'Wk', weekStatus: 'Week of the year',
		dayStatus: 'Select DD, M d, yyyy', defaultStatus: 'Select a date', isRTL: false,
		validateDate: 'Please enter a valid date', validateDateMin: 'Please enter a date on or after {0}',
		validateDateMax: 'Please enter a date on or before {0}',
		validateDateMinMax: 'Please enter a date between {0} and {1}',
		validateDateCompare: 'Please enter a date {0} {1}', validateDateToday: 'today',
		validateDateOther: 'the other date', validateDateEQ: 'equal to', validateDateNE: 'not equal to',
		validateDateLT: 'before', validateDateGT: 'after', validateDateLE: 'not after',
		validateDateGE: 'not before'}, 'All options');
});

test('Inline config', function() {
	expect(4);
	$('#inp').attr('data-datepick', 'pickerClass: \'abc\', showOtherMonths: true, monthsToStep: 2, ' +
		'minDate: \'new Date(2009, 1-1, 1)\'');
	var inp = init('#inp');
	var inst = inp.data('datepick');
	equal(inst.options.pickerClass, 'abc', 'Inline config - pickerClass');
	equalDate(inst.options.minDate, new Date(2009, 1-1, 1), 'Inline config - minDate');
	equal(inst.options.showOtherMonths, true, 'Inline config - showOtherMonths');
	equal(inst.options.monthsToStep, 2, 'Inline config - monthsToStep');
});

test('Invocation', function() {
	expect(31);
	var inp = init('#inp');
	var body = $('body');
	// On focus
	var button = inp.siblings('button');
	ok(button.length == 0, 'Focus - button absent');
	var image = inp.siblings('img');
	ok(image.length == 0, 'Focus - image absent');
	inp.focus();
	var dp = $('div.datepick');
	ok(dp.is(':visible'), 'Focus - rendered on focus');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ESC});
	ok(!dp.is(':visible'), 'Focus - hidden on exit');
	inp.focus();
	dp = $('div.datepick');
	ok(dp.is(':visible'), 'Focus - rendered on focus');
	body.simulate('mousedown', {});
	ok(!dp.is(':visible'), 'Focus - hidden on external click');
	inp.datepick('hide').datepick('destroy');
	// On button
	inp = init('#inp', {showOnFocus: false, showTrigger: '<button type="button">...</button>'});
	dp = $('div.datepick');
	ok(dp.length == 0, 'Button - initially hidden');
	button = inp.siblings('button');
	image = inp.siblings('img');
	ok(button.length == 1, 'Button - button present');
	ok(image.length == 0, 'Button - image absent');
	equal(button.text(), '...', 'Button - button text');
	inp.focus();
	dp = $('div.datepick');
	ok(dp.length == 0, 'Button - not rendered on focus');
	button.click();
	dp = $('div.datepick');
	ok(dp.is(':visible'), 'Button - rendered on button click');
	button.click();
	ok(!dp.is(':visible'), 'Button - hidden on second button click');
	inp.datepick('hide').datepick('destroy');
	// On image button
	inp = init('#inp', {showOnFocus: false, showTrigger: '<img src="cal.gif" alt="Cal"></img>'});
	dp = $('div.datepick');
	ok(dp.length == 0, 'Image button - initially hidden');
	button = inp.siblings('button');
	ok(button.length == 0, 'Image button - button absent');
	image = inp.siblings('img');
	ok(image.length == 1, 'Image button - image present');
	ok(image.attr('src').match(/.*cal.gif/), 'Image button - image source');
	equal(image.attr('alt'), 'Cal', 'Image button - image text');
	inp.focus();
	dp = $('div.datepick');
	ok(dp.length == 0, 'Image button - not rendered on focus');
	image.click();
	dp = $('div.datepick');
	ok(dp.is(':visible'), 'Image button - rendered on image click');
	image.click();
	ok(!dp.is(':visible'), 'Image button - hidden on second image click');
	inp.datepick('hide').datepick('destroy');
	// On both
	inp = init('#inp', {showTrigger:
		'<button type="button"><img src="cal.gif" alt="Cal"></img></button>'});
	dp = $('div.datepick');
	ok(dp.length == 0, 'Both - initially hidden');
	button = inp.siblings('button');
	ok(button.length == 1, 'Both - button present');
	image = inp.siblings('img');
	ok(image.length == 0, 'Both - image absent');
	image = button.children('img');
	ok(image.length == 1, 'Both - button image present');
	inp.focus();
	dp = $('div.datepick');
	ok(dp.is(':visible'), 'Both - rendered on focus');
	body.simulate('mousedown', {});
	ok(!dp.is(':visible'), 'Both - hidden on external click');
	button.click();
	dp = $('div.datepick');
	ok(dp.is(':visible'), 'Both - rendered on button click');
	button.click();
	ok(!dp.is(':visible'), 'Both - hidden on second button click');
	inp.datepick('hide').datepick('destroy');
	// External action
	inp = init('#inp');
	dp = $('div.datepick');
	ok(dp.length == 0, 'External - initially hidden');
	inp.datepick('show');
	dp = $('div.datepick');
	ok(dp.is(':visible'), 'External - rendered on show');
	inp.datepick('hide').datepick('destroy');
});

test('Base structure', function() {
	expect(62);
	var inp = init('#inp');
	inp.focus();
	var dp = $('div.datepick');
	ok(dp.parent().hasClass('datepick-popup'), 'Structure - parent wrapper');
	ok(dp.is(':visible'), 'Structure - content visible');
	ok(!dp.hasClass('datepick-rtl'), 'Structure - not right-to-left');
	ok(!dp.hasClass('datepick-multi'), 'Structure - not multi-month');
	equal(dp.children().length, 4, 'Structure - child count');
	var nav = dp.children(':eq(0)');
	ok(nav.is('div.datepick-nav'), 'Structure - nav division');
	equal(nav.children().length, 3, 'Structure - nav child count');
	ok(nav.children(':first').is('a.datepick-cmd-prev') &&
		nav.children(':first').html() != '', 'Structure - prev link');
	ok(nav.children(':eq(1)').is('a.datepick-cmd-today') &&
		nav.children(':eq(1)').html() != '', 'Structure - today link');
	ok(nav.children(':last').is('a.datepick-cmd-next') &&
		nav.children(':last').html() != '', 'Structure - next link');
	var row = dp.children(':eq(1)');
	ok(row.is('div.datepick-month-row'), 'Structure - month row division');
	equal(row.children().length, 1, 'Structure - month row child count');
	var month = row.children(':eq(0)');
	ok(month.is('div.datepick-month'), 'Structure - month division');
	var header = month.children(':first');
	ok(header.is('div.datepick-month-header'), 'Structure - month header division');
	equal(header.children().length, 2, 'Structure - month header child count');
	ok(header.children(':first').is('select.datepick-month-year'),
		'Structure - new month select');
	ok(header.children(':last').is('select.datepick-month-year'),
		'Structure - new year select');
	var table = month.children(':eq(1)');
	ok(table.is('table'), 'Structure - month table');
	ok(table.children(':first').is('thead'), 'Structure - month table thead');
	var titles = table.children(':first').children(':first');
	ok(titles.is('tr'), 'Structure - month table title row');
	equal(titles.find('span').length, 7, 'Structure - month table day headers');
	ok(table.children(':eq(1)').is('tbody'), 'Structure - month table body');
	ok(table.children(':eq(1)').children('tr').length >= 4,
		'Structure - month table week count');
	var week = table.children(':eq(1)').children(':first');
	ok(week.is('tr'), 'Structure - month table week row');
	equal(week.children().length, 7, 'Structure - week child count');
	ok(week.children(':first').children().hasClass('datepick-weekend'),
		'Structure - month table first day cell');
	ok(!week.children(':eq(1)').children().hasClass('datepick-weekend'),
		'Structure - month table second day cell');
	var control = dp.children(':eq(2)');
	ok(control.is('div.datepick-ctrl'), 'Structure - controls division');
	equal(control.children().length, 2, 'Structure - control child count');
	ok(control.children(':first').is('a.datepick-cmd-clear'),
		'Structure - clear link');
	ok(control.children(':last').is('a.datepick-cmd-close'),
		'Structure - close link');
	inp.datepick('hide').datepick('destroy');
	// Multi-month 2
	inp = init('#inp', {monthsToShow: 2});
	inp.focus();
	dp = $('div.datepick');
	ok(dp.hasClass('datepick-multi'), 'Structure multi - multi-month');
	equal(dp.children().length, 4, 'Structure multi - child count');
	row = dp.children(':eq(1)');
	ok(row.is('div.datepick-month-row'), 'Structure multi - month row division');
	equal(row.children().length, 2, 'Structure multi - month row child count');
	month = row.children(':eq(0)');
	ok(month.is('div.datepick-month'), 'Structure multi - first month division');
	month = row.children(':eq(1)');
	ok(month.is('div.datepick-month'), 'Structure multi - second month division');
	inp.datepick('hide').datepick('destroy');
	// Multi-month [2, 2]
	inp = init('#inp', {monthsToShow: [2, 2]});
	inp.focus();
	dp = $('div.datepick');
	ok(dp.hasClass('datepick-multi'), 'Structure multi - multi-month');
	equal(dp.children().length, 5, 'Structure multi - child count');
	row = dp.children(':eq(1)');
	ok(row.is('div.datepick-month-row'), 'Structure multi - first month row division');
	equal(row.children('div.datepick-month').length, 2, 'Structure multi - month row child count');
	row = dp.children(':eq(2)');
	ok(row.is('div.datepick-month-row'), 'Structure multi - second month row division');
	equal(row.children('div.datepick-month').length, 2, 'Structure multi - month row child count');
	inp.datepick('hide').datepick('destroy');
	// Inline
	var inl = init('#inl');
	dp = inl.children();
	ok(!dp.hasClass('datepick-rtl'), 'Structure inline - not right-to-left');
	ok(!dp.hasClass('datepick-multi'), 'Structure inline - not multi-month');
	equal(dp.children().length, 3, 'Structure inline - child count');
	var nav = dp.children(':first');
	ok(nav.is('div.datepick-nav'), 'Structure inline - nav division');
	equal(nav.children().length, 3, 'Structure inline - nav child count');
	var row = dp.children(':eq(1)');
	ok(row.is('div.datepick-month-row'), 'Structure inline - month row division');
	var month = row.children(':eq(0)');
	ok(month.is('div.datepick-month'), 'Structure inline - month division');
	var header = month.children(':first');
	ok(header.is('div.datepick-month-header'), 'Structure inline - month header division');
	equal(header.children().length, 2, 'Structure inline - month header child count');
	var table = month.children(':eq(1)');
	ok(table.is('table'), 'Structure inline - month table');
	ok(table.children(':first').is('thead'), 'Structure inline - month table thead');
	ok(table.children(':eq(1)').is('tbody'), 'Structure inline - month table body');
	inl.datepick('destroy');
	// Inline multi-month
	inl = init('#inl', {monthsToShow: 2});
	dp = inl.children();
	ok(dp.hasClass('datepick-multi'), 'Structure inline multi - not multi-month');
	equal(dp.children().length, 3, 'Structure inline multi - child count');
	var nav = dp.children(':first');
	ok(nav.is('div.datepick-nav'), 'Structure inline multi - nav division');
	equal(nav.children().length, 3, 'Structure inline multi - nav child count');
	var row = dp.children(':eq(1)');
	ok(row.is('div.datepick-month-row'), 'Structure inline - month row division');
	var month = row.children(':eq(0)');
	ok(month.is('div.datepick-month'), 'Structure inline multi - first month division');
	month = row.children(':eq(1)');
	ok(month.is('div.datepick-month'), 'Structure inline multi - second month division');
	inl.datepick('destroy');
});

test('Custom structure', function() {
	expect(24);
	// Check right-to-left localisation
	var inp = init('#inp', {isRTL: true});
	inp.focus();
	var dp = $('div.datepick');
	ok(dp.hasClass('datepick-rtl'), 'Structure RTL - right-to-left');
	var nav = dp.children(':eq(0)');
	ok(nav.is('div.datepick-nav'), 'Structure - nav division');
	equal(nav.children().length, 3, 'Structure - nav child count');
	ok(nav.children(':first').is('a.datepick-cmd-prev'),
		'Structure - prev link');
	ok(nav.children(':first').css('float') == 'right',
		'Structure - prev link position');
	ok(nav.children(':eq(1)').is('a.datepick-cmd-today'),
		'Structure - today link');
	ok(nav.children(':last').is('a.datepick-cmd-next'),
		'Structure - next link');
	ok(nav.children(':last').css('float') == 'left',
		'Structure - next link position');
	inp.datepick('hide').datepick('destroy');
	// Custom class
	inp = init('#inp', {pickerClass: 'myPicker'});
	inp.focus();
	dp = $('div.datepick');
	ok(dp.hasClass('myPicker'), 'Structure - custom class');
	inp.datepick('hide').datepick('destroy');
	// Popup container
	inp = init('#inp', {popupContainer: 'form'});
	inp.focus();
	dp = $('div.datepick');
	ok(dp.parent().parent().is('form'), 'Structure - parent form');
	inp.datepick('hide').datepick('destroy');
	inp = init('#inp');
	inp.focus();
	dp = $('div.datepick');
	ok(dp.parent().parent().is('body'), 'Structure - parent body');
	inp.datepick('hide').datepick('destroy');
	inp = init('#inp', {popupContainer: $('form')});
	inp.focus();
	dp = $('div.datepick');
	ok(dp.parent().parent().is('form'), 'Structure - parent form');
	inp.datepick('hide').datepick('destroy');
	// Fixed weeks
	var date = $.datepick.newDate(2009, 2, 1);
	inp = init('#inp', {defaultDate: date});
	inp.focus();
	dp = $('div.datepick');
	equal(dp.find('tbody tr').length, 4, 'Structure - not fixed weeks');
	inp.datepick('hide').datepick('destroy');
	inp = init('#inp', {defaultDate: date, fixedWeeks: true});
	inp.focus();
	dp = $('div.datepick');
	equal(dp.find('tbody tr').length, 6, 'Structure - fixed weeks');
	inp.datepick('hide').datepick('destroy');
	// Can't change month
	inp = init('#inp', {changeMonth: false});
	inp.focus();
	dp = $('div.datepick');
	var header = dp.find('div.datepick-month-header');
	equal(header.children().length, 0, 'Structure change month - header child count');
	inp.datepick('hide').datepick('destroy');
	// Commands as buttons
	inp = init('#inp', {renderer: $.extend({}, $.datepick.defaultRenderer,
		{picker: $.datepick.defaultRenderer.picker.replace(/link/g, 'button')})});
	inp.focus();
	dp = $('div.datepick');
	nav = dp.children(':eq(0)');
	ok(nav.children(':first').is('button.datepick-cmd-prev'),
		'Structure - prev button');
	ok(nav.children(':eq(1)').is('button.datepick-cmd-today'),
		'Structure - today button');
	ok(nav.children(':last').is('button.datepick-cmd-next'),
		'Structure - next button');
	inp.datepick('hide').datepick('destroy');
	// Week of year
	inp = init('#inp', {renderer: $.datepick.weekOfYearRenderer});
	inp.focus();
	dp = $('div.datepick');
	var week = dp.find('tr:first');
	ok(week.children().length == 8, 'Structure week of year - column count');
	ok(week.children(':first').is('th.datepick-week'), 'Structure week of year - first column');
	ok(week.children(':eq(1)').is('th') && !week.children(':eq(1)').hasClass('datepick-week'),
		'Structure week of year - second column');
	week = dp.find('tr:eq(1)');
	ok(week.children().length == 8, 'Structure week of year - column count');
	ok(week.children(':first').is('td.datepick-week'), 'Structure week of year - first column');
	ok(week.children(':eq(1)').is('td') && !week.children(':eq(1)').hasClass('datepick-week'),
		'Structure week of year - second column');
	inp.datepick('hide').datepick('destroy');
});

test('ThemeRoller structure', function() {
	expect(48);
	var inp = init('#inp', {renderer: $.datepick.themeRollerRenderer});
	inp.focus();
	var dp = $('#ui-datepicker-div');
	ok(dp.is(':visible'), 'ThemeRoller - content visible');
	ok(!dp.hasClass('ui-datepicker-rtl'), 'ThemeRoller - not right-to-left');
	ok(!dp.hasClass('ui-datepicker-multi'), 'ThemeRoller - not multi-month');
	equal(dp.children().length, 4, 'ThemeRoller - child count');
	var nav = dp.children(':eq(0)');
	ok(nav.is('div.ui-datepicker-header'), 'ThemeRoller - nav division');
	equal(nav.children().length, 3, 'ThemeRoller - nav child count');
	ok(nav.children(':first').is('a.ui-datepicker-cmd-prev') &&
		nav.children(':first').html() != '', 'ThemeRoller - prev link');
	ok(nav.children(':eq(1)').is('a.ui-datepicker-cmd-today') &&
		nav.children(':eq(1)').html() != '', 'ThemeRoller - today link');
	ok(nav.children(':last').is('a.ui-datepicker-cmd-next') &&
		nav.children(':last').html() != '', 'ThemeRoller - next link');
	var row = dp.children(':eq(1)');
	ok(row.is('div.ui-datepicker-row-break'), 'ThemeRoller - month row division');
	equal(row.children().length, 1, 'ThemeRoller - month row child count');
	var month = row.children(':eq(0)');
	ok(month.is('div.ui-datepicker-group'), 'ThemeRoller - month division');
	var header = month.children(':first');
	ok(header.is('div.ui-datepicker-header'), 'ThemeRoller - month header division');
	equal(header.children().length, 2, 'ThemeRoller - month header child count');
	ok(header.children(':first').is('select.datepick-month-year'),
		'ThemeRoller - new month select');
	ok(header.children(':last').is('select.datepick-month-year'),
		'ThemeRoller - new year select');
	var table = month.children(':eq(1)');
	ok(table.is('table.ui-datepicker-calendar'), 'ThemeRoller - month table');
	ok(table.children(':first').is('thead'), 'ThemeRoller - month table thead');
	var titles = table.children(':first').children(':first');
	ok(titles.is('tr'), 'ThemeRoller - month table title row');
	equal(titles.find('span').length, 7, 'ThemeRoller - month table day headers');
	ok(table.children(':eq(1)').is('tbody'), 'ThemeRoller - month table body');
	ok(table.children(':eq(1)').children('tr').length >= 4,
		'ThemeRoller - month table week count');
	var week = table.children(':eq(1)').children(':first');
	ok(week.is('tr'), 'ThemeRoller - month table week row');
	equal(week.children().length, 7, 'ThemeRoller - week child count');
	ok(week.children(':first').children().hasClass('ui-datepicker-week-end'),
		'ThemeRoller - month table first day cell');
	ok(!week.children(':eq(1)').children().hasClass('ui-datepicker-week-end'),
		'ThemeRoller - month table second day cell');
	var control = dp.children(':eq(2)');
	ok(control.is('div.ui-datepicker-header'), 'ThemeRoller - controls division');
	equal(control.children().length, 2, 'ThemeRoller - control child count');
	ok(control.children(':first').is('button.ui-datepicker-cmd-clear'),
		'ThemeRoller - clear link');
	ok(control.children(':last').is('button.ui-datepicker-cmd-close'),
		'ThemeRoller - close link');
	inp.datepick('hide').datepick('destroy');
	// Multi-month 2
	inp = init('#inp', {monthsToShow: 2, renderer: $.datepick.themeRollerRenderer});
	inp.focus();
	dp = $('#ui-datepicker-div');
	ok(dp.hasClass('ui-datepicker-multi'), 'ThemeRoller multi - multi-month');
	equal(dp.children().length, 4, 'ThemeRoller multi - child count');
	row = dp.children(':eq(1)');
	ok(row.is('div.ui-datepicker-row-break'), 'ThemeRoller multi - month row division');
	equal(row.children().length, 2, 'ThemeRoller multi - month row child count');
	month = row.children(':eq(0)');
	ok(month.is('div.ui-datepicker-group'), 'ThemeRoller multi - first month division');
	month = row.children(':eq(1)');
	ok(month.is('div.ui-datepicker-group'), 'ThemeRoller multi - second month division');
	inp.datepick('hide').datepick('destroy');
	// Multi-month [2, 2]
	inp = init('#inp', {monthsToShow: [2, 2], renderer: $.datepick.themeRollerRenderer});
	inp.focus();
	dp = $('#ui-datepicker-div');
	ok(dp.hasClass('ui-datepicker-multi'), 'ThemeRoller multi - multi-month');
	equal(dp.children().length, 5, 'ThemeRoller multi - child count');
	row = dp.children(':eq(1)');
	ok(row.is('div.ui-datepicker-row-break'), 'ThemeRoller multi - first month row division');
	equal(row.children('.ui-datepicker-group').length, 2, 'ThemeRoller multi - month row child count');
	row = dp.children(':eq(2)');
	ok(row.is('div.ui-datepicker-row-break'), 'ThemeRoller multi - second month row division');
	equal(row.children('.ui-datepicker-group').length, 2, 'ThemeRoller multi - month row child count');
	inp.datepick('hide').datepick('destroy');
	// Week of year
	inp = init('#inp', {renderer: $.datepick.themeRollerWeekOfYearRenderer});
	inp.focus();
	dp = $('#ui-datepicker-div');
	var week = dp.find('tr:first');
	ok(week.children().length == 8, 'ThemeRoller week of year - column count');
	ok(week.children(':first').is('th.ui-state-hover'), 'ThemeRoller week of year - first column');
	ok(week.children(':eq(1)').is('th') && !week.children(':eq(1)').hasClass('ui-state-hover'),
		'ThemeRoller week of year - second column');
	week = dp.find('tr:eq(1)');
	ok(week.children().length == 8, 'ThemeRoller week of year - column count');
	ok(week.children(':first').is('td.ui-state-hover'), 'ThemeRoller week of year - first column');
	ok(week.children(':eq(1)').is('td') && !week.children(':eq(1)').hasClass('ui-state-hover'),
		'ThemeRoller week of year - second column');
	inp.datepick('hide').datepick('destroy');
});

test('Enable/disable', function() {
	expect(31);
	var inp = init('#inp');
	ok(!inp.datepick('isDisabled'), 'Enable/disable - initially marked as enabled');
	ok(!inp[0].disabled, 'Enable/disable - field initially enabled');
	inp.datepick('disable');
	ok(inp.datepick('isDisabled'), 'Enable/disable - now marked as disabled');
	ok(inp[0].disabled, 'Enable/disable - field now disabled');
	inp.datepick('enable');
	ok(!inp.datepick('isDisabled'), 'Enable/disable - now marked as enabled');
	ok(!inp[0].disabled, 'Enable/disable - field now enabled');
	inp.datepick('destroy');
	// With a button
	inp = init('#inp', {showTrigger: '<button>...</button>'});
	ok(!inp.datepick('isDisabled'), 'Enable/disable button - initially marked as enabled');
	ok(!inp[0].disabled, 'Enable/disable button - field initially enabled');
	ok(!inp.next('button')[0].disabled, 'Enable/disable button - button initially enabled');
	inp.datepick('disable');
	ok(inp.datepick('isDisabled'), 'Enable/disable button - now marked as disabled');
	ok(inp[0].disabled, 'Enable/disable button - field now disabled');
	ok(inp.next('button')[0].disabled, 'Enable/disable button - button now disabled');
	inp.datepick('enable');
	ok(!inp.datepick('isDisabled'), 'Enable/disable button - now marked as enabled');
	ok(!inp[0].disabled, 'Enable/disable button - field now enabled');
	ok(!inp.next('button')[0].disabled, 'Enable/disable button - button now enabled');
	inp.datepick('destroy');
	// With an image button
	inp = init('#inp', {showTrigger: '<img src="cal.gif" alt="Cal"></img>'});
	ok(!inp.datepick('isDisabled'), 'Enable/disable image - initially marked as enabled');
	ok(!inp[0].disabled, 'Enable/disable image - field initially enabled');
	ok(inp.next('img').css('opacity') == 1, 'Enable/disable image - image initially enabled');
	inp.datepick('disable');
	ok(inp.datepick('isDisabled'), 'Enable/disable image - now marked as disabled');
	ok(inp[0].disabled, 'Enable/disable image - field now disabled');
	ok(inp.next('img').css('opacity') != 1, 'Enable/disable image - image now disabled');
	inp.datepick('enable');
	ok(!inp.datepick('isDisabled'), 'Enable/disable image - now marked as enabled');
	ok(!inp[0].disabled, 'Enable/disable image - field now enabled');
	ok(inp.next('img').css('opacity') == 1, 'Enable/disable image - image now enabled');
	inp.datepick('destroy');
	// Inline
	var inl = init('#inl');
	ok(!inl.datepick('isDisabled'), 'Enable/disable inline - initially marked as enabled');
	ok($('div.datepick-disabled', inl).length == 0, 'Enable/disable inline - cover initially absent');
	inl.datepick('disable');
	ok(inl.datepick('isDisabled'), 'Enable/disable inline - now marked as disabled');
	var disabled = $('div.datepick-disable', inl);
	var dp = $('div.datepick', inl);
	ok(disabled.length == 1, 'Enable/disable inline - cover now present');
	ok(disabled.outerWidth() == dp.outerWidth() && disabled.outerHeight() == dp.outerHeight(),
		'Enable/disable inline - cover sizing');
	inl.datepick('enable');
	ok(!inl.datepick('isDisabled'), 'Enable/disable inline - now marked as enabled');
	ok($('div.datepick-disabled', inl).length == 0, 'Enable/disable inline - cover now absent');
	inl.datepick('destroy');
});

test('Cross talk', function() {
	expect(14);
	var inp = init('#inp');
	var alt = init('#alt');
	// Enable/disable
	ok(!inp.datepick('isDisabled'), 'First is enabled');
	ok(!alt.datepick('isDisabled'), 'Second is enabled');
	inp.datepick('disable');
	ok(inp.datepick('isDisabled'), 'First is disabled');
	ok(!alt.datepick('isDisabled'), 'Second is enabled');
	alt.datepick('disable');
	ok(inp.datepick('isDisabled'), 'First is disabled');
	ok(alt.datepick('isDisabled'), 'Second is disabled');
	inp.datepick('enable');
	ok(!inp.datepick('isDisabled'), 'First is enabled');
	ok(alt.datepick('isDisabled'), 'Second is disabled');
	alt.datepick('enable');
	ok(!inp.datepick('isDisabled'), 'First is enabled');
	ok(!alt.datepick('isDisabled'), 'Second is enabled');
	// Destroy
	ok(inp.hasClass('is-datepick'), 'First has class');
	ok(alt.hasClass('is-datepick'), 'Second has class');
	inp.datepick('destroy');
	ok(!inp.hasClass('is-datepick'), 'First has no class');
	ok(alt.hasClass('is-datepick'), 'Second has class');
});

test('Keystrokes', function() {
	expect(28);
	var inp = init('#inp');
	var today = $.datepick.today();
	var date = $.datepick.newDate(2008, 2, 4);
	inp.val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [today], 'Keystroke enter');
	inp.val('02/04/2008').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [date], 'Keystroke enter - preset');
	inp.val('02/04/2008').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_HOME}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [date], 'Keystroke ctrl+home');
	inp.val('02/04/2008').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	equalDateArray(inp.datepick('getDate'), [], 'Keystroke ctrl+end');
	inp.val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalDateArray(inp.datepick('getDate'), [], 'Keystroke esc');
	inp.val('02/04/2008').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalDateArray(inp.datepick('getDate'), [date], 'Keystroke esc - preset');
	inp.val('02/04/2008').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalDateArray(inp.datepick('getDate'), [date], 'Keystroke esc - abandoned');
	// Moving by day or week
	inp.val('').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_LEFT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = $.datepick.add($.datepick.today(), -1, 'd');
	equalDateArray(inp.datepick('getDate'), [date], 'Keystroke ctrl+left');
	inp.val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_LEFT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	$.datepick.add(date, 1, 'd');
	equalDateArray(inp.datepick('getDate'), [date], 'Keystroke left');
	inp.val('').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_RIGHT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	$.datepick.add(date, 1, 'd');
	equalDateArray(inp.datepick('getDate'), [date], 'Keystroke ctrl+right');
	inp.val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_RIGHT}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	$.datepick.add(date, -1, 'd');
	equalDateArray(inp.datepick('getDate'), [date], 'Keystroke right');
	inp.val('').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	$.datepick.add(date, -7, 'd');
	equalDateArray(inp.datepick('getDate'), [date], 'Keystroke ctrl+up');
	inp.val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	$.datepick.add(date, 7, 'd');
	equalDateArray(inp.datepick('getDate'), [date], 'Keystroke up');
	inp.val('').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	$.datepick.add(date, 7, 'd');
	equalDateArray(inp.datepick('getDate'), [date], 'Keystroke ctrl+down');
	inp.val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	$.datepick.add(date, -7, 'd');
	equalDateArray(inp.datepick('getDate'), [date], 'Keystroke down');
	// Moving by month or year
	inp.val('02/04/2008').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2008, 1, 4)],
		'Keystroke pgup');
	inp.val('02/04/2008').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2008, 3, 4)],
		'Keystroke pgdn');
	inp.val('02/04/2008').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2007, 2, 4)],
		'Keystroke ctrl+pgup');
	inp.val('02/04/2008').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2009, 2, 4)],
		'Keystroke ctrl+pgdn');
	// Check for moving to short months
	inp.val('03/31/2008').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2008, 2, 29)],
		'Keystroke pgup - Feb');
	inp.val('01/30/2008').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2008, 2, 29)],
		'Keystroke pgdn - Feb');
	inp.val('02/29/2008').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2007, 2, 28)],
		'Keystroke ctrl+pgup - Feb');
	inp.val('02/29/2008').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2009, 2, 28)],
		'Keystroke ctrl+pgdn - Feb');
	// Goto current
	inp.datepick('hide').val('02/04/2008').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_HOME}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2008, 2, 4)],
		'Keystroke ctrl+home');
	// Change steps
	inp.datepick('option', {monthsToStep: 2, monthsToJump: 6}).
		datepick('hide').val('02/04/2008').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2007, 12, 4)],
		'Keystroke pgup step 2');
	inp.val('02/04/2008').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2008, 4, 4)],
		'Keystroke pgdn step 2');
	inp.val('02/04/2008').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2007, 8, 4)],
		'Keystroke ctrl+pgup step 6');
	inp.val('02/04/2008').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2008, 8, 4)],
		'Keystroke ctrl+pgdn step 6');
});

test('Mouse', function() {
	expect(16);
	var inp = init('#inp');
	inp.val('').datepick('show');
	$('div.datepick a:contains(10)').click();
	var date = $.datepick.day($.datepick.today(), 10);
	equalDateArray(inp.datepick('getDate'), [date], 'Mouse click');
	inp.val('02/04/2008').datepick('show');
	$('div.datepick a:contains(12)').click();
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2008, 2, 12)],
		'Mouse click - preset');
	inp.val('02/04/2008').datepick('show');
	$('div.datepick a.datepick-cmd-clear').click();
	equalDateArray(inp.datepick('getDate'), [], 'Mouse click - clear');
	inp.val('').datepick('show');
	$('div.datepick a.datepick-cmd-close').click();
	equalDateArray(inp.datepick('getDate'), [], 'Mouse click - close');
	inp.val('02/04/2008').datepick('show');
	$('div.datepick a.datepick-cmd-close').click();
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2008, 2, 4)],
		'Mouse click - close + preset');
	inp.val('02/04/2008').datepick('show');
	$('div.datepick a.datepick-cmd-prev').click();
	$('div.datepick a.datepick-cmd-close').click();
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2008, 2, 4)],
		'Mouse click - abandoned');
	// Today/previous/next
	inp.val('02/04/2008').datepick('show');
	$('div.datepick a.datepick-cmd-today').click();
	$('div.datepick a:contains(14)').click();
	equalDateArray(inp.datepick('getDate'), [$.datepick.day(date, 14)], 'Mouse click - today');
	inp.val('02/04/2008').datepick('show');
	$('div.datepick a.datepick-cmd-prev').click();
	$('div.datepick a:contains(16)').click();
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2008, 1, 16)],
		'Mouse click - previous');
	inp.val('02/04/2008').datepick('show');
	$('div.datepick a.datepick-cmd-next').click();
	$('div.datepick a:contains(18)').click();
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2008, 3, 18)],
		'Mouse click - next');
	// Previous/next with minimum/maximum
	inp.datepick('option', {minDate: $.datepick.newDate(2008, 2, 2),
		maxDate: $.datepick.newDate(2008, 2, 26)}).val('02/04/2008').datepick('show');
	$('div.datepick a.datepick-cmd-prev').click();
	$('div.datepick a:contains(16)').click();
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2008, 2, 16)],
		'Mouse click - previous + min/max');
	inp.val('02/04/2008').datepick('show');
	$('div.datepick a.datepick-cmd-next').click();
	$('div.datepick a:contains(18)').click();
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2008, 2, 18)],
		'Mouse click - next + min/max');
	// Inline
	var inl = init('#inl');
	date = $.datepick.today();
	inl.datepick('setDate', date);
	$('div.datepick a:contains(10)').click();
	equalDateArray(inl.datepick('getDate'), [$.datepick.day(date, 10)], 'Mouse click inline');
	inl.datepick('setDate', $.datepick.newDate(2008, 2, 4));
	$('div.datepick a:contains(12)').click();
	equalDateArray(inl.datepick('getDate'), [$.datepick.newDate(2008, 2, 12)],
		'Mouse click inline - preset');
	$('div.datepick a.datepick-cmd-today').click();
	$('div.datepick a:contains(14)').click();
	equalDateArray(inl.datepick('getDate'), [$.datepick.day(date, 14)], 'Mouse click inline - current');
	inl.datepick('setDate', $.datepick.newDate(2008, 2, 4));
	$('div.datepick a.datepick-cmd-prev').click();
	$('div.datepick a:contains(16)').click();
	equalDateArray(inl.datepick('getDate'), [$.datepick.newDate(2008, 1, 16)],
		'Mouse click inline - previous');
	inl.datepick('setDate', $.datepick.newDate(2008, 2, 4));
	$('div.datepick a.datepick-cmd-next').click();
	$('div.datepick a:contains(18)').click();
	equalDateArray(inl.datepick('getDate'), [$.datepick.newDate(2008, 3, 18)],
		'Mouse click inline - next');
});

test('Mouse wheel', function() {
	expect(12);
	var mousewheel = function(ctrl) {
		var event = $.Event('mousewheel');
		event.ctrlKey = ctrl;
		return event;
	};
	var inp = init('#inp');
	inp.val('09/20/2010').datepick('show');
	$('div.datepick-popup').trigger(mousewheel(false), [+1]);
	$('div.datepick a:contains(10)').click();
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2010, 8, 10)], 'Mouse wheel - +1');
	inp.val('09/20/2010').datepick('show');
	$('div.datepick-popup').trigger(mousewheel(false), [-1]);
	$('div.datepick a:contains(10)').click();
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2010, 10, 10)], 'Mouse wheel - -1');
	inp.val('09/20/2010').datepick('show');
	$('div.datepick-popup').trigger(mousewheel(true), [+1]);
	$('div.datepick a:contains(10)').click();
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2009, 9, 10)],
		'Mouse wheel - +1/Ctrl');
	inp.val('09/20/2010').datepick('show');
	$('div.datepick-popup').trigger(mousewheel(true), [-1]);
	$('div.datepick a:contains(10)').click();
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2011, 9, 10)],
		'Mouse wheel - -1/Ctrl');
	// useMouseWheel = false
	inp = init('#inp', {useMouseWheel: false});
	inp.val('09/20/2010').datepick('show');
	$('div.datepick-popup').trigger(mousewheel(false), [+1]);
	$('div.datepick a:contains(10)').click();
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2010, 9, 10)],
		'Mouse wheel off - +1');
	inp.val('09/20/2010').datepick('show');
	$('div.datepick-popup').trigger(mousewheel(false), [-1]);
	$('div.datepick a:contains(10)').click();
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2010, 9, 10)],
		'Mouse wheel off - -1');
	// Inline
	var inl = init('#inl');
	inl.datepick('setDate', $.datepick.newDate(2010, 9, 20));
	inl.trigger(mousewheel(false), [+1]);
	$('div.datepick a:contains(10)', inl).click();
	equalDateArray(inl.datepick('getDate'), [$.datepick.newDate(2010, 8, 10)],
		'Mouse wheel inline - +1');
	inl.datepick('setDate', $.datepick.newDate(2010, 9, 20));
	inl.trigger(mousewheel(false), [-1]);
	$('div.datepick a:contains(10)', inl).click();
	equalDateArray(inl.datepick('getDate'), [$.datepick.newDate(2010, 10, 10)],
		'Mouse wheel inline - -1');
	inl.datepick('setDate', $.datepick.newDate(2010, 9, 20));
	inl.trigger(mousewheel(true), [+1]);
	$('div.datepick a:contains(10)', inl).click();
	equalDateArray(inl.datepick('getDate'), [$.datepick.newDate(2009, 9, 10)],
		'Mouse wheel inline - +1/Ctrl');
	inl.datepick('setDate', $.datepick.newDate(2010, 9, 20));
	inl.trigger(mousewheel(true), [-1]);
	$('div.datepick a:contains(10)', inl).click();
	equalDateArray(inl.datepick('getDate'), [$.datepick.newDate(2011, 9, 10)],
		'Mouse wheel inline - -1/Ctrl');
	// useMouseWheel = false
	inl = init('#inl', {useMouseWheel: false});
	inl.datepick('setDate', $.datepick.newDate(2010, 9, 20));
	inl.trigger(mousewheel(false), [+1]);
	$('div.datepick a:contains(10)', inl).click();
	equalDateArray(inl.datepick('getDate'), [$.datepick.newDate(2010, 9, 10)],
		'Mouse wheel inline off - +1');
	inl.datepick('setDate', $.datepick.newDate(2010, 9, 20));
	inl.trigger(mousewheel(false), [-1]);
	$('div.datepick a:contains(10)', inl).click();
	equalDateArray(inl.datepick('getDate'), [$.datepick.newDate(2010, 9, 10)],
		'Mouse wheel inline off - -1');
});

test('Commands', function() {
	expect(8);
	var inp = init('#inp', {renderer: $.extend({}, $.datepick.defaultRenderer,
			{picker: $.datepick.defaultRenderer.picker.
				replace(/\{link:today\}/, '{link:millenium}')}),
		milleniumText: 'Millenium', milleniumStatus: 'Start of the millenium',
		commands: $.extend({}, $.datepick.commands, {millenium: {
			text: 'milleniumText', status: 'milleniumStatus',
			keystroke: {keyCode: 112, shiftKey: true}, // Shift+F1
			enabled: function(inst) {
				return inst.drawDate.getTime() > $.datepick.newDate(2001, 1, 1).getTime(); },
			date: function(inst) { return $.datepick.newDate(2001, 1, 1); },
			action: function(inst) { $.datepick.showMonth(this, 2001, 1, 1); }
		}})});
	inp.focus();
	var mm = $('a.datepick-cmd-millenium');
	ok(mm.length > 0, 'Commands - present');
	ok(mm.parent().hasClass('datepick-nav'), 'Commands - parent');
	equal(mm.text(), 'Millenium', 'Commands - text');
	equal(mm.attr('title'), 'Start of the millenium', 'Commands - status');
	inp.simulate('keydown', {shiftKey: true, keyCode: 112}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2001, 1, 1)],
		'Commands keystroke - shift+F1');
	inp.val('02/04/1980').datepick('show');
	mm = $('a.datepick-cmd-millenium.datepick-disabled');
	ok(mm.length > 0, 'Commands - present');
	// Change keystrokes
	inp.datepick('hide').
		datepick('option', {monthsToStep: 1, monthsToJump: 12,
			commands: $.extend({}, $.datepick.commands,
				{prevJump: $.extend({}, $.datepick.commands.prevJump,
				{keystroke: {keyCode: 33, altKey: true}})})}).
		val('02/04/2008').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2008, 2, 4)],
		'Commands keystroke - ctrl+pgup');
	inp.datepick('show').
		simulate('keydown', {altKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.newDate(2007, 2, 4)],
		'Commands keystroke - alt+pgup');
});

test('Auto size', function() {
	expect(15);
	var inp = init('#inp');
	inp.attr('size', 1);
	equal(inp.attr('size'), 1, 'Auto size - default');
	inp.datepick('option', 'autoSize', true);
	equal(inp.attr('size'), 10, 'Auto size - mm/dd/yyyy');
	inp.datepick('option', 'dateFormat', 'm/d/yyyy');
	equal(inp.attr('size'), 10, 'Auto size - m/d/yyyy');
	inp.datepick('option', 'dateFormat', 'D M d yyyy');
	equal(inp.attr('size'), 15, 'Auto size - D M d yyyy');
	inp.datepick('option', 'dateFormat', 'DD, MM dd, yyyy');
	equal(inp.attr('size'), 29, 'Auto size - DD, MM dd, yyyy');
	inp.attr('size', 1);
	// French
	inp.datepick('option', $.extend({autoSize: false},
		$.datepick.regionalOptions['fr']));
	equal(inp.attr('size'), 1, 'Auto size - fr - default');
	inp.datepick('option', 'autoSize', true);
	equal(inp.attr('size'), 10, 'Auto size - fr - dd/mm/yyyy');
	inp.datepick('option', 'dateFormat', 'm/d/yyyy');
	equal(inp.attr('size'), 10, 'Auto size - fr - m/d/yyyy');
	inp.datepick('option', 'dateFormat', 'D M d yyyy');
	equal(inp.attr('size'), 15, 'Auto size - fr - D M d yyyy');
	inp.datepick('option', 'dateFormat', 'DD, MM dd, yyyy');
	equal(inp.attr('size'), 28, 'Auto size - fr - DD, MM dd, yyyy');
	inp.attr('size', 1);
	// Hebrew
	inp.datepick('option', $.extend({autoSize: false},
		$.datepick.regionalOptions['he']));
	equal(inp.attr('size'), 1, 'Auto size - he - default');
	inp.datepick('option', 'autoSize', true);
	equal(inp.attr('size'), 10, 'Auto size - he - dd/mm/yyyy');
	inp.datepick('option', 'dateFormat', 'm/d/yyyy');
	equal(inp.attr('size'), 10, 'Auto size - he - m/d/yyyy');
	inp.datepick('option', 'dateFormat', 'D M d yyyy');
	equal(inp.attr('size'), 14, 'Auto size - he - D M d yyyy');
	inp.datepick('option', 'dateFormat', 'DD, MM dd, yyyy');
	equal(inp.attr('size'), 23, 'Auto size - he - DD, MM dd, yyyy');
});

test('Default date', function() {
	expect(20);
	var inp = init('#inp');
	var date = $.datepick.today();
	inp.val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [date], 'Default date null');
	// Numeric values
	inp.datepick('option', {defaultDate: -2}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.add(date, -2, 'd')], 'Default date -2');
	inp.datepick('option', {defaultDate: 3}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.add(date, +5, 'd')], 'Default date 3');
	inp.datepick('option', {defaultDate: 1 / 0}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.add(date, -3, 'd')], 'Default date 1 / 0');
	inp.datepick('option', {defaultDate: 1 / 'a'}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [date], 'Default date NaN');
	// String offset values
	inp.datepick('option', {defaultDate: '-1d'}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.add(date, -1, 'd')], 'Default date -1d');
	inp.datepick('option', {defaultDate: '+3D'}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.add(date, +4, 'd')], 'Default date +3D');
	inp.datepick('option', {defaultDate: ' -2 w '}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = $.datepick.add($.datepick.today(), -14, 'd');
	equalDateArray(inp.datepick('getDate'), [date], 'Default date -2 w');
	inp.datepick('option', {defaultDate: '+1 W'}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.add(date, +21, 'd')], 'Default date +1 W');
	inp.datepick('option', {defaultDate: ' -1 m '}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = $.datepick.add($.datepick.today(), -1, 'm');
	equalDateArray(inp.datepick('getDate'), [date], 'Default date -1 m');
	inp.datepick('option', {defaultDate: '+2M'}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.add(date, +3, 'm')], 'Default date +2M');
	inp.datepick('option', {defaultDate: '-2y'}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = $.datepick.add($.datepick.today(), -2, 'y');
	equalDateArray(inp.datepick('getDate'), [date], 'Default date -2y');
	inp.datepick('option', {defaultDate: '+1 Y '}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [$.datepick.add(date, +3, 'y')], 'Default date +1 Y');
	inp.datepick('option', {defaultDate: '+1M +10d'}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = $.datepick.add($.datepick.add($.datepick.today(), +1, 'm'), +10, 'd');
	equalDateArray(inp.datepick('getDate'), [date], 'Default date +1M +10d');
	date = $.datepick.newDate(2007, 1, 26);
	inp.datepick('option', {defaultDate: date}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [date], 'Default date 01/26/2007');
	// String date values
	inp.datepick('option', {defaultDate: '06/04/2009'}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = $.datepick.newDate(2009, 6, 4);
	equalDateArray(inp.datepick('getDate'), [date], 'Default date 06/04/2009');
	inp.datepick('option', {dateFormat: 'yyyy-mm-dd', defaultDate: '2009-01-26'}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = $.datepick.newDate(2009, 1, 26);
	equalDateArray(inp.datepick('getDate'), [date], 'Default date 2009-01-26');
	inp.datepick('option', {defaultDate: 'invalid'}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	date = $.datepick.today();
	equalDateArray(inp.datepick('getDate'), [date], 'Default date invalid');
	inp.datepick('option', {dateFormat: 'mm/dd/yyyy'});
	// Select default
	inp.val('');
	inp = init('#inp', {defaultDate: $.datepick.newDate(2009, 6, 4), selectDefaultDate: true});
	equal(inp.val(), '06/04/2009', 'Show default - init');
	inp.val('02/04/2009').datepick('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	equal(inp.val(), '06/04/2009', 'Show default - clear');
});

test('Miscellaneous', function() {
	expect(41);
	var inp = init('#inp', {earlierText: 'Before', laterText: 'After'});
	var genYears = function(start, count, desc, exclExtras) {
		var years = exclExtras ? '' : 'Before';
		var y = 0;
		for (var i = 0; i <= count; i++,(desc ? y-- : y++)) {
			years += (start + y);
		}
		years += exclExtras ? '' : 'After';
		return years;
	};
	// Year range
	inp.val('02/04/2008').datepick('show');
	equal($('select.datepick-month-year:last').text(), genYears(1998, 20),
		'Year range - default');
	equal($('select.datepick-month-year:last option:first').val(), '2/1988', 'Earlier year - default');
	equal($('select.datepick-month-year:last option:last').val(), '2/2028', 'Later year - default');
	inp.datepick('hide').datepick('option', {minDate: new Date(2010, 1-1, 1), maxDate: new Date(2016, 1-1, 1)}).
		datepick('show');
	equal($('select.datepick-month-year:last').text(), genYears(2010, 6, false, true),
		'Year range - default, min/max set');
	inp.datepick('option', {minDate: null, maxDate: null}).
		datepick('hide').datepick('option', {yearRange: '-6:+2'}).datepick('show');
	equal($('select.datepick-month-year:last').text(), genYears(new Date().getFullYear() - 6, 8),
		'Year range - -6:+2');
	inp.datepick('hide').datepick('option', {yearRange: '2000:2010'}).datepick('show');
	equal($('select.datepick-month-year:last').text(), genYears(2000, 10),
		'Year range - 2000:2010');
	inp.datepick('hide').datepick('option', {yearRange: 'c-5:c+5'}).
		val('01/01/2001').datepick('show');
	equal($('select.datepick-month-year:last').text(), genYears(1996, 10),
		'Year range - c-5:c+5');
	equal($('select.datepick-month-year:last option:first').val(), '1/1991', 'Earlier year - c-5:c+5');
	equal($('select.datepick-month-year:last option:last').val(), '1/2011', 'Later year - c-5:c+5');
	inp.datepick('hide').datepick('option', {yearRange: '2010:2000'}).datepick('show');
	equal($('select.datepick-month-year:last').text(), genYears(2010, 10, true),
		'Year range - 2010:2000');
	// Commands as date format
	equal($('a.datepick-cmd-prev').text(), '<Prev', 'Navigation prev - default');
	equal($('a.datepick-cmd-today').text(), 'Today', 'Navigation current - default');
	equal($('a.datepick-cmd-next').text(), 'Next>', 'Navigation next - default');
	inp.datepick('hide').datepick('option', {commandsAsDateFormat: true,
		prevText: '< M', todayText: 'MM', nextText: 'M >'}).
		val('02/04/2008').datepick('show');
	var longNames = $.datepick.defaultOptions.monthNames;
	var shortNames = $.datepick.defaultOptions.monthNamesShort;
	var date = $.datepick.today();
	equal($('a.datepick-cmd-prev').text(),
		'< ' + shortNames[0], 'Navigation prev - as date format');
	equal($('a.datepick-cmd-today').text(),
		longNames[date.getMonth()], 'Navigation today - as date format');
	equal($('a.datepick-cmd-next').text(),
		shortNames[2] + ' >', 'Navigation next - as date format');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN});
	equal($('a.datepick-cmd-prev').text(),
		'< ' + shortNames[1], 'Navigation prev - as date format + pgdn');
	equal($('a.datepick-cmd-today').text(),
		longNames[date.getMonth()], 'Navigation today - as date format + pgdn');
	equal($('a.datepick-cmd-next').text(),
		shortNames[3] + ' >', 'Navigation next - as date format + pgdn');
	inp.datepick('hide').datepick('option', {currentText: 'MM', renderer:
		$.extend({}, $.datepick.defaultRenderer,
		{picker: $.datepick.defaultRenderer.picker.replace(/today/, 'current')})}).
		val('02/04/2008').datepick('show');
	equal($('a.datepick-cmd-prev').text(),
		'< ' + shortNames[0], 'Navigation prev - as date format + current');
	equal($('a.datepick-cmd-current').text(),
		longNames[1], 'Navigation current - as date format + current');
	equal($('a.datepick-cmd-next').text(),
		shortNames[2] + ' >', 'Navigation next - as date format + current');
	// Show current at pos
	inp.datepick('hide').datepick('option', {monthsToShow: 3,
		renderer: $.datepick.defaultRenderer}).
		val('02/04/2008').datepick('show');
	equal($('a.datepick-cmd-prev').text(),
		'< ' + shortNames[0], 'Show current at pos - default prev');
	equal($('a.datepick-cmd-next').text(),
		shortNames[2] + ' >', 'Show current at pos - default next');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN});
	equal($('a.datepick-cmd-prev').text(),
		'< ' + shortNames[1], 'Show current at pos - default prev + pgdn');
	equal($('a.datepick-cmd-next').text(),
		shortNames[3] + ' >', 'Show current at pos - default next + pgdn');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGUP});
	equal($('a.datepick-cmd-prev').text(),
		'< ' + shortNames[0], 'Show current at pos - default prev + pgup');
	equal($('a.datepick-cmd-next').text(),
		shortNames[2] + ' >', 'Show current at pos - default next + pgup');
	inp.datepick('hide').datepick('option', {monthsToShow: 3, monthsOffset: 1}).
		val('02/04/2008').datepick('show');
	equal($('a.datepick-cmd-prev').text(),
		'< ' + shortNames[11], 'Show current at pos - pos 1 prev');
	equal($('a.datepick-cmd-next').text(),
		shortNames[1] + ' >', 'Show current at pos - pos 1 next');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN});
	equal($('a.datepick-cmd-prev').text(),
		'< ' + shortNames[0], 'Show current at pos - pos 1 prev + pgdn');
	equal($('a.datepick-cmd-next').text(),
		shortNames[2] + ' >', 'Show current at pos - pos 1 next + pgdn');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGUP});
	equal($('a.datepick-cmd-prev').text(),
		'< ' + shortNames[11], 'Show current at pos - pos 1 prev + pgup');
	equal($('a.datepick-cmd-next').text(),
		shortNames[1] + ' >', 'Show current at pos - pos 1 next + pgup');
	inp.datepick('hide').datepick('option', {monthsToShow: 3, monthsOffset: 2}).
		val('02/04/2008').datepick('show');
	equal($('a.datepick-cmd-prev').text(),
		'< ' + shortNames[10], 'Show current at pos - pos 2 prev');
	equal($('a.datepick-cmd-next').text(),
		shortNames[0] + ' >', 'Show current at pos - pos 2 next');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN});
	equal($('a.datepick-cmd-prev').text(),
		'< ' + shortNames[11], 'Show current at pos - pos 2 prev + pgdn');
	equal($('a.datepick-cmd-next').text(),
		shortNames[1] + ' >', 'Show current at pos - pos 2 next + pgdn');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGUP});
	equal($('a.datepick-cmd-prev').text(),
		'< ' + shortNames[10], 'Show current at pos - pos 2 prev + pgup');
	equal($('a.datepick-cmd-next').text(),
		shortNames[0] + ' >', 'Show current at pos - pos 2 next + pgup');
	inp.datepick('hide');
	// Old dates (prior to 1970)
	inp.val('01/01/1960').datepick('option', {monthsToShow: 1, monthsOffset: 0}).datepick('show');
	$('div.datepick a:contains(10)').click();
	equalDateArray(inp.datepick('getDate'), [new Date(1960, 1-1, 10, 12)], 'Old dates - 01/10/1960');
});

test('Other months', function() {
	expect(8);
	var inp = init('#inp');
	inp.val('01/01/2008').datepick('show');
	equal($('div.datepick table').text(),
		'SuMoTuWeThFrSa\u00a0\u00a012345678910111213141516171819202122232425262728293031\u00a0\u00a0',
		'Other months - default');
	$('div.datepick table a:first').click();
	equalDate(inp.datepick('getDate'), $.datepick.newDate(2008, 1, 1),
		'Other months - default click');
	inp.datepick('option', {showOtherMonths: true}).
		val('01/01/2008').datepick('show');
	equal($('div.datepick table').text(),
		'SuMoTuWeThFrSa30311234567891011121314151617181920212223242526272829303112',
		'Other months - show');
	$('div.datepick table a:first').click();
	equalDate(inp.datepick('getDate'), $.datepick.newDate(2008, 1, 1),
		'Other months - show click');
	inp.datepick('option', {showOtherMonths: true, selectOtherMonths: true}).
		val('01/01/2008').datepick('show');
	equal($('div.datepick table').text(),
		'SuMoTuWeThFrSa30311234567891011121314151617181920212223242526272829303112',
		'Other months - show/select');
	$('div.datepick table a:first').click();
	equalDate(inp.datepick('getDate'), $.datepick.newDate(2007, 12, 30),
		'Other months - show/select click');
	inp.datepick('option', {showOtherMonths: false, selectOtherMonths: true}).
		val('01/01/2008').datepick('show');
	equal($('div.datepick table').text(),
		'SuMoTuWeThFrSa\u00a0\u00a012345678910111213141516171819202122232425262728293031\u00a0\u00a0',
		'Other months - select');
	$('div.datepick table a:first').click();
	equalDate(inp.datepick('getDate'), $.datepick.newDate(2008, 1, 1),
		'Other months - select click');
});

test('Min/max', function() {
	expect(25);
	var inp = init('#inp', {renderer: $.extend({}, $.datepick.defaultRenderer,
		{picker: $.datepick.defaultRenderer.picker.
			replace(/\{link:prev\}/, '{link:prevJump}{link:prev}').
			replace(/\{link:next\}/, '{link:nextJump}{link:next}')})});
	var start = $.datepick.newDate(2008, 6, 4);
	var lastYear = $.datepick.newDate(2007, 6, 4);
	var nextYear = $.datepick.newDate(2009, 6, 4);
	var minDate = $.datepick.newDate(2008, 2, 29);
	var maxDate = $.datepick.newDate(2008, 12, 7);
	inp.val('06/04/2008').datepick('show');
	ok(!$('a.datepick-cmd-prevJump').hasClass('datepick-disabled'), 'Min/max - prev year enabled');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [lastYear],
		'Min/max - null, null - ctrl+pgup');
	inp.val('06/04/2008').datepick('show');
	ok(!$('a.datepick-cmd-nextJump').hasClass('datepick-disabled'), 'Min/max - next year enabled');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [nextYear],
		'Min/max - null, null - ctrl+pgdn');
	inp.datepick('option', {minDate: minDate}).
		datepick('hide').val('06/04/2008').datepick('show');
	ok($('a.datepick-cmd-prevJump').hasClass('datepick-disabled'), 'Min/max - prev year disabled');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [start],
		'Min/max - 02/29/2008, null - ctrl+pgup');
	inp.val('06/04/2008').datepick('show');
	ok(!$('a.datepick-cmd-nextJump').hasClass('datepick-disabled'), 'Min/max - next year enabled');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [nextYear],
		'Min/max - 02/29/2008, null - ctrl+pgdn');
	inp.datepick('option', {maxDate: maxDate}).
		datepick('hide').val('06/04/2008').datepick('show');
	ok($('a.datepick-cmd-prevJump').hasClass('datepick-disabled'), 'Min/max - prev year disabled');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [start],
		'Min/max - 02/29/2008, 12/07/2008 - ctrl+pgup');
	inp.val('06/04/2008').datepick('show');
	ok($('a.datepick-cmd-nextJump').hasClass('datepick-disabled'), 'Min/max - next year disabled');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [start],
		'Min/max - 02/29/2008, 12/07/2008 - ctrl+pgdn');
	inp.datepick('option', {minDate: null}).
		datepick('hide').val('06/04/2008').datepick('show');
	ok(!$('a.datepick-cmd-prevJump').hasClass('datepick-disabled'), 'Min/max - prev year enabled');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [lastYear],
		'Min/max - null, 12/07/2008 - ctrl+pgup');
	inp.val('06/04/2008').datepick('show');
	ok($('a.datepick-cmd-nextJump').hasClass('datepick-disabled'), 'Min/max - next year disabled');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [start],
		'Min/max - null, 12/07/2008 - ctrl+pgdn');
	// Relative dates
	var date = $.datepick.today();
	inp.datepick('option', {minDate: '-1w', maxDate: '+1 M +10 D '}).
		datepick('hide').val('').datepick('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [date],
		'Min/max - -1w, +1 M +10 D - ctrl+pgup');
	inp.val('').datepick('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [date],
		'Min/max - -1w, +1 M +10 D - ctrl+pgdn');
	// With existing date
	inp = init('#inp');
	inp.datepick('setDate', '06/04/2008').datepick('option', {minDate: minDate});
	equalDateArray(inp.datepick('getDate'), [start],
		'Min/max - setDate > min');
	inp.datepick('option', {minDate: null}).datepick('setDate', '01/04/2008').
		datepick('option', {minDate: minDate});
	equalDateArray(inp.datepick('getDate'), [],
		'Min/max - setDate < min');
	inp.datepick('option', {minDate: null}).datepick('setDate', '06/04/2008').
		datepick('option', {maxDate: maxDate});
	equalDateArray(inp.datepick('getDate'), [start],
		'Min/max - setDate < max');
	inp.datepick('option', {maxDate: null}).datepick('setDate', '01/04/2009').
		datepick('option', {maxDate: maxDate});
	equalDateArray(inp.datepick('getDate'), [],
		'Min/max - setDate > max');
	inp.datepick('option', {maxDate: null}).datepick('setDate', '01/04/2008').
		datepick('option', {minDate: minDate, maxDate: maxDate});
	equalDateArray(inp.datepick('getDate'), [],
		'Min/max - setDate < min');
	inp.datepick('option', {maxDate: null}).datepick('setDate', '06/04/2008').
		datepick('option', {minDate: minDate, maxDate: maxDate});
	equalDateArray(inp.datepick('getDate'), [start],
		'Min/max - setDate > min, < max');
	inp.datepick('option', {maxDate: null}).datepick('setDate', '01/04/2009').
		datepick('option', {minDate: minDate, maxDate: maxDate});
	equalDateArray(inp.datepick('getDate'), [],
		'Min/max - setDate > max');
});

test('Set date', function() {
	expect(44);
	var today = $.datepick.today();
	var date1 = $.datepick.newDate(2008, 6, 4);
	var date2 = $.datepick.today();
	var inp = $('#inp').val('');
	init('#inp');
	equalDateArray(inp.datepick('getDate'), [], 'Set date - blank');
	inp.val('06/08/2010');
	init('#inp');
	equalDateArray(inp.datepick('getDate'), [new Date(2010, 6-1, 8, 12)], 'Set date - preset');
	inp.val('2010-06-08');
	init('#inp');
	equalDateArray(inp.datepick('getDate'), [], 'Set date - invalid');
	inp.datepick('setDate', date1);
	equalDateArray(inp.datepick('getDate'), [date1], 'Set date - 2008-06-04');
	date1 = $.datepick.add($.datepick.today(), +7, 'd');
	inp.datepick('setDate', +7);
	equalDateArray(inp.datepick('getDate'), [date1], 'Set date - +7');
	inp.datepick('setDate', '+2y');
	equalDateArray(inp.datepick('getDate'), [$.datepick.add(date2, +2, 'y')], 'Set date - +2y');
	inp.datepick('setDate', date1, date2);
	equalDateArray(inp.datepick('getDate'), [date1], 'Set date - two dates');
	inp.datepick('setDate');
	equalDateArray(inp.datepick('getDate'), [], 'Set date - null');
	// Relative to current date
	date1 = $.datepick.add($.datepick.today(), +7, 'd');
	inp.datepick('setDate', 'c +7');
	equalDateArray(inp.datepick('getDate'), [date1], 'Set date - c +7');
	inp.datepick('setDate', 'c+7');
	equalDateArray(inp.datepick('getDate'), [$.datepick.add(date1, +7, 'd')], 'Set date - c+7');
	inp.datepick('setDate', 'c -3 w');
	equalDateArray(inp.datepick('getDate'), [$.datepick.add(date1, -21, 'd')], 'Set date - c -3 w');
	// Ranges
	date1 = $.datepick.newDate(2008, 6, 4);
	date2 = $.datepick.newDate(2009, 7, 5);
	inp.datepick('option', {rangeSelect: true}).
		datepick('setDate', date1, date2);
	equalDateArray(inp.datepick('getDate'), [date1, date2],
		'Set date range - 2008-06-04 - 2009-07-05');
	inp.datepick('setDate', date1);
	equalDateArray(inp.datepick('getDate'), [date1, date1], 'Set date range - 2008-06-04');
	date1 = $.datepick.add($.datepick.today(), -10, 'd');
	date2 = $.datepick.add($.datepick.today(), +10, 'd');
	inp.datepick('setDate', -10, +10);
	equalDateArray(inp.datepick('getDate'), [date1, date2], 'Set date range - -10 - +10');
	inp.datepick('setDate', -10);
	equalDateArray(inp.datepick('getDate'), [date1, date1], 'Set date range - -10');
	date1 = $.datepick.add($.datepick.today(), -14, 'd');
	date2 = $.datepick.add($.datepick.today(), +1, 'y');
	inp.datepick('setDate', '-2w', '+1Y');
	equalDateArray(inp.datepick('getDate'), [date1, date2], 'Set date range - -2w - +1Y');
	inp.datepick('setDate', '-2w');
	equalDateArray(inp.datepick('getDate'), [date1, date1], 'Set date range - -2w');
	inp.datepick('setDate');
	equalDateArray(inp.datepick('getDate'), [], 'Set date range - null');
	// Inline
	var inl = init('#inl');
	date1 = $.datepick.newDate(2008, 6, 4);
	date2 = $.datepick.today();
	equalDateArray(inl.datepick('getDate'), [], 'Set date inline - default');
	inl.datepick('setDate', date1);
	equalDateArray(inl.datepick('getDate'), [date1], 'Set date inline - 2008-06-04');
	date1 = $.datepick.add($.datepick.today(), +7, 'd');
	inl.datepick('setDate', +7);
	equalDateArray(inl.datepick('getDate'), [date1], 'Set date inline - +7');
	inl.datepick('setDate', '+2y');
	equalDateArray(inl.datepick('getDate'), [$.datepick.add(date2, +2, 'y')], 'Set date inline - +2y');
	inl.datepick('setDate', date1, date2);
	equalDateArray(inl.datepick('getDate'), [date1], 'Set date inline - two dates');
	inl.datepick('setDate');
	equalDateArray(inl.datepick('getDate'), [], 'Set date inline - null');
	// Alternate field
	var alt = $('#alt');
	inp.datepick('option', {altField: '#alt', altFormat: 'yyyy-mm-dd'});
	date1 = $.datepick.newDate(2008, 6, 4);
	date2 = $.datepick.newDate(2009, 7, 5);
	inp.datepick('setDate', date1, date2);
	equal(inp.val(), '06/04/2008 - 07/05/2009', 'Set date alternate - 06/04/2008 - 07/05/2009');
	equal(alt.val(), '2008-06-04 - 2009-07-05', 'Set date alternate - 2008-06-04 - 2009-07-05');
	inp.datepick('option', {rangeSelect: false}).datepick('setDate', date1);
	equal(inp.val(), '06/04/2008', 'Set date alternate - 06/04/2008');
	equal(alt.val(), '2008-06-04', 'Set date alternate - 2008-06-04');
	inp.val('06/08/2010');
	init('#inp', {altField: '#alt', altFormat: 'yyyy-mm-dd'});
	equal(inp.val(), '06/08/2010', 'Set date alternate - 06/08/2010');
	equal(alt.val(), '2010-06-08', 'Set date alternate - 2010-06-08');
	// With minimum/maximum
	inp = init('#inp');
	date1 = $.datepick.newDate(2008, 1, 4);
	date2 = $.datepick.newDate(2008, 6, 4);
	var minDate = $.datepick.newDate(2008, 2, 29);
	var maxDate = $.datepick.newDate(2008, 3, 28);
	inp.val('').datepick('option', {minDate: minDate}).datepick('setDate', date2);
	equalDateArray(inp.datepick('getDate'), [date2], 'Set date min/max - setDate > min');
	inp.datepick('setDate', date1);
	equalDateArray(inp.datepick('getDate'), [], 'Set date min/max - setDate < min');
	inp.val('').datepick('option', {maxDate: maxDate, minDate: null}).
		datepick('setDate', date1);
	equalDateArray(inp.datepick('getDate'), [date1], 'Set date min/max - setDate < max');
	inp.datepick('setDate', date2);
	equalDateArray(inp.datepick('getDate'), [], 'Set date min/max - setDate > max');
	inp.val('').datepick('option', {minDate: minDate}).datepick('setDate', date1);
	equalDateArray(inp.datepick('getDate'), [], 'Set date min/max - setDate < min');
	inp.datepick('setDate', date2);
	equalDateArray(inp.datepick('getDate'), [], 'Set date min/max - setDate > max');
	// Range with minimum/maximum
	inp = init('#inp');
	var date3 = $.datepick.newDate(2008, 3, 10);
	var date4 = $.datepick.newDate(2008, 3, 16);
	inp.val('').datepick('option', {minDate: minDate, maxDate: null, rangeSelect: true}).
		datepick('setDate', date3, date4);
	equalDateArray(inp.datepick('getDate'), [date3, date4],
		'Set date min/max - range setDate both > min');
	inp.datepick('setDate', date1, date4);
	equalDateArray(inp.datepick('getDate'), [date4, date4],
		'Set date min/max - range setDate 1 < min');
	inp.datepick('setDate', date3, date2);
	equalDateArray(inp.datepick('getDate'), [date3, date2],
		'Set date min/max - range setDate both > min');
	inp.val('').datepick('option', {maxDate: maxDate, minDate: null}).
		datepick('setDate', date3, date4);
	equalDateArray(inp.datepick('getDate'), [date3, date4],
		'Set date min/max - range setDate both < max');
	inp.datepick('setDate', date3, date2);
	equalDateArray(inp.datepick('getDate'), [date3, date3],
		'Set date min/max - range setDate 1 > max');
	inp.datepick('setDate', date1, date4);
	equalDateArray(inp.datepick('getDate'), [date1, date4],
		'Set date min/max - range setDate both > max');
	inp.val('').datepick('option', {minDate: minDate}).
		datepick('setDate', date3, date4);
	equalDateArray(inp.datepick('getDate'), [date3, date4],
		'Set date min/max - range setDate');
	inp.datepick('setDate', date1, date2);
	equalDateArray(inp.datepick('getDate'), [],
		'Set date min/max - range setDate < min, > max');
});

test('Ranges', function() {
	expect(27);
	var date1 = $.datepick.today();
	var date2 = $.datepick.today();
	var inp = $('#inp').val('');
	init('#inp', {rangeSelect: true});
	equalDateArray(inp.datepick('getDate'), [], 'Range - init blank');
	inp.val('06/12/2010');
	init('#inp', {rangeSelect: true});
	equalDateArray(inp.datepick('getDate'), [new Date(2010, 6-1, 12, 12), new Date(2010, 6-1, 12, 12)],
		'Range - init preset single');
	inp.val('06/08/2010 - 06/18/2010');
	init('#inp', {rangeSelect: true});
	equalDateArray(inp.datepick('getDate'), [new Date(2010, 6-1, 8, 12), new Date(2010, 6-1, 18, 12)],
		'Range - init preset range');
	inp.val('2010-06-08 - 2010-06-18');
	init('#inp', {rangeSelect: true});
	equalDateArray(inp.datepick('getDate'), [], 'Range - init invalid');
	// Select today - today
	inp.val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [date1, date1], 'Range - enter/enter');
	// Can't select prior to start date
	inp.val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [date1, date1],
		'Range - enter/ctrl+up/enter');
	// Can select after start date
	inp.val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	$.datepick.add(date2, +7, 'd');
	equalDateArray(inp.datepick('getDate'), [date1, date2],
		'Range - enter/ctrl+down/enter');
	equal(inp.val(), $.datepick.formatDate('mm/dd/yyyy', date1) + ' - ' +
		$.datepick.formatDate('mm/dd/yyyy', date2), 'Range - value');
	// Select then cancel defaults to first date
	inp.val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalDateArray(inp.datepick('getDate'), [date1, date1],
		'Range - enter/ctrl+down/esc');
	// Separator
	inp.datepick('option', {rangeSeparator: ' to '}).
		datepick('hide').val('06/04/2008').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'),
		[$.datepick.newDate(2008, 6, 4), $.datepick.newDate(2008, 6, 11)],
		'Range separator - enter/ctrl+down/enter');
	equal(inp.val(), '06/04/2008 to 06/11/2008', 'Range separator - value');
	// Callbacks
	inp.datepick('option', {onSelect: callback, rangeSeparator: ' - '}).
		datepick('hide').val('06/04/2008').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(selectedDates, [$.datepick.newDate(2008, 6, 4), $.datepick.newDate(2008, 6, 11)],
		'Range onSelect date - enter/ctrl+down/enter');
	inp.datepick('option', {onChangeMonthYear: callback2, onSelect: null}).
		datepick('hide').val('05/04/2008').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equal(selectedDates, '2008/4',
		'Range onChangeMonthYear value - enter/ctrl+down/enter');
	inp.datepick('option', {onClose: callback, onChangeMonthYear: null}).
		datepick('hide').val('03/04/2008').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(selectedDates, [$.datepick.newDate(2008, 3, 4), $.datepick.newDate(2008, 3, 11)],
		'Range onClose date - enter/ctrl+down/enter');
	// Minimum/maximum
	date1 = $.datepick.newDate(2008, 5, 20);
	date2 = $.datepick.newDate(2008, 7, 2);
	inp.datepick('option', {minDate: date1, maxDate: date2, onClose: null}).
		datepick('hide').val('06/04/2008').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGUP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [date1, date2],
		'Range min/max - pgup/enter/pgdn/pgdn/enter');
	inp.val('06/04/2008').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'),
		[$.datepick.newDate(2008, 5, 28), $.datepick.newDate(2008, 6, 11)],
		'Range min/max - ctrl+up/enter/ctrl+down/ctrl+down/enter');
	// Min/max with existing date
	var date3 = $.datepick.newDate(2008, 6, 4);
	var date4 = $.datepick.newDate(2008, 6, 20);
	inp.datepick('setDate', '06/04/2008', '06/20/2008').
		datepick('option', {minDate: date1});
	equalDateArray(inp.datepick('getDate'), [date3, date4],
		'Range min/max - setDate both > min');
	inp.datepick('option', {minDate: null}).
		datepick('setDate', '01/04/2008', '06/20/2008').
		datepick('option', {minDate: date1});
	equalDateArray(inp.datepick('getDate'), [date4, date4],
		'Range min/max - setDate 1 < min');
	inp.datepick('option', {minDate: null}).
		datepick('setDate', '01/04/2008', '02/04/2008').
		datepick('option', {minDate: date1});
	equalDateArray(inp.datepick('getDate'), [],
		'Range min/max - setDate both < min');
	inp.datepick('option', {minDate: null}).
		datepick('setDate', '06/04/2008', '06/20/2008').
		datepick('option', {maxDate: date2});
	equalDateArray(inp.datepick('getDate'), [date3, date4],
		'Range min/max - setDate both < max');
	inp.datepick('option', {maxDate: null}).
		datepick('setDate', '06/04/2008', '12/04/2008').
		datepick('option', {maxDate: date2});
	equalDateArray(inp.datepick('getDate'), [date3, date3],
		'Range min/max - setDate 1 > max');
	inp.datepick('option', {maxDate: null}).
		datepick('setDate', '08/04/2008', '12/04/2008').
		datepick('option', {maxDate: date2});
	equalDateArray(inp.datepick('getDate'), [],
		'Range min/max - setDate both > max');
	inp.datepick('option', {maxDate: null}).
		datepick('setDate', '06/04/2008', '06/20/2008').
		datepick('option', {minDate: date1, maxDate: date2});
	equalDateArray(inp.datepick('getDate'), [date3, date4],
		'Range min/max - setDate both > min, < max');
	inp.datepick('option', {maxDate: null}).
		datepick('setDate', '01/04/2008', '12/04/2008').
		datepick('option', {minDate: date1, maxDate: date2});
	equalDateArray(inp.datepick('getDate'), [],
		'Range min/max - setDate both < min, > max');
	// Inline
	var inl = init('#inl', {rangeSelect: true});
	date1 = $.datepick.day($.datepick.today(), 12);
	date2 = $.datepick.day($.datepick.today(), 19);
	$('tbody a:contains(12)').click();
	$('tbody a:contains(12)').click();
	equalDateArray(inl.datepick('getDate'), [date1, date1],
		'Range inline - same day');
	$('tbody a:contains(12)').click();
	$('tbody a:contains(10)').click(); // Doesn't select
	equalDateArray(inl.datepick('getDate'), [date1, date1],
		'Range inline - prev');
	$('tbody a:contains(12)').click(); // Selects
	inl.datepick('setDate', date1);
	$('tbody a:contains(12)').click();
	$('tbody a:contains(19)').click();
	equalDateArray(inl.datepick('getDate'), [date1, date2],
		'Range inline - next');
});

test('Multiple dates', function() {
	expect(35);
	var date1 = $.datepick.today();
	var date2 = $.datepick.today();
	var inp = $('#inp').val('');
	init('#inp', {multiSelect: 2});
	equalDateArray(inp.datepick('getDate'), [], 'Multiple 2 - init blank');
	inp.val('06/12/2010');
	init('#inp', {multiSelect: 2});
	equalDateArray(inp.datepick('getDate'), [new Date(2010, 6-1, 12, 12)],
		'Multiple 2 - init preset single');
	inp.val('06/08/2010,06/18/2010');
	init('#inp', {multiSelect: 2});
	equalDateArray(inp.datepick('getDate'), [new Date(2010, 6-1, 8, 12), new Date(2010, 6-1, 18, 12)],
		'Multiple 2 - init preset range');
	inp.val('2010-06-08,2010-06-18');
	init('#inp', {multiSelect: 2});
	equalDateArray(inp.datepick('getDate'), [], 'Multiple 2 - init invalid');
	// Select date(s)
	inp.val('').datepick('show');
	equalDateArray(inp.datepick('getDate'), [], 'Multiple 2 - no dates');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [date1], 'Multiple 2 - pick 1');
	inp.datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	ok($('div.datepick').is(':visible'), 'Multiple - still open after first pick');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	$.datepick.add(date2, +7, 'd');
	equalDateArray(inp.datepick('getDate'), [date1, date2], 'Multiple 2 - pick 2');
	ok(!$('div.datepick').is(':visible'), 'Multiple - closed after second pick');
	inp.datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	$.datepick.add(date1, -7, 'd');
	equalDateArray(inp.datepick('getDate'), [date1], 'Multiple 2 - pick/unpick');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	equalDateArray(inp.datepick('getDate'), [], 'Multiple 2 - clear');
	inp.datepick('hide').val('');
	// Set date
	var today = $.datepick.today();
	inp.datepick('setDate', [date1]);
	equalDateArray(inp.datepick('getDate'), [date1], 'Multiple set date - 1');
	inp.datepick('setDate', [date2, date1]);
	equalDateArray(inp.datepick('getDate'), [date2, date1], 'Multiple set date - 2');
	inp.datepick('setDate', [today, date1, date2]);
	equalDateArray(inp.datepick('getDate'), [today, date1], 'Multiple set date - 3');
	inp.datepick('setDate', [-7, '+1w']);
	equalDateArray(inp.datepick('getDate'), [date1, date2], 'Multiple set date - relative');
	inp.datepick('setDate');
	equalDateArray(inp.datepick('getDate'), [], 'Multiple set date - null');
	inp.datepick('setDate', date1, date2);
	equalDateArray(inp.datepick('getDate'), [date1, date2], 'Multiple set date - non-array');
	// Min/max
	var defaultDate = $.datepick.newDate(2008, 6, 14);
	var minDate = $.datepick.newDate(2008, 6, 10);
	var maxDate = $.datepick.newDate(2008, 6, 18);
	date1 = $.datepick.newDate(2008, 6, 7);
	date2 = $.datepick.newDate(2008, 6, 28);
	inp.datepick('hide').
		datepick('option', {defaultDate: defaultDate, minDate: minDate}).
		val('').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [defaultDate, date2], 'Multiple min');
	inp.datepick('hide').datepick('option', {maxDate: maxDate}).
		val('').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [], 'Multiple min/max');
	inp.datepick('hide').datepick('option', {minDate: null}).
		val('').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(inp.datepick('getDate'), [date1, defaultDate], 'Multiple max');
	inp.datepick('option', {minDate: minDate, maxDate: null}).
		datepick('setDate', [date1, date2]);
	equalDateArray(inp.datepick('getDate'), [date2], 'Multiple min - set');
	inp.datepick('option', {maxDate: maxDate}).
		datepick('setDate', [date1, date2]);
	equalDateArray(inp.datepick('getDate'), [], 'Multiple min/max - set');
	inp.datepick('option', {minDate: null}).
		datepick('setDate', [date1, date2]);
	equalDateArray(inp.datepick('getDate'), [date1], 'Multiple max - set');
	// Alt field
	alt = $('#alt').val('');
	inp.val('');
	inp = init('#inp', {multiSelect: 2, multiSeparator: '+',
		altField: '#alt', altFormat: 'yyyy-mm-dd'});
	date1 = $.datepick.today();
	date2 = $.datepick.add($.datepick.today(), +7, 'd');
	inp.datepick('show');
	equal(alt.val(), '', 'Multiple alt - no dates');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equal(alt.val(), $.datepick.formatDate('yyyy-mm-dd', date1), 'Multiple alt - pick 1');
	inp.datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equal(alt.val(), $.datepick.formatDate('yyyy-mm-dd', date1) + '+' +
		$.datepick.formatDate('yyyy-mm-dd', date2), 'Multiple alt - pick 2');
	inp.datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_UP}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equal(alt.val(), $.datepick.formatDate('yyyy-mm-dd', $.datepick.add(date1, -7, 'd')),
		'Multiple alt - pick/unpick');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	equal(alt.val(), '', 'Multiple alt - clear');
	inp.datepick('hide').val('');
	// Callbacks
	inp = init('#inp', {multiSelect: 2, onSelect: callback, defaultDate: date1}).
		datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(selectedDates, [date1], 'Multiple onSelect date - enter');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(selectedDates, [date1, date2], 'Multiple onSelect date - ctrl+down/enter');
	selectedDates = null;
	inp.datepick('option', {onSelect: null, onClose: callback}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equal(selectedDates, null, 'Multiple onClose date - enter');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(selectedDates, [date1, date2], 'Multiple onClose date - ctrl+down/enter');
	// Inline
	var inl = init('#inl', {multiSelect: 2});
	date1 = $.datepick.day($.datepick.today(), 12);
	date2 = $.datepick.day($.datepick.today(), 19);
	$('tbody a:contains(12)').click();
	$('tbody a:contains(19)').click();
	equalDateArray(inl.datepick('getDate'), [date1, date2],
		'Multiple inline - two days');
	$('tbody a:contains(12)').click(); // Deselects
	equalDateArray(inl.datepick('getDate'), [date2], 'Multiple inline - deselect');
	$('tbody a:contains(12)').click();
	$('tbody a:contains(29)').click();
	equalDateArray(inl.datepick('getDate'), [date2, date1],
		'Multiple  inline - reselect + one');
});

test('Alt field', function() {
	expect(20);
	var inp = init('#inp');
	var alt = $('#alt');
	// No alternate field set
	alt.val('');
	inp.val('06/04/2008').datepick('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equal(inp.val(), '06/04/2008', 'Alt field - dp - enter');
	equal(alt.val(), '', 'Alt field - alt not set');
	// Alternate field set
	alt.val('');
	inp.datepick('option', {altField: '#alt', altFormat: 'yyyy-mm-dd'}).
		val('06/04/2008').datepick('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equal(inp.val(), '06/04/2008', 'Alt field - dp - enter');
	equal(alt.val(), '2008-06-04', 'Alt field - alt - enter');
	// Move from initial date
	alt.val('');
	inp.val('06/04/2008').datepick('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equal(inp.val(), '07/04/2008', 'Alt field - dp - pgdn');
	equal(alt.val(), '2008-07-04', 'Alt field - alt - pgdn');
	// Alternate field set - closed
	alt.val('');
	inp.val('06/04/2008').datepick('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equal(inp.val(), '06/04/2008', 'Alt field - dp - pgdn/esc');
	equal(alt.val(), '', 'Alt field - alt - pgdn/esc');
	// Clear date and alternate
	alt.val('');
	inp.val('06/04/2008').datepick('show');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	equal(inp.val(), '', 'Alt field - dp - ctrl+end');
	equal(alt.val(), '', 'Alt field - alt - ctrl+end');
	// Range select no alternate field set
	alt.val('');
	inp.datepick('option', {rangeSelect: true, altField: '', altFormat: ''}).
		datepick('hide').val('06/04/2008 - 07/14/2008').datepick('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equal(inp.val(), '06/04/2008 - 06/04/2008', 'Alt field range - dp - enter');
	equal(alt.val(), '', 'Alt field range - alt not set');
	// Range select no movement
	alt.val('');
	inp.datepick('option', {altField: '#alt', altFormat: 'yyyy-mm-dd'}).
		datepick('hide').val('06/04/2008 - 07/14/2008').datepick('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equal(inp.val(), '06/04/2008 - 06/04/2008', 'Alt field range - dp - enter');
	equal(alt.val(), '2008-06-04 - 2008-06-04', 'Alt field range - alt - enter');
	// Range select next month
	alt.val('');
	inp.val('06/04/2008 - 07/14/2008').datepick('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equal(inp.val(), '06/04/2008 - 07/04/2008',
		'Alt field range - dp - enter/pgdn/enter');
	equal(alt.val(), '2008-06-04 - 2008-07-04',
		'Alt field range - alt - enter/pgdn/enter');
	// Range select escape
	alt.val('');
	inp.val('06/04/2008 - 07/14/2008').datepick('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equal(inp.val(), '06/04/2008 - 06/04/2008',
		'Alt field range - dp - enter/pgdn/esc');
	equal(alt.val(), '2008-06-04 - 2008-06-04',
		'Alt field range - alt - enter/pgdn/esc');
	// Range select clear
	alt.val('');
	inp.val('06/04/2008 - 07/14/2008').datepick('show');
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {keyCode: $.simulate.VK_PGDN}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	equal(inp.val(), '', 'Alt field range - dp - enter/pgdn/ctrl+end');
	equal(alt.val(), '', 'Alt field range - alt - enter/pgdn/ctrl+end');
});

test('Daylight saving', function() {
	expect(25);
	var inp = init('#inp');
	ok(true, 'Daylight saving - ' + $.datepick.today());
	// Australia, Sydney - AM change, southern hemisphere
	inp.val('04/01/2008').datepick('show');
	$('div.datepick-month a:eq(4)').click();
	equal(inp.val(), '04/05/2008', 'Daylight saving - Australia 04/05/2008');
	inp.val('04/01/2008').datepick('show');
	$('div.datepick-month a:eq(5)').click();
	equal(inp.val(), '04/06/2008', 'Daylight saving - Australia 04/06/2008');
	inp.val('04/01/2008').datepick('show');
	$('div.datepick-month a:eq(6)').click();
	equal(inp.val(), '04/07/2008', 'Daylight saving - Australia 04/07/2008');
	inp.val('10/01/2008').datepick('show');
	$('div.datepick-month a:eq(3)').click();
	equal(inp.val(), '10/04/2008', 'Daylight saving - Australia 10/04/2008');
	inp.val('10/01/2008').datepick('show');
	$('div.datepick-month a:eq(4)').click();
	equal(inp.val(), '10/05/2008', 'Daylight saving - Australia 10/05/2008');
	inp.val('10/01/2008').datepick('show');
	$('div.datepick-month a:eq(5)').click();
	equal(inp.val(), '10/06/2008', 'Daylight saving - Australia 10/06/2008');
	// Brasil, Brasilia - midnight change, southern hemisphere
	inp.val('02/01/2008').datepick('show');
	$('div.datepick-month a:eq(15)').click();
	equal(inp.val(), '02/16/2008', 'Daylight saving - Brasil 02/16/2008');
	inp.val('02/01/2008').datepick('show');
	$('div.datepick-month a:eq(16)').click();
	equal(inp.val(), '02/17/2008', 'Daylight saving - Brasil 02/17/2008');
	inp.val('02/01/2008').datepick('show');
	$('div.datepick-month a:eq(17)').click();
	equal(inp.val(), '02/18/2008', 'Daylight saving - Brasil 02/18/2008');
	inp.val('10/01/2008').datepick('show');
	$('div.datepick-month a:eq(10)').click();
	equal(inp.val(), '10/11/2008', 'Daylight saving - Brasil 10/11/2008');
	inp.val('10/01/2008').datepick('show');
	$('div.datepick-month a:eq(11)').click();
	equal(inp.val(), '10/12/2008', 'Daylight saving - Brasil 10/12/2008');
	inp.val('10/01/2008').datepick('show');
	$('div.datepick-month a:eq(12)').click();
	equal(inp.val(), '10/13/2008', 'Daylight saving - Brasil 10/13/2008');
	// Lebanon, Beirut - midnight change, northern hemisphere
	inp.val('03/01/2008').datepick('show');
	$('div.datepick-month a:eq(28)').click();
	equal(inp.val(), '03/29/2008', 'Daylight saving - Lebanon 03/29/2008');
	inp.val('03/01/2008').datepick('show');
	$('div.datepick-month a:eq(29)').click();
	equal(inp.val(), '03/30/2008', 'Daylight saving - Lebanon 03/30/2008');
	inp.val('03/01/2008').datepick('show');
	$('div.datepick-month a:eq(30)').click();
	equal(inp.val(), '03/31/2008', 'Daylight saving - Lebanon 03/31/2008');
	inp.val('10/01/2008').datepick('show');
	$('div.datepick-month a:eq(24)').click();
	equal(inp.val(), '10/25/2008', 'Daylight saving - Lebanon 10/25/2008');
	inp.val('10/01/2008').datepick('show');
	$('div.datepick-month a:eq(25)').click();
	equal(inp.val(), '10/26/2008', 'Daylight saving - Lebanon 10/26/2008');
	inp.val('10/01/2008').datepick('show');
	$('div.datepick-month a:eq(26)').click();
	equal(inp.val(), '10/27/2008', 'Daylight saving - Lebanon 10/27/2008');
	// US, Eastern - AM change, northern hemisphere
	inp.val('03/01/2008').datepick('show');
	$('div.datepick-month a:eq(7)').click();
	equal(inp.val(), '03/08/2008', 'Daylight saving - US 03/08/2008');
	inp.val('03/01/2008').datepick('show');
	$('div.datepick-month a:eq(8)').click();
	equal(inp.val(), '03/09/2008', 'Daylight saving - US 03/09/2008');
	inp.val('03/01/2008').datepick('show');
	$('div.datepick-month a:eq(9)').click();
	equal(inp.val(), '03/10/2008', 'Daylight saving - US 03/10/2008');
	inp.val('11/01/2008').datepick('show');
	$('div.datepick-month a:eq(0)').click();
	equal(inp.val(), '11/01/2008', 'Daylight saving - US 11/01/2008');
	inp.val('11/01/2008').datepick('show');
	$('div.datepick-month a:eq(1)').click();
	equal(inp.val(), '11/02/2008', 'Daylight saving - US 11/02/2008');
	inp.val('11/01/2008').datepick('show');
	$('div.datepick-month a:eq(2)').click();
	equal(inp.val(), '11/03/2008', 'Daylight saving - US 11/03/2008');
});

test('Is selectable', function() {
	expect(23);
	var inp = init('#inp');
	equal(inp.datepick('isSelectable'), true, 'Is selectable - blank');
	inp.datepick('setDate', +5);
	equal(inp.datepick('isSelectable'), true, 'Is selectable - default');
	equal(inp.datepick('isSelectable', new Date(2010, 1-1, 1)), true,
		'Is selectable - 2010, 1, 1');
	equal(inp.datepick('isSelectable', +10), true, 'Is selectable - +10');
	equal(inp.datepick('isSelectable', '+1m -2d'), true, 'Is selectable - +1m -1d');
	// Minimum
	inp.val('');
	inp = init('#inp', {minDate: -10});
	equal(inp.datepick('isSelectable'), true, 'Is selectable - minDate - blank');
	inp.datepick('setDate', -5);
	equal(inp.datepick('isSelectable'), true, 'Is selectable - minDate - default');
	equal(inp.datepick('isSelectable', new Date(2010, 1-1, 1)), false,
		'Is selectable - minDate - 2010, 1, 1');
	equal(inp.datepick('isSelectable', -10), true, 'Is selectable - minDate - -10');
	equal(inp.datepick('isSelectable', '+1m -2d'), true, 'Is selectable - minDate - +1m -1d');
	// Maximum
	inp.val('');
	inp = init('#inp', {maxDate: +10});
	equal(inp.datepick('isSelectable'), true, 'Is selectable - maxDate - blank');
	inp.datepick('setDate', +5);
	equal(inp.datepick('isSelectable'), true, 'Is selectable - maxDate - default');
	equal(inp.datepick('isSelectable', new Date(2010, 1-1, 1)), true,
		'Is selectable - maxDate - 2010, 1, 1');
	equal(inp.datepick('isSelectable', +10), true, 'Is selectable - maxDate - +10');
	equal(inp.datepick('isSelectable', '+1m -2d'), false, 'Is selectable - maxDate - +1m -1d');
	// onDate
	inp.val('');
	inp = init('#inp', {onDate: function(date) {
		return {selectable: date.getDate() % 2 == 0};
	}});
	var date = new Date();
	equal(inp.datepick('isSelectable'), date.getDate() % 2 == 0, 'Is selectable - onDate - blank');
	inp.datepick('setDate', +5);
	date.setDate(date.getDate() + 5);
	equal(inp.datepick('isSelectable'), date.getDate() % 2 == 0, 'Is selectable - onDate - default');
	equal(inp.datepick('isSelectable', new Date(2010, 1-1, 1)), false,
		'Is selectable - onDate - 2010, 1, 1');
	date.setDate(date.getDate() + 5);
	equal(inp.datepick('isSelectable', +10), date.getDate() % 2 == 0, 'Is selectable - onDate - +10');
	// all
	inp.val('');
	inp = init('#inp', {minDate: -10, maxDate: +10, onDate: function(date) {
		return {selectable: date.getDate() % 2 == 0};
	}});
	var date = new Date();
	equal(inp.datepick('isSelectable'), date.getDate() % 2 == 0, 'Is selectable - all - blank');
	inp.datepick('setDate', +5);
	date.setDate(date.getDate() + 5);
	equal(inp.datepick('isSelectable'), date.getDate() % 2 == 0, 'Is selectable - all - default');
	equal(inp.datepick('isSelectable', new Date(2010, 1-1, 1)), false,
		'Is selectable - all - 2010, 1, 1');
	date.setDate(date.getDate() + 10);
	var count = 15;
	while (date.getDate() % 2 != 0) {
		date.setDate(date.getDate() + 1);
		count++;
	}
	equal(inp.datepick('isSelectable', count), false, 'Is selectable - all - +' + count);
});

var onDateThis = null;
var onDateInMonth = false;
var onDateOK = true;

function checkOnDate(date, inMonth) {
	onDateThis = this;
	onDateInMonth |= inMonth;
	onDateOK &= (date.getTime() > $.datepick.newDate(2008, 1, 26) &&
		date.getTime() < $.datepick.newDate(2008, 3, 6).getTime());
	return {selectable: date.getDate() % 2 == 0, dateClass: (date.getDate() % 10 == 0 ? 'day10' : ''),
		title: (date.getDate() % 3 == 0 ? 'Divisible by 3' : '')};
}

var onShowThis = null;
var onShowPicker = null;
var onShowCalendar = null;
var onShowInst = null;

function checkOnShow(picker, inst) {
	onShowThis = this;
	onShowPicker = picker;
	onShowInst = inst;
	picker.find('td span').text('-');
}

function calcWeek(date) {
	return date.getDate();
}

test('Callbacks', function() {
	expect(16);
	// onDate
	inp = init('#inp', {onDate: checkOnDate});
	inp.val('02/04/2008').datepick('show');
	ok(onDateThis.id == inp[0].id, 'onDate - this OK');
	ok(onDateOK, 'onDate - dates OK');
	var day20 = $('div.datepick-month td *:contains("20")');
	var day21 = $('div.datepick-month td *:contains("21")');
	ok(day20.is('a'), 'onDate - selectable 20');
	ok(!day21.is('a'), 'onDate - selectable 21');
	ok(day20.hasClass('day10'), 'onDate - CSS 20');
	ok(!day21.hasClass('day10'), 'onDate - CSS 21');
	equal(day20.attr('title'), 'Select Wednesday, Feb 20, 2008', 'onDate - title 20');
	equal(day21.attr('title'), 'Divisible by 3', 'onDate - title 21');
	inp.datepick('hide').datepick('destroy');
	// onShow
	var inp = init('#inp', {onShow: checkOnShow});
	inp.datepick('show');
	var inst = inp.data('datepick');
	equal($('div.datepick-month td span').text(), '------', 'onShow - updated');
	ok(onShowThis.id == inp[0].id, 'onShow - this OK');
	ok(onShowPicker.is('div.datepick'), 'onShow - picker OK');
	deepEqual(onShowInst, inst, 'onShow - inst OK');
	inp.datepick('hide').datepick('destroy');
	// Calculate week
	inp = init('#inp', {calculateWeek: calcWeek, renderer: $.datepick.weekOfYearRenderer});
	inp.val('02/04/2008').datepick('show');
	equal($('td.datepick-week:first').text(), 27, 'Calculate week - default first');
	equal($('td.datepick-week:last').text(), 24, 'Calculate week - default last');
	// Make Tuesday first
	inp.datepick('hide').datepick('option', {firstDay: 2}).datepick('show');
	equal($('td.datepick-week:first').text(), 29, 'Calculate week - firstDay first');
	equal($('td.datepick-week:last').text(), 26, 'Calculate week - firstDay last');
	inp.datepick('hide').datepick('destroy');
});

var selectedThis = null;
var selectedDates = null;
var selectedSelect = null;

function hover(date, selectable) {
	selectedThis = this;
	selectedDates = date;
	selectedSelect = selectable;
}

function callback(dates) {
	selectedThis = this;
	selectedDates = dates;
}

function callback2(year, month) {
	selectedThis = this;
	selectedDates = year + '/' + month;
}

test('Events', function() {
	expect(36);
	var inp = init('#inp', {onShow: $.datepick.hoverCallback(hover)});
	var date = $.datepick.today();
	// onHover
	inp.val('01/01/2009').datepick('show');
	$('a:contains(20)').simulate('mouseover');
	equal(selectedThis, inp[0], 'Callback hover over this');
	equalDate(selectedDates, $.datepick.newDate(2009, 1, 20), 'Callback hover over date');
	equal(selectedSelect, true, 'Callback hover over selectable');
	$('a:contains(20)').simulate('mouseout');
	equal(selectedThis, inp[0], 'Callback hover out this');
	equal(selectedDates, null, 'Callback hover out date');
	equal(selectedSelect, null, 'Callback hover out selectable');
	selectedThis = selectedDates = selectedInst = null;
	$('tbody span:first').simulate('mouseover'); // over empty day cell
	equal(selectedThis, inp[0], 'Callback hover over empty this');
	equalDate(selectedDates, $.datepick.newDate(2008, 12, 28), 'Callback hover over empty date');
	equal(selectedSelect, false, 'Callback hover over empty selectable');
	// onSelect
	inp.datepick('hide').datepick('option',
		{onSelect: callback, renderer: $.datepick.defaultRenderer}).
		val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equal(selectedThis, inp[0], 'Callback selected this');
	equalDateArray(selectedDates, [date], 'Callback selected date');
	inp.val('').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(selectedDates, [$.datepick.add(date, +7, 'd')], 'Callback selected date - ctrl+down');
	inp.val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalDateArray(selectedDates, [date], 'Callback selected date - esc');
	// onChangeMonthYear
	selectedDates = null;
	inp.datepick('option', {onChangeMonthYear: callback2, onSelect: null}).
		val('').datepick('show');
	var newMonthYear = function(date) {
		return date.getFullYear() + '/' + (date.getMonth() + 1);
	};
	date = $.datepick.add($.datepick.day($.datepick.today(), 1), -1, 'm');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGUP});
	equal(selectedThis, inp[0], 'Callback change month/year this');
	equal(selectedDates, newMonthYear(date), 'Callback change month/year value - pgup');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN});
	equal(selectedDates, newMonthYear($.datepick.add(date, +1, 'm')), 'Callback change month/year value - pgdn');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP});
	equal(selectedDates, newMonthYear($.datepick.add(date, -1, 'y')),
		'Callback change month/year value - ctrl+pgup');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_HOME});
	equal(selectedDates, newMonthYear($.datepick.add(date, +1, 'y')),
		'Callback change month/year value - ctrl+home');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN});
	equal(selectedDates, newMonthYear($.datepick.add(date, +1, 'y')),
		'Callback change month/year value - ctrl+pgdn');
	inp.datepick('setDate', $.datepick.newDate(2007, 1, 26));
	equal(selectedDates, '2007/1', 'Callback change month/year value - setDate');
	selectedDates = null;
	inp.datepick('setDate', $.datepick.newDate(2007, 1, 12));
	equal(selectedDates, null, 'Callback change month/year value - setDate no change');
	// onChangeMonthYear step by 2
	inp.datepick('option', {monthsToStep: 2}).
		datepick('hide').val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_PGUP});
	equal(selectedDates, newMonthYear($.datepick.add(date, -14, 'm')),
		'Callback change month/year by 2 value - pgup');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGUP});
	equal(selectedDates, newMonthYear($.datepick.add(date, -12, 'm')),
		'Callback change month/year by 2 value - ctrl+pgup');
	inp.simulate('keydown', {keyCode: $.simulate.VK_PGDN});
	equal(selectedDates, newMonthYear($.datepick.add(date, +2, 'm')),
		'Callback change month/year by 2 value - pgdn');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_PGDN});
	equal(selectedDates, newMonthYear($.datepick.add(date, +12, 'm')),
		'Callback change month/year by 2 value - ctrl+pgdn');
	// onClose
	inp.datepick('option', {onClose: callback, onChangeMonthYear: null, monthsToStep: 1}).
		val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equal(selectedThis, inp[0], 'Callback close this');
	equalDateArray(selectedDates, [], 'Callback close date - esc');
	inp.val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(selectedDates, [$.datepick.today()], 'Callback close date - enter');
	inp.val('02/04/2008').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalDateArray(selectedDates, [$.datepick.newDate(2008, 2, 4)], 'Callback close date - preset');
	inp.val('02/04/2008').datepick('show').
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_END});
	equalDateArray(selectedDates, [], 'Callback close date - ctrl+end');
	// Range onHover
	inp.datepick('option',
		{onClose: null, onShow: $.datepick.hoverCallback(hover), rangeSelect: true}).
		val('01/01/2009').datepick('show');
	$('a:contains(20)').simulate('mouseover');
	equalDate(selectedDates, $.datepick.newDate(2009, 1, 20), 'Callback range hover over date');
	$('a:contains(20)').simulate('mouseout');
	equal(selectedDates, null, 'Callback range hover out date');
	// Range onSelect
	date = $.datepick.today();
	inp.datepick('hide').datepick('option', {onSelect: callback, onHover: null}).
		val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(selectedDates, [date, date], 'Callback range selected date');
	inp.simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	var date2 = $.datepick.add($.datepick.today(), +7, 'd');
	equalDateArray(selectedDates, [date, date2], 'Callback range selected date - ctrl+down');
	// Range onClose
	inp.datepick('option', {onClose: callback, onSelect: null}).
		val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ESC});
	equalDateArray(selectedDates, [], 'Callback range close date - esc');
	inp.val('').datepick('show').
		simulate('keydown', {keyCode: $.simulate.VK_ENTER}).
		simulate('keydown', {ctrlKey: true, keyCode: $.simulate.VK_DOWN}).
		simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	equalDateArray(selectedDates, [date, date2], 'Callback range close date - enter');
});

function highlight20(date) {
	return {title: (date.getDate() == 20 ? '*** 20 ***' : 'Select ' + date.getDate())};
}

test('Status', function() {
	expect(15);
	var inp = init('#inp', {renderer: $.datepick.weekOfYearRenderer,
		onDate: highlight20,
		onShow: $.datepick.multipleEvents(
		$.datepick.changeFirstDay, $.datepick.showStatus)});
	inp.val('10/01/2009').datepick('show');
	var status = $('div.datepick-status');
	ok(status.length == 1, 'Status - present');
	equal(status.text(), 'Select a date', 'Status - default');
	$('a.datepick-cmd-clear').simulate('mouseover');
	equal(status.text(), 'Clear all the dates', 'Status - clear');
	$('a.datepick-cmd-close').simulate('mouseover');
	equal(status.text(), 'Close the datepicker', 'Status - close');
	$('a.datepick-cmd-prev').simulate('mouseover');
	equal(status.text(), 'Show the previous month', 'Status - previous');
	$('a.datepick-cmd-today').simulate('mouseover');
	equal(status.text(), 'Show today\'s month', 'Status - today');
	$('a.datepick-cmd-next').simulate('mouseover');
	equal(status.text(), 'Show the next month', 'Status - next');
	$('div.datepick-month-header select:first').simulate('mouseover');
	equal(status.text(), 'Change the month', 'Status - new month');
	$('div.datepick-month-header select:last').simulate('mouseover');
	equal(status.text(), 'Change the year', 'Status - new year');
	$('th:first span').simulate('mouseover');
	equal(status.text(), 'Week of the year', 'Status - week header');
	var day = 0;
	$('th:eq(1) a').simulate('mouseover');
	equal(status.text(), 'Change first day of the week', 'Status - day header');
	day = 0;
	var month = $.datepick.defaultOptions.monthNamesShort[$.datepick.today().getMonth()];
	$('div.datepick-month tr:eq(1) a').each(function() {
		$(this).simulate('mouseover');
		equal(status.text(), 'Select ' + $(this).text(), 'Status - dates');
		day++;
	});
	$('div.datepick-month a:contains("20")').each(function() {
		$(this).simulate('mouseover');
		equal(status.text(), '*** 20 ***', 'Status - dates');
	});
	inp.datepick('hide').datepick('destroy');
});

test('Change first day', function() {
	expect(6);
	var inp = init('#inp');
	inp.datepick('show');
	ok($('div.datepick th a').length == 0, 'Change first day - can\'t initially');
	equal($('div.datepick th:first').text(), 'Su', 'Change first day - initial first day');
	inp.datepick('hide').datepick('destroy');
	inp = init('#inp', {onShow: $.datepick.changeFirstDay});
	inp.datepick('show');
	ok($('div.datepick th a').length == 7, 'Change first day - can change');
	equal($('div.datepick th:first').text(), 'Su', 'Change first day - initial first day');
	$('div.datepick th:eq(1) a').simulate('click');
	equal($('div.datepick th:first').text(), 'Mo', 'Change first day - changed first day');
	$('div.datepick th:eq(1) a').simulate('click');
	equal($('div.datepick th:first').text(), 'Tu', 'Change first day - changed first day');
	inp.datepick('hide').datepick('destroy');
});

test('Localisation', function() {
	expect(21);
	var french = $.datepick.regionalOptions['fr'];
	var inp = init('#inp', french);
	inp.datepick('option', {dateFormat: 'DD, d MM yyyy',
		renderer: $.datepick.weekOfYearRenderer,
		onShow: $.datepick.multipleEvents(
			$.datepick.changeFirstDay, $.datepick.showStatus)}).
		val('').datepick('show');
	var status = $('div.datepick-status');
	equal($('a.datepick-cmd-clear').text(), 'Effacer', 'Localisation - clear');
	equal($('a.datepick-cmd-close').text(), 'Fermer', 'Localisation - close');
	$('a.datepick-cmd-close').simulate('mouseover');
	equal(status.text(), 'Fermer sans modifier', 'Localisation - status');
	equal($('a.datepick-cmd-prev').text(), '<Préc', 'Localisation - previous');
	equal($('a.datepick-cmd-today').text(), 'Aujourd\'hui', 'Localisation - today');
	equal($('a.datepick-cmd-next').text(), 'Suiv>', 'Localisation - next');
	var month = 0;
	$('div.datepick-month-header select:first option').each(function() {
		equal($(this).text(), french.monthNames[month],
			'Localisation - month ' + month);
		month++;
	});
	equal($('thead th:first').text(), french.weekText, 'Localisation - week header');
	var day = 1;
	equal($('thead a:first').text(), french.dayNamesMin[day], 'Localisation - day ' + day);
	inp.simulate('keydown', {keyCode: $.simulate.VK_ENTER});
	var date = $.datepick.today();
	equal(inp.val(), french.dayNames[date.getDay()] + ', ' +
		date.getDate() + ' ' + french.monthNames[date.getMonth()] +
		' ' + date.getFullYear(), 'Localisation - formatting');
});

test('No weekends', function() {
	expect(31);
	for (var i = 1; i <= 31; i++) {
		var date = $.datepick.newDate(2001, 1, i);
		deepEqual($.datepick.noWeekends(date), {selectable: (i + 1) % 7 >= 2},
			'No weekends ' + date);
	}
});

test('Validation', function() {
	expect(63);
	var frm = $('#frm');
	frm.validate({errorPlacement: $.datepick.errorPlacement, rules: {inp: 'dpDate'}});
	var inp = init('#inp');
	var date = $.datepick.today();
	var getError = function() {
		return (inp.siblings('label:visible').length == 0 ? '' : inp.siblings('label').text());
	};
	inp.val('');
	frm.valid();
	equal(getError(), '', 'Validate - blank');
	inp.datepick('show');
	var dp = $('div.datepick');
	$('tbody a:contains(10)').click();
	$.datepick.day(date, 10);
	equalDate(inp.datepick('getDate'), date, 'Select 10th');
	equal(getError(), '', 'Validate - 10th');
	inp.val('92/04/2008');
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate - 92/04/2008');
	inp.val('02-04/2008');
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate - 02-04/2008');
	inp.val('02/04/2008x');
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate - 02/04/2008x');
	inp.val('02/04/2008');
	frm.valid();
	equal(getError(), '', 'Validate - 02/04/2008');
	inp.datepick('option', {dateFormat: 'yyyy-mm-dd'});
	inp.val('02/04/2008');
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate - 02/04/2008');
	inp.val('2008-02-04');
	frm.valid();
	equal(getError(), '', 'Validate - 2008-02-04');
	// Messages
	$.datepick.setDefaults({validateDate: 'Wrong date'});
	inp.val('92/04/2008');
	frm.valid();
	equal(getError(), 'Wrong date', 'Validate - 92/04/2008');
	$.datepick.setDefaults({validateDate: 'Please enter a valid date'});
	// Range
	inp.datepick('option', {rangeSelect: true, dateFormat: 'mm/dd/yyyy'});
	inp.val('');
	frm.valid();
	equal(getError(), '', 'Validate range - blank');
	inp.datepick('show');
	$('tbody a:contains(10)').click();
	$('tbody a:contains(20)').click();
	equalDate(inp.datepick('getDate')[0], $.datepick.day(date, 10), 'Select start - 10th');
	equalDate(inp.datepick('getDate')[1], $.datepick.day(date, 20), 'Select end - 20th');
	equal(getError(), '', 'Validate range - 10th - 20th');
	inp.val('92/04/2008 - 12/04/2008');
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate range - 92/04/2008 - 12/04/2008');
	inp.val('02-04/2008 - 12/04/2008');
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate range - 02-04/2008 - 12/04/2008');
	inp.val('02/04/2008 + 12/04/2008');
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate range - 02/04/2008 + 12/04/2008');
	inp.val('02/04/2008 - 12/94/2008');
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate range - 02/04/2008 - 12/94/2008');
	inp.val('02/04/2008 - 12/042008');
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate range - 02/04/2008 - 12/042008');
	inp.val('02/04/2008 - 12/04/2008');
	frm.valid();
	equal(getError(), '', 'Validate range - 02/04/2008 - 12/04/2008');
	inp.val('12/04/2008 - 02/04/2008'); // Start > end
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate range - 12/04/2008 - 02/04/2008');
	inp.datepick('option', {dateFormat: 'yyyy-mm-dd'});
	inp.val('02/04/2008 - 12/04/008');
	frm.valid();
	equal(getError(), 'Please enter a valid date',
		'Validate range - 02/04/2008 - 12/04/008');
	inp.val('2008-02-04 - 2008-12-04');
	frm.valid();
	equal(getError(), '', 'Validate range - 2008-02-04 - 2008-12-04');
	// Multiple
	inp.datepick('option', {rangeSelect: false, multiSelect: 2, dateFormat: 'mm/dd/yyyy'});
	inp.val('');
	frm.valid();
	equal(getError(), '', 'Validate multiple - blank');
	inp.datepick('show');
	$('tbody a:contains(10)').click();
	$('tbody a:contains(20)').click();
	equalDate(inp.datepick('getDate')[0], $.datepick.day(date, 10), 'Select 1 - 10th');
	equalDate(inp.datepick('getDate')[1], $.datepick.day(date, 20), 'Select 2 - 20th');
	equal(getError(), '', 'Validate multiple - 10th, 20th');
	inp.val('92/04/2008,12/04/2008');
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate multiple - 92/04/2008,12/04/2008');
	inp.val('02-04/2008,12/04/2008');
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate multiple - 02-04/2008,12/04/2008');
	inp.val('02/04/2008+12/04/2008');
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate multiple - 02/04/2008+12/04/2008');
	inp.val('02/04/2008,12/94/2008');
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate multiple - 02/04/2008,12/94/2008');
	inp.val('02/04/2008,12/042008');
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate multiple - 02/04/2008,12/042008');
	inp.val('02/04/2008,12/04/2008');
	frm.valid();
	equal(getError(), '', 'Validate multiple - 02/04/2008,12/04/2008');
	inp.val('12/04/2008,02/04/2008'); // Start > end
	frm.valid();
	equal(getError(), '', 'Validate multiple - 12/04/2008,02/04/2008');
	inp.datepick('option', {dateFormat: 'yyyy-mm-dd'});
	inp.val('02/04/2008,12/04/008');
	frm.valid();
	equal(getError(), 'Please enter a valid date', 'Validate multiple - 02/04/2008,12/04/008');
	inp.val('2008-02-04,2008-12-04');
	frm.valid();
	equal(getError(), '', 'Validate multiple - 2008-02-04,2008-12-04');
	// Min date
	inp.datepick('option', {multiSelect: false, dateFormat: 'mm/dd/yyyy',
		minDate: $.datepick.newDate(2008, 1, 26)});
	inp.val('');
	frm.valid();
	equal(getError(), '', 'Validate minimum - blank');
	inp.val('12/04/2008');
	frm.valid();
	equal(getError(), '', 'Validate minimum - 12/04/2008');
	inp.val('01/04/2008');
	frm.valid();
	equal(getError(), 'Please enter a date on or after 01/26/2008', 
		'Validate minimum - 01/04/2008');
	inp.val('01/25/2008');
	frm.valid();
	equal(getError(), 'Please enter a date on or after 01/26/2008',
		'Validate minimum - 01/25/2008');
	inp.val('01/26/2008');
	frm.valid();
	equal(getError(), '', 'Validate minimum - 01/26/2008');
	inp.datepick('option', {dateFormat: 'yyyy-mm-dd'}).
		val('01/30/2008').datepick('show');
	frm.valid();
	equal(getError(), 'Please enter a date on or after 2008-01-26',
		'Validate minimum - 01/30/2008');
	inp.val('2008-01-30');
	frm.valid();
	equal(getError(), '', 'No error message - 2008-01-30');
	// Max date
	inp.datepick('option', {minDate: null, dateFormat: 'mm/dd/yyyy',
		maxDate: $.datepick.newDate(2009, 1, 26)});
	inp.val('');
	frm.valid();
	equal(getError(), '', 'Validate maximum - blank');
	inp.val('12/04/2008');
	frm.valid();
	equal(getError(), '', 'Validate maximum - 12/04/2008');
	inp.val('01/31/2009');
	frm.valid();
	equal(getError(), 'Please enter a date on or before 01/26/2009', 
		'Validate maximum - 01/31/2009');
	inp.val('01/27/2009');
	frm.valid();
	equal(getError(), 'Please enter a date on or before 01/26/2009',
		'Validate maximum - 01/27/2009');
	inp.val('01/26/2009');
	frm.valid();
	equal(getError(), '', 'Validate maximum - 01/26/2009');
	inp.datepick('option', {dateFormat: 'yyyy-mm-dd'}).
		val('01/20/2009').datepick('show');
	frm.valid();
	equal(getError(), 'Please enter a date on or before 2009-01-26',
		'Validate maximum - 01/20/2009');
	inp.val('2009-01-20');
	frm.valid();
	equal(getError(), '', 'Validate maximum - 2009-01-20');
	// Min/max date
	inp.datepick('option', {dateFormat: 'mm/dd/yyyy',
		minDate: $.datepick.newDate(2008, 1, 26)});
	inp.val('');
	frm.valid();
	equal(getError(), '', 'Validate minimum/maximum - blank');
	inp.val('12/04/2008');
	frm.valid();
	equal(getError(), '', 'Validate minimum/maximum - 12/04/2008');
	inp.val('01/04/2008');
	frm.valid();
	equal(getError(), 'Please enter a date between 01/26/2008 and 01/26/2009',
		'Validate minimum/maximum - 01/04/2008');
	inp.val('01/25/2008');
	frm.valid();
	equal(getError(), 'Please enter a date between 01/26/2008 and 01/26/2009',
		'Validate minimum/maximum - 01/25/2008');
	inp.val('01/26/2008');
	frm.valid();
	equal(getError(), '', 'Validate minimum/maximum - 01/26/2008');
	inp.val('01/31/2009');
	frm.valid();
	equal(getError(), 'Please enter a date between 01/26/2008 and 01/26/2009',
		'Validate minimum/maximum - 01/31/2009');
	inp.val('01/27/2009');
	frm.valid();
	equal(getError(), 'Please enter a date between 01/26/2008 and 01/26/2009',
		'Validate minimum/maximum - 01/27/2009');
	inp.val('01/26/2009');
	frm.valid();
	equal(getError(), '', 'Validate minimum/maximum - 01/26/2009');
	inp.datepick('option', {dateFormat: 'yyyy-mm-dd'}).
		val('01/20/2009').datepick('show');
	frm.valid();
	equal(getError(), 'Please enter a date between 2008-01-26 and 2009-01-26',
		'Validate minimum/maximum - 01/20/2009');
	inp.val('2009-01-20');
	frm.valid();
	equal(getError(), '', 'Validate minimum/maximum - 2009-01-20');
	inp.datepick('hide');
	// onDate callback
	var noEvens = function(date) {
		return {selectable: date.getDate() % 2 == 1, dateClass:
			date.getDate() % 2 ? 'odd' : 'even'};
	};
	inp.datepick('option', {dateFormat: 'mm/dd/yyyy', onDate: noEvens});
	inp.val('01/25/2008');
	frm.valid();
	equal(getError(), 'Please enter a date between 01/26/2008 and 01/26/2009',
		'Validate onDate - 01/25/2008');
	inp.val('01/26/2008');
	frm.valid();
	equal(getError(), 'Please enter a date between 01/26/2008 and 01/26/2009',
		'Validate onDate - 01/26/2008');
	inp.val('01/27/2008');
	frm.valid();
	equal(getError(), '', 'Validate onDate - 01/27/2008');
});

test('Validation compare', function() {
	expect(75);
	var frm = $('#frm');
	frm.validate({errorPlacement: $.datepick.errorPlacement,
		rules: {inp: {dpCompareDate: ['equal', '#alt']}}});
	var inp = init('#inp');
	var alt = init('#alt');
	var getError = function() {
		return (inp.siblings('label:visible').length == 0 ? '' : inp.siblings('label').text());
	};
	inp.val('');
	frm.valid();
	equal(getError(), '', 'Validate compare - blank');
	inp.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010, blank');
	// equal/notEqual/before/after/notBefore/notAfter
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), 'Please enter a date equal to the other date',
		'Validate compare - 12/25/2010 equal 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 equal 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), 'Please enter a date equal to the other date',
		'Validate compare - 12/25/2010 equal 12/26/2010');
	inp.rules('add', {dpCompareDate: {notEqual: '#alt'}});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 notEqual 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), 'Please enter a date not equal to the other date',
		'Validate compare - 12/25/2010 notEqual 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 notEqual 12/26/2010');
	inp.rules('add', {dpCompareDate: ['before', '#alt']});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), 'Please enter a date before the other date',
		'Validate compare - 12/25/2010 before 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), 'Please enter a date before the other date',
		'Validate compare - 12/25/2010 before 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 before 12/26/2010');
	inp.rules('add', {dpCompareDate: ['after', '#alt']});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 after 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), 'Please enter a date after the other date',
		'Validate compare - 12/25/2010 after 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), 'Please enter a date after the other date',
		'Validate compare - 12/25/2010 after 12/26/2010');
	inp.rules('add', {dpCompareDate: 'notBefore #alt'});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 notBefore 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 notBefore 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), 'Please enter a date not before the other date',
		'Validate compare - 12/25/2010 notBefore 12/26/2010');
	inp.rules('add', {dpCompareDate: 'notAfter #alt'});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), 'Please enter a date not after the other date',
		'Validate compare - 12/25/2010 notAfter 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 notAfter 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 notAfter 12/26/2010');
	// eq/ne/lt/gt/ge/le
	inp.rules('add', {dpCompareDate: 'eq #alt'});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), 'Please enter a date equal to the other date',
		'Validate compare - 12/25/2010 eq 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 eq 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), 'Please enter a date equal to the other date',
		'Validate compare - 12/25/2010 eq 12/26/2010');
	inp.rules('add', {dpCompareDate: {ne: alt}});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 ne 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), 'Please enter a date not equal to the other date',
		'Validate compare - 12/25/2010 ne 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 ne 12/26/2010');
	inp.rules('add', {dpCompareDate: {lt: alt[0]}});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), 'Please enter a date before the other date',
		'Validate compare - 12/25/2010 lt 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), 'Please enter a date before the other date',
		'Validate compare - 12/25/2010 lt 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 lt 12/26/2010');
	inp.rules('add', {dpCompareDate: ['gt', '#alt']});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 gt 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), 'Please enter a date after the other date',
		'Validate compare - 12/25/2010 gt 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), 'Please enter a date after the other date',
		'Validate compare - 12/25/2010 gt 12/26/2010');
	inp.rules('add', {dpCompareDate: 'ge #alt'});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 ge 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 ge 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), 'Please enter a date not before the other date',
		'Validate compare - 12/25/2010 ge 12/26/2010');
	inp.rules('add', {dpCompareDate: ['le', alt[0]]});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), 'Please enter a date not after the other date',
		'Validate compare - 12/25/2010 le 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 le 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 le 12/26/2010');
	// same/notSame/lessThan/greaterThan/notLessThan/notGreaterThan
	inp.rules('add', {dpCompareDate: 'same #alt'});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), 'Please enter a date equal to the other date',
		'Validate compare - 12/25/2010 same 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 same 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), 'Please enter a date equal to the other date',
		'Validate compare - 12/25/2010 same 12/26/2010');
	inp.rules('add', {dpCompareDate: {notSame: alt}});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 notSame 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), 'Please enter a date not equal to the other date',
		'Validate compare - 12/25/2010 notSame 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 notSame 12/26/2010');
	inp.rules('add', {dpCompareDate: {lessThan: alt[0]}});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), 'Please enter a date before the other date',
		'Validate compare - 12/25/2010 lessThan 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), 'Please enter a date before the other date',
		'Validate compare - 12/25/2010 lessThan 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 lessThan 12/26/2010');
	inp.rules('add', {dpCompareDate: ['greaterThan', '#alt']});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 greaterThan 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), 'Please enter a date after the other date',
		'Validate compare - 12/25/2010 greaterThan 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), 'Please enter a date after the other date',
		'Validate compare - 12/25/2010 greaterThan 12/26/2010');
	inp.rules('add', {dpCompareDate: 'notLessThan #alt'});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 notLessThan 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 notLessThan 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), 'Please enter a date not before the other date',
		'Validate compare - 12/25/2010 notLessThan 12/26/2010');
	inp.rules('add', {dpCompareDate: ['notGreaterThan', alt[0]]});
	alt.datepick('setDate', '12/24/2010');
	frm.valid();
	equal(getError(), 'Please enter a date not after the other date',
		'Validate compare - 12/25/2010 notGreaterThan 12/24/2010');
	alt.datepick('setDate', '12/25/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 notGreaterThan 12/25/2010');
	alt.datepick('setDate', '12/26/2010');
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2010 notGreaterThan 12/26/2010');
	// Today
	inp.datepick('setDate', '12/25/2009');
	inp.rules('add', {dpCompareDate: 'equal today'});
	frm.valid();
	equal(getError(), 'Please enter a date equal to today', 'Validate compare - 12/25/2009 equal today');
	inp.rules('add', {dpCompareDate: {ne: 'today'}});
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2009 ne today');
	inp.rules('add', {dpCompareDate: {lessThan: 'today'}});
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2009 lessThan today');
	inp.rules('add', {dpCompareDate: ['after', 'today']});
	frm.valid();
	equal(getError(), 'Please enter a date after today', 'Validate compare - 12/25/2009 after today');
	inp.rules('add', {dpCompareDate: 'ge today'});
	frm.valid();
	equal(getError(), 'Please enter a date not before today', 'Validate compare - 12/25/2009 ge today');
	inp.rules('add', {dpCompareDate: ['notGreaterThan', 'today']});
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2009 notGreaterThan today');
	// Other date
	inp.rules('add', {dpCompareDate: 'equal 12/25/2009'});
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2009 equal 12/25/2009');
	inp.rules('add', {dpCompareDate: {ne: $.datepick.newDate(2009, 12, 25)}});
	frm.valid();
	equal(getError(), 'Please enter a date not equal to 12/25/2009',
		'Validate compare - 12/25/2009 ne newDate(2009, 12, 25)');
	inp.rules('add', {dpCompareDate: {lessThan: '01/01/2010'}});
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/25/2009 lessThan 01/01/2010');
	inp.rules('add', {dpCompareDate: ['after', new Date(2010, 1 - 1, 1)]});
	frm.valid();
	equal(getError(), 'Please enter a date after 01/01/2010',
		'Validate compare - 12/25/2009 after newDate(2010, 1, 1)');
	inp.rules('add', {dpCompareDate: ['notGreaterThan', '01/01/2009']});
	frm.valid();
	equal(getError(), 'Please enter a date not after 01/01/2009',
		'Validate compare - 12/25/2009 notGreaterThan 01/01/2009');
	// Range
	inp.datepick('option', {rangeSelect: true}).
		datepick('setDate', '12/01/2009', '12/31/2009').
		rules('add', {dpCompareDate: 'equal 12/25/2009'});
	frm.valid();
	equal(getError(), 'Please enter a date equal to 12/25/2009',
		'Validate compare - 12/01/2009-12/31/2009 equal 12/25/2009');
	inp.rules('add', {dpCompareDate: {ne: $.datepick.newDate(2009, 12, 25)}});
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/01/2009-12/31/2009 ne newDate(2009, 12, 25)');
	// Multiple
	inp.datepick('option', {multiSelect: 3, rangeSelect: false}).
		datepick('setDate', ['12/01/2009', '12/15/2009', '12/31/2009']).
		rules('add', {dpCompareDate: 'before 01/01/2010'});
	frm.valid();
	equal(getError(), '', 'Validate compare - 12/01/2009,12/15/2009,12/31/2009 before 01/01/2010');
	inp.rules('add', {dpCompareDate: {after: new Date(2009, 12 - 1, 5)}});
	frm.valid();
	equal(getError(), 'Please enter a date after 12/05/2009',
		'Validate compare - 12/01/2009,12/15/2009,12/31/2009 after newDate(2009, 12, 5)');
	// Localisation
	$.datepick.setDefaults({validateDateCompare: 'Field must be {0} {1}',
		validateDateToday: 'now', validateDateOther: 'something else',
		validateDateEQ: 'eq', validateDateNE: 'ne', validateDateLT: 'lt',
		validateDateGT: 'gt', validateDateLE: 'le', validateDateGE: 'ge'});
	inp.datepick('option', {rangeSelect: false}).datepick('setDate', '12/25/2009').
		rules('add', {dpCompareDate: 'equal 12/25/2010'});
	frm.valid();
	equal(getError(), 'Field must be eq 12/25/2010',
		'Validate compare - localise - 12/25/2009 equal 12/25/2010');
	inp.rules('add', {dpCompareDate: {ne: $.datepick.newDate(2009, 12, 25)}});
	frm.valid();
	equal(getError(), 'Field must be ne 12/25/2009',
		'Validate compare - localise - 12/25/2009 ne newDate(2009, 12, 25)');
	inp.rules('add', {dpCompareDate: {notLessThan: '#alt'}});
	frm.valid();
	equal(getError(), 'Field must be ge something else',
		'Validate compare - localise - 12/25/2009 notLessThan #alt');
	inp.rules('add', {dpCompareDate: ['after', 'today']});
	frm.valid();
	equal(getError(), 'Field must be gt now',
		'Validate compare - localise - 12/25/2009 after today');
});

});
