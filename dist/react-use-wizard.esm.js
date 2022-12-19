import { createContext, useContext, memo, useState, useRef, Children, useMemo, cloneElement, createElement } from 'react';

const WizardContext = /*#__PURE__*/createContext(null);

if (process.env.NODE_ENV !== "production") {
  WizardContext.displayName = 'WizardContext';
}

const useWizard = () => {
  const context = useContext(WizardContext);

  if (!context && process.env.NODE_ENV !== "production") {
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
  if (process.env.NODE_ENV !== "production") {
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

const Wizard = /*#__PURE__*/memo(({
  header,
  footer,
  children,
  wrapper: Wrapper,
  startIndex = 0
}) => {
  const [activeStep, setActiveStep] = useState(startIndex);
  const [isLoading, setIsLoading] = useState(false);
  const hasNextStep = useRef(true);
  const hasPreviousStep = useRef(false);
  const nextStepHandler = useRef(() => {});
  const stepCount = Children.toArray(children).length;
  hasNextStep.current = activeStep < stepCount - 1;
  hasPreviousStep.current = activeStep > 0;
  const goToNextStep = useRef(() => {
    if (hasNextStep.current) {
      setActiveStep(activeStep => activeStep + 1);
    }
  });
  const goToPreviousStep = useRef(() => {
    if (hasPreviousStep.current) {
      nextStepHandler.current = null;
      setActiveStep(activeStep => activeStep - 1);
    }
  });
  const goToStep = useRef(stepIndex => {
    if (stepIndex >= 0 && stepIndex < stepCount) {
      nextStepHandler.current = null;
      setActiveStep(stepIndex);
    } else {
      if (process.env.NODE_ENV !== "production") {
        log('warn', ["Invalid step index [" + stepIndex + "] passed to 'goToStep'. ", "Ensure the given stepIndex is not out of boundaries."].join(''));
      }
    }
  }); // Callback to attach the step handler

  const handleStep = useRef(handler => {
    nextStepHandler.current = handler;
  });
  const doNextStep = useRef(async () => {
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
  const wizardValue = useMemo(() => ({
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
  const activeStepContent = useMemo(() => {
    const reactChildren = Children.toArray(children);

    if (process.env.NODE_ENV !== "production") {
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
  const enhancedActiveStepContent = useMemo(() => Wrapper ? cloneElement(Wrapper, {
    children: activeStepContent
  }) : activeStepContent, [Wrapper, activeStepContent]);
  return createElement(WizardContext.Provider, {
    value: wizardValue
  }, header ? header({
    activeStep: wizardValue.activeStep,
    stepCount: wizardValue.stepCount
  }) : null, enhancedActiveStepContent, footer ? footer({
    activeStep: wizardValue.activeStep,
    stepCount: wizardValue.stepCount
  }) : null);
});

export { Wizard, useWizard };
//# sourceMappingURL=react-use-wizard.esm.js.map
