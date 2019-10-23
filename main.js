angular.module('KRRclass', [ 'chart.js']).controller('MainCtrl', ['$scope','$http', mainCtrl]);

//var uluru = {lat: 52.334518, lng: 4.866753};

var globalOne =  {lat: 52.334518, lng: 4.866753};
var wine_list  = []

function initMap() {
  // The location of Uluru
  //var uluru = {lat: 52.334518, lng: 4.866753};

  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 6, center: globalOne});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: globalOne, map: map});
}






/////////////////////////////////


function onRowClick(tableId, callback) {
    var table = document.getElementById(tableId),
        rows = table.getElementsByTagName("tr"),
        i;
        console.log("value>>");
    for (i = 0; i < rows.length; i++) {
        table.rows[i].onclick = function (row) {
            return function () {
                callback(row);
            };
        }(table.rows[i]);
    }
};
 
onRowClick("winetable", function (row){
    var value = row.getElementsByTagName("td")[0].innerHTML;
    document.getElementById('click-response').innerHTML = value + " clicked!";
    console.log("value>>", value);
});

function abacaxi(){
	console.log(this)
}







//////////////////////////



function mainCtrl($scope, $http, ChartJsProvider){
  	

	// ###################### Question 6 	
	// Create an interaction with the triplestore by filling the following method 
	// The function needs to include : some arguments sent by the html + an http call to the sparql endpoint + a variable storing the results to be visualised    
	// use the native function encodeURI(mySparqlQuery) to encode your query as a URL
	//$scope.map_coordinates = {lat: 52.334518, lng: 4.866753};


	$scope.myendpoint = "http://localhost:7200/repositories/final?query=";
	


	$scope.doMyAction  = function(){



				var location_drop_down_list = document.getElementById("location");
				var location_input = location_drop_down_list.options[location_drop_down_list.selectedIndex].value;
				console.log(location_input)

				var price_category_drop_down_list = document.getElementById("pricecategory");
				var price_input = price_category_drop_down_list.options[price_category_drop_down_list.selectedIndex].value;
				console.log(price_input)



				var colour_drop_down_list = document.getElementById("colour");
				var colour_input = colour_drop_down_list.options[colour_drop_down_list.selectedIndex].value;
				console.log(colour_input)


				var sorting_drop_down_list = document.getElementById("sorting");
				var sorting_input = sorting_drop_down_list.options[sorting_drop_down_list.selectedIndex].value;
				console.log(sorting_input)

				var taste_drop_down_list = document.getElementById("tasteprofiles");
				var selected_tastes = taste_drop_down_list.selectedOptions;
				console.log(taste_drop_down_list)
				console.log(selected_tastes)



			$scope.query_string = `PREFIX ex:<http://www.example.com/K&D/group42/>
			PREFIX vin:<http://www.w3.org/TR/2003/PR-owl-guide-20031209/wine#> 
			PREFIX bevon:<http://rdfs.co/bevon/> 
			PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#> 
			PREFIX cbo:<http://comicmeta.org/cbo/> 
			PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
			select distinct ?winelabel ?taste_profile ?winerylabel ?grapelabel ?rating ?price where { 
			 `;


			for(j =0 ; j< selected_tastes.length;j++){
				$scope.query_string = $scope.query_string + " ?wine ex:hasTasteProfile ex:"+selected_tastes[j].value+ " ."
			}
			$scope.query_string = $scope.query_string +  " ?wine rdf:type "+colour_input + " . ";
			//$scope.query_string = $scope.query_string +  " ?wine rdf:type "+colour_input + " . ";

			$scope.query_string = $scope.query_string +  `?wine rdfs:label ?winelabel .
    ?wine ex:concatString ?taste_profile .
    ?wine vin:hasMaker ?winery .
    ?winery rdfs:label ?winerylabel .
    ?wine vin:madeFromGrape ?grape  .
    ?grape rdfs:label ?grapelabel.
    ?wine ex:hasRating ?rating .
    ?wine cbo:price ?price . } order by DESC(` +sorting_input+ ") limit 100";




    		$scope.dinamic_string = encodeURIComponent($scope.query_string);
    		console.log($scope.dinamic_string)
    		$http( {
 	method: "GET",
	url : $scope.myendpoint+  $scope.dinamic_string 
	//headers : {'Accept':'application/sparql-results+json', 'Content-Type':'application/sparql-results+json'}
	} )
	.success(function(data, status ) {
	      // TODO : your code here 
	      var winetable = document.getElementById("winetable");
	      $scope.resultz = data ; 
	      $scope.resultz = eval($scope.resultz);
	      console.log($scope.resultz["head"]["vars"])
			if (!winetable) return ;

			

			var test = [1,2,3,4,5,6];
			for (j=0 ; j<$scope.resultz["results"]["bindings"].length;j++){
				var newRow = winetable.insertRow(winetable.rows.length);

				for (i = 0; i < $scope.resultz["head"]["vars"].length; i++){
					var cell = newRow.insertCell(i);
					cell.innerHTML = $scope.resultz["results"]["bindings"][j][$scope.resultz["head"]["vars"][i]]["value"];
				}
			}
			var cells = winetable.getElementsByTagName('td');



			for (var i = 0; i < cells.length; i++) {
			        // Take each cell
			        var cell = cells[i];
			        // do something on onclick event for cell
			        cell.onclick = function () {
			            // Get the row id where the cell exists
			            var rowId = this.parentNode.rowIndex;

			            var rowsNotSelected = winetable.getElementsByTagName('tr');
			            for (var row = 0; row < rowsNotSelected.length; row++) {
			                rowsNotSelected[row].style.backgroundColor = "";
			                rowsNotSelected[row].classList.remove('selected');
			            }
			            var rowSelected = winetable.getElementsByTagName('tr')[rowId];
			            rowSelected.style.backgroundColor = "yellow";
			            rowSelected.className += " selected";

			            $scope.lat_lng_query = " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> select ?lat ?lng where { ?s rdfs:label "+rowSelected.cells[0].innerHTML+" . ?s }"
			            var map = new google.maps.Map(document.getElementById('map'), {
        						center: {lat: 52.334518, lng: 4.866753},
      						  zoom: 6
     					 });
						 
						 var grape_image = document.getElementById("grapeimage");
						 grape_image.src = "https://imgflip.com/s/meme/Mocking-Spongebob.jpg"; 
			        }
    }

			console.log(cells)



  })
	.error(function(error ){
	    console.log('Error '+error);
	    $scope.resultz = error ; 
	});

			//newRow.onclick = change_map(newRow)

	};
	
	


	

}


