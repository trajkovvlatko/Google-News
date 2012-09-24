document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    db = window.openDatabase("test", "1.0", "Test DB", 1000000);
    db.transaction(populateDB, errorCB, successCB);
    
}

function populateDB(tx) {
     //tx.executeSql("DROP TABLE IF EXISTS news");
     tx.executeSql("CREATE TABLE IF NOT EXISTS news (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, title, link, desc, category)");
   	 //tx.executeSql("DELETE FROM news");
}

function truncateNewsTable(tx){
	tx.executeSql("DELETE FROM news");
}

function insertItems(tx){
	$.each(arrItems, function(i, item){
		for(i = 0; i < 4; i++){
			item[i] = item[i].replace("'", "\'");
		}
		tx.executeSql("INSERT INTO news (title, link, desc, category) VALUES (?, ?, ?, ?)", [item[0], item[1], item[2], item[3]]);
	});    
}

function errorCB(tx, err) {
    alert("Error processing SQL: "+err);
}

function successCB() {
    alert("success!");
}

function errorGetItemsByCategory(tx, err) {
    alert("Error processing SQL: "+err);
}

function successGetItemsByCategory() {
    alert("success!");
}

function errorInsertItems(tx, err) {
    alert("Error processing SQL: "+err);
}

function successInsertItems() {
   // alert("inserted item!");
}

function showAllNews(tx){
	tx.executeSql('SELECT * FROM news', [], showAllNewsSuccess, errorCB);
}

function showAllNewsSuccess(tx, results) {
	printOneItem(results);
}


function successGetItemsByCategory(tx, results){
	printOneItem(results);
}

function getItemsByCategory(tx){
	tx.executeSql('SELECT * FROM news WHERE category = ?', [selectedTopic], successGetItemsByCategory, errorCB);
}

function printOneItem(results){
	var len = results.rows.length;
	for (var i=0; i<len; i++){
		var title = results.rows.item(i).title;
		if(title.length > 70){
			title = title.substring(0,70) + "...";
		}
        $(".news").append("<div class='title'>" + title + "</div><div class='desc'><br />" + results.rows.item(i).desc + "</div><br />");
    }
}
