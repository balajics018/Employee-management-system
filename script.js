
let employees = JSON.parse(localStorage.getItem('employees')) || [];
let currentPage = 1;
const rowsPerPage = 5;
let isEditing = false;
let editingId = null;

const modal = document.getElementById('employeeModal');
const addBtn = document.getElementById('addBtn');
const closeBtn = document.querySelector('.close');
const cancelBtn = document.querySelector('.close-btn');
const form = document.getElementById('employeeForm');
const tableBody = document.getElementById('tableBody');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

document.addEventListener('DOMContentLoaded', () => {
    renderTable();
});


addBtn.addEventListener('click', () => {
    isEditing = false;
    form.reset();
    document.getElementById('modalTitle').innerText = "Add Employee";
    document.getElementById('empId').value = "EMP-" + Date.now();
    openModal();
});

function openModal() {
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

[closeBtn, cancelBtn].forEach(btn => btn.addEventListener('click', closeModal));



form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    
    const employeeData = {
        id: document.getElementById('empId').value,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        gender: document.querySelector('input[name="gender"]:checked').value,
        department: document.getElementById('department').value,
        designation: document.getElementById('designation').value,
        salary: document.getElementById('salary').value,
        doj: document.getElementById('doj').value,
        address: document.getElementById('address').value
    };

    if (isEditing) {
        
        const index = employees.findIndex(emp => emp.id === editingId);
        employees[index] = employeeData;
        isEditing = false;
        editingId = null;
    } else {
        employees.push(employeeData);
    }

    saveAndRender();
    closeModal();
});


function renderTable() {
    tableBody.innerHTML = "";
    
    
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedItems = employees.slice(startIndex, endIndex);

    if (paginatedItems.length === 0 && currentPage > 1) {
        currentPage--;
        renderTable();
        return;
    }

    paginatedItems.forEach(emp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${emp.id}</td>
            <td>${emp.fullName}</td>
            <td>${emp.email}</td>
            <td>${emp.department}</td>
            <td>${emp.designation}</td>
            <td>
                <button class="btn edit-btn" onclick="editEmployee('${emp.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn danger-btn" onclick="deleteEmployee('${emp.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    updatePaginationControls();
}


window.editEmployee = (id) => {
    const emp = employees.find(e => e.id === id);
    if (emp) {
        isEditing = true;
        editingId = id;
        
        
        document.getElementById('empId').value = emp.id;
        document.getElementById('fullName').value = emp.fullName;
        document.getElementById('email').value = emp.email;
        document.getElementById('phone').value = emp.phone;
        
        
        const radio = document.querySelector(`input[name="gender"][value="${emp.gender}"]`);
        if (radio) radio.checked = true;
        
        document.getElementById('department').value = emp.department;
        document.getElementById('designation').value = emp.designation;
        document.getElementById('salary').value = emp.salary;
        document.getElementById('doj').value = emp.doj;
        document.getElementById('address').value = emp.address;
        
        document.getElementById('modalTitle').innerText = "Edit Employee";
        openModal();
    }
};


window.deleteEmployee = (id) => {
    
    if (confirm("Are you sure you want to delete this employee?")) {
        employees = employees.filter(emp => emp.id !== id); 
        saveAndRender();
    }
};

function saveAndRender() {
    localStorage.setItem('employees', JSON.stringify(employees)); 
    renderTable(); 
}

function updatePaginationControls() {
    pageInfo.innerText = `Page ${currentPage}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = (currentPage * rowsPerPage) >= employees.length;
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

nextBtn.addEventListener('click', () => {
    if ((currentPage * rowsPerPage) < employees.length) {
        currentPage++;
        renderTable();
    }
});