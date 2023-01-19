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

export const mockSocial = (location, url) => ({
  location,
  url,
});

export const mockProfile = (username) => ({
  avatar: "/path/to/avatar.jpg",
  bio: `A simple bio about ${username}.`,
  socials: [
    mockSocial("Github", "https://github.com/example"),
    mockSocial("Facebook", "https://facebook.com"),
    mockSocial("Twitter", "https://twitter.com"),
  ],
});

let id = 0;
export const mockUser = (username) => {
  id += 1;
  return {
    id: id,
    username: username,
    name: "John Doe",
    profile: mockProfile(username),
  };
};
