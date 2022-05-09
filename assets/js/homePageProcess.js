let officeListJSON = [];
$( document ).ready(function () {
    initializationUserStatus();
    console.log("The page is loaded!");

    // Get the office location list info and update it
    $("#pick-up-office-location").niceSelect();
    // alert('Gonna Refresh office location list');
    let officeLocationListSelector = [...document.getElementsByClassName("office-location-list")];
    
    $.ajax({
        url : 'http://localhost:8084/api/office/listMenu',
        method : 'GET',
        dataType: 'json',
        contentType : 'application/json',
        data : JSON.stringify(""),
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success : function(data) {
            console.log(data);
            officeListJSON = JSON.parse(JSON.stringify(data.data));
        },
        error: function(error) {
            console.log(error);
        }
    }).then(function (res) {
        console.log("Res is: ");
        console.log(res);
        console.log("Verify cloned data.\n");
        console.log(res.data);
        localStorage.setItem("officeLocationList", JSON.stringify(res.data));
        // console.log(JSON.parse(JSON.stringify(res.data)));

        // Create Array including the office location list item 
        let officeListOptionArr = [];
        let officeListItemArr = [];
        let itemId = 2;
        res.data.forEach(function(officeLocationItem) {
            dropdownItem_1 = document.createElement("option");
            dropdownItem_1.setAttribute("value", officeLocationItem.id);
            dropdownItem_1.textContent = officeLocationItem.city;
            officeListOptionArr.push(dropdownItem_1);
        })
        console.log("After refreshing show the office list option:");
        console.log(officeListOptionArr);

        //Update the office location list 
        officeLocationListSelector.forEach(function(officeLocationList) {
            if (!officeLocationList.classList.contains("nice-select"))  {
                officeListOptionArr.forEach(function(officeItem) {
                    officeLocationList.appendChild(officeItem.cloneNode(true));
                })
            }
        });
        $("#pick-up-office-location, #return-office-location").niceSelect("update");
        
    });
})

let resultItem = [];
$("#vehicle-search-filters-form").submit(function (element) {
    element.preventDefault();
    //To continue search, user have to log in first 
    if (!verfiyUserStatus()) {
        alert("You have to log in first!");
        window.location.href = "./login.html";
    }
    else {
        // alert("Gonna submit this form!!");
        let pickUpLocationID = $("#pick-up-office-location").val();
        console.log("Current pickup location ID is: ");
        console.log(pickUpLocationID);

        let dropLocationID =  $("#return-office-location").val();

        let pickupDate = $("#vehicle-rent-date").val();
        console.log(pickupDate);
        // let pickupTime = $("#vehicle-rent-time").val();
        // console.log(pickupTime);

        let returnDate = $("#vehicle-return-date").val();
        console.log(returnDate);
        // let returnTime = $("#vehicle-return-time").val();
        // console.log(returnTime);
        let filterJSON = JSON.stringify({
            "pickUpLoc": pickUpLocationID,
            "pickUpDate": pickupDate,
            "dropDate": returnDate,
            "dropLoc": dropLocationID
        });
        console.log(filterJSON);
        
        $.ajax({
            url : 'http://localhost:8084/api/vehicle/search',
            method : 'POST',
            dataType: 'json',
            contentType : 'application/json',
            data : filterJSON,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success : function(data) {
                console.log("Success!");
                console.log(data);
                console.log(data.data);
                resultItem = data.data;
                window.location.href = "./car.html";
                localStorage.setItem('filterOptions', filterJSON);
                localStorage.setItem("vehicleSearchResultFromHomepage", JSON.stringify(data.data));
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
});

$("#logout-trigger").on("click", function () {
    logoutProcess();
})