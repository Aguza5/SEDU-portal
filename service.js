//config vars
const api_key = 'AO7D8W1KC6UOQBFT';


function refreshPage() {
  location.reload();
}

function getDataThingSpeak(dataNumber) {
    // URL ThingSpeak
    let url = 'https://api.thingspeak.com/channels/2182848/feeds.json?api_key='+api_key+'&results='+dataNumber;
  
    // Crear y ennviar solicitud HTTP
    let request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.send();
  
    // Verificar el estado de la respuesta
    if (request.status === 200) {
      // Obtener los datos de la respuesta y almacenarlos en una variable
      let datos = JSON.parse(request.responseText);
  
      return datos;
    } else {
      console.log('Error al realizar la solicitud: ' + request.status);
    }
   
  }
  

function getDataFieldThingSpeak(fieldNumber, dataNumber) {
  // URL ThingSpeak
  let url = 'https://api.thingspeak.com/channels/2182848/fields/'+fieldNumber+'.json?api_key='+api_key+'&results='+dataNumber;
  // Crear y ennviar solicitud HTTP
  let request = new XMLHttpRequest();
  request.open('GET', url, false);
  request.send();

  // Verificar el estado de la respuesta
  if (request.status === 200) {
    // Obtener los datos de la respuesta y almacenarlos en una variable
    let datos = JSON.parse(request.responseText);

    return datos;
  } else {
    console.log('Error al realizar la solicitud: ' + request.status);
  }

}

function parseFecha(fecha) {
  let date = new Date(fecha);
  let dia = date.getUTCDate();
  let mes = date.getUTCMonth() + 1;
  let anio = date.getUTCFullYear();
  let horas = date.getUTCHours() + 2; // por estar en GTM +2
  let minutos = date.getUTCMinutes();
  // Se anhaden 0 en caso de ser necesario
  dia = dia < 10 ? "0" + dia : dia;
  mes = mes < 10 ? "0" + mes : mes;
  minutos = minutos < 10 ? "0" + minutos : minutos;
  
  return dia + "/" + mes + "/" + anio + " " + horas + ":" + minutos;
}

function calculateSensacionTermica(temp, hum) {
  return -8.784695 + 1.61139411 * temp + 2.338549 * hum - 0.14611605 * temp * hum - 0.012308094 * Math.pow(temp, 2) 
         - 0.016424827 * Math.pow(hum, 2) + 0.002211732 * Math.pow(temp, 2) * hum + 0.00072546 * temp * Math.pow(hum, 2) 
         - 0.000003582 * Math.pow(temp, 2) * Math.pow(hum, 2);
}

//Mucho Frio: x<=10 | Frio; x>10 x<20 | Agradable: x>=20 x<30 | Calor: x>=30
function TempRecomendation(temperatura) {
  let res = '';
  if (temperatura <= 10) {
    res = "¡Hace mucho frío! Te recomiendo que te abrigues bien para mantener el calor.";
  } else if (temperatura > 10 && temperatura < 20) {
    res = "¡Hace frío!, te sugiero que te abrigues adecuadamente para evitar el frío.";
  } else if (temperatura >= 20 && temperatura < 30) {
    res ="La temperatura es agradable ¡Genial!, disfruta de este clima agradable y siéntete cómodo.";
  } else {
    res = "¡Hace calor! Te aconsejo que te refresques y tomes precauciones para mantenerte fresco.";
  }

  var tempRecomendation = document.getElementById("TempRecomendation");
  if (tempRecomendation) {
    tempRecomendation.innerHTML = "<p>" + res + "</p>";
  }

}

function calculteAverage(array) {
  var suma = 0;

  for (var i = 0; i < array.length; i++) {
    suma += array[i];
  }

  var media = suma / array.length;
  return media;
}