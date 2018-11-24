ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
            center: [62.264069, 74.482761],
            zoom: 16
        }, {
            searchControlProvider: 'yandex#search'
        });

	clusterer = new ymaps.Clusterer({
								// Макет метки кластера pieChart.
								clusterIconLayout: 'default#pieChart',
								// Радиус диаграммы в пикселях.
								clusterIconPieChartRadius: 25,
								// Радиус центральной части макета.
								clusterIconPieChartCoreRadius: 10,
								// Ширина линий-разделителей секторов и внешней обводки диаграммы.
								clusterIconPieChartStrokeWidth: 3							
						});				

	$.get('/getdata', {act:'getcontacts'}, function(data) {
		data=JSON.parse(data);
		var points=[];
			for(let i=0;i<data.length;i++){
				point = new ymaps.GeoObject({
					// Описание геометрии.
					geometry: {
						type: "Point",
						coordinates: [data[i].latitude, data[i].longitude]
					},
					
					// Свойства.
					properties: {
						// Контент метки.
						balloonContent:  data[i].name,
						hintContent: data[i].address
					}
				}, {
					draggable: false
				});
				points.push(point);
			};
		clusterer.add(points);
		myMap.geoObjects.add(clusterer);		
	});	
	
}
