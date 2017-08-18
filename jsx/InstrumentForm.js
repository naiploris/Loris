import Form from './Form';
import { Evaluator, NullVariableError } from './lib/Parser';

const { SelectElement, RadioGroupLabels, RadioGroupElement, CheckboxGroupElement, TextboxElement, DateElement } = Form;
const INPUT_TYPES = ['radio', 'text', 'checkbox', 'select', 'date'];

function isDisplayed(element, index, data, context, options = {}) {
  if (
    (element.Hidden) ||
    (options.surveyMode && element.HiddenSurvey) ||
    (element.DisplayIf === false)
  ) {
    return false;
  }

  if (element.DisplayIf === '') return true;

  try {
    return Evaluator(element.DisplayIf, { ...data, context});
  } catch(e) {
    if (!(e instanceof NullVariableError)) {
      console.log(`Error evaluating DisplayIf property of element ${index}.\n${e}`);
    }

    return false;
  }
}

function isRequired(element, index, data, context) {
  if (!INPUT_TYPES.includes(element.Type)) return false;

  const requireResponse = element.Options.RequireResponse;
  if (typeof(requireResponse) === 'boolean') return requireResponse;

  try {
    return Evaluator(requireResponse, { ...data, context });
  } catch (e) {
    if (!(e instanceof NullVariableError)) {
      console.log(`Error evaluating RequireResponse property of element ${index}.\n${e}`);
    }

    return false;
  }
}

const SaveButton = ({onSave}) => {
  return (
    <button onClick={onSave} type="button" className="btn btn-default btn-lg">
      <span className="glyphicon glyphicon-star" aria-hidden="true"></span> Save
    </button>
  );
}

const InstrumentForm = ({instrument, data, context, options, onUpdate, onSave}) => {
  return (
    <div>
      {renderMeta(instrument.Meta)}
      {
        instrument.Elements.filter(
          (element, index) => (isDisplayed(element, index, data, context, options))
        ).map((element, index) => (
          renderElement(element, index, data, onUpdate, isRequired(element, index, data, context))
        ))
      }
      <SaveButton onSave={onSave}/>
    </div>
  );
};

// TODO: propTypes
function renderMeta(meta) {
  return (
    <div className="title">
      <h1>{meta.LongName}</h1>
    </div>
  )
}

function renderElement(element, key, data, onUpdate, required = false) {
  if (element.Type === 'label') {
    return renderLabel(element, key)
  } else if (element.Type === 'radio-labels') {
    return renderRadioLabels(element, key)
  } else if (element.Type === 'radio') {
    return renderRadio(element, data[element.Name], key, onUpdate, required)
  } else if (element.Type === 'select') {
    return renderSelect(element, data[element.Name], key, onUpdate, required)
  } else if (element.Type === 'checkbox') {
    return renderCheckbox(element, data[element.Name], key, onUpdate, required)
  } else if (element.Type === 'text') {
    return renderText(element, data[element.Name], key, onUpdate, required)
  } else if (element.Type === 'calc') {
    return renderCalc(element, data[element.Name], key, onUpdate)
  } else if (element.Type === 'date') {
    return renderDate(element, data[element.Name], key, onUpdate, required)
  }
}

function renderLabel(labelEl, key) {
  // Form's StaticElement doesn't allow us to set HTML.
  return (<div className="instrument-label" key={key} dangerouslySetInnerHTML={{__html: labelEl.Description}} />);
}

function renderRadioLabels(radioLabelsEl, key) {
  return (
    <RadioGroupLabels key={key} labels={radioLabelsEl.Labels}/>
  );
}

function renderRadio(radioEl, value, key, onUpdate, isRequired) {
  return (
    <RadioGroupElement
      key={key}
      name={radioEl.Name}
      label={radioEl.Description}
      options={radioEl.Options.Values}
      orientation={radioEl.Options.Orientation}
      onUserInput={onUpdate}
      required={isRequired}
      value={value}
    />
  );
}

function renderSelect(selectEl, value, key, onUpdate, isRequired) {
  if (selectEl.Options.AllowMultiple) {
    <p>MultiSelects not implemented yet</p>
  } else {
    return (
      <SelectElement
        key={key}
        name={selectEl.Name}
        label={selectEl.Description}
        options={selectEl.Options.Values}
        onUserInput={onUpdate}
        value={value}
        required={isRequired}
      />
    );
  }
}

function renderCheckbox(selectEl, value, key, onUpdate, isRequired) {
  return (
    <CheckboxGroupElement
      key={key}
      name={selectEl.Name}
      label={selectEl.Description}
      options={selectEl.Options.Values}
      onUserInput={onUpdate}
      value={value}
      required={isRequired}
    />
  );
}

function renderText(textEl, value, key, onUpdate, isRequired) {
  return (
    <TextboxElement
      key={key}
      name={textEl.Name}
      label={textEl.Description}
      onUserInput={onUpdate}
      required={isRequired}
      value={value}
    />
  );
}

function renderCalc(calcEl, value, key, onUpdate) {
  return (
    <TextboxElement
      key={key}
      name={calcEl.Name}
      label={calcEl.Description}
      value={value}
      disabled={true}
    />
  );
}

function renderDate(dateEl, value, key, onUpdate, isRequired) {
  return (
    <DateElement
      key={key}
      name={dateEl.Name}
      label={dateEl.Description}
      onUserInput={onUpdate}
      value={value}
      required={isRequired}
    />
  )
}
export default InstrumentForm;
