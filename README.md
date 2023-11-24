# Firebase Cloud Function for Managing Posts

This Firebase Cloud Function provides an API to manage posts.

## Prerequisites

- Node.js and npm installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project set up on the [Firebase Console](https://console.firebase.google.com/)
- Firebase Admin SDK credentials configured

## Installation

1. Clone the repository: `git clone https://github.com/your-username/your-repo.git`
2. Install dependencies: `cd your-repo && npm install`
3. Deploy the Cloud Function: `firebase deploy --only functions`

## Usage

- **Create a Post:** `POST /posts`
- **Read a Post:** `GET /posts/:postId`
- **Read All Posts:** `GET /posts`
- **Update a Post:** `PUT /posts/:postId`
- **Delete a Post:** `DELETE /posts/:postId`

## Error Handling

- 404 error if a post is not found.
- 500 error for internal server issues.

## Contributing

Contributions welcome! Submit issues or pull requests.

## License

This project is licensed under the MIT License.
