const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');
const slotController = require('../controllers/slotController');
const verifyUser = require('../middlewares/verifyUser');
const requiredSuperAdmin = require('../middlewares/requiredSuperAdmin');
const upload = require('../middlewares/uploadImage');

router.use(verifyUser(), requiredSuperAdmin);

router.get('/:mapId/slots/qr-code', slotController.getAllSlotDetails);
router.get('/with-shapes', mapController.getAllMapsWithShapes);
router.post('/', upload.any(), mapController.createMap);
router.get('/', mapController.getAllMaps);
router.get('/:id', mapController.getMapById);
router.put('/:id', upload.any(), mapController.updateMap);
router.delete('/shape/:shapeId', mapController.deleteShape);
router.delete('/:id', mapController.deleteMap);

module.exports = router;
