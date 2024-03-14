/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
const nspell = require("nspell");
const fs = require("fs");
const { addToReport } = require("./report");

/* -------------------------------------------------------------------------- */
/*                              GLOBAL VARIABLES                              */
/* -------------------------------------------------------------------------- */

const fixAccessibility = false;
const fixCase = false;
const fixTabOrder = false;
const fixContainerResponsiveFlow = false;
const titleCaseExceptions = [
  "ID",
  "SSN",
  "EIN",
  "DOB",
  "POA",
  "POC",
  "POI",
  "POE",
];

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

function checkAccessibility(form, pIndex, fieldIndex, fix = false) {
  const fieldName = getFieldName(form, pIndex, fieldIndex);
  const accessibilityLabel = getAccesibilityLabel(form, pIndex, fieldIndex);
  let newAccessibilityLabel = fieldName;

  if (!accessibilityLabel) {
    if (fix) {
      const fieldLabel = getLabelByFieldByName(form, fieldName);
      if (fieldLabel && fieldLabel.includes("*")) {
        newAccessibilityLabel += ". Required Field.";
      }

      form.FormPages[0].FormPage[pIndex].FieldList[0].BaseField[
        fieldIndex
      ].AccessibilityLabel[0] = newAccessibilityLabel;

      addToReport(
        `#### ${fieldName}`,
        `Accessibility label for \`${fieldName}\` was set to \`${newAccessibilityLabel}\``,
      );
    } else {
      addToReport(
        `#### ${fieldName}`,
        `Field \`${fieldName}\` has no accessibility label`,
      );
    }
  }
  return form;
}

function fixTitleCase(form, pIndex, fieldIndex) {
  const fieldName = getFieldName(form, pIndex, fieldIndex);

  if (fixCase) {
    const titleCaseFieldName = strToTitleCase(fieldName);

    form.FormPages[0].FormPage[pIndex].FieldList[0].BaseField[
      fieldIndex
    ].Name[0] = titleCaseFieldName;

    addToReport(
      `#### ${fieldName}`,
      `Field \`${fieldName}\` was changed to \`${titleCaseFieldName}\``,
    );
  }

  return form;
}

function wordToUppercase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function strToTitleCase(str) {
  // Split the string into an array of words
  const words = str.split(" ");

  // Capitalize the first letter of each word
  const titleCaseWords = words.map((word) => wordToUppercase(word));

  // Join the words back into a single string
  return titleCaseWords.join(" ");
}

function getAccesibilityLabel(form, pIndex, fieldIndex) {
  const fields = getFields(form, pIndex);
  const field = fields[fieldIndex];
  const accessibilityLabel = field.AccessibilityLabel[0];
  return accessibilityLabel;
}

function getLabelByFieldByName(form, fieldName) {
  const fields = form.FormPages[0].FormPage[0].FieldList[0].BaseField;
  let label;

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
        label = labelText;
      }
    }
  });

  return label;
}

function getFieldName(form, pIndex, fieldIndex) {
  const fields = getFields(form, pIndex);
  const field = fields[fieldIndex];
  const fieldName = field.Name[0];
  return fieldName;
}

function getFields(form, pIndex) {
  return form.FormPages[pIndex].FormPage[0].FieldList[0].BaseField;
}

function hasDefaultText(field) {
  const fieldName = field.Name[0];
  const fieldType = field.$["xsi:type"];
  const defaultText = field.Text[0];
  let isDefaultText = false;

  if (fieldType === "FieldCheckbox") {
    isDefaultText = defaultText.includes("Checkbox");
  } else if (fieldType === "UserIDStamp") {
    isDefaultText = defaultText.includes("Signature Stamp");
  } else if (fieldType === "FormButton") {
    isDefaultText =
      defaultText.includes("Next") && !field.Name[0].includes("Next");
  }

  if (isDefaultText) {
    addToReport(
      `#### ${fieldName}`,
      `Field \`${field.Name[0]}\` has a default text`,
    );
  }

  return isDefaultText;
}

function hasDefaultName(fieldName) {
  const isDefaultName = fieldName.includes("DataField");

  if (isDefaultName) {
    addToReport(
      `#### ${fieldName}`,
      `Field \`${fieldName}\` has a default name`,
    );
  }

  return isDefaultName;
}

function checkDistanceToBorder(form, field) {
  const fieldName = field.Name[0];
  const distanceToLeftBorder = Number(field.LayoutLeft[0]);
  const layoutRight = distanceToLeftBorder + Number(field.Width[0]);
  const distanceToRightBorder = Math.abs(
    Number(form.FormWidth[0] - layoutRight),
  );

  if (distanceToRightBorder < 30) {
    addToReport(
      `#### ${fieldName}`,
      `Field \`${fieldName}\` is too close to the border`,
    );
  }
}

