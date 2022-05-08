// rendering user profile
function renderingUserProfile(userProfileObject) {
    console.log(userProfileObject);
    let usernameItem = document.getElementById("username-profile");
    usernameItem.value = userProfileObject.username;
    usernameItem.readOnly = true;
    usernameItem.disabled = true;
}

$(document).ready(function (){
    initializationUserStatus();
    // selector initialization
    $("#corporate-name").niceSelect();
    $("#corporate-name").niceSelect("destroy");

    renderingUserProfile(JSON.parse(localStorage.getItem("currentUserInfo")));
});


$(".logout-trigger").on("click", function(e) {
    e.preventDefault();
    logoutProcess();
})

$("#user-profile-trigger").on("click", function(e) {
    e.preventDefault();
    window.location.href = "./account.html";
})


let individualRadioButton = document.getElementById("individual-user-button");
// let corporateRadioButton = document.getElementById("corprate-user-button");
let individualInfo = document.getElementById("individual-user-info");
let corporateInfo = document.getElementById("corporate-user-info");
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
$("#user-profile-info").submit(function (e){
    e.preventDefault();
    alert("Gonna save your profile!");

    let userPorfileObject = {};
    userPorfileObject.type = isIndividualUser() ? "i" : "c";
    userPorfileObject.firstName = $("#user-firstname-profile").val();
    userPorfileObject.lastName = $("#user-lastname-profile").val();
    userPorfileObject.email = $("#user-email-profile").val();
    userPorfileObject.phoneNo = $("#user-phone-number-profile").val();
    userPorfileObject.address = $("#user-address-profile").val();
    userPorfileObject.state = $("#user-state-profile").val();
    userPorfileObject.city = $("#user-city-profile").val();
    userPorfileObject.zipcode = $("#user-zipcode-profile").val();
    if (isIndividualUser()) {
        userPorfileObject.dln = $("#individual-user-driver-license-number").val();
        userPorfileObject.insrcCompany =  $("#individual-user-insurance-company").val();
        userPorfileObject.insrcNo =  $("#individual-user-insurance-number").val();
    }
    else {
        let listItem = document.getElementById("corporate-name");
        userPorfileObject.corpId = listItem.options[listItem.selectedIndex].value;
    }

    console.log(userPorfileObject);
    userPorfileObject = JSON.stringify(userPorfileObject);

    $.ajax({
        url : 'http://localhost:8084/api/user/saveProfile',
        method : 'POST',
        dataType: 'json',
        contentType : 'application/json',
        data : userPorfileObject,
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