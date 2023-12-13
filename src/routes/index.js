const express = require("express")
const router = express.Router();

const employeeRouter = require("./employee.route");
const departmentRouter = require("./department.route")

const productsRouter = require("./products.route.js");
const salesRouter = require("./sales.route.js");

/**
 * Inicializacion de todas las rutas
 */
router.use("/employees", employeeRouter);
router.use("/departments", departmentRouter)
router.use("/products", productsRouter);
router.use("/sales", salesRouter);

module.exports = router;