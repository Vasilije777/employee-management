const API_URL = "http://localhost:5000/employees";

// ==========================================
// KLASA 1: ZADUŽENA ZA REST API (KOMUNIKACIJA SA SERVEROM)
// ==========================================
class APIService {
    // GET metoda: Preuzimanje svih zaposlenih
    static async getAllEmployees() {
        const response = await fetch(API_URL);
        return await response.json();
    }

    // POST metoda: Slanje novog zaposlenog
    static async createEmployee(employeeData) {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employeeData)
        });
        return await response.json();
    }

    // PUT metoda: Izmena zaposlenog na osnovu ID-ja
    static async updateEmployee(id, employeeData) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employeeData)
        });
        return await response.json();
    }

    // DELETE metoda: Brisanje zaposlenog
    static async deleteEmployee(id) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        return await response.json();
    }
}

// ==========================================
// KLASA 2: ZADUŽENA ZA IZGLED I AKCIJE (DOM I KORISNIČKI INTERFEJS)
// ==========================================
class App {
    constructor() {
        // Hvatanje elemenata sa HTML stranice
        this.form = document.getElementById("employee-form");
        this.idInput = document.getElementById("employee-id");
        this.nameInput = document.getElementById("name");
        this.roleInput = document.getElementById("role");
        this.statusInput = document.getElementById("status");
        this.tableBody = document.getElementById("employee-table-body");
        this.formTitle = document.getElementById("form-title");
        this.submitBtn = document.getElementById("submit-btn");
        this.cancelBtn = document.getElementById("cancel-btn");

        this.initEvents();
        this.renderTable();
    }

    initEvents() {
        this.form.addEventListener("submit", (e) => this.handleSubmit(e));
        this.cancelBtn.addEventListener("click", () => this.resetForm());
    }

    // Funkcija koja crta tabelu sa radnicima na ekranu
    async renderTable() {
        try {
            const employees = await APIService.getAllEmployees();
            this.tableBody.innerHTML = ""; 

            employees.forEach(emp => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${emp.id}</td>
                    <td><strong>${emp.name}</strong></td>
                    <td>${emp.role}</td>
                    <td><span class="status-badge">${emp.status}</span></td>
                    <td>
                        <button class="btn btn-edit" onclick="app.editEmployee('${emp.id}', '${emp.name.replace(/'/g, "\\'")}', '${emp.role.replace(/'/g, "\\'")}', '${emp.status}')">Izmeni</button>
                        <button class="btn btn-danger" onclick="app.deleteEmployee('${emp.id}')">Obriši</button>
                    </td>
                `;
                this.tableBody.appendChild(tr);
            });
        } catch (error) {
            console.error("Greška pri renderovanju tabele:", error);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const id = this.idInput.value;
        const employeeData = {
            name: this.nameInput.value,
            role: this.roleInput.value,
            status: this.statusInput.value
        };

        try {
            if (id) {
                await APIService.updateEmployee(id, employeeData);
            } else {
                
                await APIService.createEmployee(employeeData);
            }

            this.resetForm();
            this.renderTable(); 
        } catch (error) {
            console.error("Prava greška u konzoli:", error);
            alert("Došlo je do greške prilikom čuvanja podataka.");
        }
    }

    // Prebacivanje forme u mod za izmenu podataka
    editEmployee(id, name, role, status) {
        this.idInput.value = id;
        this.nameInput.value = name;
        this.roleInput.value = role;
        this.statusInput.value = status;

        this.formTitle.innerText = "Izmeni zaposlenog";
        this.submitBtn.innerText = "Ažuriraj";
        this.cancelBtn.style.display = "inline-block";
    }

    // Brisanje zaposlenog
    async deleteEmployee(id) {
        if (confirm("Da li ste sigurni da želite da obrišete ovog zaposlenog?")) {
            try {
                await APIService.deleteEmployee(id);
                this.renderTable();
            } catch (error) {
                alert("Greška prilikom brisanja.");
            }
        }
    }

    // Vraćanje forme na početni izgled
    resetForm() {
        this.form.reset();
        this.idInput.value = "";
        this.formTitle.innerText = "Dodaj novog zaposlenog";
        this.submitBtn.innerText = "Sačuvaj";
        this.cancelBtn.style.display = "none";
    }
}

const app = new App();