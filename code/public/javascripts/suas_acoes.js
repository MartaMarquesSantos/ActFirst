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
      let userDropBox= "<a href='procurar_acoes.html'>Procurar ações</a>"+
      "<a href='#' class='selected'>As suas ações</a>"+
      "<a href='#' onclick='logout()'>Logout</a>";
      document.getElementById("userDropBox").innerHTML = userDropBox;

    }
    if(organizacao==1){
      let userDropBox= "<a href='procurar_acoes.html'>Procurar ações</a>"+
      "<a href='#' class='selected'>As suas ações</a>"+
      "<a href='criar_acoes.html'>Criar Acão</a>"+
      "<a href='#' onclick='logout()'>Logout</a>";
      document.getElementById("userDropBox").innerHTML = userDropBox;

    }


  } 
  catch(err) {
    console.log(err);
  }

  mapSetup();

}


function mapSetup(){

  map = L.map('map').setView([38.718334,-9.150734], 13);
  markers = new L.LayerGroup().addTo(map);
  L.tileLayer('https://api.mapbox.com/styles/v1/krscripter/ckigd79nk5gtv19qry86qdzsi/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia3JzY3JpcHRlciIsImEiOiJja2lnZDNlbWQwbmJvMnVxazYwcWU5MDRlIn0.jqnlOPKhrK-r7-Il14uaYQ', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}

async function suasAcoesFiltrar(){

  let AP=document.getElementById("AP");
  let APP=document.getElementById("APP");
  let AF=document.getElementById("AF");

  if(AP.checked){
    
    try {
        let acoes = await $.ajax({
          url: "/api/acoes/participadas?userID="+utilizadorID,
          method: "get",
          dataType: "json"
        });
  
        markers.clearLayers();
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
          "<button class='btnMaisInfo' onclick='maisInfoAcao()'>Mais informações</button>");
       }
  
        if (acoes.length == 0) {
          alert("Não participou em nenhuma ação!");
        }
      } 
      catch(err) {
        console.log(err);
      }

  }
  if(APP.checked){

    try {
      let acoes = await $.ajax({
        url: "/api/acoes/participacao?userID="+utilizadorID,
        method: "get",
        dataType: "json"
      });

      markers.clearLayers();
      for(let acao of acoes){
        var markerIcon = L.icon({
          iconUrl:'./icons/markerVerde.png',
          iconSize:     [50, 50], // size of the icon
          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
       });
        //Caso seja uma organização
        if(organizacao==1){
          let marker=new L.marker(new L.LatLng(acao.lat, acao.lng), {icon: markerIcon}).addTo(markers);
          marker.bindPopup("<section>"+
          "<p>Nome Organização:  "+acao.NomeOrganizacao+"</p>"+
          "<p>Tipo da ação:  "+acao.nome+"</p>"+
          "<p>Dia ação:  "+acao.diaAcaoInicio.substring(0,10)+ " às " + acao.diaAcaoInicio.substring(11,16) +"</p>"+
          "<p>Total de pessoas inscritas/Maximo:  "+acao.pessoasInscritas+"  /  "+acao.maximoPessoas+"</p></section>"+
          "<button class='btnApagarAcao' onclick='ApagarAcao("+acao.acao_id+")'>Apagar Ação</button>  <button class='btnMaisInfo' onclick='maisInfoAcao()'>Mais informações</button>");  
        }
        else{
          let marker=new L.marker(new L.LatLng(acao.lat, acao.lng), {icon: markerIcon}).addTo(markers);
          marker.bindPopup("<section>"+
          "<p>Nome Organização:  "+acao.NomeOrganizacao+"</p>"+
          "<p>Tipo da ação:  "+acao.nome+"</p>"+
          "<p>Dia ação:  "+acao.diaAcaoInicio.substring(0,10)+ " às " + acao.diaAcaoInicio.substring(11,16) +"</p>"+
          "<p>Total de pessoas inscritas/Maximo:  "+acao.pessoasInscritas+"  /  "+acao.maximoPessoas+"</p></section>"+
          "<button class='btnAbandonar' onclick='abandonar("+acao.acao_id+")'>Abandonar</button>  <button class='btnMaisInfo' onclick='maisInfoAcao()'>Mais informações</button>");
        }
      }

      if (acoes.length == 0) {
        alert("Não se encontra a participar em nenhuma ação!");
      }
    } 
    catch(err) {
      console.log(err);
    }

  }
  if(AF.checked){
    try {
      let acoes = await $.ajax({
        url: "/api/acoes/futuras?userID="+utilizadorID,
        method: "get",
        dataType: "json"
      });

      markers.clearLayers();
      for(let acao of acoes){
        var markerIcon = L.icon({
          iconUrl:'./icons/markerVerde.png',
          iconSize:     [50, 50], // size of the icon
          popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
       });
       //Caso seja uma organização
        if(organizacao==1){
          let marker=new L.marker(new L.LatLng(acao.lat, acao.lng), {icon: markerIcon}).addTo(markers);
          marker.bindPopup("<section>"+
          "<p>Nome Organização:  "+acao.NomeOrganizacao+"</p>"+
          "<p>Tipo da ação:  "+acao.nome+"</p>"+
          "<p>Dia ação:  "+acao.diaAcaoInicio.substring(0,10)+ " às " + acao.diaAcaoInicio.substring(11,16) +"</p>"+
          "<p>Total de pessoas inscritas/Maximo:  "+acao.pessoasInscritas+"  /  "+acao.maximoPessoas+"</p></section>"+
          "<button class='btnApagarAcao' onclick='ApagarAcao("+acao.acao_id+")'>Apagar Ação</button>  <button class='btnMaisInfo' onclick='maisInfoAcao()'>Mais informações</button>");  
        }
        else{
          let marker=new L.marker(new L.LatLng(acao.lat, acao.lng), {icon: markerIcon}).addTo(markers);
          marker.bindPopup("<section>"+
          "<p>Nome Organização:  "+acao.NomeOrganizacao+"</p>"+
          "<p>Tipo da ação:  "+acao.nome+"</p>"+
          "<p>Dia ação:  "+acao.diaAcaoInicio.substring(0,10)+ " às " + acao.diaAcaoInicio.substring(11,16) +"</p>"+
          "<p>Total de pessoas inscritas/Maximo:  "+acao.pessoasInscritas+"  /  "+acao.maximoPessoas+"</p></section>"+
          "<button class='btnAbandonar' onclick='abandonar("+acao.acao_id+")'>Abandonar</button>  <button class='btnMaisInfo' onclick='maisInfoAcao()'>Mais informações</button>");
        }
      }

      if (acoes.length == 0) {
        alert("Não se encontra a participar em nenhuma ação futuramente!");
      }
    } 
    catch(err) {
      console.log(err);
    }

  }
}
