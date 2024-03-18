/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
const nspell = require("nspell");
const fs = require("fs");
const { addToReport } = require("./report");

/* -------------------------------------------------------------------------- */
/*                              GLOBAL VARIABLES                              */
/* -------------------------------------------------------------------------- */

const fix = {
  accessibilityLabel: false,
  case: false,
  responsiveFlow: false,
  simpleUpload: false,
  tabOrder: false,
};

// Exceptions to the Title Case rule
const uppercaseExceptionWords = ["of", "to", "a", "and", "the", "in", "on"];
const PA_EXCEPTIONS = ["MPI", "ACT13", "PB22", "DBA"];
const WA_EXCEPTIONS = ["DP", "Auth"];
const titleCaseExceptions = [
  "ID",
  "SSN",
  "EIN",
  "DOB",
  "POA",
  "POC",
  "POI",
  "POE",
  "CSV",
  ...PA_EXCEPTIONS,
  ...WA_EXCEPTIONS,
  ...uppercaseExceptionWords,
];
const noLabelFields = [
  "FieldLabel",
  "FormIDStamp",
  "FormButton",
  "FieldContainer",
  "FieldCheckbox",
  "ImageFormControl",
  "RepeatingRowControl",
  "FieldDataGrid",
  "UploadButton",
];
const noTitleCaseFields = [
  "FieldLabel",
  "FormIDStamp",
  "FormButton",
  "FieldContainer",
  "RepeatingRowControl",
  "FieldDataGrid",
  "UploadButton",
];

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

function createAccTextWithLabel(form, pIndex, fieldIndex, fieldName) {
  const field = getPageFields(form, pIndex)[fieldIndex];
  const fieldType = field.$["xsi:type"];
  const fields = getPageFields(form, pIndex);

  let isRequired = false;
  let newAccText = "";
  let cleanedLabelText = "";

  if (
    fieldType === "FieldCheckbox" ||
    fieldType === "FormButton" ||
    fieldType === "FormIDStamp" ||
    fieldType === "UploadButton"
  ) {
    const [fieldText] = field.Text;
    isRequired = isRequiredField(field, fieldText);
    [cleanedLabelText] = fieldText.split("<")[0].split(":");
  } else {
    const fieldLabel = findFieldLabeByProximity(field, fields);
    const labelText = fieldLabel ? fieldLabel.Text[0] : "";
    isRequired = isRequiredField(field, labelText);
    [cleanedLabelText] = labelText.split("<")[0].split(":");
  }

  newAccText = cleanedLabelText.trim();

  if (isRequired) {
    newAccText += " Required Field";
  }

  return newAccText;
}

function isRequiredField(field, labelText) {
  const fieldType = field.$["xsi:type"];
  let isRequired = false;

  if (
    fieldType === "FieldCheckbox" ||
    fieldType === "FormButton" ||
    fieldType === "FormIDStamp" ||
    fieldType === "UploadButton"
  ) {
    isRequired = field.Text[0].includes("*");
  } else {
    isRequired = labelText && labelText.includes("*");
  }

  return isRequired;
}

function checkAccessibility(form, pIndex, fieldIndex) {
  const field = getPageFields(form, pIndex)[fieldIndex];
  const fieldType = field.$["xsi:type"];
  const fieldName = getFieldName(form, pIndex, fieldIndex);
  const fieldHasLabel = !noLabelFields.includes(fieldType);
  const fieldNameCanBeUsed = !noTitleCaseFields.includes(fieldType);
  let currentAccText = getAccesibilityText(form, pIndex, fieldIndex);
  let newAccText = "";

  newAccText = createAccTextWithLabel(form, pIndex, fieldIndex, fieldName);

  if (!newAccText) {
    newAccText = fieldName;
  }

  if (!currentAccText) {
    if (fix.accessibilityLabel && fieldNameCanBeUsed) {
      form.FormPages[0].FormPage[pIndex].FieldList[0].BaseField[
        fieldIndex
      ].AccessibilityLabel[0] = newAccText;
      currentAccText = newAccText;

      addToReport(
        `#### ${fieldName}`,
        `The \`Accessibility Label\` was set to \`'${newAccText}'\`.`,
      );
    } else {
      addToReport(`#### ${fieldName}`, `The \`Accessibility Label\` is empty.`);
    }
  }

  if (currentAccText && currentAccText !== newAccText) {
    if (fix.accessibilityLabel && fieldNameCanBeUsed) {
      form.FormPages[0].FormPage[pIndex].FieldList[0].BaseField[
        fieldIndex
      ].AccessibilityLabel[0] = newAccText;

      addToReport(
        `#### ${fieldName}`,
        `The \`Accessibility Label\` was changed from \`'${currentAccText}'\` to \`'${newAccText}'\`.`,
      );
    } else if (fieldNameCanBeUsed) {
      addToReport(
        `#### ${fieldName}`,
        `The current \`Accessibility Label\` value \`'${currentAccText}'\` does not match with the recommended value \`'${newAccText}'\`.`,
      );
    } else if (!isStrTitleCase(currentAccText)) {
      addToReport(
        `#### ${fieldName}`,
        `The current \`Accessibility Label\` value \`'${currentAccText}'\` does not follow the accessibility standards.`,
      );
    } else {
      const labelTextCouldBeOk = currentAccText
        .split(" ")
        .filter((word) => fieldName.includes(word));

      if (!labelTextCouldBeOk) {
        addToReport(
          `#### ${fieldName}`,
          `The current \`Accessibility Label\` value \`'${currentAccText}'\` needs to be manually reviewed.`,
        );
      }
    }
  }

  return form;
}

