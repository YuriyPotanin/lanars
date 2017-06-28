'use strict'

function _checkRequried(body, specification) {
  let errors = [];
  Object.keys(specification).forEach(field => {
    if (!body[field] && specification[field].required) {
      errors.push({
        field: `${field}`,
        message: `field ${field} is required`
      });
    }
  });
  return errors;
}

function _checkLength(body, specification) {
  let errors = [];
  Object.keys(specification).forEach(field => {
    if (typeof body[field] === 'undefined' && !specification[field].required) return;
    if (specification[field].length > body[field].length) {
      errors.push({
        field: `${field}`,
        message: `The length of the field ${field}  must be at least ${specification[field].length}`
      });
    }
  });
  return errors;
}

function _checkType(body, specification) {
  let errors = [];
  Object.keys(specification).forEach(field => {
    if (specification[field].type !== typeof body[field]) {
      if (typeof body[field] === 'undefined' && !specification[field].required) return;
      errors.push({
        field: `${field}`,
        message: `field ${field}  must be ${specification[field].type}`
      });
    }
  });
  return errors;
}

function validate(body, specification) {
  let errors = [];
  try {
    if (!Object.keys(body).length) return { status: 400 };
    errors = _checkRequried(body, specification);
    if (errors.length) return { status: 422, errors };
    errors = _checkType(body, specification);
    if (errors.length) return { status: 422, errors };
    errors = _checkLength(body, specification);
    if (errors.length) return { status: 422, errors };
  } catch (err) {
    return { status: 500 };
  }

}

module.exports = validate;
