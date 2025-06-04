import { getEle } from "../controllers/main.js";
import Employee from "./employee.js";

class EmployeeList {
  constructor() {
    this.employees = [];
  }

  searchEmployee(input, container) {
    const childList = container.querySelectorAll("tr");
    const searchValue = input.trim().toLowerCase();

    childList.forEach((child) => {
      const roleCell = child.querySelectorAll("td")[6];
      if (!roleCell) {
        child.style.display = "none";
        return;
      }
      const employeeRole = roleCell.textContent.trim().toLowerCase();

      if (employeeRole.includes(searchValue) || searchValue === "") {
        child.style.display = "table-row";
      } else {
        child.style.display = "none";
      }
    });
  }

  addEmployee(employee) {
    this.employees.push(employee);
  }

  removeEmployee(id) {
    let index = -1;
    for (let i = 0; i < this.employees.length; i++) {
      const employee = this.employees[i];
      if (employee.username == id) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      this.employees.splice(index, 1);
    }
  }

  editEmployee(
    id,
    username,
    fullname,
    email,
    password,
    beginDate,
    salary,
    role,
    workingHours
  ) {
    if (id !== -1) {
      // Tạo một Object Employee mới với tất cả thông tin mới
      const editedInfo = new Employee(
        username,
        fullname,
        email,
        password,
        beginDate,
        salary,
        role,
        workingHours
      );

      // Tính toán lại các giá trị
      editedInfo.getEmployeeRole(role);

      editedInfo.calculateSalaryByRole();

      editedInfo.calculateRank();

      // Gán object mới vào object hiện tại để thay thế nó
      this.employees[id] = editedInfo;
    }
  }
}

export default EmployeeList;