function checkDistanceToBorder(form, field) {
  const fieldName = field.Name[0];
  const distanceToLeftBorder = Number(field.LayoutLeft[0]);
  const layoutRight = distanceToLeftBorder + Number(field.Width[0]);
  const pageWidth = Number(form.FormPages[0].FormPage[0].Width);
  const distanceToRightBorder = Math.abs(Number(pageWidth - layoutRight));

  if (distanceToRightBorder < 30) {
    addToReport(
      `#### ${fieldName}`,
      `The field is less than 30px from the right border.`,
    );
  }
}

function checkTabOrder(form, field, pageIndex, fieldIndex) {
  const fieldName = field.Name[0];
  const tabOrder = Number(field.TabOrder[0]);

  if (tabOrder !== 0) {
    if (fix.tabOrder) {
      form.FormPages[0].FormPage[pageIndex].FieldList[0].BaseField[
        fieldIndex
      ].TabOrder[0] = 0;

      addToReport(`#### ${fieldName}`, `The field \`Tab Order\` was set to 0.`);
    } else {
      addToReport(
        `#### ${fieldName}`,
        `The field has a \`Tab Order\` value different than 0.`,
      );
    }
  }

  return form;
}

function findFieldLabeByProximity(field, fields) {
  const fieldTop = Number(field.LayoutTop[0]);
  const fieldLeft = Number(field.LayoutLeft[0]);
  const onlyLabels = fields.filter((f) => f.$["xsi:type"] === "FieldLabel");

  const fieldLabel = onlyLabels.find((f) => {
    const labelTop = Number(f.LayoutTop[0]);
    const labelLeft = Number(f.LayoutLeft[0]);
    const labelWidth = Number(f.Width[0]);
    const labelRight = labelLeft + labelWidth;
    const isAboutSameHeight = Math.abs(labelTop - fieldTop) <= 15;
    const isProximate = Math.abs(fieldLeft - labelRight) <= 60;

    return isProximate && isAboutSameHeight;
  });

  return fieldLabel;
}

function findLabelFieldByProximity(labelData, fields) {
  const labelTop = Number(labelData.LayoutTop[0]);
  const labelLeft = Number(labelData.LayoutLeft[0]);
  const labelWidth = Number(labelData.Width[0]);
  const labelRight = labelLeft + labelWidth;

  const filteredFields = fields.filter((f) => {
    const fieldType = f.$["xsi:type"];
    return !noLabelFields.includes(fieldType);
  });

  const field = filteredFields.find((f) => {
    const fieldTop = Number(f.LayoutTop[0]);
    const fieldLeft = Number(f.LayoutLeft[0]);
    const isAboutSameHeight = Math.abs(labelTop - fieldTop) <= 15;
    const isProximate = fieldLeft - labelRight <= 100;

    return isProximate && isAboutSameHeight && fieldLeft > labelLeft;
  });

  return field;
}

function fixTitleCase(form, pIndex, fieldIndex) {
  const fieldName = getFieldName(form, pIndex, fieldIndex);

  if (fix.case) {
    const titleCaseFieldName = strToTitleCase(fieldName);

    form.FormPages[0].FormPage[pIndex].FieldList[0].BaseField[
      fieldIndex
    ].Name[0] = titleCaseFieldName;

    addToReport(
      `#### ${fieldName}`,
      `The field name \`${fieldName}\` was changed to \`${titleCaseFieldName}\`.`,
    );
  }

  return form;
}

