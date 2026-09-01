"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mechanic_controller_1 = require("../controllers/mechanic.controller");
const router = (0, express_1.Router)();
router.get('/', mechanic_controller_1.getMechanics);
router.get('/:id', mechanic_controller_1.getMechanicById);
router.patch('/:id/status', mechanic_controller_1.updateMechanicStatus);
exports.default = router;
