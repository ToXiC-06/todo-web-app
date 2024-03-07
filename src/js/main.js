// Import our custom CSS
import "../scss/styles.scss";

// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";
import $ from "jquery";

$(function () {
  $("#RegisterSubmit").attr("disabled", true);
  function LoadComponent(page) {
    $.ajax({
      method: "get",
      url: page,
      success: (response) => {
        $("main").html(response);
      },
    });
  }

  function LoadAppointments(uid) {
    $("#appointmentsContainer").html("");
    $.ajax({
      method: "get",
      url: `http://127.0.0.1:4000/appointments/${uid}`,
      success: (response) => {
        $("#UserNameContainer").html(
          sessionStorage.getItem("userName").toUpperCase()
        );
        response.map((data) => {
          $(`<div class="card m-4">
              <div class="card-header bg-info-subtle">
                <div class="fw-bold fs-3 card-title">${data.Title}</div>
                <div>${new Date(
                  data.Date.toString().slice(
                    0,
                    data.Date.toString().indexOf("T")
                  )
                ).toDateString()}</div>
              </div>
              <div class="card-body">
                    <div>${data.Description}</div>
              </div>
              <div class="card-footer bg-dark-subtle">
                  <div class="d-flex justify-content-between">
                    <button class="bi bi-pen-fill btn btn-warning" id="EditAppointment" value=${
                      data._id
                    }>Edit</button>
                    <button class="bi bi-trash-fill btn btn-danger" id="DeleteAppointment" value=${
                      data._id
                    } >Delete</button>
                  </div>
              </div>
          </div>`).appendTo("#appointmentsContainer");
        });
      },
    });
  }

  $("#btnHomeLogin").click(() => {
    if (sessionStorage.getItem("userId") !== null) {
      LoadComponent("appointments.html");
      LoadAppointments(sessionStorage.getItem("userId"));
      $("#container").removeClass("align-items-center");
    } else {
      LoadComponent("login.html");
    }
  });

  $("#btnHomeRegister").click(() => {
    LoadComponent("register.html");
  });
  $(document).on("click", "#btnNavRegister", () => {
    LoadComponent("register.html");
  });
  $(document).on("click", "#btnNavLogin", () => {
    if (sessionStorage.getItem("userId") !== null) {
      LoadComponent("appointments.html");
      LoadAppointments(sessionStorage.getItem("userId"));
      $("#container").removeClass("align-items-center");
    } else {
      LoadComponent("login.html");
    }
  });

  $(document).on("click", "#LoginSubmit", () => {
    if ($("#LoginPassword").val().length === 0) {
      alert("Invalid Credentials....");
    } else {
      $.ajax({
        method: "get",
        url: "http://127.0.0.1:4000/users",
        success: (res) => {
          var data = res.find(
            (item) => item.UserId === $("#LoginUserId").val()
          );
          if (data === undefined) {
            alert("User Not Available");
          } else {
            if (data.Password === $("#LoginPassword").val()) {
              sessionStorage.setItem("userId", data.UserId);
              sessionStorage.setItem("userName", data.UserName);
              LoadComponent("appointments.html");
              LoadAppointments(data.UserId);
              $("#container").removeClass("align-items-center");
            } else {
              alert("Invalid Credentials...");
            }
          }
        },
      });
    }
  });

  $(document).on("keyup", "#RegisterUserId", () => {
    $.ajax({
      method: "get",
      url: "http://127.0.0.1:4000/users",
      success: (res) => {
        var data = res.find(
          (item) => item.UserId === $("#RegisterUserId").val()
        );
        if (data === undefined && $("#RegisterUserId").val().length >= 6) {
          $("#RegisterSubmit").attr("disabled", false);
          $("#checkId").text("");
        } else {
          $("#checkId").text("User Id already exist...");
          $("#RegisterSubmit").attr("disabled", true);
        }
      },
    });
  });

  $(document).on("submit", "#RegisterForm", (e) => {
    e.preventDefault();
    var newUser = {
      UserId: $("#RegisterUserId").val(),
      UserName: $("#RegisterName").val(),
      Email: $("#RegisterEmail").val(),
      Password: $("#RegisterPassword").val(),
      Mobile: $("#RegisterMobile").val(),
    };
    if ($("#RegisterPassword").val().length < 5) {
      alert("Password must be 5 characters");
    } else {
      $.ajax({
        method: "post",
        url: "http://127.0.0.1:4000/register-user",
        data: newUser,
      });
      alert("Registered Succesfully...");
      LoadComponent("login.html");
    }
  });

  $(document).on("click", "#btnSignOut", () => {
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userId");
    LoadComponent("login.html");
    $("#container").addClass("align-items-center");
  });

  $(document).on("click", "#btnNewAppointment", () => {
    $("#container").addClass("align-items-center");
    LoadComponent("new-appointment.html");
  });

  $(document).on("click", "#ACancel", () => {
    LoadComponent("appointments.html");
    $("#container").removeClass("align-items-center");
    LoadAppointments(sessionStorage.getItem("userId"));
  });

  $(document).on("submit", "#AddAppointment", (e) => {
    e.preventDefault();
    if (
      $("#ATitle").val() == "" ||
      $("#ADate").val() == "" ||
      $("#ADescription").val() == ""
    ) {
      alert("Provide Every details...");
    } else {
      const appointment = {
        Title: $("#ATitle").val(),
        Date: $("#ADate").val(),
        Description: $("#ADescription").val(),
        UserId: sessionStorage.getItem("userId"),
      };
      $.ajax({
        method: "post",
        url: "http://127.0.0.1:4000/add-task",
        data: appointment,
      });
      alert("Appointment added succesfully...");
      $("#container").removeClass("align-items-center");
      LoadComponent("appointments.html");
      LoadAppointments(sessionStorage.getItem("userId"));
    }
  });

  $(document).on("click", "#DeleteAppointment", (e) => {
    let flag = confirm("Are you sure want to Delete?");
    if (flag) {
      $.ajax({
        method: "delete",
        url: `http://127.0.0.1:4000/delete-task/${e.target.value}`,
      });
      alert("Deleted Succesfully");
      LoadAppointments(sessionStorage.getItem("userId"));
    }
  });

  //edit appointment------------

  $(document).on("click", "#EditAppointment", (e) => {
    $("#container").addClass("align-items-center");
    LoadComponent("edit-appointment.html");
    $.ajax({
      method: "get",
      url: `http://127.0.0.1:4000/get-byid/${e.target.value}`,
      success: (appointments) => {
        $("#ETitle").val(appointments[0].Title);
        $("#EDescription").val(appointments[0].Description);
        $("#EDate").val(
          appointments[0].Date.slice(0, appointments[0].Date.indexOf("T"))
        );
        $("#EInput").val(appointments[0]._id);
      },
    });
  });

  $(document).on("click", "#EUpdate", () => {
    console.log($("#EInput").val());
    let updatedAppointment = {
      Title: $("#ETitle").val(),
      Date: $("#EDate").val(),
      Description: $("#EDescription").val(),
      UserId: sessionStorage.getItem("userId"),
    };
    $.ajax({
      method: "put",
      url: `http://127.0.0.1:4000/edit-task/${$("#EInput").val()}`,
      data: updatedAppointment,
    });

    alert("Task Updated...");
    LoadComponent("appointments.html");
    $("#container").removeClass("align-items-center");
    LoadAppointments(sessionStorage.getItem("userId"));
  });

  $(document).on("click", "#ECancel", () => {
    LoadComponent("appointments.html");
    $("#container").removeClass("align-items-center");
    LoadAppointments(sessionStorage.getItem("userId"));
  });
});
