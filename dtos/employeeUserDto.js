module.exports = class EmployeeDto {
    id;
    firstName;
    lastName;
    email;
    roles;
    isActivated;
    image;
    phone;
    departmentId;
    employerId;
    employeeId;
    uei;
    startDate;
    bonusPlanId;
    companyId
    confirmAuthStatus;
    isPwdChanged;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.roles = model.roles;
        this.isActivated = model.isActivated;
        this.image = model.image;
        this.phone = model.phone;
        this.departmentId = model.departmentId;
        this.employerId = model.employerId;
        this.employeeId = model.employeeId;
        this.uei = model.uei;
        this.startDate = model.startDate;
        this.bonusPlanId = this.bonusPlanId;
        this.confirmAuthStatus = model.confirmAuthStatus;
        this.companyId = model.companyId;
        this.isPwdChanged = model?.isPwdChanged;
    }
};