function getAccesibilityText(form, pIndex, fieldIndex) {
  const fields = getPageFields(form, pIndex);
  const field = fields[fieldIndex];
  const accessibilityLabel = field.AccessibilityLabel[0];
  return accessibilityLabel;
}

function getFieldName(form, pIndex, fieldIndex) {
  const fields = getPageFields(form, pIndex);
  const field = fields[fieldIndex];
  const fieldName = field.Name[0];
  return fieldName;
}

function getPageFields(form, pIndex) {
  return form.FormPages[pIndex].FormPage[0].FieldList[0].BaseField;
}

function getLabelByFieldByName(form, fieldName) {
  const fields = form.FormPages[0].FormPage[0].FieldList[0].BaseField;
  let labelData;

  fields.forEach((field) => {
    const fieldType = field.$["xsi:type"];
    const isLabel = fieldType === "FieldLabel";

    if (isLabel) {
      const labelLayoutTop = field.LayoutTop[0];
      const labelText = field.Text[0];
      const namePartialMatch = labelText.includes(fieldName.trim());
      const similarTopDistance =
        Math.abs(field.LayoutTop[0] - labelLayoutTop) <= 15;

      if (namePartialMatch && similarTopDistance) {
        labelData = labelText;
      }
    }
  });

  return labelData;
}

function getPropertyValueByPropetyName(field, propertyName) {
  const hasPorperty = propertyName in field;
  if (hasPorperty) {
    return field[propertyName][0];
  }

  throw new Error("propertyName not exist");
}

function hasDefaultName(fieldName, fieldType = "Default") {
  // object mapping pattern of defaults names according to field type
  const defaultNames = {
    Default: "DataField[0-9]+",
    UploadButton: "UploadButton[0-9]+",
    ImageFormControl: "Image[0-9]+",
    RepeatingRowControl: "RepeatingRowControl[0-9]+",
    FieldDataGrid: "DataGrid[0-9]+",
  };

  const isDefaultName = new RegExp(defaultNames[fieldType]).test(fieldName);

  if (isDefaultName) {
    addToReport(
      `#### ${fieldName}`,
      `The field name \`${fieldName}\` has a default value.`,
    );
  }

  return isDefaultName;
}

function hasDefaultText(field) {
  const fieldName = field.Name[0];
  const fieldType = field.$["xsi:type"];
  const defaultText = field.Text[0];
  let isDefaultText = false;
  let regExp;

  switch (fieldType) {
    case "FieldCheckbox":
      regExp = /Checkbox/;
      break;
    case "UserIDStamp":
      regExp = /Signature Stamp/;
      break;
    case "FormButton":
      regExp = /Next/;
      break;
    default:
      // handle other field types here
      break;
  }

  isDefaultText = regExp.test(fieldName);

  if (isDefaultText) {
    addToReport(
      `#### ${fieldName}`,
      `The field text \`${defaultText}\` has a default value.`,
    );
  }

  return isDefaultText;
}

function isExceptionWord(word) {
  const regex = new RegExp(`\\b${word}\\b`, "i");
  return titleCaseExceptions.some((exc) => regex.test(exc));
}

function isLabelOverlaping(field, fields) {
  const lblLeft = Number(field.LayoutLeft[0]);
  const lblTop = Number(field.LayoutTop[0]);
  const lblWidth = Number(field.Width[0]);
  const lblRight = lblLeft + lblWidth;
  const labelName = field.Name[0];

  fields.forEach((f) => {
    const fieldLeft = Number(f.LayoutLeft[0]);
    const fieldTop = Number(f.LayoutTop[0]);
    const fieldName = f.Name[0];
    const topAproxEqual = Math.abs(fieldTop - lblTop) <= 15;
    const borderAproxOverlap = lblRight - fieldLeft >= 5;
    const isLabel = f.$["xsi:type"] === "FieldLabel";
    const isFormStamp = f.$["xsi:type"] === "FormIDStamp";

    if (
      !isLabel &&
      !isFormStamp &&
      topAproxEqual &&
      borderAproxOverlap &&
      fieldLeft > lblLeft
    ) {
      addToReport(
        `#### ${fieldName}`,
        `The field is overlapping with the label \`${labelName}\`.`,
      );
    }
  });
}

