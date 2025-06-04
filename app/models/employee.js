class Employee {
  constructor(
    username,
    fullname,
    email,
    password,
    beginDate,
    salary,
    role,
    workingHours
  ) {
    this.username = username;
    this.fullname = fullname;
    this.email = email;
    this.password = password;
    this.beginDate = beginDate;
    this.salary = salary ?? 0;
    this.role = role;
    this.workingHours = workingHours;
    this.totalSalary = 0;
    this.rank = "";
  }

  calculateRank() {
    if (this.workingHours >= 192) {
      this.rank = "Xuất sắc";
      console.log(this.rank);
    } else if (176 <= this.workingHours && this.workingHours < 192) {
      this.rank = "Giỏi";
      console.log(this.rank);
    } else if (160 <= this.workingHours && this.workingHours < 176) {
      this.rank = "Khá";
      console.log(this.rank);
    } else {
      this.rank = "Trung bình";
      console.log(this.rank);
    }
  }

  getEmployeeRole(roleId) {
    if (roleId == 1) {
      this.role = "Sếp";
    } else if (roleId == 2) {
      this.role = "Trưởng phòng";
    } else if (roleId == 3) {
      this.role = "Nhân viên";
    }
  }

  calculateSalaryByRole() {
    if (this.role == "Sếp") {
      this.totalSalary = this.salary * 3;
    } else if (this.role == "Trưởng phòng") {
      this.totalSalary = this.salary * 2;
    } else {
      this.totalSalary = this.salary;
    }
  }
}

export default Employee;
