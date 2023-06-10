var lastData = 0;
const numberDatas = (window.innerWidth < 768) ? 2 : 5;


document.addEventListener('DOMContentLoaded', function() {
    
  var chartTemp = buildTempChart();
  
  //recarga la pagina si cambia el tamano
  window.addEventListener('resize', function() {
    location.reload();
  });
    
  //insertar nuevo dato
  let btnAddData = document.getElementById('addDataButtonTemp');
  btnAddData.addEventListener('click', function() {
    updateTempChart(chartTemp);
  });
  
});



function updateTempChart(chartTemp){

  //Nuevo dato
  let dataField4Hum = getDataFieldThingSpeak(4, 1);
  let dataField5Temp = getDataFieldThingSpeak(5, 1);

  let entryId = dataField4Hum.feeds[0].entry_id;

  entryId=1
  if(lastData == entryId){
    alert("Todos los datos ya han sido agregados")
  }else{
    chartTemp.data.labels.push(dataField4Hum.feeds[0].created_at);

    let humVar = dataField4Hum.feeds[0].field4;
    let tempVar = dataField5Temp.feeds[0].field5;
    for (let i = 0; i <  chartTemp.data.datasets.length; i++) {
      
      datas =  chartTemp.data.datasets[i];
      if (datas.label === "Temperatura") {
        datas.data.push(tempVar);
      }
    
      if (datas.label === "Humedad") {
        datas.data.push(humVar);
      }
    
      if (datas.label === "Sensación térmica") {
        let calcAux = calculateSensacionTermica(tempVar,humVar);
        datas.data.push(calcAux);
        mediaRecomend1= calculteAverage(datas.data);
      }
    }    
    chartTemp.update();
    //se actualiza la recomendacion
    TempRecomendation(mediaRecomend1);
  }

}


var mediaRecomend1 = 0;

function buildTempChart(){

  TSdata = getDataThingSpeak(numberDatas);

  let labels = [];
  for (let i = 0; i < TSdata.feeds.length; i++) {
    let feed = TSdata.feeds[i];
    labels.push(parseFecha(feed.created_at));
  }

  let HumDatas = [];
  for (let i = 0; i < TSdata.feeds.length; i++) {
    let feed = TSdata.feeds[i];
    HumDatas.push(feed.field4);
  }

  let TempDatas = [];
  for (let i = 0; i < TSdata.feeds.length; i++) {
    let feed = TSdata.feeds[i];
    TempDatas.push(feed.field5);
  }

  let STDatas = [];

  for (let i = 0; i < TempDatas.length; i++) {
    let temperatura = TempDatas[i];
    let humedad = HumDatas[i];
    let sensacionTermica = calculateSensacionTermica(temperatura, humedad);
    STDatas.push(sensacionTermica);
    mediaRecomend1 = mediaRecomend1 + sensacionTermica;
  }

  mediaRecomend1 = calculteAverage(STDatas)

  TempRecomendation(mediaRecomend1);
//configuraciones para la grafica
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Sensación térmica',
        data: STDatas,
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgb(255, 159, 64)',
        stack: 'combined',
        type: 'line',
        order: 1
      },
      {
        label: 'Temperatura',
        data: TempDatas,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgb(255, 99, 132)',
        stack: 'combined',
        type: 'bar',
        order: 0
      },
      {
        label: 'Humedad',
        data: HumDatas,
        borderColor: 'rgb(143, 237, 143)',
        backgroundColor: 'rgb(143, 237, 143)',
        stack: 'combined',
        type: 'line',
        order: 2
      }
    ]
  };


  const configTemp = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Temperatura vs Humedad vs Punto de Rocío'
        }
      }
    },
  };



  const chartTempCanvas = document.getElementById('chartTempCanvas');
  return new Chart(chartTempCanvas, configTemp);

}
