'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

const WizardContext = /*#__PURE__*/React.createContext(null);

{
  WizardContext.displayName = 'WizardContext';
}

const useWizard = () => {
  const context = React.useContext(WizardContext);

  if (!context && "development" !== "production") {
    throw Error('Wrap your step with `Wizard`');
  } else {
    return context;
  }
};

/**
 * Log messages in the console with a corresponding urgency
 *
 * @param level The urgency of the message
 * @param message The message to log in the console
 */
const log = (level, message) => {
  {
    const packageName = '[react-use-wizard]';

    switch (level) {
      case 'warn':
        console.warn(packageName + " " + message);
        break;

      case 'error':
        console.error(packageName + " " + message);
        break;

      default:
        console.log(packageName + " " + message);
    }
  }
};

const Wizard = /*#__PURE__*/React.memo(({
  header,
  footer,
  children,
  wrapper: Wrapper,
  startIndex = 0
}) => {
  const [activeStep, setActiveStep] = React.useState(startIndex);
  const [isLoading, setIsLoading] = React.useState(false);
  const hasNextStep = React.useRef(true);
  const hasPreviousStep = React.useRef(false);
  const nextStepHandler = React.useRef(() => {});
  const stepCount = React.Children.toArray(children).length;
  hasNextStep.current = activeStep < stepCount - 1;
  hasPreviousStep.current = activeStep > 0;
  const goToNextStep = React.useRef(() => {
    if (hasNextStep.current) {
      setActiveStep(activeStep => activeStep + 1);
    }
  });
  const goToPreviousStep = React.useRef(() => {
    if (hasPreviousStep.current) {
      nextStepHandler.current = null;
      setActiveStep(activeStep => activeStep - 1);
    }
  });
  const goToStep = React.useRef(stepIndex => {
    if (stepIndex >= 0 && stepIndex < stepCount) {
      nextStepHandler.current = null;
      setActiveStep(stepIndex);
    } else {
      {
        log('warn', ["Invalid step index [" + stepIndex + "] passed to 'goToStep'. ", "Ensure the given stepIndex is not out of boundaries."].join(''));
      }
    }
  }); // Callback to attach the step handler

  const handleStep = React.useRef(handler => {
    nextStepHandler.current = handler;
  });
  const doNextStep = React.useRef(async () => {
    if (hasNextStep.current && nextStepHandler.current) {
      try {
        setIsLoading(true);
        await nextStepHandler.current();
        setIsLoading(false);
        nextStepHandler.current = null;
        goToNextStep.current();
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    } else {
      goToNextStep.current();
    }
  });
  const wizardValue = React.useMemo(() => ({
    nextStep: doNextStep.current,
    previousStep: goToPreviousStep.current,
    handleStep: handleStep.current,
    isLoading,
    activeStep,
    stepCount,
    isFirstStep: !hasPreviousStep.current,
    isLastStep: !hasNextStep.current,
    goToStep: goToStep.current
  }), [activeStep, stepCount, isLoading]);
  const activeStepContent = React.useMemo(() => {
    const reactChildren = React.Children.toArray(children);

    {
      // No steps passed
      if (reactChildren.length === 0) {
        log('warn', 'Make sure to pass your steps as children in your <Wizard>');
      } // The passed start index is invalid


      if (activeStep > reactChildren.length) {
        log('warn', 'An invalid startIndex is passed to <Wizard>');
      }
    }

    return reactChildren[activeStep];
  }, [activeStep, children]);
  const enhancedActiveStepContent = React.useMemo(() => Wrapper ? React.cloneElement(Wrapper, {
    children: activeStepContent
  }) : activeStepContent, [Wrapper, activeStepContent]);
  return React.createElement(WizardContext.Provider, {
    value: wizardValue
  }, header ? header({
    activeStep: wizardValue.activeStep,
    stepCount: wizardValue.stepCount
  }) : null, enhancedActiveStepContent, footer ? footer({
    activeStep: wizardValue.activeStep,
    stepCount: wizardValue.stepCount
  }) : null);
});

exports.Wizard = Wizard;
exports.useWizard = useWizard;
//# sourceMappingURL=react-use-wizard.cjs.development.js.map
