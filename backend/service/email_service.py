from backend import sg, app


def send_confirmation_email(confirmation_id, email, name):
    base_url = app.config['BASE_URL']
    data = {
        "template_id": "d-335db9b46c12429eae2b7a662752ea07",
        "from": {
            "email": "no-reply@neurodex.app",
            "name": "Neurodex"
        },
        "personalizations": [{
            "to": [
                {
                    "email": email,
                    "name": name
                }
            ],
            "dynamic_template_data": {
                "confirmationLink": f"{base_url}/confirm-email/{confirmation_id}",
                "name": name
            }
        }]
    }
    return sg.client.mail.send.post(request_body=data)
