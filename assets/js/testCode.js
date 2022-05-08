$("#test-btn").on("click", function () {
    alert("Going to refresh the search result!");

    for (let i = 0; i < 6; i++) {
        let search_result_display_unit = document.createElement("div");
        search_result_display_unit.id = "search-result-display-unit-" + (i + 1);
        search_result_display_unit.classList.add("col-lg-6", "col-md-6");

        let search_result_vehicle_item = document.createElement("div");
        search_result_vehicle_item.classList.add("feature_vehicle_item", "aos-init", "aos-animate");
        search_result_vehicle_item.dataset.aos = "fade-up";
        search_result_vehicle_item.dataset.aosDelay = "100";
        
        let search_result_vehicle_name = document.createElement("h3");
        search_result_vehicle_name.classList.add("item_title", "mb-0");
        let vehicle_title_item = document.createElement("a");
        vehicle_title_item.setAttribute("href", "#!");
        vehicle_title_item.textContent = "Vehicle No." + (i + 1);
        search_result_vehicle_name.appendChild(vehicle_title_item);

        let search_result_vehicle_image_item = document.createElement("div");
        search_result_vehicle_image_item.classList.add("item_image", "position-relative");
        let image_wrap_item = document.createElement("a");
        image_wrap_item.setAttribute("href", "#!");
        let vehicle_image = document.createElement("img");
        vehicle_image.src = "assets/images/feature/img_08.jpg";
        vehicle_image.alt = "image_not_found";
        let temp_span_item = document.createElement("span");
        temp_span_item.classList.add("item_price", "bg_default_blue");
        temp_span_item.textContent = "$230/Day"
        search_result_vehicle_image_item.append(image_wrap_item, vehicle_image, temp_span_item);

        let search_result_info_list = document.createElement("ul");
        search_result_info_list.classList.add("info_list", "ul_li_center", "clearfix");
        for (let j = 0; j < 4; j++) {
            let list_item = document.createElement("li");
            list_item.textContent = "Vechicle_Attribute_" + (j + 1);
            search_result_info_list.appendChild(list_item);
        }
        search_result_vehicle_item.append(search_result_vehicle_name, search_result_vehicle_image_item, search_result_info_list);

        search_result_display_unit.appendChild(search_result_vehicle_item);
        $("#search-result-display").append(search_result_display_unit);
    }

    //test search api
    let search_vehicle_item = {
        "pickUpLoc": 1,
        "pickUpDate": 1650575489560,
        "dropDate": 1650575489580
    };

    debugger
    $.ajax({
        url : 'http://localhost:8080/api/vehicle/search',
        method : 'POST',
        dataType: 'json',
        contentType : 'application/json',
        data : JSON.stringify(search_vehicle_item),
        crossDomain: true,
        success : function(data) {
            console.log(data)
        },
        error: function(error) {
            console.log(error);
        }
    });
});