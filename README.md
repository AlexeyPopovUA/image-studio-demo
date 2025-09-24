# Image Studio Demo

This is a web application for browsing and editing images, sourced from the public "Picsum Photos" API. The application allows users to view a gallery of images, select an image, and apply various edits such as resizing, grayscale, and blur effects.

This project was bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

*   Browse a paginated gallery of images from Picsum Photos.
*   Edit image properties like width, height, grayscale, and blur.
*   Download the edited image.
*   Responsive design that works on different screen sizes.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **UI:** [React](https://react.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
*   **Package Manager:** [pnpm](https://pnpm.io/)

## Getting Started

### Prerequisites

*   Node.js (version 22)
*   pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd image-studio-demo
    ```
3.  Install the dependencies:
    ```bash
    pnpm install
    ```

### Running the Development Server

To start the development server, run:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

In the project directory, you can run:

*   `pnpm dev`: Runs the app in development mode.
*   `pnpm build`: Builds the app for production to the `out` folder.
*   `pnpm start`: Starts a local production server.
*   `pnpm lint`: Runs ESLint to check for code quality issues.