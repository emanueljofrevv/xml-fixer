# VisualVault XML Fixer

This project is a utility tool designed to automate the process of fixing common issues in Form Templates XML files. It provides a set of features to alert users about potential problems and automatically correct them where possible.
<br/><br/>

## 🌟 Features

### General

- **Reporting Mode**: Disables automatic fixing.
- **Batch Processing**: Processes all the XML files in the input folder creating outputs specific to each form template.

### Components and Fields

| Configuration/Standard                      | Action     | Buttons | Calendar | Cell | Checkbox | Container | Data Grid | Drop-down | Form ID Stamp | Image | Labels | RRC | Signature Stamp | Textbox | Text Area | Upload Buttons |
| ------------------------------------------- | ---------- | :-----: | :------: | :--: | :------: | :-------: | :-------: | :-------: | :-----------: | :---: | :----: | :-: | :-------------: | :-----: | :-------: | :------------: |
| Accessibility Label Text                    | Report/Fix |   ✅    |    ✅    |  ✅  |    ✅    |           |    ✅     |    ✅     |               |  ✅   |        | ✅  |       ✅        |   ✅    |    ✅     |       ✅       |
| Accessibility Label and Label Text Matching | Report/Fix |   ✅    |    ✅    |  ✅  |    ✅    |           |    ✅     |    ✅     |               |  ✅   |   ✅   | ✅  |       ✅        |   ✅    |    ✅     |       ✅       |
| Default Name                                | Report     |   ✅    |    ✅    |  ✅  |    ✅    |           |    ✅     |    ✅     |      ✅       |  ✅   |        | ✅  |       ✅        |   ✅    |    ✅     |       ✅       |
| Default Text                                | Report     |   ✅    |          |      |    ✅    |           |           |           |               |       |        |     |       ✅        |         |           |                |
| Label Overlapping Field                     | Report     |         |          |      |          |           |           |           |               |       |   ✅   |     |                 |         |           |                |
| Responsive Flow                             | Report/Fix |         |          |      |          |    ✅     |           |           |               |       |        |     |                 |         |           |                |
| Right Border Proximity                      | Report     |   ✅    |    ✅    |  ✅  |    ✅    |           |           |    ✅     |      ✅       |  ✅   |        |     |       ✅        |   ✅    |    ✅     |       ✅       |
| Simple Upload                               | Report/Fix |         |          |      |          |           |           |           |               |       |        |     |                 |         |           |       ✅       |
| Spelling                                    | Report     |         |    ✅    |  ✅  |    ✅    |           |           |    ✅     |      ✅       |       |        |     |                 |   ✅    |    ✅     |                |
| Tab Order                                   | Report/Fix |   ✅    |    ✅    |  ✅  |    ✅    |           |           |    ✅     |               |       |        |     |       ✅        |   ✅    |    ✅     |       ✅       |
| Title Case Name                             | Report/Fix |         |    ✅    |  ✅  |    ✅    |           |    ✅     |    ✅     |      ✅       |  ✅   |        | ✅  |       ✅        |   ✅    |    ✅     |                |

#### Notes:

Description of configurations/standards. The table above has priority over the preconditions listed here.

- **Accessibility Label Text**: Fields that should have a `Accessibility Label Text` value in the `Accessibility` configurations.
  - Preconditions:
    - `Name` must have a non-default value.
    - `Name` must be on title case.
    - `Name` must have no spelling errors.
- **Accessibility Label Text and Label Text Matching**: The `Accessibility Label Text` of an input field must match the `Label Text` value. For some input fields that do not use labels (checkboxes, buttons) the `Accessibility Label Text` must match the `Text` value.
  - Preconditions:
    - `Name` must have a non-default value.
    - `Name` must be on title case.
    - `Name` must have no spelling errors.
