const apiKey = "bygS6woF8nVt2ACQoGaC02FNsIEJSpHYn0oQMaFl";
const apodUrl = "https://api.nasa.gov/planetary/apod";
const afeedUrl = "https://api.nasa.gov/neo/rest/v1/feed";


function handleAFeedData({element_count, near_earth_objects}, afeedElement, afeedTable){
    

    afeedElement.innerHTML = Object.keys(near_earth_objects).map(date=>{
        return near_earth_objects[date].map(asteroid=>{
            const name      = asteroid.name;
            const dangerous = asteroid.is_potentially_hazardous_asteroid;
            const magnitude = asteroid.absolute_magnitude_h;
            const close_approach_data = asteroid.close_approach_data.shift();
            const miss_distance = close_approach_data.miss_distance.kilometers;

            return `<tr>
                <td>${name}</td>
                <td>${dangerous ? "YES" : "NO"}</td>
                <td>${magnitude}</td>
                <td>${miss_distance}</td>
                <td>${date}</td>
            </tr>`

        }).join("");

    }).join("");

    if(afeedElement.innerHTML === ""){
        afeedTable.className = "striped hide"
    } else{
        afeedTable.className = "striped";
    }


}

function contentLoaded(){
    const apodElement = document.getElementById("apod");
    const startElement = document.getElementById("start");
    const afeedElement = document.getElementById("afeed");
    const afeedTable   = document.getElementById("afeedTable");

    /** Apod */

    fetch(`${apodUrl}?api_key=${apiKey}`)
    .then(res=>res.json())
    .then(data=>{

        let media = "";
        if(data.media_type === "image"){
            media = `<img class="responsive-img" src="${data.hdurl}">`
        } else {
            media = `<div class="video-container">
                        <iframe src="${dat.hdurl}" width="560" height="315"></iframe>
                    </div>`
        }

        apodElement.innerHTML = (`
            <div class="card-image">
                ${media}
                <span class="card-title">${data.title}</span>
            </div>
            <div class="card-content">
                <p>
                    ${data.explanation}
                </p>

                <p>${(new Date(data.date)).toDateString()}</p>
                <p>© ${data.copyright}</p>
            </div>
            <div class="card-action">
                <a target="_blank" href="https://www.nasa.gov/">Find more @ Nasa</a>
            </div>
        `)
    }).catch(handleError);

    /** Asteroid Feed */
    const elems = document.querySelectorAll('.datepicker');
    const instances = M.Datepicker.init(elems, {
        autoClose: true,
        defaultDate: new Date(),
        format: 'yyyy-mm-dd'
    });

    start.addEventListener("change", function(){

        fetch(`${afeedUrl}?start_date=${this.value}&api_key=${apiKey}`)
        .then(res=>res.json())
        .then(data=>handleAFeedData(data, afeedElement, afeedTable))
        .catch(handleError);

        console.log(this.value);
    })

}

function handleError(error){
    console.warn(error.message);
}

window.addEventListener("DOMContentLoaded", contentLoaded)



function vnosDatuma(){

}



//   APLIKACIJA

const TEACHING_API_BAZA = nirinja;
const SENSEI_RACUN = 0xe080E10741F59862f25A1e7F260209b90656090E;


let SENSEI_BC_RPC_URL = "https://sensei.lavbic.net:8546";
let TEACHING_API_BASE_URL =
  "https://teaching.lavbic.net/api/OIS/baza/" + TEACHING_API_BAZA + "/podatki/";

  