import Employee from "../models/employee.js";
import EmployeeList from "../models/employee_list.js";
import Validation from "../models/validation.js";

export const employeeList = new EmployeeList();
const validation = new Validation();

export function getEle(id, object = document) {
  return object.getElementById(id);
}

function getValue() {
  const username = getEle("tknv").value;
  const fullname = getEle("name").value;
  const email = getEle("email").value;
  const password = getEle("password").value;
  const beginDate = getEle("datepicker").value;
  const salary = getEle("luongCB").value;
  const role = getEle("chucvu").value;
  const workingHours = getEle("gioLam").value;

  let isValid = true;

  isValid = getValidationConditions(
    isValid,
    getEle("tknv").value,
    getEle("name").value,
    getEle("email").value,
    getEle("password").value,
    getEle("datepicker").value,
    getEle("luongCB").value,
    getEle("chucvu").value,
    getEle("gioLam").value,
    {
      username: "tbTKNV",
      fullname: "tbTen",
      email: "tbEmail",
      password: "tbMatKhau",
      beginDate: "tbNgay",
      salary: "tbLuongCB",
      role: "tbChucVu",
      workingHours: "tbGiolam",
    }
  );

  if (!isValid) return;

  const employee = new Employee(
    username,
    fullname,
    email,
    password,
    beginDate,
    salary,
    role,
    workingHours
  );

  employee.getEmployeeRole(role);

  employee.calculateSalaryByRole();

  employee.calculateRank();

  return employee;
}

function getValidationConditions(
  isValid,
  username,
  fullname,
  email,
  password,
  beginDate,
  salary,
  role,
  workingHours,
  errorIds, // Tạo object để lưu trữ các span ID
  currentUsername = null,
  currentFullname = null,
  currentEmail = null
) {
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
      currentUsername
    );

  isValid &=
    validation.checkEmpty(fullname, "tbTen", "(*) Tên không được để trống") &&
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
      currentFullname
    );

  isValid &=
    validation.checkEmpty(email, "tbEmail", "(*) Email không được để trống") &&
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
      currentEmail
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
    validation.checkNumber(
      salary,
      errorIds.salary,
      "(*) Lương không hợp lệ (hãy bỏ các ký tự nếu có)"
    ) &&
    validation.checkSalaryRange(
      salary,
      errorIds.salary,
      "(*) Lương cơ bản phải từ 1 000 000 - 20 000 000"
    );

  isValid &= validation.checkValidRole(
    role,
    errorIds.role,
    "(*) Xin hãy chọn chức vụ hợp lệ"
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
      "(*) Giờ làm không hợp lệ (hãy bỏ các từ)"
    ) &&
    validation.checkWorkingHours(
      workingHours,
      errorIds.workingHours,
      "Giờ làm chỉ được nằm trong khoảng 80 - 200 giờ"
    );

  return isValid;
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
      let isValid = true;

      isValid = getValidationConditions(
        isValid,
        getEle("edit-tknv").value,
        getEle("edit-name").value,
        getEle("edit-email").value,
        getEle("edit-password").value,
        getEle("edit-datepicker").value,
        getEle("edit-luongCB").value,
        getEle("edit-chucvu").value,
        getEle("edit-gioLam").value,
        {
          username: "tbTKNVEdit",
          fullname: "tbTenEdit",
          email: "tbEmailEdit",
          password: "tbMatKhauEdit",
          beginDate: "tbNgayEdit",
          salary: "tbLuongCBEdit",
          role: "tbChucVuEdit",
          workingHours: "tbGiolamEdit",
        },
        currentUserInfo.username,
        currentUserInfo.fullname,
        currentUserInfo.email
      );

      if (!isValid) return;

      // Truyền các thông tin mới cho hàm editEmployee
      employeeList.editEmployee(
        index,
        username.value,
        fullname.value,
        email.value,
        password.value,
        beginDate.value,
        salary.value,
        role.value,
        workingHours.value
      );
      renderEmployeeList(employeeList.employees);
      setLocalStorage(employeeList.employees);
      getEle("btnDongEdit").click();
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
  const employee = getValue();

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
