module.exports = class EmployerDto {
    id;
    firstName;
    lastName;
    email;
    roles;
    isActivated;
    confirmAuthStatus;
    companyId;
    isPwdChanged

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.firstName = model.firstName;
        this.lastName = model.lastName;
        this.roles = model.roles;
        this.isActivated = model.isActivated;
        this.confirmAuthStatus = model.confirmAuthStatus;
        this.companyId = model.companyId;
        this.isPwdChanged = model?.isPwdChanged;
    }
};
