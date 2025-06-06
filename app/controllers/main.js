import Employee from "../models/employee.js";
import EmployeeList from "../models/employee_list.js";
import Validation from "../models/validation.js";

export const employeeList = new EmployeeList();
const validation = new Validation();

export function getEle(id, object = document) {
  return object.getElementById(id);
}

function getEmployeeFromForm(formType, currentEmployee = null) {
  const prefix = formType === "edit" ? "edit-" : "";
  const errorSuffix = formType === "edit" ? "Edit" : "";

  const username = getEle(`${prefix}tknv`).value;
  const fullname = getEle(`${prefix}name`).value;
  const email = getEle(`${prefix}email`).value;
  const password = getEle(`${prefix}password`).value;
  const beginDate = getEle(`${prefix}datepicker`).value;
  const salary = getEle(`${prefix}luongCB`).value;
  const role = getEle(`${prefix}chucvu`).value;
  const workingHours = getEle(`${prefix}gioLam`).value;

  const errorIds = {
    username: `tbTKNV${errorSuffix}`,
    fullname: `tbTen${errorSuffix}`,
    email: `tbEmail${errorSuffix}`,
    password: `tbMatKhau${errorSuffix}`,
    beginDate: `tbNgay${errorSuffix}`,
    salary: `tbLuongCB${errorSuffix}`,
    role: `tbChucVu${errorSuffix}`,
    workingHours: `tbGiolam${errorSuffix}`,
  };

  let isValid = true;

  isValid &=
    validation.checkEmpty(
      username,
      errorIds.username,
      "(*) Tài khoản không được để trống"
    ) &&
    validation.checkUsernameLength(
      username,
      errorIds.username,
      "(*) Tài khoản phải từ 4-6 ký số",
      4,
      6
    ) &&
    validation.checkNumber(
      username,
      errorIds.username,
      "Tài khoản chỉ được chứa ký tự số"
    ) &&
    validation.checkDuplicate(
      username,
      errorIds.username,
      "(*) Tài khoản này đã có người sử dụng",
      employeeList.employees,
      "username",
      currentEmployee?.username
    );

  isValid &=
    validation.checkEmpty(
      fullname,
      errorIds.fullname,
      "(*) Tên không được để trống"
    ) &&
    validation.checkString(
      fullname,
      errorIds.fullname,
      "(*) Tên không hợp lệ (không bao gồm số)"
    ) &&
    validation.checkDuplicate(
      fullname,
      errorIds.fullname,
      "(*) Tên này đã có người sử dụng",
      employeeList.employees,
      "fullname",
      currentEmployee?.fullname
    );

  isValid &=
    validation.checkEmpty(
      email,
      errorIds.email,
      "(*) Email không được để trống"
    ) &&
    validation.checkEmail(
      email,
      errorIds.email,
      "(*) Định dạng email không hợp lệ"
    ) &&
    validation.checkDuplicate(
      email,
      errorIds.email,
      "(*) Email này đã có người sử dụng",
      employeeList.employees,
      "email",
      currentEmployee?.email
    );

  isValid &=
    validation.checkEmpty(
      password,
      errorIds.password,
      "(*) Mật khẩu không được để trống"
    ) &&
    validation.checkPasswordLength(
      password,
      errorIds.password,
      "(*) Mật khẩu phải từ 6-10 ký tự",
      6,
      10
    ) &&
    validation.checkPassword(
      password,
      errorIds.password,
      "(*) Mật khẩu phải chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt"
    );

  isValid &=
    validation.checkEmpty(
      salary,
      errorIds.salary,
      "(*) Lương không được để trống"
    ) &&
    validation.checkNumber(salary, errorIds.salary, "(*) Lương không hợp lệ") &&
    validation.checkSalaryRange(
      salary,
      errorIds.salary,
      "(*) Lương phải từ 1.000.000 - 20.000.000"
    );

  isValid &= validation.checkValidRole(
    role,
    errorIds.role,
    "(*) Hãy chọn chức vụ hợp lệ"
  );

  isValid &=
    validation.checkEmpty(
      workingHours,
      errorIds.workingHours,
      "(*) Giờ làm không được để trống"
    ) &&
    validation.checkNumber(
      workingHours,
      errorIds.workingHours,
      "(*) Giờ làm không hợp lệ"
    ) &&
    validation.checkWorkingHours(
      workingHours,
      errorIds.workingHours,
      "(*) Giờ làm từ 80 đến 200"
    );

  if (!isValid) return null;

  const employee = new Employee(
    username,
    fullname,
    email,
    password,
    beginDate,
    Number(salary),
    role,
    Number(workingHours)
  );

  return employee;
}

