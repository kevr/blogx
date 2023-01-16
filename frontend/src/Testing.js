export const mockPost = (title, content) => ({
  id: 1,
  author: {
    id: 999,
    url: "http://testserver/users/999/",
    name: "John Doe",
    username: "john",
    email: "john@example.org",
  },
  title: title,
  content: content,
  created: "2023-1-12T00:00:00Z",
  edited: "2023-1-12T00:30:00Z",
});
