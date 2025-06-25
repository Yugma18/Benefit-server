const express = require("express");
const {
    getAllEmployers,
    createEmployer,
    getEmployerById,
    updateEmployer,
    deleteEmployer,
    addEmployee,
} = require("../controllers/EmployerController");

const router = express.Router();

router.route("/").get(getAllEmployers).post(createEmployer);
router.route("/:id").get(getEmployerById).put(updateEmployer).delete(deleteEmployer);
router.route("/add_employee/:id").post(addEmployee);

module.exports = router;
