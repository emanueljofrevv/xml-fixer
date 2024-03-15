const { addToReport } = require("./report");

/* -------------------------------------------------------------------------- */
/*                               HELPER FUNCTION                              */
/* -------------------------------------------------------------------------- */

function getAllFieldsInForm(form) {
  const pages = form.FormPages;
  const fields = [];

  pages.forEach(({ FormPage }) => {
    const fieldList = FormPage[0].FieldList[0].BaseField;
    fields.push(...fieldList);
  });

  return fields;
}

function getAllGroupsFields(groups) {
  const fields = [];

  groups.forEach((group) => {
    const groupFields = group.FieldCollection[0].FieldMember || [];
    fields.push(...groupFields);
  });

  return fields;
}

function getConditionsSets(group) {
  const isVisibleCondition = group.ConditionCollection;
  const isReadOnlyCondition = group.ReadOnlyConditionCollection;
  const isVisibleSecurity = group.SecurityMemberCollection;
  const isReadOnlySecurity = group.SecurityMemberReadonlyCollection;

  const allConditions = [
    ...isVisibleCondition,
    ...isReadOnlyCondition,
    ...isVisibleSecurity,
    ...isReadOnlySecurity,
  ];

  // Remove empty conditions
  const conditions = allConditions.filter((condition) => condition !== "");

  return conditions;
}

function getFieldNameByID(fieldID, form) {
  const fields = getAllFieldsInForm(form);
  const field = fields.find((f) => f.ID[0] === fieldID);
  return field.Name[0];
}

function getFieldNameInGroup(field, form) {
  const fieldType = field.FieldType[0];
  let name = "";

  if (fieldType !== "FormControls") {
    const fieldID = field.FieldID[0];
    name = getFieldNameByID(fieldID, form);
  } else {
    [name] = field.FormControlType;
  }
  return name;
}

function getGroups(form) {
  return form.GroupsHolder[0].GroupCollection[0].Group;
}

function hasAdminOverride(groupName, groupConditions, form) {
  let hasOverride = false;

  groupConditions.forEach((conditionSet) => {
    const rules = conditionSet.ConditionBase || [];

    rules.forEach((rule) => {
      const fieldValue1 = rule.FieldValue1[0];
      const fieldID = fieldValue1.FieldID[0];
      const fieldName = getFieldNameByID(fieldID, form);
      if (fieldName.toLowerCase().includes("override")) {
        hasOverride = true;
      }
    });
  });

  if (!hasOverride) {
    addToReport(
      `#### ${groupName}`,
      `The group does not have an admin override condition.`,
    );
  }
}

function isFieldInMoreThanOneGroup(fields, form) {
  const allFields = new Map();
  const duplicatedFields = new Map();

  fields.forEach((field) => {
    const fieldName = getFieldNameInGroup(field, form);

    if (!allFields.has(fieldName)) {
      allFields.set(fieldName, field);
    } else {
      duplicatedFields.set(fieldName, field);
    }
  });

  duplicatedFields.forEach((value, key) => {
    addToReport(`#### ${key}`, `Field \`${key}\` is in more than one group.`);
  });
}

/* -------------------------------------------------------------------------- */
/*                         GROUPS AND CONDITION FIXING                        */
/* -------------------------------------------------------------------------- */

function fixGroupsAndConditions(form) {
  let groups = getGroups(form);

  if (!groups) {
    groups = [];
  }

  const allGroupsFields = getAllGroupsFields(groups) || [];
  addToReport("## Groups and Conditions", "");

  if (groups.length === 0) {
    addToReport(
      `#### The template hasn't groups`,
      `The template hasn't groups`,
    );
  }

  isFieldInMoreThanOneGroup(allGroupsFields, form);

  groups.forEach((group) => {
    const groupConditions = getConditionsSets(group);
    const groupName = group.GroupName[0];
    const isOverrideGroup = groupName.toLowerCase().includes("admin");

    if (!isOverrideGroup) {
      hasAdminOverride(groupName, groupConditions, form);
    }
  });

  console.log();
}

module.exports = fixGroupsAndConditions;
