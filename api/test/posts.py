from datetime import datetime
from http import HTTPStatus
from typing import Any

from api.models import Post
from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient


class PostsTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="test_user",
            email="test_user@example.org",
            password="test_password",
            # is_superuser=True is currently required due to
            # rest_framework's default permissions.
            # TODO: Resolve this. Each user should be able to manage
            # their _own_ posts, and staff or superusers should be
            # able to manage _any_ post.
            is_superuser=True,
        )

        self.posts = [
            Post.objects.create(author=self.user, content="post1"),
            Post.objects.create(author=self.user, content="post2"),
        ]

    def _endpoint(self, leaf: Any = None) -> str:
        """Returns `/posts/` if `leaf` is omitted, otherwise `/posts/{leaf}/`

        When provided, `leaf` is stripped of `/` characters from its start/end.
        """
        endpoint = "/posts/"

        if leaf:
            endpoint += f"{str(leaf).strip('/').rstrip('/')}/"

        return endpoint

    def test_post_unauthorized(self) -> None:
        data = {"content": "test"}
        endpoint = self._endpoint()

        response = self.client.post(endpoint, data=data)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_post(self) -> None:
        data = {"content": "test"}
        endpoint = self._endpoint()

        self.client.force_authenticate(self.user)
        response = self.client.post(endpoint, data=data)
        self.assertEqual(response.status_code, HTTPStatus.OK)

        # Check that the post we created can be found in the database
        data = response.json()
        post_id = data.get("id")
        post = Post.objects.get(pk=post_id)
        self.assertNotEqual(post, None)

    def test_multi_get(self) -> None:
        # Make a GET request to /posts/
        endpoint = self._endpoint()
        response = self.client.get(endpoint)
        self.assertEqual(response.status_code, HTTPStatus.OK)

        # Deserialize JSON data from the response
        data = response.json()

        # Check the first post
        post1, post1_json = self.posts[0], data[0]
        self.assertEqual(post1_json.get("content"), post1.content)

        # Check the second post
        post2, post2_json = self.posts[1], data[1]
        self.assertEqual(post2_json.get("content"), post2.content)

    def test_get(self) -> None:
        post = self.posts[0]
        endpoint = self._endpoint(post.id)
        response = self.client.get(endpoint)
        self.assertEqual(response.status_code, HTTPStatus.OK)

        # Check that all of our API output came out as expected
        data = response.json()
        self.assertEqual(data.get("id"), post.id)
        self.assertTrue(data.get("url").endswith(f"{post.id}/"))
        self.assertTrue(data.get("author").endswith(f"{self.user.id}/"))
        self.assertEqual(data.get("content"), post.content)
        self.assertNotEqual(data.get("created"), None)
        self.assertEqual(data.get("edited"), None)

    def test_patch_unauthorized(self) -> None:
        post = self.posts[0]

        data = {"content": "updated"}
        endpoint = self._endpoint(post.id)

        response = self.client.patch(endpoint, data=data)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_patch(self) -> None:
        # Verify that a new post has a null edited column
        post = self.posts[0]
        self.assertEqual(post.edited, None)

        # Login
        self.client.force_authenticate(user=self.user)

        # Patch an existing post
        endpoint = self._endpoint(post.id)
        data = {"content": "updated"}
        response = self.client.patch(endpoint, data=data)
        self.assertEqual(response.status_code, HTTPStatus.OK)

        # Expect that the post's edited column was set
        data = response.json()
        self.assertEqual(data.get("content"), "updated")
        self.assertNotEqual(data.get("edited"), None)

        # Compare JSON we got with our updated post object
        post = Post.objects.get(pk=post.id)

        # Compare post.id with the API's "id" field
        self.assertEqual(post.id, data.get("id"))

        # Ensure that post.id was used as a tail in API's "url" field
        url_tail = f"/posts/{post.id}/"
        self.assertTrue(data.get("url").endswith(url_tail))

        # Ensure that self.user.id was used as a tail in API's "author" field
        author_tail = f"/users/{self.user.id}/"
        self.assertTrue(data.get("author").endswith(author_tail))

        # Compare the 'content' column
        self.assertEqual(post.content, data.get("content"))

        # Compare the 'created' column
        created = datetime.fromisoformat(
            data.get("created").rstrip("Z")
        ).astimezone(post.created.tzinfo)
        self.assertEqual(post.created, created)

        # Compare the 'edited' column
        edited = datetime.fromisoformat(
            data.get("edited").rstrip("Z")
        ).astimezone(post.edited.tzinfo)
        self.assertEqual(post.edited, edited)

    def test_put_unauthorized(self) -> None:
        post = self.posts[0]

        data = {"content": "test change"}
        endpoint = self._endpoint(post.id)

        response = self.client.put(endpoint, data=data)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_put_method_not_allowed(self) -> None:
        post = self.posts[0]

        data = {"content": "test change"}
        endpoint = self._endpoint(post.id)

        self.client.force_authenticate(self.user)
        response = self.client.put(endpoint, data=data)
        self.assertEqual(response.status_code, HTTPStatus.METHOD_NOT_ALLOWED)

    def test_delete_unauthorized(self) -> None:
        post = self.posts[0]

        endpoint = self._endpoint(post.id)

        response = self.client.delete(endpoint)
        self.assertEqual(response.status_code, HTTPStatus.UNAUTHORIZED)

    def test_delete(self) -> None:
        # Perform a query against the first post
        post = Post.objects.get(pk=self.posts[0].id)
        self.assertNotEqual(post, None)

        # Login
        self.client.force_authenticate(self.user)

        # Send a DELETE request for the post
        endpoint = self._endpoint(post.id)
        response = self.client.delete(endpoint)
        self.assertEqual(response.status_code, HTTPStatus.OK)

        # Perform another query against the first post
        post = Post.objects.filter(pk=self.posts[0].id).first()

        # It should no longer exist
        self.assertEqual(post, None)
