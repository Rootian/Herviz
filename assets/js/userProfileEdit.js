let individualRadioButton = document.getElementById("individual-user-button");
let corporateRadioButton = document.getElementById("corprate-user-button");
let individualInfo = document.getElementById("individual-user-info");
let corporateInfo = document.getElementById("corporate-user-info");

// rendering user profile
function renderingUserProfile() {
    console.log("Gonna rendering user profile!");
    $.ajax({
        url : 'http://localhost:8084/api/user/getProfile',
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
        },
        error: function(error) {
            console.log(error);
        }
    }).then(function (res) {
        let userProfileObject = res.data;

        // set username
        userProfileObject.username = (JSON.parse(localStorage.getItem("currentUserInfo"))).username;
        let usernameItem = document.getElementById("username-profile");
        usernameItem.value = userProfileObject.username;
        usernameItem.readOnly = true;
        usernameItem.disabled = true;

        function filterAttributes(value) {
            return value === undefined ? "" : value;
        }
        // set email
        document.getElementById("user-email-profile").value = filterAttributes(userProfileObject.email);

        // set name
        document.getElementById("user-firstname-profile").value = filterAttributes(userProfileObject.firstName);
        document.getElementById("user-lastname-profile").value = filterAttributes(userProfileObject.lastName);

        // set phone number
        document.getElementById("user-phone-number-profile").value = filterAttributes(userProfileObject.phoneNo);

        // set address info
        document.getElementById("user-address-profile").value = filterAttributes(userProfileObject.address);
        document.getElementById("user-city-profile").value = filterAttributes(userProfileObject.city);
        document.getElementById("user-state-profile").value = filterAttributes(userProfileObject.state);
        document.getElementById("user-zipcode-profile").value = filterAttributes(userProfileObject.zipCode);

        // set individual or corporate info
        if (userProfileObject.type === "i") {
            document.getElementById("individual-user-button").checked = true;
            individualInfo.hidden = false;
            corporateInfo.hidden = true;
            
            document.getElementById("individual-user-driver-license-number").value = filterAttributes(userProfileObject.dln);
            document.getElementById("individual-user-insurance-company").value = filterAttributes(userProfileObject.insrcCompany);
            document.getElementById("individual-user-insurance-number").value = filterAttributes(userProfileObject.insrcNo);
        }
        else if (userProfileObject.type === "c"){
            document.getElementById("corporate-user-button").checked = true;
            individualInfo.hidden = true;
            corporateInfo.hidden = false;

            document.getElementById("corporate-name").selectedIndex = filterAttributes(userProfileObject.corpId);
        }
    });
}

$(document).ready(function (){
    initializationUserStatus();
    // selector initialization
    $("#corporate-name").niceSelect();
    $("#corporate-name").niceSelect("destroy");

    renderingUserProfile();//JSON.parse(localStorage.getItem("currentUserInfo"))
});


$(".logout-trigger").on("click", function(e) {
    e.preventDefault();
    logoutProcess();
})

$("#user-profile-trigger").on("click", function(e) {
    e.preventDefault();
    window.location.href = "./account.html";
})

$("#individual-user-button").on("click", function() {
    individualInfo.hidden = false;
    corporateInfo.hidden = true;
});

$("#corporate-user-button").on("click", function() {
    individualInfo.hidden = true;
    corporateInfo.hidden = false;
});

function isIndividualUser() {
    return individualRadioButton.checked;
}

function getListSelectedOption(listname) {
    let list = document.getElementById(listname);
    return list.options[list.selectedIndex];
}

$("#user-profile-info").submit(function (e){
    e.preventDefault();
    alert("Gonna save your profile!");

    let userProfileObjectJSON = {};
    userProfileObjectJSON.type = isIndividualUser() ? "i" : "c";
    userProfileObjectJSON.firstName = $("#user-firstname-profile").val();
    userProfileObjectJSON.lastName = $("#user-lastname-profile").val();
    userProfileObjectJSON.email = $("#user-email-profile").val();
    userProfileObjectJSON.phoneNo = $("#user-phone-number-profile").val();
    userProfileObjectJSON.address = $("#user-address-profile").val();
    userProfileObjectJSON.state = $("#user-state-profile").val();
    userProfileObjectJSON.city = $("#user-city-profile").val();
    userProfileObjectJSON.zipcode = $("#user-zipcode-profile").val();
    if (isIndividualUser()) {
        userProfileObjectJSON.dln = $("#individual-user-driver-license-number").val();
        userProfileObjectJSON.insrcCompany =  $("#individual-user-insurance-company").val();
        userProfileObjectJSON.insrcNo =  $("#individual-user-insurance-number").val();
    }
    else {
        userProfileObjectJSON.corpId = getListSelectedOption("corporate-name").value;
    }

    console.log(userProfileObjectJSON);
    userProfileObjectJSON = JSON.stringify(userProfileObjectJSON);

    $.ajax({
        url : 'http://localhost:8084/api/user/saveProfile',
        method : 'POST',
        dataType: 'json',
        contentType : 'application/json',
        data : userProfileObjectJSON,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success : function(data) {
            console.log(data);
        },
        error: function(error) {
            console.log(error);
        }
    }).then(function (res) {
        if (res.code === 200) {
            alert("Save profile successfully!");
            console.log(res);
        }
    });
});