function checkTabOrder(form, field, pageIndex, fieldIndex) {
  const fieldName = field.Name[0];
  const tabOrder = Number(field.TabOrder[0]);

  if (tabOrder !== 0) {
    if (fixTabOrder) {
      form.FormPages[0].FormPage[pageIndex].FieldList[0].BaseField[
        fieldIndex
      ].TabOrder[0] = 0;

      addToReport(
        `#### ${fieldName}`,
        `Field \`${fieldName}\` Tab Order was set to 0`,
      );
    } else {
      addToReport(
        `#### ${fieldName}`,
        `Field \`${fieldName}\` has a Tab Order different than 0`,
      );
    }
  }

  return form;
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

    if (topAproxEqual && borderAproxOverlap && fieldLeft > lblLeft) {
      addToReport(
        `#### ${fieldName}`,
        `Field \`${fieldName}\` is overlapping with a label`,
      );
    }
  });
}

function isTitleCase(fieldName) {
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
        const includesException = titleCaseExceptions.some((exc) =>
          word.includes(exc),
        );

        if (!includesException) {
          addToReport(
            `#### ${fieldName}`,
            `Field \`${fieldName}\` is not in Title Case`,
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
    if (!isValid) {
      const suggestedWords = spellchecker.suggest(word);
      const suggestionMsg =
        suggestedWords.length > 0 ? suggestedWords : "No suggestions";

      addToReport(
        `#### ${fieldName}`,
        `Possible misspeled word: \`${word}\`. Manually check accessibility label.
        Suggested spellings: \`${suggestionMsg}\``,
      );

      hasError = true;
    }
  });

  return hasError;
}

/* -------------------------------------------------------------------------- */
/*                                   FIXERS                                   */
/* -------------------------------------------------------------------------- */

function fixButton(form, pIndex, fieldIndex) {
  const fieldName = getFieldName(form, pIndex, fieldIndex);
  const field = getFields(form, pIndex)[fieldIndex];

  if (!hasDefaultName(fieldName)) {
    form = checkAccessibility(form, pIndex, fieldIndex, fixAccessibility);
  }

  hasDefaultText(field);

  return form;
}

function fixCalendar(form, pIndex, fieldIndex) {
  const fieldName = getFieldName(form, pIndex, fieldIndex);
  const field = getFields(form, pIndex)[fieldIndex];

  checkDistanceToBorder(form, field);

  if (!hasDefaultName(fieldName)) {
    if (!isTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    } else if (!hasSpellingError(fieldName)) {
      form = checkAccessibility(form, pIndex, fieldIndex, fixAccessibility);
    }
  }

  return form;
}

function fixCell(form, pIndex, fieldIndex) {
  const field = getFields(form, pIndex)[fieldIndex];
  const fieldName = getFieldName(form, pIndex, fieldIndex);

  checkDistanceToBorder(form, field);

  if (!hasDefaultName(fieldName)) {
    if (!isTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    } else if (!hasSpellingError(fieldName)) {
      form = checkAccessibility(form, pIndex, fieldIndex, fixAccessibility);
    }
  }

  return form;
}

function fixCheckbox(form, pIndex, fieldIndex) {
  const fieldName = getFieldName(form, pIndex, fieldIndex);
  const field = getFields(form, pIndex)[fieldIndex];

  hasDefaultText(field);
  checkDistanceToBorder(form, field);

  if (!hasDefaultName(fieldName)) {
    if (!isTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    } else if (!hasSpellingError(fieldName)) {
      form = checkAccessibility(form, pIndex, fieldIndex, fixAccessibility);
    }
  }

  return form;
}

function fixContainer(form, pIndex, fieldIndex) {
  const oneColumnResponsiveFlow = "3";
  const fields = getFields(form, pIndex);
  const field = fields[fieldIndex];
  const fieldID = field.ID[0];
  const fieldName = field.Name[0];
  const responsiveFlow = field.ResponsiveFlow[0];
  const hasMoreThan1field =
    fields.filter((f) => f.ContainerId[0] === fieldID).length > 1;

  if (hasMoreThan1field && responsiveFlow !== oneColumnResponsiveFlow) {
    if (fixContainerResponsiveFlow) {
      // Set responsive flow to "1 column"
      form.FormPages[0].FormPage[pIndex].FieldList[0].BaseField[
        fieldIndex
      ].ResponsiveFlow[0] = oneColumnResponsiveFlow;
      addToReport(
        `#### ${fieldName}`,
        `Container \`${fieldName}\` has been set to 1 column flow`,
      );
    } else {
      addToReport(
        `#### ${fieldName}`,
        `Container \`${fieldName}\` has more than 1 field and is not set to 1 column flow`,
      );
    }
  }

  return form;
}

