
let totalMoney = 0;
let discountedPrice = 0;
let paymentCount = 1;
let taxRate = 0.08875;
let totalPriceIncludeTax = 0;

function setPrice(number) {
    document.getElementById("vehicle-total-money").childNodes[1].data = ` $${number}`;
    document.getElementById("sales-tax-amount").childNodes[1].data = ` $${(number * taxRate).toFixed(2)}`;
    totalPriceIncludeTax = (number * (1 + taxRate)).toFixed(2);
    document.getElementById("total-charge-including-tax").childNodes[1].data = ` $${totalPriceIncludeTax}`;
}

function isCouponEmpty() {
    let listItem = document.getElementById("user-coupon-list");
    return !(listItem.options[listItem.selectedIndex].text.includes("%"));
}
function getCurrentCouponID() {
    let listItem = document.getElementById("user-coupon-list");
    return listItem.options[listItem.selectedIndex].value;
}
// Load user's coupon info
function loadUserCouponInfo() {
    // request coupon info from server
    let couponListItem = document.getElementById("user-coupon-list");
    let couponItemArray = [...couponListItem];
    couponItemArray.forEach(function (element) {
        couponListItem.removeChild(element);
    })
    // debugger
    // while (couponListItem.firstChild)
    // 	couponListItem.remove(couponListItem.lastChild);
    $("#user-coupon-list").niceSelect("update");

    $.ajax({
        url : `http://localhost:8084/api/coupon/getByUserId`,
        method : 'GET',
        dataType: 'json',
        contentType : 'application/json',
        // data : JSON.stringify($("#coupon-code-input-content").val()),
        crossDomain: true,
        xhrFields: {withCredentials: true},
        success : function(data) {
            console.log("Load user coupon info success!");
            console.log(data);
            console.log(data.data);
        },
        error: function(error) {
            console.log(error);
        }
    }).then(function (res) {
        if (res.code === 200) {
            console.log(res);
            console.log(res.data);
            let coupons = res.data;
            let couponCount = coupons.length;
            let couponCountItem = document.createElement("option");
            couponCountItem.textContent = `You have ${couponCount} coupon${couponCount > 1 ? "s" : ""}!`;
            // couponCountItem.disabled = true;
            couponCountItem.selected = true;
            couponListItem.appendChild(couponCountItem);
            $("#user-coupon-list").niceSelect("update");

            // update number of coupons
            coupons.forEach(function (coupon){
                couponListItem.appendChild(createCouponItem(coupon));
            });
            $("#user-coupon-list").niceSelect("update");
        }
    });
}