- **Default Name**: Fields that should not have the default `Name` value in the `Control Properties` configurations.
- **Default Text**: Fields that should not have the default `Text` value in the `Appearance` configurations.
- **Label Overlapping Field**: Alerts if a label is overlapping a field by more than 5px.
- **Responsive Flow**: Containers with more than 1 field in them should have the `Responsive Flow` value in the `Appearance` configurations set to `1 Column` or `2 Columns`.
- **Right Border Proximity**: Fields that should not be closer than 30px from the form right margin.
- **Simple Upload**: Upload buttons that should have the `Display Uploaded Files` checkbox in the `Miscellaneous` configurations unchecked.
- **Spelling**: Fields that should have the `Name` value in the `Control Properties` configurations checked for spelling errors.
  - Preconditions:
    - `Name` must have a non-default value.
- **Tab Order**: Fields that should have the `Tab Order` value in the `Appearance` configurations set to `0`.
- **Title Case**: Fields that should have the `Name` value in the `Appearance` on title case.
  - Preconditions:
    - `Name` must have a non-default value.

### Groups and Conditions

- Reports if a field is in more than 1 group.
- Reports if a group does not include an admin override condition.
  <br/><br/>

## 🚀 Getting Started

To get started with the VisualVault XML Fixer, follow these steps:

### 1. Clone the Repository

Clone the repository to your local machine using the following command:

```
git clone https://github.com/visualvault/xml-fixer.git
```

### 2. Install Required Modules

Navigate to the project directory and install the required modules by running the following command:

```
npm install
```

### 3. Create Folders

Create the following folders inside the project directory:

- `public`: This folder will contain any public assets or files that need to be served.
- `public/input`: This folder will contain the XML files that need to be processed.
- `public/output`: This folder will store the processed XML files and the markdown reports.

You can create these folders manually or use the following commands:

```
mkdir public
mkdir public/input
mkdir public/output
```

## 🛠️ How To Use

1. Export the form template xml file from the VisualVault environment.
2. Place the xml file in the input path `/public/input`.
3. Open your terminal or command prompt and navigate to the directory where your project is located.
4. Once you are in the project directory, run the command `npm start`.

## 🚀🐳 Getting Started with Docker Setup and Usage

If you prefer to use Docker for running the `xml-fixer` application, follow these steps for a smooth setup and execution process. This guide assumes you have Docker and Docker Compose installed on your machine. If not, please install them from the [official Docker website](https://www.docker.com/get-started) before proceeding.

### Initial Setup

1. **Clone the repository:** If you haven't already, clone the `xml-fixer` repository to your local machine.

    ```bash
    git clone <repository-url>
    ```

2. **Navigate to the project directory:** Change your current directory to the `xml-fixer` project directory.

    ```bash
    cd xml-fixer
    ```

3. **Build and run the Docker environment:** Use the following Docker Compose command to build the Docker image and start the container in detached mode. The `--build` flag ensures that Docker builds the image before starting the containers, while `-d` runs them in the background (detached mode).

    ```bash
    docker-compose up -d --build
    ```

    This command does a few things:
    - **Builds a Docker image** for the `xml-fixer` application based on the instructions in the `Dockerfile`. This includes setting up the required environment, dependencies, and application files.
    - **Starts the containers** specified in your `docker-compose.yml` file. In this case, it runs the `xml-fixer` application container.
    - **Runs the containers in detached mode** (`-d`), meaning they run in the background. You can use your terminal or command prompt for other commands while the container continues to run.

### Running the Application

After setting up Docker as described above, you're ready to use the `xml-fixer` application with Docker.

1. **Export the form template XML file** from the VisualVault environment.

2. **Place the XML file** in the project's `/public/input` directory. If you're using Docker, you might need to place the file in the corresponding directory on your host machine that's mapped to the Docker container.

3. **Execute the container:** If the container is already running in detached mode, the application inside the container is ready to use. Otherwise, you can start the container with:

    ```bash
    docker-compose up -d
    ```

4. **Accessing the application:** Depending on how `xml-fixer` is configured, you might interact with it through command line commands, APIs, or web interfaces. Refer to specific `xml-fixer` usage instructions for details on how to use the application.

### Stopping the Application

To stop the running Docker container(s), use the following command:

```bash
docker-compose down