function fixDataGrid(form, pIndex, fieldIndex) {}

function fixDropdown(form, pIndex, fieldIndex) {
  const field = getFields(form, pIndex)[fieldIndex];
  const fieldName = getFieldName(form, pIndex, fieldIndex);

  checkDistanceToBorder(form, field);

  if (!hasDefaultName(fieldName)) {
    if (!isTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    } else if (!hasSpellingError(fieldName)) {
      form = checkAccessibility(form, pIndex, fieldIndex, fixAccessibility);
    }
  }

  return form;
}

function fixFormIDStamp(form, pIndex, fieldIndex) {}

function fixImage(form, pIndex, fieldIndex) {}

function fixLabel(form, pIndex, fieldIndex) {
  const fields = getFields(form, pIndex);
  const field = fields[fieldIndex];

  isLabelOverlaping(field, fields);
}

function fixRRC(form, pIndex, fieldIndex) {}

function fixSignatureStamp(form, pIndex, fieldIndex) {
  const field = getFields(form, pIndex)[fieldIndex];
  hasDefaultText(field);
}

function fixTextArea(form, pIndex, fieldIndex) {
  const field = getFields(form, pIndex)[fieldIndex];
  const fieldName = getFieldName(form, pIndex, fieldIndex);

  checkDistanceToBorder(form, field);

  if (!hasDefaultName(fieldName)) {
    if (!isTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    } else if (!hasSpellingError(fieldName)) {
      form = checkAccessibility(form, pIndex, fieldIndex, fixAccessibility);
    }
  }

  return form;
}

function fixTextbox(form, pIndex, fieldIndex) {
  const field = getFields(form, pIndex)[fieldIndex];
  const fieldName = getFieldName(form, pIndex, fieldIndex);

  checkDistanceToBorder(form, field);

  if (!hasDefaultName(fieldName)) {
    if (!isTitleCase(fieldName)) {
      form = fixTitleCase(form, pIndex, fieldIndex);
    } else if (!hasSpellingError(fieldName)) {
      form = checkAccessibility(form, pIndex, fieldIndex, fixAccessibility);
    }
  }

  return form;
}

function fixUploadButton(form, pIndex, fieldIndex) {
  const field = getFields(form, pIndex)[fieldIndex];
  const fieldName = getFieldName(form, pIndex, fieldIndex);
  console.log("fixUploadButton");
}

/* -------------------------------------------------------------------------- */
/*                                MAIN FUNCTION                               */
/* -------------------------------------------------------------------------- */

function fixFields(form) {
  try {
    addToReport("## Fields", "");
    // Iterate over each form page
    form.FormPages.forEach(({ FormPage }, pageIndex) => {
      const fields = FormPage[pageIndex].FieldList[0].BaseField;

      // Iterate over each field in the page
      fields.forEach((field, fieldIndex) => {
        const fieldType = field.$["xsi:type"];

        if (fieldType !== "FieldContainer") {
          form = checkTabOrder(form, field, pageIndex, fieldIndex);
        }

        const fieldActions = {
          CellField: (f, i, j) => fixCell(f, i, j),
          FieldCalendar3: (f, i, j) => fixCalendar(f, i, j),
          FieldCheckbox: (f, i, j) => fixCheckbox(f, i, j),
          FieldContainer: (f, i, j) => fixContainer(f, i, j),
          FieldDataGrid: (f, i, j) => fixDataGrid(f, i, j),
          FieldDropDownList3: (f, i, j) => fixDropdown(f, i, j),
          FieldLabel: (f, i, j) => fixLabel(f, i, j),
          FieldTextArea3: (f, i, j) => fixTextArea(f, i, j),
          FieldTextbox3: (f, i, j) => fixTextbox(f, i, j),
          FormButton: (f, i, j) => fixButton(f, i, j),
          FormIDStamp: (f, i, j) => fixFormIDStamp(f, i, j),
          ImageFormControl: (f, i, j) => fixImage(f, i, j),
          RepeatingRowControl: (f, i, j) => fixRRC(f, i, j),
          UploadButton: (f, i, j) => fixUploadButton(f, i, j),
          UserIDStamp: (f, i, j) => fixSignatureStamp(f, i, j),
        };

        const action = fieldActions[fieldType];

        if (action) {
          form = action(form, pageIndex, fieldIndex) || form;
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
  return form;
}

module.exports = fixFields;