function isStrTitleCase(fieldName) {
  // Split the string into an array of words
  const words = fieldName.split(" ");

  // Check each word to see if it follows the Title Case pattern
  words.forEach((word) => {
    // Check if the word is not empty (to handle multiple spaces)
    if (word) {
      // If the first letter is not uppercase or the rest of the word has any uppercase letter, return false
      const isFirstLetterUppercase = word[0] === word[0].toUpperCase();
      const isRestOfWordLowercase =
        word.slice(1) === word.slice(1).toLowerCase();

      if (!isFirstLetterUppercase || !isRestOfWordLowercase) {
        const includesException = isExceptionWord(word);

        if (!includesException) {
          return false;
        }
      }
    }
    return true;
  });
}

function checkTitleCase(fieldName) {
  // Split the string into an array of words
  const words = fieldName.split(" ");

  // Check each word to see if it follows the Title Case pattern
  words.forEach((word) => {
    // Check if the word is not empty (to handle multiple spaces)
    if (word) {
      // If the first letter is not uppercase or the rest of the word has any uppercase letter, return false
      const isFirstLetterUppercase = word[0] === word[0].toUpperCase();
      const isRestOfWordLowercase =
        word.slice(1) === word.slice(1).toLowerCase();

      if (!isFirstLetterUppercase || !isRestOfWordLowercase) {
        const includesException = isExceptionWord(word);

        if (!includesException) {
          addToReport(
            `#### ${fieldName}`,
            `The field name \`${fieldName}\` is not in title case.`,
          );
          return false;
        }
      }
    }
    return true;
  });

  // If all words follow the Title Case pattern, return true
  return true;
}

function strToTitleCase(str) {
  // Split the string into an array of words
  const words = str.split(" ");

  // Capitalize the first letter of each word
  const titleCaseWords = words.map((word) => wordToUppercase(word));

  // Join the words back into a single string
  return titleCaseWords.join(" ");
}

function wordToUppercase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/* -------------------------------------------------------------------------- */
/*                                SPELL CHECKER                               */
/* -------------------------------------------------------------------------- */

// Hunspell dictionary and affix files
const affixPath = "./src/hunspell/en_US.aff";
const dictionaryPath = "./src/hunspell/en_US.dic";

// Load dictionary and affix files (these paths are just examples)
const dic = fs.readFileSync(dictionaryPath, "utf-8");
const aff = fs.readFileSync(affixPath, "utf-8");

// Create the nspell spellchecker with the loaded dictionary
const spellchecker = nspell({ dic, aff });

function hasSpellingError(fieldName) {
  let hasError = false;
  const words = fieldName.split(" ");

  words.forEach((word) => {
    const isValid = spellchecker.correct(word);
    const isException = isExceptionWord(word);

    if (!isValid && !isException) {
      const suggestedWords = spellchecker.suggest(word);
      const suggestionMsg =
        suggestedWords.length > 0 ? suggestedWords : "No suggestions";

      addToReport(
        `#### ${fieldName}`,
        `Possible misspeled word: \`${word}\`.
        Suggested spellings: \`${suggestionMsg}\`
        Manually check accessibility label.`,
      );

      hasError = true;
    }
  });

  return hasError;
}

/* -------------------------------------------------------------------------- */
/*                         FIELD TYPES HELPER FUNCTION                        */
/* -------------------------------------------------------------------------- */

function button(form, pIndex, fieldIndex) {
  const fieldName = getFieldName(form, pIndex, fieldIndex);
  const field = getPageFields(form, pIndex)[fieldIndex];

  checkDistanceToBorder(form, field);
  form = checkTabOrder(form, field, pIndex, fieldIndex);

  if (!hasDefaultName(fieldName)) {
    if (!checkTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    }
    form = checkAccessibility(form, pIndex, fieldIndex);
  }

  hasDefaultText(field);

  return form;
}

function calendar(form, pIndex, fieldIndex) {
  const fieldName = getFieldName(form, pIndex, fieldIndex);
  const field = getPageFields(form, pIndex)[fieldIndex];

  checkDistanceToBorder(form, field);
  form = checkTabOrder(form, field, pIndex, fieldIndex);

  if (!hasDefaultName(fieldName)) {
    if (!checkTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    }
    if (!hasSpellingError(fieldName)) {
      form = checkAccessibility(form, pIndex, fieldIndex);
    }
  }

  return form;
}