$(document).ready(function () {
    // some initialization work
    $("#user-coupon-list").niceSelect();
    totalMoney = 0;
    paymentCount = 1;
    discountedPrice = 0;
    document.getElementById("payment-information").hidden = true;

    function verifySelectVehicle() {
        return (localStorage.getItem("filterOptions") !== null) && 
        (localStorage.getItem("officeLocationList") !== null) && 
        (localStorage.getItem("vehicleSearchResultFromHomepage") !== null) &&
        (localStorage.getItem("selectedVehicleID") !== null);
    }

    if (verifySelectVehicle()) {
        let filterOptionJSON = JSON.parse(localStorage.getItem("filterOptions"));
        function setPickupOffice() {
            let pickUPOfficeID = parseInt(filterOptionJSON.pickUpLoc, 10)
            JSON.parse(localStorage.getItem("officeLocationList")).forEach(function (element){
                if (pickUPOfficeID === element.id)
                document.getElementById("cart-pickup-location").childNodes[1].data = 
                ` ${element.streetAddr}, ${element.city}, ${element.state}, ${element.zipCode}`;
            });
        }

        function setDate(elementID, isPickUpDate) {
            let dateElement = document.getElementById(elementID);
            if (isPickUpDate) {
                dateElement.childNodes[1].data = filterOptionJSON.pickUpDate;
            }
            else {
                dateElement.childNodes[1].data = filterOptionJSON.dropDate;
            }
        }

        console.log("gonna render the cart!");
        //Set order information
        setPickupOffice();
        setDate("cart-pickup-date", true);
        setDate("cart-return-date", false);
        
        let selectedVehicle = getCurrentSelectedVehicle();
        function setChargeRate() {
            let res = selectedVehicle.rentalRate;
            document.getElementById("vehicle-rental-rate").childNodes[1].data = ` $${res}/day`;
            return res;
        }

        function setRentalDuration () {
            function splitDateStr(dateStr) {
                dateStr = dateStr.split("-");
                let year = parseInt(dateStr[0]);
                let month = parseInt(dateStr[1]) - 1;
                let day = parseInt(dateStr[2]);
                return new Date(year, month, day);
            }
            const totalMillisecondsADay = 24*60*60*1000;
            let res = (splitDateStr(filterOptionJSON.dropDate) - splitDateStr(filterOptionJSON.pickUpDate)) / totalMillisecondsADay;
            document.getElementById("vehicle-rental-duration").childNodes[1].data = ` ${res} day${res > 1 ? 's' : ' '}`;
            return res == 0 ? 1 : res;
        }
        
        function setSubtotalMoney(rate, days) {
            let res = rate * days;
            setPrice(res);
            return res;
        }
        //Calculate order dates and cost
        function setDurationTimeAndMoney() {
            console.log(`Selected Car is: ${selectedVehicle.id}`);
            console.log(selectedVehicle);
            let dailyRate = setChargeRate();
            let totalDays = setRentalDuration();
            totalMoney = setSubtotalMoney(dailyRate, totalDays);
        }

        setDurationTimeAndMoney();

        //Render the vehicle info
        let vehicleDisplayItem = generateVehicleDisplayItem(selectedVehicle);
        console.log("gonna render this item: \n");
        vehicleDisplayItem.classList.remove(...vehicleDisplayItem.classList);
        vehicleDisplayItem.classList.add("col-lg-4", "col-md-9", "col-sm-10", "col-xs-12");
        vehicleDisplayItem.children[0].classList.add("mt-0", "ml-0");
        console.log(vehicleDisplayItem);
        let vehicleDisplayBoardElement = document.getElementById("vehicle-display-board");
        vehicleDisplayBoardElement.insertBefore(vehicleDisplayItem, vehicleDisplayBoardElement.firstChild);

        // bind the coupon selector list
        console.log("Ongoing load coupon info");
        loadUserCouponInfo();
    }
});

$("#coupon-code-form").submit(function (element) {
    // alert("Gonna verify coupon code!");
    console.log("Input coupon code is:");
    console.log($("#coupon-code-input-content").val());
    element.preventDefault();
    $.ajax({
        url : `http://localhost:8084/api/coupon/addCouponToAccount?couponCode=${$("#coupon-code-input-content").val()}`,
        method : 'GET',
        dataType: 'json',
        contentType : 'application/json',
        crossDomain: true,
        xhrFields: {withCredentials: true},
        success : function(data) {
            console.log("Success!");
            console.log(data);
            console.log(data.data);
            resultItem = data.data;
        },
        error: function(error) {
            console.log(error);
        }
    }).then(function(res) {
        if (res.code === 200) {
            alert("Your coupon code is added successfully!");
            console.log(`Res is: \n ${res}`);
            loadUserCouponInfo();
        }
        else {
            alert("Invalid coupon code! Please try again!");
        }
    });
}) 

$("#user-coupon-list").on("change", function() {
    function resetTotalMoney() {
        setPrice(totalMoney);
        let item = document.getElementById("user-coupon-discount");
        if (item !== null)
            item.remove();
    }
    // this.children().last().remove();
    console.log("Current coupon is:");
    console.log(this.options[this.selectedIndex].text);

    let couponInfo = this.options[this.selectedIndex].text;
    // first check if there is some coupon selected
    if (isCouponEmpty()) {
        resetTotalMoney();
        return;
    }

    let discount = parseInt(couponInfo.split('%')[0]) / 100;
    let cartInfoListItem = document.getElementById("cart-info-date-and-money");
    let cartInforItemArray = [...cartInfoListItem.children];
    resetTotalMoney();

    //Display coupon's discount
    let discountItem = document.createElement("li");
    discountItem.setAttribute("id", "user-coupon-discount");
    let textItem = document.createElement("strong");
    textItem.textContent = "Discout: ";
    discountItem.appendChild(textItem);
    discountItem.appendChild(document.createTextNode(`-${discount * 100}% `));
    cartInfoListItem.appendChild(discountItem);

    // after receive the discount, calculate the discounted price
    let discountedPrice = totalMoney * (1 - discount);
    setPrice(discountedPrice);

});

