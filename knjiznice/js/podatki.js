/*
const TEACHING_API_BAZA = nirinja;
const SENSEI_RACUN = 0xe080E10741F59862f25A1e7F260209b90656090E;


let SENSEI_BC_RPC_URL = "https://sensei.lavbic.net:8546";
let TEACHING_API_BASE_URL = "https://teaching.lavbic.net/api/OIS/baza/" + TEACHING_API_BAZA + "/podatki/";

function generirajScenarij(stScenarija) {
   return scenarijId;
*/

  var baza = "demo";
  var baseUrl = "https://teaching.lavbic.net/api/OIS/baza/" + baza + "/podatki/";

  function generirajID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  

  function kreirajEHRzaBolnika() {
    var ime = $("#kreirajIme").val();
    var priimek = $("#kreirajPriimek").val();
    var datumRojstva = $("#kreirajDatumRojstva").val();
    if (
      !ime ||
      !priimek ||
      !datumRojstva ||
      ime.trim().length == 0 ||
      priimek.trim().length == 0 ||
      datumRojstva.trim().length == 0
    ) {
      $("#kreirajSporocilo").html(
        "<div class='alert alert-warning alert-dismissible fade show mt-3 mb-0'>" +
          "Prosim vnesite zahtevane podatke!" +
          "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
          "</div>"
      );
    } else {
      var ehrID = generirajID();
      var podatki = {
        ime: ime,
        priimek: priimek,
        datumRojstva: datumRojstva,
      };
      $.ajax({
        url: baseUrl + "azuriraj?kljuc=" + ehrID,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(podatki),
        success: function (data) {
          $("#kreirajSporocilo").html(
            "<div class='alert alert-success alert-dismissible fade show mt-3 mb-0'>" +
              "Uspešna prijava<b>" +
              "</b>." +
              "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
              "</div>"
          );
          $("#preberiEHRid").val(ehrID);
          $("#kreirajIme").val("");
          $("#kreirajPriimek").val("");
          $("#kreirajDatumRojstva").val("");
        },
        error: function (err) {
          $("#kreirajSporocilo").html(
            "<div class='alert alert-danger alert-dismissible fade show mt-3 mb-0'>" +
              "Napaka '" +
              JSON.parse(err.responseText).opis +
              "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
              "!</div>"
          );
        },
      });
    }
  }
  
 
  function preberiEHRodBolnika() {
    var ehrID = $("#preberiEHRid").val();
    if (!ehrID || ehrID.trim().length == 0) {
      $("#preberiSporocilo").html(
        "<div class='alert alert-warning alert-dismissible fade show mt-3 mb-0'>" +
          "Prosim vnesite zahtevan podatek!" +
          "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
          "</div>"
      );
    } else {
      $.ajax({
        url: baseUrl + "vrni/" + ehrID,
        type: "GET",
        success: function (podatki) {
          $("#preberiSporocilo").html(
            "<div class='alert alert-success alert-dismissible fade show mt-3 mb-0'>" +
              "Bolnik <b>" +
              podatki.ime +
              " " +
              podatki.priimek +
              "</b>, ki se je rodil <b>" +
              podatki.datumRojstva +
              "</b>" +
              "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
              ".</div>"
          );
        },
        error: function (err) {
          $("#preberiSporocilo").html(
            "<div class='alert alert-danger alert-dismissible fade show mt-3 mb-0'>" +
              "Napaka '" +
              JSON.parse(err.responseText).opis +
              "<button type='button' class='btn-close' data-bs-dismiss='alert'></button>" +
              "!</div>"
          );
        },
      });
    }
  }

  $(document).ready(function () {

    $("#preberiPredlogoBolnika").change(function () {
      $("#kreirajSporocilo").html("");
      var podatki = $(this).val().split(",");
      $("#kreirajIme").val(podatki[0]);
      $("#kreirajPriimek").val(podatki[1]);
      $("#kreirajDatumRojstva").val(podatki[2]);
    });
  

    $("#preberiEhrIdZaVitalneZnake").change(function () {
      $("#preberiMeritveVitalnihZnakovSporocilo").html("");
      $("#rezultatMeritveVitalnihZnakov").html("");
      $("#meritveVitalnihZnakovEHRid").val($(this).val());
    });
  });
