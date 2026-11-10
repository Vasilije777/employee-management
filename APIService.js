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