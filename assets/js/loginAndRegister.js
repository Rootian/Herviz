$(document).ready(function (){
    initializationUserStatus();
})

$("#user-login-form").submit(function(element) {
    if (verfiyUserStatus()) {
        window.location.href = "./index.html";
    }
    else {
        userInfo = {
            "username": $("#input-username").val(),
            "password": $("#input-user-password").val()
        }
        element.preventDefault();
        console.log("Login attempt");
        $.ajax({
            url : 'http://localhost:8084/api/auth/login',
            method : 'POST',
            dataType: 'json',
            contentType : 'application/json',
            data : JSON.stringify(userInfo),
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
        }).then(function (res) {
            console.log("Login status is: ");
            console.log(res);
            // If login fails
            if (res.code === 500) {
                alert(`Whoops! ${res.message}!`);
            }
            // If login successful, go to the homepage 
            else {
                console.log("stringfied data is: ");
                console.log(JSON.stringify(res.data));
                console.log("tokenValue is: ");
                console.log(res.data.tokenValue);

                // set current user to localStorage
                localStorage.setItem("currentUserInfo", JSON.stringify(res.data));

                // set token value to browser cookie 
                console.log("gonna add TokenValue");
                if (document.cookie !== "")
                    document.cookie = "; ";
                setCookie("satoken", res.data.tokenValue, 7);
                window.location.href = "./index.html";
            }
        });
    }
});

function verifyPassword() {
    let userPassword = $("#user-password").val();
    let userPasswordConfirm = $("#user-password-confirm").val();
    return userPassword === userPasswordConfirm;
}

$("#user-register-form").submit(function(element) {
    element.preventDefault();
    if (verifyPassword()) {
        let userRegisterInfoObject = {};
        userRegisterInfoObject.username = $("#user-name").val();
        userRegisterInfoObject.password = $("#user-password").val();
        userRegisterInfoObject = JSON.stringify(userRegisterInfoObject);
        console.log(userRegisterInfoObject);

        $.ajax({
            url : 'http://localhost:8084/api/auth/register',
            method : 'POST',
            dataType: 'json',
            contentType : 'application/json',
            data : userRegisterInfoObject,
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
                alert("You have registered successfully!");
            }
            else {
                alert("Registration Failed!");
            }
        })
    }
    else {
        alert("Your password is not matched!");
    }
})

$("#user-profile-trigger").on("click", function(e) {
    e.preventDefault();
    window.location.href = "./account.html";
})

$("#logout-trigger").on("click", function () {
    logoutProcess();
})