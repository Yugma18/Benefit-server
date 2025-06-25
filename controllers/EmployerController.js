const employerService = require("../services/EmployerService");

exports.getAllEmployers = async (req, res) => {
    try {
        const employers = await employerService.getAllEmployers();
        res.json({ data: employers, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createEmployer = async (req, res) => {
    try {
        const employer = await employerService.createEmployer(req.body);
        res.json({ data: employer, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getEmployerById = async (req, res) => {
    try {
        const employer = await employerService.getEmployerById(req.params.id);
        res.json({ data: employer, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateEmployer = async (req, res) => {
    try {
        const employer = await employerService.updateEmployer(req.params.id, req.body);
        res.json({ data: employer, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteEmployer = async (req, res) => {
    try {
        const employer = await employerService.deleteEmployer(req.params.id);
        res.json({ data: employer, status: "success" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addEmployee = async (req, res) => {
    try {
        const employer = await employerService.getEmployerById(req.params.id);
        const list = employer.employeeList
        if (list.includes(req.body.employeeId)){
            res.status(500).json({ error: 'Employee already exists' });
        } else {
            const employerUpdate = await employerService.updateEmployer(req.params.id, {employeeList: [ ...list , req.body.employeeId ]});
            res.json({ data: employerUpdate, status: "success" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
