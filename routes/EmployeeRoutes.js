const express = require("express");
const {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    addBonusPlan,
} = require("../controllers/EmployeeController");

const router = express.Router();

router.route("/").get(getAllEmployees).post(createEmployee);
router.route("/:id").get(getEmployeeById).put(updateEmployee).delete(deleteEmployee);
router.route("/add_bonus/:id").post(addBonusPlan);

module.exports = router;
