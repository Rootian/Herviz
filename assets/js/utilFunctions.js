// Cookie Manipulation functions
function setCookie(name, value, days) {
	console.log("Gonna modify cookie!");
	console.log(name);
	console.log(value);
	console.log(days);

    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
	let contentStr = name + "=" + (value || "")  + expires + "; path=/";
	
	console.log("cookie content is: ");
	console.log(contentStr);
    document.cookie = contentStr;
	console.log("After modify cookie, it is: ");
	console.log(document.cookie);
}
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// search result Item generation function
function generateVehicleDisplayItem(vehicle) {
	let resultItemID = vehicle.id;

	let search_result_display_unit = document.createElement("div");
	search_result_display_unit.id = `search-result-display-unit-${resultItemID}`;
	search_result_display_unit.classList.add("col-lg-6", "col-md-6");

	let search_result_vehicle_item = document.createElement("div");
	search_result_vehicle_item.classList.add("feature_vehicle_item", "aos-init", "aos-animate");
	search_result_vehicle_item.dataset.aos = "fade-up";
	search_result_vehicle_item.dataset.aosDelay = "100";
	
	let search_result_vehicle_name = document.createElement("h3");
	search_result_vehicle_name.classList.add("item_title", "mb-0");
	let vehicle_title_item = document.createElement("a");
	vehicle_title_item.classList.add("vehicle_name", `vehicleID_${resultItemID}`);
	// vehicle_title_item.setAttribute("href", "#!");
	vehicle_title_item.textContent = `${vehicle.type}`;
	search_result_vehicle_name.appendChild(vehicle_title_item);

	let search_result_vehicle_image_item = document.createElement("div");
	search_result_vehicle_image_item.classList.add("item_image", "position-relative");
	let image_wrap_item = document.createElement("a");
	// image_wrap_item.setAttribute("href", "#!");
	image_wrap_item.classList.add("image_wrap", `vehicleID_${resultItemID}`);
	let vehicle_image = document.createElement("img");
	vehicle_image.src = `assets/images/feature/img_0${resultItemID}.jpg`;
	vehicle_image.alt = "image_not_found";
	image_wrap_item.appendChild(vehicle_image)
	let temp_span_item = document.createElement("span");
	temp_span_item.classList.add("item_price", "bg_default_blue");
	temp_span_item.textContent = `$${vehicle.rentalRate}/Day`;
	search_result_vehicle_image_item.append(image_wrap_item, temp_span_item);

	//Set different vehicle attributes
	let search_result_info_list = document.createElement("ul");
	search_result_info_list.classList.add("info_list", "ul_li_center", "clearfix");
	let list_item = document.createElement("li");
	list_item.textContent = `${vehicle.seat} Seats`;
	search_result_info_list.appendChild(list_item);

	list_item = document.createElement("li");
	list_item.textContent = `${vehicle.bag} Bags`;
	search_result_info_list.appendChild(list_item);

	list_item = document.createElement("li");
	list_item.textContent = `${vehicle.type}`;
	search_result_info_list.appendChild(list_item);

	search_result_vehicle_item.append(search_result_vehicle_name, search_result_vehicle_image_item, search_result_info_list);

	search_result_display_unit.appendChild(search_result_vehicle_item);

	return search_result_display_unit;
}

// vefify the user login status (if logged in, return true)
function verfiyUserStatus() {
	function verifyUserInfoWithCookie() {
		return getCookie("userTokenValue") !== null;
	}
	return  localStorage.getItem("currentUserInfo") !== null;// && verifyUserInfoWithCookie();
}

function initializationUserStatus() {
	// initialization task when loading the homepage
	// Based on whether the user is logged in
	if (verfiyUserStatus()) {
		console.log("Currently has a user logged in!");
		[...document.getElementsByClassName("user-login-info")].forEach(element => element.hidden = false);
		[...document.getElementsByClassName("homepage-initial-info")].forEach(element => element.hidden = true);
		document.getElementById("username-navbar").textContent = (JSON.parse(localStorage.getItem("currentUserInfo"))).username;
	}
	else {
		// show the breif info on the home page
		localStorage.clear();
		console.log("Currently dose not has a user logged in!");
		[...document.getElementsByClassName("user-login-info")].forEach(element => element.hidden = true);
		[...document.getElementsByClassName("homepage-initial-info")].forEach(element => element.hidden = false);
	}
}

function createBoldTextNode(contentStr) {
	let res = document.createElement("strong");
	res.appendChild(document.createTextNode(contentStr));
	return res;
}

function createCouponItem(coupon) {
	let res = document.createElement("option");
	let couponInfoStr = `${coupon.discount * 100}% off, valid until ${coupon.eDate}`;
	res.setAttribute("value", coupon.id);
	res.appendChild(document.createTextNode(couponInfoStr));
	return res;
}

function getCurrentSelectedVehicle() {
	let res = {};
	JSON.parse(localStorage.getItem("vehicleSearchResultFromHomepage")).forEach(function (element) {
		if (element.id == parseInt(localStorage.getItem("selectedVehicleID"), 10)){
			res = element;
		}
	});
	return res;
}

function logoutProcess() {
	localStorage.clear();
	window.location.href = "./index.html";
}