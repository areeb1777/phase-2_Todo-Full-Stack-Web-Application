def test_create_todo(test_client, auth_headers):
    response = test_client.post(
        "/todos/",
        json={"title": "Test Todo"},
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["completed"] is False


def test_get_todos(test_client, auth_headers):
    # Create a todo first
    test_client.post(
        "/todos/",
        json={"title": "Todo for list"},
        headers=auth_headers,
    )
    response = test_client.get("/todos/", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_update_todo(test_client, auth_headers):
    # Create a todo
    create_resp = test_client.post(
        "/todos/",
        json={"title": "Todo to update"},
        headers=auth_headers,
    )
    todo_id = create_resp.json()["id"]

    # Update it
    response = test_client.put(
        f"/todos/{todo_id}",
        json={"completed": True},
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["completed"] is True


def test_delete_todo(test_client, auth_headers):
    # Create a todo
    create_resp = test_client.post(
        "/todos/",
        json={"title": "Todo to delete"},
        headers=auth_headers,
    )
    todo_id = create_resp.json()["id"]

    # Delete it
    response = test_client.delete(f"/todos/{todo_id}", headers=auth_headers)
    assert response.status_code == 204