$("#order-checkout-button").on("click", function(e) {
    // alert("Gonna checkout!");
    let paymentInfoModule = document.getElementById("payment-information");
    if (paymentInfoModule.hidden === true) {
        paymentInfoModule.hidden = false;
        addPayment();
    }

    let orderInfoObject = {};
    let currentSelectedVehicle = getCurrentSelectedVehicle();
    orderInfoObject.classId = currentSelectedVehicle.id;
    let filterObject = JSON.parse(localStorage.getItem("filterOptions"));
    orderInfoObject.pDate = filterObject.pickUpDate;
    orderInfoObject.dDate = filterObject.dropDate;
    orderInfoObject.pickupLoc = filterObject.pickUpLoc;
    orderInfoObject.dropLoc = filterObject.dropLoc;
    if (!isCouponEmpty())
        orderInfoObject.couponId = getCurrentCouponID();
    orderInfoObject = JSON.stringify(orderInfoObject);
    console.log("The request content is: ");
    console.log(orderInfoObject);

    $.ajax({
        url : 'http://localhost:8084/api/order/save',
        method : 'POST',
        dataType: 'json',
        contentType : 'application/json',
        data : orderInfoObject,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success : function(data) {
            console.log("Success!");
            console.log(data);
            console.log(data.data);
            resultItem = data.data;
        },
        error: function(error) {
            console.log(error);
        }
    }).then(function (res) {
        if (res.code === 500) {
            alert(`Whoops! ${res.message}!`);
        }
        else {
            localStorage.setItem("userOrderID", res.data.id);
        }
    });
    e.preventDefault();
})

function createPaymentRowItem(rowID) {
    let rowItem = document.createElement("div");
    rowItem.classList.add("row");

    // add card type Item
    let cardTypeITem = document.createElement("div");
    cardTypeITem.classList.add("col-lg-6", "col-md-6", "col-sm-12", "col-xs-12");
    let formItem1 = document.createElement("div");
    formItem1.classList.add("form_item");
    let cardTypeList = document.createElement("select");
    cardTypeList.classList.add("form-select", "form-select-lg", "card-type-selector");
    cardTypeList.id = `card-type-${rowID}`;
    let cardTypeText = document.createElement("option");
    cardTypeText.textContent = "Choose your card type."
    cardTypeText.disabled = true;
    cardTypeList.appendChild(cardTypeText);
    let creditItem = document.createElement("option");
    creditItem.textContent = "Debit Card";
    cardTypeList.appendChild(creditItem);
    let debitItem = document.createElement("option");
    debitItem.textContent = "Credit Card";
    cardTypeList.appendChild(debitItem);

    formItem1.appendChild(cardTypeList);
    cardTypeITem.appendChild(formItem1);
    rowItem.appendChild(cardTypeITem);

    // add card-number item
    let cardNumberItem = document.createElement("div");
    cardNumberItem.classList.add("col-lg-6", "col-md-6", "col-sm-12", "col-xs-12");
    let formItem2 = document.createElement("div");
    formItem2.classList.add("form_item");
    let cardNumberText = document.createElement("input");
    cardNumberText.id = `card-number-${rowID}`;
    cardNumberText.setAttribute("type", "text");
    cardNumberText.setAttribute("name", "card-number");
    cardNumberText.setAttribute("placeholder", "Card Number");

    formItem2.appendChild(cardNumberText);
    cardNumberItem.appendChild(formItem2);
    rowItem.appendChild(cardNumberItem);

    // add expire date item
    let cardExpireDateItem = document.createElement("div");
    cardExpireDateItem.classList.add("col-lg-6", "col-md-6", "col-sm-12", "col-xs-12");
    let formItem3 = document.createElement("div");
    formItem3.classList.add("form_item");
    let expireDateText = document.createElement("input");
    expireDateText.id = `expire-date-${rowID}`;
    expireDateText.setAttribute("type", "text");
    expireDateText.setAttribute("name", "expire-date");
    expireDateText.setAttribute("placeholder", "Expire date: MM/YYYY");

    formItem3.appendChild(expireDateText);
    cardExpireDateItem.appendChild(formItem3);
    rowItem.appendChild(cardExpireDateItem);

    // add cvv code item
    let cvvCodeItem = document.createElement("div");
    cvvCodeItem.classList.add("col-lg-6", "col-md-6", "col-sm-12", "col-xs-12");
    let formItem4 = document.createElement("div");
    formItem4.classList.add("form_item");
    let cvvCodeText = document.createElement("input");
    cvvCodeText.id = `cvv-code-${rowID}`;
    cvvCodeText.setAttribute("type", "text");
    cvvCodeText.setAttribute("name", "cvv-number");
    cvvCodeText.setAttribute("placeholder", "CVV code");

    formItem4.appendChild(cvvCodeText);
    cvvCodeItem.appendChild(formItem4);
    rowItem.appendChild(cvvCodeItem);

    // add payment amount item
    let paymentAmountItem = document.createElement("div");
    paymentAmountItem.classList.add("col-lg-6", "col-md-6", "col-sm-12", "col-xs-12");
    let formItem5 = document.createElement("div");
    formItem5.classList.add("form_item");
    let paymentAmountText = document.createElement("input");
    paymentAmountText.id = `payment-amount-${rowID}`;
    paymentAmountText.setAttribute("type", "text");
    paymentAmountText.setAttribute("name", "payment-amount");
    paymentAmountText.setAttribute("placeholder", "Paymen Amount:");

    formItem5.appendChild(paymentAmountText);
    paymentAmountItem.appendChild(formItem5);
    rowItem.appendChild(paymentAmountItem);

    // add space item
    let spaceItem = document.createElement("div");
    spaceItem.classList.add("col-lg-6", "col-md-6", "col-sm-12", "col-xs-12");
    rowItem.appendChild(spaceItem);

    return rowItem;
}