function cell(form, pIndex, fieldIndex) {
  const field = getPageFields(form, pIndex)[fieldIndex];
  const fieldName = getFieldName(form, pIndex, fieldIndex);

  checkDistanceToBorder(form, field);
  form = checkTabOrder(form, field, pIndex, fieldIndex);

  if (!hasDefaultName(fieldName)) {
    if (!checkTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    }
    if (!hasSpellingError(fieldName)) {
      form = checkAccessibility(form, pIndex, fieldIndex);
    }
  }

  return form;
}

function checkbox(form, pIndex, fieldIndex) {
  const fieldName = getFieldName(form, pIndex, fieldIndex);
  const field = getPageFields(form, pIndex)[fieldIndex];

  hasDefaultText(field);
  checkDistanceToBorder(form, field);
  form = checkTabOrder(form, field, pIndex, fieldIndex);

  if (!hasDefaultName(fieldName)) {
    if (!checkTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    }
    if (!hasSpellingError(fieldName)) {
      form = checkAccessibility(form, pIndex, fieldIndex);
    }
  }

  return form;
}

function container(form, pIndex, fieldIndex) {
  const oneColumnResponsiveFlow = "3";
  const twoColumnResponsiveFlow = "4";
  const fields = getPageFields(form, pIndex);
  const field = fields[fieldIndex];
  const fieldID = field.ID[0];
  const fieldName = field.Name[0];
  const responsiveFlow = field.ResponsiveFlow[0];
  const hasMoreThan1field =
    fields.filter((f) => f.ContainerId[0] === fieldID).length > 1;

  if (
    hasMoreThan1field &&
    responsiveFlow !== oneColumnResponsiveFlow &&
    responsiveFlow !== twoColumnResponsiveFlow
  ) {
    if (fix.responsiveFlow) {
      // Set responsive flow to "1 column"
      form.FormPages[0].FormPage[pIndex].FieldList[0].BaseField[
        fieldIndex
      ].ResponsiveFlow[0] = oneColumnResponsiveFlow;
      addToReport(
        `#### ${fieldName}`,
        `The \`Responsive Flow\` of container \`${fieldName}\` has been set to \`1 Column\`.`,
      );
    } else {
      addToReport(
        `#### ${fieldName}`,
        `The container has more than 1 field and its \`Responsive Flow\` is not set to \`1 Column\` or \`2 Columns\`.`,
      );
    }
  }

  return form;
}

function datagrid(form, pIndex, fieldIndex) {
  const fieldName = getFieldName(form, pIndex, fieldIndex);

  if (!hasDefaultName(fieldName, "FieldDataGrid")) {
    if (!checkTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    }
    form = checkAccessibility(form, pIndex, fieldIndex);
  }

  return form;
}

function dropdown(form, pIndex, fieldIndex) {
  const field = getPageFields(form, pIndex)[fieldIndex];
  const fieldName = getFieldName(form, pIndex, fieldIndex);

  checkDistanceToBorder(form, field);
  form = checkTabOrder(form, field, pIndex, fieldIndex);

  if (!hasDefaultName(fieldName)) {
    if (!checkTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    }
    if (!hasSpellingError(fieldName)) {
      form = checkAccessibility(form, pIndex, fieldIndex);
    }
  }

  return form;
}

function formIDStamp(form, pIndex, fieldIndex) {
  const field = getPageFields(form, pIndex)[fieldIndex];
  const fieldName = getFieldName(form, pIndex, fieldIndex);

  checkDistanceToBorder(form, field);

  if (!hasDefaultName(fieldName)) {
    if (!checkTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    }
    hasSpellingError(fieldName);
  }

  return form;
}

function image(form, pIndex, fieldIndex) {
  const field = getPageFields(form, pIndex)[fieldIndex];
  const fieldName = getFieldName(form, pIndex, fieldIndex);

  checkDistanceToBorder(form, field);

  if (!hasDefaultName(fieldName, "ImageFormControl")) {
    if (!checkTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    }
    form = checkAccessibility(form, pIndex, fieldIndex);
  }
  return form;
}

function label(form, pIndex, labelIndex) {
  const fields = getPageFields(form, pIndex);
  const labelData = fields[labelIndex];

  isLabelOverlaping(labelData, fields);

  return form;
}

function rowRepeatingControl(form, pIndex, fieldIndex) {
  const field = getPageFields(form, pIndex)[fieldIndex];
  const fieldName = getFieldName(form, pIndex, fieldIndex);

  if (!hasDefaultName(fieldName, "RepeatingRowControl")) {
    if (!checkTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    }
    if (!hasSpellingError(fieldName)) {
      form = checkAccessibility(form, pIndex, fieldIndex);
    }
  }

  return form;
}

