from locust import HttpUser, task, between

class SpringBootUser(HttpUser):
    wait_time = between(1, 3)  # Wait between requests

    # @task
    # def get_dashboard(self):
    #     self.client.get("/api/dashboard")

    @task
    def post_expense(self):
        self.client.post("/auth/login", json={
            "username": "navi",
            "password": "securePassword123"
        
        })
