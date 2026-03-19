var roi = BBSR1;

var collection = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(roi)
  .filterDate('2023-01-01', '2023-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .map(function(img) {
    var ndvi = img.normalizedDifference(['B8', 'B4']).rename('NDVI');
    return ndvi.copyProperties(img, ['system:time_start']);
  });   // ← VERY IMPORTANT

var chart = ui.Chart.image.series({
  imageCollection: collection,
  region: roi,
  reducer: ee.Reducer.mean(),
  scale: 50,
});

print(chart);
// Export NDVI image
Export.image.toDrive({
  image: collection.mean(),
  description: 'NDVI_Bhubaneswar',
  scale: 10,
  region: roi,
  maxPixels: 1e13
});