function renderEmployeeList(employeeList) {
  let content = "";
  employeeList.forEach((employees) => {
    content += `
            <tr class="text-nowrap" data-userid="${employees.username}">
                <td>${employees.username}</td>
                <td>${employees.fullname}</td>
                <td>${employees.email}</td>
                <td>${employees.beginDate}</td>
                <td>${employees.role}</td>
                <td>${employees.totalSalary}</td>
                <td>${employees.rank}</td>
                <td class="d-flex">
                    <button class="btn btn-success mr-2" data-toggle="modal" data-target="#myEditModal" onclick="handleEditModal(${employees.username})">Edit</button>
                    <button class="btn btn-danger" onclick="onDeleteEmployee(${employees.username})">Delete</button>
                </td>
            </tr>
        
        `;
  });

  getEle("tableDanhSach").innerHTML = content;
}

function handleEditModal(id) {
  // Khởi tạo các giá trị
  let index = -1;
  let initUsername = id;
  let username = getEle("edit-tknv");
  let fullname = getEle("edit-name");
  let email = getEle("edit-email");
  let password = getEle("edit-password");
  let beginDate = getEle("edit-datepicker");
  let salary = getEle("edit-luongCB");
  let role = getEle("edit-chucvu");
  let workingHours = getEle("edit-gioLam");

  // Tìm ra vị trí của employee cần chỉnh sửa dựa trên username
  for (let i = 0; i < employeeList.employees.length; i++) {
    const employee = employeeList.employees[i];
    if (employee.username == initUsername) {
      index = i;
      break;
    }
  }

  if (index !== -1) {
    // Tạo biến lưu thông tin hiện tại của nhân viên
    const currentUserInfo = employeeList.employees[index];

    // Gán cac thông tin hiện tại vào các trường input
    username.value = currentUserInfo.username;
    fullname.value = currentUserInfo.fullname;
    email.value = currentUserInfo.email;
    password.value = currentUserInfo.password;
    beginDate.value = currentUserInfo.beginDate;
    salary.value = currentUserInfo.salary;

    // Khởi tạo điều kiện lấy ra chức vụ
    if (currentUserInfo.role === "Sếp") role.value = "1";
    else if (currentUserInfo.role === "Trưởng phòng") role.value = "2";
    else if (currentUserInfo.role === "Nhân viên") role.value = "3";
    else role.value = "0";
    workingHours.value = currentUserInfo.workingHours;

    getEle("btnCapNhat").onclick = function () {
      const updatedEmployee = getEmployeeFromForm("edit", currentUserInfo);

      if (updatedEmployee) {
        employeeList.editEmployee(index, updatedEmployee);
        renderEmployeeList(employeeList.employees);
        setLocalStorage(employeeList.employees);
        getEle("btnDongEdit").click();
      }
    };
  }
}

window.handleEditModal = handleEditModal;

function onDeleteEmployee(id) {
  employeeList.removeEmployee(id);

  renderEmployeeList(employeeList.employees);

  setLocalStorage(employeeList.employees);
}

window.onDeleteEmployee = onDeleteEmployee;

function setLocalStorage(employeeList) {
  const dataString = JSON.stringify(employeeList);
  localStorage.setItem("employeeList", dataString);
}

function getLocalStorage(key) {
  const dataString = localStorage.getItem(key);

  // Nếu không có dữ liệu thì trả về
  if (!dataString) return;

  const data = JSON.parse(dataString);

  employeeList.employees = data;

  // Cập nhật giao diện
  renderEmployeeList(employeeList.employees);
}

getLocalStorage("employeeList");

getEle("btnThemNV").onclick = function () {
  const employee = getEmployeeFromForm("add");

  if (employee) {
    employeeList.addEmployee(employee);

    renderEmployeeList(employeeList.employees);

    setLocalStorage(employeeList.employees);

    getEle("btnDong").click();
  }
};

getEle("searchName").oninput = function (e) {
  const container = getEle("tableDanhSach");
  employeeList.searchEmployee(e.target.value, container);
};

$(function () {
  $("#datepicker, #edit-datepicker").datepicker({
    dateFormat: "dd/mm/yy",
    showAnim: "fadeIn",
    showOn: "both",
    buttonText: "Chọn ngày",
    buttonImage: "../../img/calendar-icon.png",
    buttonImageOnly: true,
  });
});