function signatureStamp(form, pIndex, fieldIndex) {
  const field = getPageFields(form, pIndex)[fieldIndex];
  const fieldName = getFieldName(form, pIndex, fieldIndex);

  hasDefaultText(field);
  checkDistanceToBorder(form, field);

  if (!hasDefaultName(fieldName)) {
    if (!checkTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    }
    form = checkAccessibility(form, pIndex, fieldIndex);
  }

  return form;
}

function textArea(form, pIndex, fieldIndex) {
  const field = getPageFields(form, pIndex)[fieldIndex];
  const fieldName = getFieldName(form, pIndex, fieldIndex);

  checkDistanceToBorder(form, field);
  form = checkTabOrder(form, field, pIndex, fieldIndex);

  if (!hasDefaultName(fieldName)) {
    if (!checkTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    }
    if (!hasSpellingError(fieldName)) {
      form = checkAccessibility(form, pIndex, fieldIndex);
    }
  }

  return form;
}

function textbox(form, pIndex, fieldIndex) {
  const field = getPageFields(form, pIndex)[fieldIndex];
  const fieldName = getFieldName(form, pIndex, fieldIndex);

  checkDistanceToBorder(form, field);
  form = checkTabOrder(form, field, pIndex, fieldIndex);

  if (!hasDefaultName(fieldName)) {
    if (!checkTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    }
    if (!hasSpellingError(fieldName)) {
      form = checkAccessibility(form, pIndex, fieldIndex);
    }
  }

  return form;
}

function uploadButton(form, pIndex, fieldIndex) {
  const field = getPageFields(form, pIndex)[fieldIndex];
  const fieldName = getFieldName(form, pIndex, fieldIndex);
  const isSimpleUpload =
    getPropertyValueByPropetyName(field, "DisplayUploadedFiles") === "false";

  form = checkTabOrder(form, field, pIndex, fieldIndex);
  checkDistanceToBorder(form, field);

  if (!hasDefaultName(fieldName, "UploadButton")) {
    if (!checkTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    }
    form = checkAccessibility(form, pIndex, fieldIndex);
  }

  if (!isSimpleUpload) {
    if (fix.simpleUpload) {
      form.FormPages[0].FormPage[pIndex].FieldList[0].BaseField[
        fieldIndex
      ].DisplayUploadedFiles[0] = false;

      addToReport(
        `#### ${fieldName}`,
        `The field [${fieldName}] was changed to [${false}]`,
      );
    }

    addToReport(
      `#### ${fieldName}`,
      `Field [${fieldName}] has DisplayUploadedFiles attribue in [${true}]`,
    );
  }

  return form;
}

/* -------------------------------------------------------------------------- */
/*                                MAIN FUNCTION                               */
/* -------------------------------------------------------------------------- */

function fixFields(form) {
  try {
    addToReport("## Fields", "");
    // Iterate over each form page
    form.FormPages.forEach((page, pageIndex) => {
      const fields = getPageFields(form, pageIndex);

      // Iterate over each field in the page
      fields.forEach((field, fieldIndex) => {
        const fieldType = field.$["xsi:type"];

        const fieldActions = {
          CellField: (f, i, j) => cell(f, i, j),
          FieldCalendar3: (f, i, j) => calendar(f, i, j),
          FieldCheckbox: (f, i, j) => checkbox(f, i, j),
          FieldContainer: (f, i, j) => container(f, i, j),
          FieldDataGrid: (f, i, j) => datagrid(f, i, j),
          FieldDropDownList3: (f, i, j) => dropdown(f, i, j),
          FieldLabel: (f, i, j) => label(f, i, j),
          FieldTextArea3: (f, i, j) => textArea(f, i, j),
          FieldTextbox3: (f, i, j) => textbox(f, i, j),
          FormButton: (f, i, j) => button(f, i, j),
          FormIDStamp: (f, i, j) => formIDStamp(f, i, j),
          ImageFormControl: (f, i, j) => image(f, i, j),
          RepeatingRowControl: (f, i, j) => rowRepeatingControl(f, i, j),
          UploadButton: (f, i, j) => uploadButton(f, i, j),
          UserIDStamp: (f, i, j) => signatureStamp(f, i, j),
        };

        const action = fieldActions[fieldType];

        if (action) {
          form = action(form, pageIndex, fieldIndex) || form;
        } else {
          console.log(`${fieldType} type not found.`);
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
  return form;
}

module.exports = fixFields;
