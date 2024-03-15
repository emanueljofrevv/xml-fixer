# VisualVault XML Fixer

This project is a utility tool designed to automate the process of fixing common issues in Form Templates XML files. It provides a set of features to alert users about potential problems and automatically correct them where possible.

## 🌟 Features

### General

- **Reporting Mode**: Disables automatic fixing.
- **Batch Processing**: Processes all the XML files in the input folder creating outputs specific to each form template.

### Components and Fields

| Configuration/Standard  | Action     | Buttons | Calendar | Cell | Checkbox | Container | Data Grid | Drop-down | Form ID Stamp | Image | Labels | RRC | Signature Stamp | Textbox | Text Area | Upload Buttons |
| ----------------------- | ---------- | :-----: | :------: | :--: | :------: | :-------: | :-------: | :-------: | :-----------: | :---: | :----: | :-: | :-------------: | :-----: | :-------: | :------------: |
| Accessibility Label     | Report/Fix |   ✅    |    ✅    |  ✅  |    ✅    |           |    ✅     |    ✅     |               |  ✅   |        | ✅  |       ✅        |   ✅    |    ✅     |       ✅       |
| Default Name            | Report     |   ✅    |    ✅    |  ✅  |    ✅    |           |    ✅     |    ✅     |      ✅       |  ✅   |        | ✅  |       ✅        |   ✅    |    ✅     |       ✅       |
| Default Text            | Report     |   ✅    |          |      |    ✅    |           |           |           |               |       |        |     |       ✅        |         |           |                |
| Label Overlapping Field | Report     |         |          |      |          |           |           |           |               |       |   ✅   |     |                 |         |           |                |
| Responsive Flow         | Report/Fix |         |          |      |          |    ✅     |           |           |               |       |        |     |                 |         |           |                |
| Right Border Proximity  | Report     |   ✅    |    ✅    |  ✅  |    ✅    |           |           |    ✅     |      ✅       |  ✅   |        |     |       ✅        |   ✅    |    ✅     |       ✅       |
| Simple Upload           | Report/Fix |         |          |      |          |           |           |           |               |       |        |     |                 |         |           |       ✅       |
| Spelling                | Report     |         |    ✅    |  ✅  |    ✅    |           |           |    ✅     |      ✅       |       |        |     |                 |   ✅    |    ✅     |                |
| Tab Order               | Report/Fix |   ✅    |    ✅    |  ✅  |    ✅    |           |           |    ✅     |               |       |        |     |       ✅        |   ✅    |    ✅     |       ✅       |
| Title Case Name         | Report/Fix |         |    ✅    |  ✅  |    ✅    |           |    ✅     |    ✅     |      ✅       |  ✅   |        | ✅  |       ✅        |   ✅    |    ✅     |                |

### Groups and Conditions

- Reports if a field is in more than 1 group.
- Reports if a group does not include an admin override condition.

## 🚀 Getting Started

Include instructions on how to set up, install, and run the project. This section should guide the user through getting a copy of the project up and running on their local machine for development and testing purposes.

```bash
git clone https://github.com/yourrepository/VisualVault-XML-Fixer.git
cd VisualVault-XML-Fixer
# Include other necessary commands
```
