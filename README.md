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

#### Notes:

Description of configurations/standards. The table above has priority over the preconditions listed here.

- **Accessibility Label**: Fields that should have a `Accessibility Label Text` value in the `Accessibility` configurations.
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

## 🚀 Getting Started

Include instructions on how to set up, install, and run the project. This section should guide the user through getting a copy of the project up and running on their local machine for development and testing purposes.

```bash
git clone https://github.com/yourrepository/VisualVault-XML-Fixer.git
cd VisualVault-XML-Fixer
# Include other necessary commands
```
