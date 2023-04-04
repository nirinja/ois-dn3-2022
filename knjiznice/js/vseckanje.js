const TEACHING_API_BAZA = nirinja;
const SENSEI_RACUN = 0x71Ff6CEc078608612DbA2a336C77D82415D35B2C;


let SENSEI_BC_RPC_URL = "https://sensei.lavbic.net:8546";
let TEACHING_API_BASE_URL = "https://teaching.lavbic.net/api/OIS/baza/" + TEACHING_API_BAZA + "/podatki/";

let prijavljenRacun;
let web3;

 //Funkcija za donacijo 0,1 Ethereum kriptovalute
 const donirajEthereum = async (modalnoOknoDoniraj) => {
    var posiljateljDenarnica = $("#prijava").attr("denarnica");
  
    await web3.eth.sendTransaction(
      {
        from: posiljateljDenarnica,
        to: SENSEI_RACUN,
        value: $("#rangeInput").val() * Math.pow(10, 18),
      },
      function (napaka, rezultat) {
        // ob uspešni transakciji
  
        if (!napaka) {
          let data = { oliverHash: `${rezultat}` };
          $.ajax({
            url: "https://teaching.lavbic.net/api/OIS/baza/nirinja/podatki/azuriraj?kljuc=oliver&elementTabele=true",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(data),
            accept: "*/*",
            success: function (podatki) {},
          });
          modalnoOknoDoniraj.hide();
        } else {
          // neuspešna transakcija
          $("#napakaDonacija").html(
            "<div class='alert alert-danger' role='alert'>" +
              "<i class='fas fa-exclamation-triangle me-2'></i>" +
              "Prišlo je do napake pri transakciji: " +
              napaka +
              "</div>"
          );
        }
      }
    );
  };


 //Funkcija za prikaz donacij v tabeli

const dopolniTabeloDonacij = async () => {
    try {
        let steviloBlokov = (await web3.eth.getBlock("latest")).number;
        let st = 1;
        $("#seznam-donacij").html("");
        $.ajax({
          url: "https://teaching.lavbic.net/api/OIS/baza/nirinjathedev/podatki/vrni/vsi",
          type: "GET",
          success: function (podatki) {
            let st = 1;
    
            podatki["oliver"].forEach(async function (el) {
              let tx = await web3.eth.getTransaction(el["oliverHash"]);
              $("#seznam-donacij").append(
                "\
                    <tr>\
                        <th scope='row'>" + st++ + "</th>\
                        <td>" + okrajsajNaslov(tx.hash) + "</td>\
                        <td>" + okrajsajNaslov(tx.from) + "</td>\
                        <td>" + okrajsajNaslov(tx.to) + "</td>\
                        <td>" + parseFloat(web3.utils.fromWei(tx.value)) + " <i class='fa-brands fa-ethereum'></i></td>\
                    </tr>");
                });
            },
        });
    } catch (e) {
        alert(e);
    }
};

function okrajsajNaslov(vrednost) {
    return vrednost.substring(0, 4) + "..." + vrednost.substring(vrednost.length - 3, vrednost.length);
}


 // Funkcija za prijavo Ethereum denarnice v testno omrežje
const prijavaEthereumDenarnice = async (modalnoOknoPrijava) => {
    try {
        let rezultat = await web3.eth.personal.unlockAccount(
            $("#denarnica").val(),
            $("#geslo").val(),
            300);

        // ob uspešni prijavi računa
        if (rezultat) {
            prijavljenRacun = $("#denarnica").val();
            $("#prijava").html(okrajsajNaslov($("#denarnica").val()) + " (5 min)");
      
            $("#prijava").attr("denarnica", $("#denarnica").val());
            $("#gumb-doniraj-start").removeAttr("disabled");
            $("#prijava").prop("disabled", true);
            modalnoOknoPrijava.hide();
          } else {
            // neuspešna prijava računa
            $("#napakaPrijava").html(
                "<div class='alert alert-danger' role='alert'>" +
                "<i class='fas fa-exclamation-triangle me-2'></i>" +
                "Prišlo je do napake pri odklepanju!" +
                "</div>"
            );
        }
    } catch (napaka) {
        // napaka pri prijavi računa
        $("#napakaPrijava").html(
            "<div class='alert alert-danger' role='alert'>" +
            "<i class='fas fa-exclamation-triangle me-2'></i>" +
            "Prišlo je do napake pri odklepanju: " + napaka +
            "</div>"
        );

    }
};


 // Funkcija za dodajanje poslušalcev modalnih oken
 function poslusalciModalnaOkna() {
  const modalnoOknoPrijava = new bootstrap.Modal(
    document.getElementById("modalno-okno-prijava")
  );

  const modalnoOknoDoniraj = new bootstrap.Modal(
    document.getElementById("modalno-okno-donacije")
  );

 /* let input = document.querySelector(".gumb-potrdi-prijavo");
  let button = document.querySelector(".button");
  
  button.disabled = true; //setting button state to disabled
  
  input.addEventListener("change", stateHandle);
  
  function stateHandle() {
      if (document.querySelector(".input").value === "") {
          button.disabled = true; //button remains disabled
      } else {
          button.disabled = false; //button is enabled
      }
  }
  $("#denarnica,#geslo").keyup(function (e) {
    if ($("#denarnica").val().length > 0 && $("#geslo").val().length > 0)
      $("#gumb-potrdi-prijavo").removeAttr("disabled");
    else $("#gumb-potrdi-prijavo").attr("disabled", "disabled");
  });*/

  $("#gumb-potrdi-prijavo").click(function (e) {
    prijavaEthereumDenarnice(modalnoOknoPrijava);
  });

  $("#potrdi-donacijo").click(function (e) {
    donirajEthereum(modalnoOknoDoniraj);
  });

  var modalnoOknoDonacije = document.getElementById("modalno-okno-donacije");
  modalnoOknoDonacije.addEventListener("show.bs.modal", function (event) {
    var prijavljenaDenarnica = $("#prijava").attr("denarnica");
    $("#posiljatelj").text(prijavljenaDenarnica);
  });

  var modalnoOknoSeznamDonacij = document.getElementById(
    "modalno-okno-seznam-donacij"
  );
  modalnoOknoSeznamDonacij.addEventListener("show.bs.modal", function (event) {
    dopolniTabeloDonacij();
  });
}

$(document).ready(function () {
  //Povežemo se na testno Ethereum verigo blokov 
  web3 = new Web3(SENSEI_BC_RPC_URL);

  poslusalciModalnaOkna();
  dopolniTabeloDonacij();

  generirajPodatkeGumb();
  generirajScenarijGumb();
  function generirajPodatkeGumb() {
    $("#generiranje").on("click", () => {
      generiranje();
    });
  }

  function generirajScenarijGumb() {
    $("#scenarijGumb").on("click", () => {
      for (let i = 0; i < $("#dropDown")[0].children.length; i++) {
        if (
          $("#inputId")[0].value.toLowerCase() ==
          $("#dropDown")[0].children[i].textContent.trim().toLowerCase()
        ) {
          generirajScenarij(i + 1);
          location.href = `#${i + 1}scenarij`;
          return;
        }
      }
      generirajScenarij($("#inputId")[0].value);
      location.href = `#${$("#inputId")[0].value}scenarij`;
    });

    for (let i = 0; i < $("#dropDown").children().length; i++) {
      $("#dropDown")
        .children()
        [i].addEventListener("click", (e) => {
          generirajScenarij(i + 1);
        });
    }
  }
});
