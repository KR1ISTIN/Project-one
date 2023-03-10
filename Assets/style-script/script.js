var getData = $("#getDates") //submit button on check in and out
var checkIn = $("#datepicker-1") // check in input
var checkOut = $("#datepicker-2") // check out input
var cityHotel = $("#cityHotel") // gets value in search box for hotels 
var foodBtn = $("#food") // food search button 
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f7405bb471mshd0743285be682f2p1aecacjsncf8b70e2b390',
		'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com'
	}
};
const option = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f7405bb471mshd0743285be682f2p1aecacjsncf8b70e2b390',
		'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
	}
};

// *********** Options Exmaple ***********  just for explaination only \\
// if I pass options here as ${options}, I will get [object Object]
// if I pass options here simply as options, I will get the method and headers needed
console.log(`${options}`); // outputs [object Object]
console.log(options); // outputs {method: 'GET', headers: {…}} ** aka what we want to see!! **
// *********** Options Exmaple *********** \\


// *********** Nav Bar Timer *********** \\
setInterval(function() {
    $('#navTime').text(dayjs().format(' MMMM D, YYYY h:mm A '));
}, 1000);
// *********** Nav Bar Timer *********** \\

// this is for the burger menu to become active
$(document).ready(function() {
	// Check for click events on the navbar burger icon
	$(".navbar-burger").click(function() {
		// Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
		$(".navbar-burger").toggleClass("is-active");
		$(".navbar-menu").toggleClass("is-active");
  
	});
  });

  

/*these two dates will update the input box with the 
check in and out value so we can use it for 
the hotel fetch parameters, these functions provide the datepicker widget*/
 $(function() { //check in widget
	$("#datepicker-1" ).datepicker({
	dateFormat:"yy-mm-dd", 
	});
 });
 $(function() { //check out widget
	$("#datepicker-2" ).datepicker({
	dateFormat:"yy-mm-dd", 
	}); 
 });

 var checkDates = function (event) {
	event.preventDefault();
	var searchHotel = cityHotel.val(); // value for search city box for hotels
	var inDate = checkIn.val(); //check in widget value
	var outDate = checkOut.val(); // check out widget value
	if((inDate === "") || (outDate === "" || cityHotel === "")){ // if user does not fill in both widget dates then input box will outline in red
		$("#datepicker-1").addClass("is-danger");
		$("#datepicker-2").addClass("is-danger");
		cityHotel.addClass("is-danger");
	} else {
		$("#datepicker-1").removeClass("is-danger");
		$("#datepicker-2").removeClass("is-danger");
		cityHotel.removeClass("is-danger");
	}
	
	function returnHotel(urlForHotels, params) {
		return fetch(urlForHotels, params)
		.then(function(response) {
			return response.json()
		})
	}
	returnHotel(`https://priceline-com-provider.p.rapidapi.com/v1/hotels/locations?name=${searchHotel}&search_type=ALL`, options)
	.then(function(data) {
		console.log(data) //fetches the city data
		var cityID = data[0].cityID // gets the city ID for each city that the user puts in
		console.log(cityID) //confirming we attacked right way to access city ID

		var hotelsURL = `https://priceline-com-provider.p.rapidapi.com/v1/hotels/search?date_checkout=${outDate}&sort_order=HDR&date_checkin=${inDate}&location_id=${cityID}&star_rating_ids=4.0,5.0%2C5.0&rooms_number=1`;
	
	returnHotel(hotelsURL, options) // this is going to return hotels in the city
	.then(function(hotelListings) {
		console.log(hotelListings); // will help navigate through array to get values you want
		var id = 1; // is equal to each div hotel card
		// var for address
		var isNull = null;
		for(var i = 0; i < 6; i++) {
			try { // javascript says hey there might be an error here so let's try out this line of code first
				var hotelName = hotelListings.hotels[i].name // logs top 5 hotel // here we write the code that is giving us an error
			} catch(e) { // so if there is an error, we catch the error (e) and do something with it
				console.log(e) 
				continue// in this case, we console.log(e) the error so we know what it is and the program can "skip" the error to keep running and not stop here 
			}
			try {
				var imgURL = hotelListings.hotels[i].media.url; // picture of hotel
			} catch(e) {
				console.log(e);
				continue
			}
			//still need to add the address
			$(`#${id}`).children("#img").attr("src", imgURL);
			$(`#${id}`).children("#hotelName").text(hotelName);
			// need to append address here
			id++
		}

	})
	})
	.catch(err => console.error(err));
 }

 
var foodSearch =  function(event) {
	event.preventDefault();
	var food = $("#findFood"); // this is targetting the input for food
	var findFood = food.val(); // this is grabbing the value from input
	
	function returnFood(urlFood, param) {
		return fetch(urlFood, param)
		.then(function(response) {
			return response.json()
		})
	}
	returnFood(`https://travel-advisor.p.rapidapi.com/locations/search?query=${findFood}&offset=0&units=km&currency=USD&sort=relevance&lang=en_US`, option)
	.then(function(foodFindings) { // gives us access to get location ID
		console.log(foodFindings);
		var locID = foodFindings.data[0].result_object.location_id // gets location ID
		console.log(locID);

		var restaurantSearch = `https://travel-advisor.p.rapidapi.com/restaurants/list?location_id=${locID}&limit=30&min_rating=4.0&open_now=false&lang=en_US`
		returnFood(restaurantSearch, option) 
		.then(function(foodListings) {
			console.log(foodListings)
			var id = 6;
			for(var i = 0; i < 6; i++) {
				try { 
					var restaurantNames = foodListings.data[i].name; // restaurant name
				} catch(e) { 
					console.log(e) 
					continue
				}
				try {
					var foodImg = foodListings.data[i].photo.images.original.url // picture of hotel
				} catch(e) {
					console.log(e);
					continue
				} try {
					var webLink = foodListings.data[i].website // link to site
				} catch(e) {
					console.log(e)
					continue
				}
			 
				console.log(restaurantNames)
				console.log(foodImg)
				console.log(webLink)
				$(`#${id}`).children("#foodName").text(restaurantNames);
                $(`#${id}`).children("#img2").attr("src", foodImg);
                $(`#${id}`).children("#link").attr("href", webLink);
				id++
			}
		})
	})
	.catch(err => console.error(err));
}

getData.on("click",checkDates) // when you click on submit button this function runs

foodBtn.on("click", foodSearch) // when you click on the food search button, the foodSearch function will run 


  // when the heart icon is clicked on 
  var hearts = document.querySelectorAll('.heart');
  hearts.forEach((heart) => {
	heart.addEventListener('click', () => {
	  heart.classList.toggle('clicked');
	  var cardTitle = heart.nextElementSibling.textContent;

	  if (heart.classList.contains('clicked')) {
		localStorage.setItem(cardTitle, true);
	  } else {
		localStorage.removeItem(cardTitle);
	  }
	  console.log(localStorage);
	});
  });

  function scrollToTop() {
	window.scrollTo({top: 0, behavior: 'smooth'});
  }
  


function saveFood(foodPlace) {
	var dining = JSON.parse(localStorage.getItem("Restaurants")) || [];
	if(!dining.includes(foodPlace)) {
		
	}
}