function createHorizontalLineItem() {
    let resItem = document.createElement("hr");
    return resItem;
}

function addPayment() {
    let paymentFormItem = document.getElementById("payment-info-form");
    if (paymentCount === 1)
        paymentFormItem.insertBefore(createHorizontalLineItem(), paymentFormItem.childNodes[getListChildNodesNum() - 3]);

    function getListChildNodesNum() {
        return [...paymentFormItem.childNodes].length;
    }
    paymentFormItem.insertBefore(createHorizontalLineItem(), paymentFormItem.childNodes[getListChildNodesNum() - 4]);
    paymentFormItem.insertBefore(createPaymentRowItem(paymentCount), paymentFormItem.childNodes[getListChildNodesNum() - 4]);
    $(`#card-type-${paymentCount}`).niceSelect();
    $(`#card-type-${paymentCount}`).niceSelect('update');
    paymentCount++;
}

$("#add-payment-button").on("click", function(e) {
    e.preventDefault();
    // alert("Gonna add a payment!");
    
    addPayment();
});

function getSinglePaymentInfo(paymentID) {
    let resObject = {};
    
    let paymentNumber = $(`#payment-amount-${paymentID}`).val();
    paymentNumber = parseFloat(paymentNumber);
    resObject.amount = paymentNumber;

    resObject.method = $(`#card-type-${paymentID}`).val()[0] === 'C' ? "credit" : "debit";
    resObject.cardNo = $(`#card-number-${paymentID}`).val();
    return resObject;
}

$("#order-submit-button").on("click", function(e) {
    e.preventDefault();
    // alert("Gonna submit payment!");

    let orderInfoJson = {};
    orderInfoJson.orderId = parseInt(localStorage.getItem("userOrderID"));
    let payList = [];
    let userPaidAmount = 0;
    for (let i = 1; i < paymentCount; i++) {
        let paymentObject = getSinglePaymentInfo(i);
        payList.push(paymentObject);
        userPaidAmount += paymentObject.amount;
    }
    // debugger
    if (!Math.abs(userPaidAmount - totalPriceIncludeTax) < 1e-4) {
        console.log(userPaidAmount);
        console.log(totalPriceIncludeTax);
        alert("Your total payment is not correct! Please check again!");
        return;
    }
    orderInfoJson.payList = payList;
    orderInfoJson = JSON.stringify(orderInfoJson);

    $.ajax({
        url : 'http://localhost:8084/api/payment/pay',
        method : 'POST',
        dataType: 'json',
        contentType : 'application/json',
        data : orderInfoJson,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success : function(data) {
            console.log("Success!");
            console.log(data);
            console.log(data.data);
        },
        error: function(error) {
            console.log(error);
        }
    }).then(function(res) {
        if (res.code === 200) {
            window.location.href = "./paymentSuccessful.html"
        }
        else {
            alert("Your payment failed!");
        }
    });
});

$("#logout-trigger").on("click", function () {
    logoutProcess();
})