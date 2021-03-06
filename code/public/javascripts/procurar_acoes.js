var map,markers;
var utilizadorID=2;
var organizacao=1;

window.onload = async function () {
  try {
    let user = await $.ajax({
      url: "/api/utilizadores/"+utilizadorID,
      method: "get",
      dataType: "json"
    });
    document.getElementById("userName").innerHTML=user.username;
    if(organizacao==0){
      let userDropBox= "<a href='#' class='selected'>Procurar ações</a>"+
      "<a href='suas_acoes.html' >As suas ações</a>"+
      "<a href='#' onclick='logout()'>Logout</a>";
      document.getElementById("userDropBox").innerHTML = userDropBox;

    }
    if(organizacao==1){
      let userDropBox= "<a href='#' class='selected'>Procurar ações</a>"+
      "<a href='suas_acoes.html' >As suas ações</a>"+
      "<a href='criar_acoes.html'>Criar Acão</a>"+
      "<a href='#' onclick='logout()'>Logout</a>";
      document.getElementById("userDropBox").innerHTML = userDropBox;

    }
  } 
  catch(err) {
    console.log(err);
  }
  
  getLocalizacao(); 

}


function mapSetup(position){
  var latitude=position.coords.latitude;
  var longitude=position.coords.longitude;
  map = L.map('map').setView([latitude,longitude], 50);
  markers = new L.LayerGroup().addTo(map);
  L.tileLayer('https://api.mapbox.com/styles/v1/krscripter/ckigd79nk5gtv19qry86qdzsi/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia3JzY3JpcHRlciIsImEiOiJja2lnZDNlbWQwbmJvMnVxazYwcWU5MDRlIn0.jqnlOPKhrK-r7-Il14uaYQ', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.marker([latitude,longitude]).addTo(map)
      .bindPopup('A sua localização')
      .openPopup();
}
// vai buscar a  nossa localizacao
function getLocalizacao(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(mapSetup);
  }
}

async function procurarAcoes(){
  let data= document.getElementById("date").value;
  let localizacao= document.getElementById("localizacao").value;

  if(data!== "" && localizacao!== "" ) {

    try {
      let acoes = await $.ajax({
        url: "/api/acoes?userID="+utilizadorID+"&localizacao="+localizacao+"&data="+data,
        method: "get",
        dataType: "json"
      });

      markers.clearLayers();

      //vai buscar as acoes da lista e mete acoes no mapa
      for(let acao of acoes){
        var markerIcon = L.icon({
          iconUrl:'./icons/markerVerde.png',
          iconSize:     [50, 50], // size of the icon
          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
       });
        let marker=new L.marker(new L.LatLng(acao.lat, acao.lng), {icon: markerIcon}).addTo(markers);
        marker.bindPopup("<section>"+
        "<p>Nome Organização:  "+acao.NomeOrganizacao+"</p>"+
        "<p>Tipo da ação:  "+acao.nome+"</p>"+
        "<p>Dia ação:  "+acao.diaAcaoInicio.substring(0,10)+ " às " + acao.diaAcaoInicio.substring(11,16) +"</p>"+
        "<p>Total de pessoas inscritas/Maximo:  "+acao.pessoasInscritas+"  /  "+acao.maximoPessoas+"</p></section>"+
        "<button id='btnParticipar' onclick='participar("+acao.acao_id+")'>Participar</button>  <button id='btnMaisInfo' onclick='maisInfoAcao()'>Mais informações</button>");
      }

      if (acoes.length == 0) {
        alert("Não exitem ações nesta data!");
      }
    } 
    catch(err) {
      console.log(err);
    }
  }
}

function maisInfoAcao(){
  window.location = "mais_info.html";
}

async function participar(id) {

  let data = {
    acao_id: id,
    user_id: utilizadorID
  }

try {

    let result = await $.ajax({
        url: "/api/acoes/addacao",
        method: "post",
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json"
    });

    alert("Nova ação adicionada, com sucesso!");
    window.location = "procurar_acoes.html";

} catch(err) {
    console.log(err);
}

}